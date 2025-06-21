'use client';

import { Separator } from '@/components/ui/separator';

type StatusBarProps = {
  line: number;
  column: number;
  wordCount: number;
  charCount: number;
};

export function StatusBar({ line, column, wordCount, charCount }: StatusBarProps) {
  return (
    <footer className="flex items-center h-8 px-4 border-t text-sm text-muted-foreground shrink-0">
      <div className="flex items-center gap-4">
        <span>Ln {line}, Col {column}</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{wordCount} words</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{charCount} characters</span>
      </div>
      <div className="ml-auto">
        <span>UTF-8</span>
      </div>
    </footer>
  );
}
