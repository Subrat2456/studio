'use client';

import * as React from 'react';
import {AppHeader} from '@/components/app/header';
import {Editor} from '@/components/app/editor';
import {StatusBar} from '@/components/app/status-bar';
import {AboutDialog} from '@/components/app/about-dialog';
import {GrammarCheckDialog} from '@/components/app/grammar-check-dialog';
import {grammarCheck} from '@/ai/flows/grammar-check';
import type {GrammarCheckOutput} from '@/ai/flows/grammar-check';
import {useToast} from '@/hooks/use-toast';

type StatusBarData = {
  line: number;
  column: number;
  wordCount: number;
  charCount: number;
};

export default function ProTextAIPage() {
  const [text, setText] = React.useState('');
  const [fileHandle, setFileHandle] = React.useState<FileSystemFileHandle | null>(null);
  const [fileName, setFileName] = React.useState('Untitled');
  const [isSaved, setIsSaved] = React.useState(true);
  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [wordWrap, setWordWrap] = React.useState(false);
  const [statusBarData, setStatusBarData] = React.useState<StatusBarData>({
    line: 1,
    column: 1,
    wordCount: 0,
    charCount: 0,
  });

  const [isAboutDialogOpen, setIsAboutDialogOpen] = React.useState(false);
  const [isGrammarCheckDialogOpen, setIsGrammarCheckDialogOpen] = React.useState(false);
  const [grammarCheckResult, setGrammarCheckResult] = React.useState<GrammarCheckOutput | null>(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = React.useState(false);

  const editorRef = React.useRef<HTMLTextAreaElement>(null);
  const {toast} = useToast();

  React.useEffect(() => {
    document.title = `${fileName}${isSaved ? '' : ' - Unsaved'} | ProText AI`;
  }, [fileName, isSaved]);
  
  const updateStatusBar = React.useCallback(() => {
    if (!editorRef.current) return;
    const textarea = editorRef.current;
    const newText = textarea.value;
    const cursorPos = textarea.selectionStart;

    const textBeforeCursor = newText.substring(0, cursorPos);
    const line = textBeforeCursor.split('\n').length;
    const column = textBeforeCursor.lastIndexOf('\n') === -1
      ? cursorPos + 1
      : cursorPos - textBeforeCursor.lastIndexOf('\n');

    const wordCount = newText.trim() === '' ? 0 : newText.trim().split(/\s+/).length;
    const charCount = newText.length;

    setStatusBarData({line, column, wordCount, charCount});
  }, []);

  React.useEffect(() => {
    updateStatusBar();
    setIsSaved(false);
  }, [text, updateStatusBar]);

  const handleNew = () => {
    setText('');
    setFileHandle(null);
    setFileName('Untitled');
    setIsSaved(true);
  };

  const handleOpen = async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{description: 'Text Files', accept: {'text/plain': ['.txt', '.js', '.html', '.css', '.md']}}],
      });
      const file = await handle.getFile();
      const content = await file.text();
      setText(content);
      setFileHandle(handle);
      setFileName(handle.name);
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to open file:', err);
    }
  };

  const handleSave = async () => {
    if (fileHandle) {
      try {
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
        setIsSaved(true);
        toast({title: 'File saved successfully'});
      } catch (err) {
        console.error('Failed to save file:', err);
        toast({title: 'Error saving file', description: 'Could not save changes.', variant: 'destructive'});
      }
    } else {
      await handleSaveAs();
    }
  };

  const handleSaveAs = async () => {
    try {
      const handle = await window.showSaveFilePicker({
        types: [{description: 'Text Files', accept: {'text/plain': ['.txt']}}],
      });
      const writable = await handle.createWritable();
      await writable.write(text);
      await writable.close();
      setFileHandle(handle);
      setFileName(handle.name);
      setIsSaved(true);
      toast({title: 'File saved successfully'});
    } catch (err) {
      console.error('Failed to save file as:', err);
    }
  };
  
  const handleExit = () => {
    if (!isSaved) {
        if (confirm("You have unsaved changes. Are you sure you want to exit?")) {
            window.close();
        }
    } else {
        window.close();
    }
  }

  const handleUndo = () => editorRef.current?.ownerDocument.execCommand('undo');
  const handleCut = () => editorRef.current?.ownerDocument.execCommand('cut');
  const handleCopy = () => editorRef.current?.ownerDocument.execCommand('copy');
  const handlePaste = () => editorRef.current?.ownerDocument.execCommand('paste');
  const handleDelete = () => editorRef.current?.ownerDocument.execCommand('delete');
  const handleSelectAll = () => editorRef.current?.select();
  const handleInsertTimeDate = () => {
    const date = new Date().toLocaleString();
    if(editorRef.current) {
        const { selectionStart, selectionEnd } = editorRef.current;
        const newText = text.substring(0, selectionStart) + date + text.substring(selectionEnd);
        setText(newText);
        setTimeout(() => {
            if(editorRef.current) {
                editorRef.current.selectionStart = editorRef.current.selectionEnd = selectionStart + date.length;
            }
        }, 0);
    }
  }

  const handleGrammarCheck = async () => {
    if (!text.trim()) {
      toast({title: 'Nothing to check', description: 'Editor is empty.'});
      return;
    }
    setIsCheckingGrammar(true);
    try {
      const result = await grammarCheck({text});
      if (!result.correctionsProposed) {
        toast({title: 'Grammar & Spelling', description: 'No corrections found.'});
      } else {
        setGrammarCheckResult(result);
        setIsGrammarCheckDialogOpen(true);
      }
    } catch (error) {
      console.error('Grammar check failed:', error);
      toast({title: 'AI Error', description: 'Failed to check grammar.', variant: 'destructive'});
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  const applyGrammarCorrection = () => {
    if(grammarCheckResult) {
        setText(grammarCheckResult.correctedText);
    }
    setIsGrammarCheckDialogOpen(false);
    setGrammarCheckResult(null);
  }

  const menuActions = {
    'file:new': handleNew,
    'file:open': handleOpen,
    'file:save': handleSave,
    'file:saveAs': handleSaveAs,
    'file:exit': handleExit,
    'edit:undo': handleUndo,
    'edit:cut': handleCut,
    'edit:copy': handleCopy,
    'edit:paste': handlePaste,
    'edit:delete': handleDelete,
    'edit:selectAll': handleSelectAll,
    'edit:timeDate': handleInsertTimeDate,
    'format:wordWrap': () => setWordWrap(prev => !prev),
    'view:statusBar': () => setShowStatusBar(prev => !prev),
    'help:about': () => setIsAboutDialogOpen(true),
    'ai:grammarCheck': handleGrammarCheck,
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body overflow-hidden">
      <AppHeader
        menuActions={menuActions}
        isCheckingGrammar={isCheckingGrammar}
        wordWrap={wordWrap}
        showStatusBar={showStatusBar}
      />
      <main className="flex-grow flex relative overflow-hidden">
        <Editor
          ref={editorRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSelect={updateStatusBar}
          wordWrap={wordWrap}
        />
      </main>
      {showStatusBar && <StatusBar {...statusBarData} />}
      <AboutDialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen} />
      {grammarCheckResult && (
        <GrammarCheckDialog
            open={isGrammarCheckDialogOpen}
            onOpenChange={setIsGrammarCheckDialogOpen}
            originalText={text}
            correctedText={grammarCheckResult.correctedText}
            onApply={applyGrammarCorrection}
        />
      )}
    </div>
  );
}
