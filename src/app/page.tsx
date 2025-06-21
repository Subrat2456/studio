'use client';

import * as React from 'react';
import {AppHeader} from '@/components/app/header';
import {Editor} from '@/components/app/editor';
import {StatusBar} from '@/components/app/status-bar';
import {AboutDialog} from '@/components/app/about-dialog';
import {GrammarCheckDialog} from '@/components/app/grammar-check-dialog';
import {FindReplaceDialog, type FindReplaceOptions} from '@/components/app/find-replace-dialog';
import {HelpDialog} from '@/components/app/help-dialog';
import {FontDialog, type FontSettings} from '@/components/app/font-dialog';

import {grammarCheck} from '@/ai/flows/grammar-check';
import type {GrammarCheckOutput} from '@/ai/flows/grammar-check';
import {summarizeText} from '@/ai/flows/summarize-flow';
import {paraphraseText} from '@/ai/flows/paraphrase-flow';
import {expandText} from '@/ai/flows/expand-flow';

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

  // Dialog states
  const [isAboutDialogOpen, setIsAboutDialogOpen] = React.useState(false);
  const [isGrammarCheckDialogOpen, setIsGrammarCheckDialogOpen] = React.useState(false);
  const [isFindReplaceDialogOpen, setIsFindReplaceDialogOpen] = React.useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = React.useState(false);
  const [isFontDialogOpen, setIsFontDialogOpen] = React.useState(false);

  // AI states
  const [grammarCheckResult, setGrammarCheckResult] = React.useState<GrammarCheckOutput | null>(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = React.useState(false);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [isParaphrasing, setIsParaphrasing] = React.useState(false);
  const [isExpanding, setIsExpanding] = React.useState(false);

  // Find/Replace state
  const [lastSearch, setLastSearch] = React.useState<FindReplaceOptions & { from: number } | null>(null);
  
  // Format state
  const [fontSettings, setFontSettings] = React.useState<FontSettings>({
    family: 'monospace',
    size: 14,
    weight: 'normal',
    style: 'normal',
  });
  const [syntaxLanguage, setSyntaxLanguage] = React.useState('none');

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

  React.useEffect(() => {
    updateStatusBar();
  }, [text, updateStatusBar]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      setIsSaved(false);
  };

  // File Menu Handlers
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
        setFileHandle(null);
        setIsSaved(true);
      };
      reader.onerror = () => {
        toast({ title: 'Error opening file', description: 'Could not read the selected file.', variant: 'destructive' });
      }
      reader.readAsText(file);
    }
    if(e.target) e.target.value = '';
  };

  const handleSave = () => handleSaveAs();

  const handleSaveAs = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
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

  const handlePrint = () => window.print();
  
  const handleExit = () => {
    if (!isSaved) {
        if (confirm("You have unsaved changes. Are you sure you want to exit?")) window.close();
    } else {
        window.close();
    }
  }

  // Edit Menu Handlers
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
        setIsSaved(false);
        setTimeout(() => {
            if(editorRef.current) {
                editorRef.current.selectionStart = editorRef.current.selectionEnd = selectionStart + date.length;
            }
        }, 0);
    }
  }

  const findText = (options: FindReplaceOptions, from: number) => {
    if (!editorRef.current) return -1;
    const { find, matchCase, wholeWord } = options;
    const editorText = editorRef.current.value;

    if (!find) return -1;
    
    const normalizedEditorText = matchCase ? editorText : editorText.toLowerCase();
    const normalizedFindText = matchCase ? find : find.toLowerCase();
    
    let index = normalizedEditorText.indexOf(normalizedFindText, from);

    while (index !== -1) {
        if (wholeWord) {
            const before = editorText.charAt(index - 1);
            const after = editorText.charAt(index + normalizedFindText.length);
            if ((index === 0 || /[\s\p{P}]/u.test(before)) && (index + normalizedFindText.length === editorText.length || /[\s\p{P}]/u.test(after))) {
                return index;
            }
        } else {
            return index;
        }
        index = normalizedEditorText.indexOf(normalizedFindText, index + 1);
    }
    return -1;
  };
  
  const handleFindNext = (options: FindReplaceOptions) => {
    if (!editorRef.current || !options.find) return;

    const isNewSearch = JSON.stringify(options) !== JSON.stringify({find: lastSearch?.find, replace: lastSearch?.replace, matchCase: lastSearch?.matchCase, wholeWord: lastSearch?.wholeWord});
    const startPosition = isNewSearch ? editorRef.current.selectionEnd : (lastSearch?.from ?? editorRef.current.selectionEnd);

    let foundIndex = findText(options, startPosition + (isNewSearch ? 0 : 1));
    
    if (foundIndex !== -1) {
      editorRef.current.focus();
      editorRef.current.setSelectionRange(foundIndex, foundIndex + options.find.length);
      setLastSearch({ ...options, from: foundIndex });
    } else {
      // Wrap search
      const wrappedIndex = findText(options, 0);
      if (wrappedIndex !== -1 && wrappedIndex < startPosition) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(wrappedIndex, wrappedIndex + options.find.length);
        setLastSearch({ ...options, from: wrappedIndex });
      } else {
        toast({ title: "Find", description: `Cannot find "${options.find}"` });
        setLastSearch(null);
      }
    }
  };

  const handleFindNextFromMenu = () => {
    if (lastSearch) {
        handleFindNext(lastSearch);
    } else {
        setIsFindReplaceDialogOpen(true);
    }
  }

  const handleReplace = (options: FindReplaceOptions) => {
    if (!editorRef.current || !options.find) return;
    const { selectionStart, selectionEnd, value } = editorRef.current;
    
    const selectedText = value.substring(selectionStart, selectionEnd);
    const normalizedSelected = options.matchCase ? selectedText : selectedText.toLowerCase();
    const normalizedFind = options.matchCase ? options.find : options.find.toLowerCase();

    if (selectedText && normalizedSelected === normalizedFind) {
        const newText = value.substring(0, selectionStart) + options.replace + value.substring(selectionEnd);
        setText(newText);
        setIsSaved(false);
        setTimeout(() => handleFindNext({ ...options, from: selectionStart }), 0);
    } else {
        handleFindNext(options);
    }
  };
  
  const handleReplaceAll = (options: FindReplaceOptions) => {
    if (!editorRef.current || !options.find) return;
    const { value } = editorRef.current;
    
    let flags = "g";
    if (!options.matchCase) flags += "i";
    
    let findPattern = options.find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (options.wholeWord) {
      findPattern = `\\b${findPattern}\\b`;
    }
    
    const regex = new RegExp(findPattern, flags);
    const newText = value.replace(regex, options.replace);
    
    if (newText !== value) {
        setText(newText);
        setIsSaved(false);
        toast({title: "Replace All", description: "All instances replaced."});
    } else {
        toast({title: "Replace All", description: "No instances found."});
    }
  };

  // AI Handlers
  const handleAIAction = async (
    action: (input: { text: string }) => Promise<{ [key: string]: string }>,
    setLoading: (loading: boolean) => void,
    actionName: string,
    outputKey: string
  ) => {
    if (!text.trim()) {
      toast({ title: `Nothing to ${actionName.toLowerCase()}`, description: 'Editor is empty.' });
      return;
    }
    setLoading(true);
    try {
      const result = await action({ text });
      setText(result[outputKey]);
      setIsSaved(false);
      toast({ title: `AI ${actionName}`, description: 'Text has been updated.' });
    } catch (error) {
      console.error(`${actionName} failed:`, error);
      toast({ title: 'AI Error', description: `Failed to ${actionName.toLowerCase()} text.`, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = () => handleAIAction(summarizeText, setIsSummarizing, 'Summarize', 'summary');
  const handleParaphrase = () => handleAIAction(paraphraseText, setIsParaphrasing, 'Paraphrase', 'paraphrasedText');
  const handleExpand = () => handleAIAction(expandText, setIsExpanding, 'Expand', 'expandedText');
  
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
        setIsSaved(false);
    }
    setIsGrammarCheckDialogOpen(false);
    setGrammarCheckResult(null);
  };
  
  // View Menu Handlers
  const handleZoomIn = React.useCallback(() => {
    setFontSettings(prev => ({ ...prev, size: Math.min(prev.size + 2, 72) }));
  }, []);

  const handleZoomOut = React.useCallback(() => {
    setFontSettings(prev => ({ ...prev, size: Math.max(prev.size - 2, 4) }));
  }, []);

  const handleRestoreZoom = React.useCallback(() => {
    setFontSettings(prev => ({ ...prev, size: 14 }));
  }, []);

  // Keyboard shortcuts for zoom
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        let handled = false;
        switch (e.key) {
          case '=':
          case '+':
            handleZoomIn();
            handled = true;
            break;
          case '-':
            handleZoomOut();
            handled = true;
            break;
          case '0':
            handleRestoreZoom();
            handled = true;
            break;
        }
        if (handled) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleZoomIn, handleZoomOut, handleRestoreZoom]);

  const menuActions = {
    'file:new': handleNew,
    'file:open': handleOpen,
    'file:save': handleSave,
    'file:saveAs': handleSaveAs,
    'file:print': handlePrint,
    'file:exit': handleExit,
    'edit:undo': handleUndo,
    'edit:cut': handleCut,
    'edit:copy': handleCopy,
    'edit:paste': handlePaste,
    'edit:delete': handleDelete,
    'edit:find': () => setIsFindReplaceDialogOpen(true),
    'edit:findNext': handleFindNextFromMenu,
    'edit:replace': () => setIsFindReplaceDialogOpen(true),
    'edit:selectAll': handleSelectAll,
    'edit:timeDate': handleInsertTimeDate,
    'format:wordWrap': () => setWordWrap(prev => !prev),
    'format:font': () => setIsFontDialogOpen(true),
    'view:zoomIn': handleZoomIn,
    'view:zoomOut': handleZoomOut,
    'view:restoreZoom': handleRestoreZoom,
    'view:statusBar': () => setShowStatusBar(prev => !prev),
    'help:viewHelp': () => setIsHelpDialogOpen(true),
    'help:about': () => setIsAboutDialogOpen(true),
    'ai:grammarCheck': handleGrammarCheck,
    'ai:summarize': handleSummarize,
    'ai:paraphrase': handleParaphrase,
    'ai:expand': handleExpand,
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body overflow-hidden">
      <AppHeader
        menuActions={menuActions}
        isCheckingGrammar={isCheckingGrammar}
        isSummarizing={isSummarizing}
        isParaphrasing={isParaphrasing}
        isExpanding={isExpanding}
        wordWrap={wordWrap}
        showStatusBar={showStatusBar}
        syntaxLanguage={syntaxLanguage}
        onSyntaxChange={setSyntaxLanguage}
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
          fontSettings={fontSettings}
          syntaxLanguage={syntaxLanguage}
        />
      </main>
      {showStatusBar && <StatusBar {...statusBarData} />}
      <AboutDialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen} />
      <HelpDialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
      <FontDialog 
        open={isFontDialogOpen}
        onOpenChange={setIsFontDialogOpen}
        initialSettings={fontSettings}
        onApply={setFontSettings}
      />
      <FindReplaceDialog
        open={isFindReplaceDialogOpen}
        onOpenChange={setIsFindReplaceDialogOpen}
        onFindNext={handleFindNext}
        onReplace={handleReplace}
        onReplaceAll={handleReplaceAll}
      />
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
