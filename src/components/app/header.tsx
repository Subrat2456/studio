'use client';

import * as React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarSub,
  MenubarSubContent,
  MenubarTrigger,
  MenubarSubTrigger,
  MenubarRadioGroup,
  MenubarRadioItem,
} from '@/components/ui/menubar';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Loader, Sparkles, Code, Image as ImageIcon, Play, FileCode, Presentation } from 'lucide-react';

type AppHeaderProps = {
  menuActions: { [key: string]: () => void };
  isCheckingGrammar: boolean;
  wordWrap: boolean;
  showStatusBar: boolean;
  isSummarizing: boolean;
  isParaphrasing: boolean;
  isExpanding: boolean;
  isGeneratingCode: boolean;
  isGeneratingImage: boolean;
  isRunningCode: boolean;
  syntaxLanguage: string;
  onSyntaxChange: (language: string) => void;
};

export function AppHeader({ 
  menuActions, 
  isCheckingGrammar, 
  wordWrap, 
  showStatusBar, 
  isSummarizing, 
  isParaphrasing, 
  isExpanding,
  isGeneratingCode,
  isGeneratingImage,
  isRunningCode,
  syntaxLanguage,
  onSyntaxChange,
}: AppHeaderProps) {
  const isMac = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false;
  const CtrlCmd = isMac ? 'Cmd' : 'Ctrl';

  const handleAction = (action: string) => {
    if (menuActions[action]) {
      menuActions[action]();
    }
  };

  const anyAiActionInProgress = isCheckingGrammar || isSummarizing || isParaphrasing || isExpanding || isGeneratingCode || isGeneratingImage || isRunningCode;

  return (
    <header className="flex h-12 items-center px-4 border-b shrink-0">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">ProText AI</h1>
      </div>

      <Menubar className="mx-4">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => handleAction('file:new')}>New <MenubarShortcut>{CtrlCmd}+N</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('file:open')}>Open... <MenubarShortcut>{CtrlCmd}+O</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('file:save')}>Save <MenubarShortcut>{CtrlCmd}+S</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('file:saveAs')}>Save As...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('file:pageSetup')}>Page Setup...</MenubarItem>
            <MenubarItem onClick={() => handleAction('file:print')}>Print...<MenubarShortcut>{CtrlCmd}+P</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('file:exit')}>Exit<MenubarShortcut>Alt+F4</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => handleAction('edit:undo')}>Undo<MenubarShortcut>{CtrlCmd}+Z</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('edit:cut')}>Cut<MenubarShortcut>{CtrlCmd}+X</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('edit:copy')}>Copy<MenubarShortcut>{CtrlCmd}+C</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('edit:paste')}>Paste<MenubarShortcut>{CtrlCmd}+V</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('edit:delete')}>Delete<MenubarShortcut>Del</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('edit:find')}>Find...<MenubarShortcut>{CtrlCmd}+F</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('edit:findNext')}>Find Next<MenubarShortcut>F3</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('edit:replace')}>Replace...<MenubarShortcut>{CtrlCmd}+H</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('edit:selectAll')}>Select All<MenubarShortcut>{CtrlCmd}+A</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('edit:timeDate')}>Time/Date<MenubarShortcut>F5</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={wordWrap} onClick={() => handleAction('format:wordWrap')}>Word Wrap</MenubarCheckboxItem>
            <MenubarItem onClick={() => handleAction('format:font')}>Font...</MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Syntax Highlighting</MenubarSubTrigger>
              <MenubarSubContent>
                 <MenubarRadioGroup value={syntaxLanguage} onValueChange={onSyntaxChange}>
                    <MenubarRadioItem value="none">Plain Text</MenubarRadioItem>
                    <MenubarRadioItem value="javascript">JavaScript</MenubarRadioItem>
                    <MenubarRadioItem value="html">HTML</MenubarRadioItem>
                    <MenubarRadioItem value="css">CSS</MenubarRadioItem>
                    <MenubarRadioItem value="python">Python</MenubarRadioItem>
                    <MenubarRadioItem value="bash">Bash</MenubarRadioItem>
                 </MenubarRadioGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Zoom</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => handleAction('view:zoomIn')}>
                  Zoom In <MenubarShortcut>{CtrlCmd}+=</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={() => handleAction('view:zoomOut')}>
                  Zoom Out <MenubarShortcut>{CtrlCmd}+-</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => handleAction('view:restoreDefaultFont')}>
                  Restore Default Font <MenubarShortcut>{CtrlCmd}+0</MenubarShortcut>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarCheckboxItem checked={showStatusBar} onClick={() => handleAction('view:statusBar')}>Status Bar</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
            <MenubarTrigger>Run</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={() => handleAction('run:runCode')} disabled={anyAiActionInProgress}>
                    {isRunningCode ? (
                        <><Loader className="mr-2 h-4 w-4 animate-spin" /> Running...</>
                    ) : (
                        <><Play className="mr-2 h-4 w-4" /> Run Code</>
                    )}
                    <MenubarShortcut>{CtrlCmd}+R</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => handleAction('run:previewHtml')}>
                    <FileCode className="mr-2 h-4 w-4" /> Preview HTML
                </MenubarItem>
                <MenubarItem onClick={() => handleAction('run:previewMarkdown')}>
                    <Presentation className="mr-2 h-4 w-4" /> Preview Markdown
                </MenubarItem>
            </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>AI</MenubarTrigger>
          <MenubarContent>
             <MenubarItem onClick={() => handleAction('ai:summarize')} disabled={anyAiActionInProgress}>
                {isSummarizing ? (
                    <><Loader className="mr-2 h-4 w-4 animate-spin" /> Summarizing...</>
                ) : (
                    "Summarize"
                )}
             </MenubarItem>
             <MenubarItem onClick={() => handleAction('ai:paraphrase')} disabled={anyAiActionInProgress}>
                {isParaphrasing ? (
                    <><Loader className="mr-2 h-4 w-4 animate-spin" /> Paraphrasing...</>
                ) : (
                    "Paraphrase"
                )}
             </MenubarItem>
             <MenubarItem onClick={() => handleAction('ai:expand')} disabled={anyAiActionInProgress}>
                {isExpanding ? (
                    <><Loader className="mr-2 h-4 w-4 animate-spin" /> Expanding...</>
                ) : (
                    "Expand"
                )}
             </MenubarItem>
             <MenubarSeparator />
             <MenubarItem onClick={() => handleAction('ai:grammarCheck')} disabled={anyAiActionInProgress}>
                {isCheckingGrammar ? (
                    <><Loader className="mr-2 h-4 w-4 animate-spin" /> Checking...</>
                ) : (
                    "Grammar & Spell Check"
                )}
             </MenubarItem>
             <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('ai:generateCode')} disabled={anyAiActionInProgress}>
              {isGeneratingCode ? (
                <><Loader className="mr-2 h-4 w-4 animate-spin" /> Generating Code...</>
              ) : (
                <><Code className="mr-2 h-4 w-4" /> Generate Code...</>
              )}
            </MenubarItem>
            <MenubarItem onClick={() => handleAction('ai:generateImage')} disabled={anyAiActionInProgress}>
              {isGeneratingImage ? (
                <><Loader className="mr-2 h-4 w-4 animate-spin" /> Generating Image...</>
              ) : (
                <><ImageIcon className="mr-2 h-4 w-4" /> Generate Image...</>
              )}
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => handleAction('help:viewHelp')}>View Help</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('help:about')}>About ProText AI</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
