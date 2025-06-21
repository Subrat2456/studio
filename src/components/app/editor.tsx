'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type EditorProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSelect: () => void;
  wordWrap: boolean;
};

export const Editor = React.forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ value, onChange, onSelect, wordWrap }, ref) => {
    const lineNumbersRef = React.useRef<HTMLDivElement>(null);
    const [lineCount, setLineCount] = React.useState(1);

    React.useEffect(() => {
      const count = value.split('\n').length;
      setLineCount(count > 0 ? count : 1);
    }, [value]);

    const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
      }
    };
    
    // Line height needs to match textarea's line height for sync scroll to work well
    const editorLineHeight = 'leading-6'; 

    return (
      <div className="flex flex-grow w-full h-full bg-card">
        <div
          ref={lineNumbersRef}
          className={cn(
            'p-4 pt-[18px] text-right bg-muted text-muted-foreground select-none overflow-y-hidden font-code text-sm',
            editorLineHeight
          )}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onSelect={onSelect}
          onScroll={handleScroll}
          className={cn(
            'flex-grow p-4 bg-transparent outline-none resize-none font-code text-sm w-full h-full',
            editorLineHeight,
            wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre',
          )}
          spellCheck="false"
          wrap={wordWrap ? 'soft' : 'off'}
        />
      </div>
    );
  }
);

Editor.displayName = 'Editor';
