'use client';

import * as React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/components/app/theme-provider';
import type { FontSettings } from '@/components/app/font-dialog';
import { cn } from '@/lib/utils';

type EditorProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSelect: () => void;
  wordWrap: boolean;
  fontSettings: FontSettings;
  syntaxLanguage: string;
};

export const Editor = React.forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ value, onChange, onSelect, wordWrap, fontSettings, syntaxLanguage }, ref) => {
    const lineNumbersRef = React.useRef<HTMLDivElement>(null);
    const highlighterRef = React.useRef<HTMLDivElement>(null);
    const [lineCount, setLineCount] = React.useState(1);
    const { theme } = useTheme();
    const [currentCaretColor, setCurrentCaretColor] = React.useState('black');

    React.useEffect(() => {
      const count = value.split('\n').length;
      setLineCount(count > 0 ? count : 1);
    }, [value]);
    
    React.useEffect(() => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setCurrentCaretColor(isDark ? 'white' : 'black');
      } else {
        setCurrentCaretColor(theme === 'dark' ? 'white' : 'black');
      }
    }, [theme]);

    const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
      const { scrollTop, scrollLeft } = event.currentTarget;
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
      if (highlighterRef.current) {
        highlighterRef.current.scrollTop = scrollTop;
        highlighterRef.current.scrollLeft = scrollLeft;
      }
    };
    
    const editorStyle: React.CSSProperties = {
        fontFamily: fontSettings.family,
        fontSize: `${fontSettings.size}px`,
        fontWeight: fontSettings.weight,
        fontStyle: fontSettings.style,
        lineHeight: '24px',
    };

    const syntaxTheme = React.useMemo(() => {
        const baseTheme = theme === 'dark' ? vscDarkPlus : vs;
        if (fontSettings.color) {
            const newTheme = JSON.parse(JSON.stringify(baseTheme));
            const plainTextStyle = { color: fontSettings.color };
            newTheme['code[class*="language-"]'] = { ...newTheme['code[class*="language-"]'], ...plainTextStyle };
            newTheme['pre[class*="language-"]'] = { ...newTheme['pre[class*="language-"]'], ...plainTextStyle };
            return newTheme;
        }
        return baseTheme;
    }, [theme, fontSettings.color]);

    const textareaStyle: React.CSSProperties = {
        ...editorStyle,
        caretColor: currentCaretColor,
    };

    if (syntaxLanguage !== 'none') {
        textareaStyle.color = 'transparent';
    } else if (fontSettings.color) {
        textareaStyle.color = fontSettings.color;
    }


    return (
      <div className="flex flex-grow w-full h-full bg-card">
        <div
          ref={lineNumbersRef}
          style={editorStyle}
          className={cn(
            'p-4 pt-[18px] text-right bg-muted text-muted-foreground select-none overflow-y-hidden'
          )}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-grow h-full">
            <textarea
                ref={ref}
                value={value}
                onChange={onChange}
                onSelect={onSelect}
                onScroll={handleScroll}
                style={textareaStyle}
                className={cn(
                    'absolute inset-0 p-4 bg-transparent outline-none resize-none w-full h-full z-10',
                    wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre',
                )}
                spellCheck="false"
                wrap={wordWrap ? 'soft' : 'off'}
            />
             {syntaxLanguage !== 'none' && (
                <div
                    ref={highlighterRef}
                    className="absolute inset-0 p-4 overflow-auto pointer-events-none"
                    style={editorStyle}
                >
                    <SyntaxHighlighter
                        language={syntaxLanguage}
                        style={syntaxTheme}
                        customStyle={{
                            ...editorStyle,
                            margin: 0,
                            padding: 0,
                            backgroundColor: 'transparent',
                        }}
                        codeTagProps={{
                            style: {
                                ...editorStyle,
                                display: 'block'
                            },
                        }}
                        wrapLines={wordWrap}
                        showLineNumbers={false}
                    >
                        {value ? `${value}\n` : ''}
                    </SyntaxHighlighter>
                </div>
            )}
        </div>
      </div>
    );
  }
);

Editor.displayName = 'Editor';
