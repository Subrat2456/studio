'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export type OutputMode = 'output' | 'html-preview' | 'markdown-preview';

type OutputPanelProps = {
  mode: OutputMode;
  content: string;
  onModeChange: (mode: OutputMode) => void;
};

export function OutputPanel({ mode, content, onModeChange }: OutputPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs value={mode} onValueChange={(value) => onModeChange(value as OutputMode)} className="flex-grow flex flex-col">
        <TabsList className="shrink-0">
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="html-preview">HTML Preview</TabsTrigger>
          <TabsTrigger value="markdown-preview">Markdown Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="output" className="flex-grow mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <ScrollArea className="h-full w-full bg-muted rounded-md">
            <pre className="p-4 text-sm font-code text-foreground whitespace-pre-wrap">{content}</pre>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="html-preview" className="flex-grow mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <iframe
                srcDoc={content}
                title="HTML Preview"
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border rounded-md bg-white"
            />
        </TabsContent>
        <TabsContent value="markdown-preview" className="flex-grow mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <ScrollArea className="h-full w-full rounded-md border">
                 <div className="p-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                 </div>
            </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
