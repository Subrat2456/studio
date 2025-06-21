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
  // File System Access API is not available in sandboxed environments.
  // We fall back to using input elements and download links, so fileHandle will remain null.
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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

  // Update status bar on text change
  React.useEffect(() => {
    updateStatusBar();
  }, [text, updateStatusBar]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      setIsSaved(false);
  };

  const handleNew = () => {
    setText('');
    setFileHandle(null);
    setFileName('Untitled');
    setIsSaved(true);
  };

  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
        setFileName(file.name);
        setFileHandle(null); // We don't get a handle with this method
        setIsSaved(true);
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        toast({ title: 'Error opening file', description: 'Could not read the selected file.', variant: 'destructive' });
      }
      reader.readAsText(file);
    }
    // Reset the input value to allow opening the same file again
    if(e.target) {
      e.target.value = '';
    }
  };


  const handleSave = () => {
    // Since we can't get a file handle, all saves are "Save As" (download)
    handleSaveAs();
  };

  const handleSaveAs = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Use a default filename if the current one is just "Untitled"
      link.download = fileName === 'Untitled' || !fileName.includes('.') ? `${fileName}.txt` : fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsSaved(true);
      toast({title: 'File downloaded successfully'});
    } catch (err) {
      console.error('Failed to save file as:', err);
      toast({title: 'Error saving file', variant: 'destructive'});
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
        setIsSaved(false); // Also set unsaved on this action
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
        setIsSaved(false); // Applying correction is an edit
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
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            style={{ display: 'none' }}
            accept=".txt,.js,.html,.css,.md,text/plain"
        />
        <Editor
          ref={editorRef}
          value={text}
          onChange={handleTextChange}
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
