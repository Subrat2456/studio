'use client';

import * as React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarCheckboxItem
} from '@/components/ui/menubar';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Loader, Sparkles } from 'lucide-react';

type AppHeaderProps = {
  menuActions: { [key: string]: () => void };
  isCheckingGrammar: boolean;
  wordWrap: boolean;
  showStatusBar: boolean;
};

export function AppHeader({ menuActions, isCheckingGrammar, wordWrap, showStatusBar }: AppHeaderProps) {
  const isMac = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false;
  const CtrlCmd = isMac ? 'Cmd' : 'Ctrl';

  const handleAction = (action: string) => {
    if (menuActions[action]) {
      menuActions[action]();
    }
  };

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
            <MenubarItem disabled>Page Setup...</MenubarItem>
            <MenubarItem disabled>Print...<MenubarShortcut>{CtrlCmd}+P</MenubarShortcut></MenubarItem>
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
            <MenubarItem disabled>Find...<MenubarShortcut>{CtrlCmd}+F</MenubarShortcut></MenubarItem>
            <MenubarItem disabled>Find Next<MenubarShortcut>F3</MenubarShortcut></MenubarItem>
            <MenubarItem disabled>Replace...<MenubarShortcut>{CtrlCmd}+H</MenubarShortcut></MenubarItem>
            <MenubarItem disabled>Go To...<MenubarShortcut>{CtrlCmd}+G</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => handleAction('edit:selectAll')}>Select All<MenubarShortcut>{CtrlCmd}+A</MenubarShortcut></MenubarItem>
            <MenubarItem onClick={() => handleAction('edit:timeDate')}>Time/Date<MenubarShortcut>F5</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={wordWrap} onClick={() => handleAction('format:wordWrap')}>Word Wrap</MenubarCheckboxItem>
            <MenubarItem disabled>Font...</MenubarItem>
            <MenubarItem disabled>Text Color...</MenubarItem>
            <MenubarItem disabled>Background...</MenubarItem>
            <MenubarItem disabled>Syntax Highlighting</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
             <MenubarItem disabled>Zoom</MenubarItem>
             <MenubarCheckboxItem checked={showStatusBar} onClick={() => handleAction('view:statusBar')}>Status Bar</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>AI</MenubarTrigger>
          <MenubarContent>
             <MenubarItem disabled>Summarize</MenubarItem>
             <MenubarItem disabled>Paraphrase</MenubarItem>
             <MenubarItem disabled>Expand</MenubarItem>
             <MenubarSeparator />
             <MenubarItem onClick={() => handleAction('ai:grammarCheck')} disabled={isCheckingGrammar}>
                {isCheckingGrammar ? (
                    <><Loader className="mr-2 h-4 w-4 animate-spin" /> Checking...</>
                ) : (
                    "Grammar & Spell Check"
                )}
             </MenubarItem>
             <MenubarSeparator />
             <MenubarItem disabled>Generate Code...</MenubarItem>
             <MenubarItem disabled>Auto-complete</MenubarItem>
             <MenubarItem disabled>Refactor</MenubarItem>
             <MenubarItem disabled>Debug Suggestions</MenubarItem>
             <MenubarSeparator />
             <MenubarItem disabled>Generate Image...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
            <MenubarTrigger>Run</MenubarTrigger>
            <MenubarContent>
                <MenubarItem disabled>Execute Python</MenubarItem>
                <MenubarItem disabled>Execute JavaScript</MenubarItem>
                <MenubarItem disabled>Execute Bash</MenubarItem>
            </MenubarContent>
        </MenubarMenu>


        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>View Help<MenubarShortcut>F1</MenubarShortcut></MenubarItem>
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
