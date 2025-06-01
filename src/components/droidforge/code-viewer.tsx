'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code2 } from 'lucide-react';

interface CodeViewerProps {
  selectedFile: { path: string; content: string } | null;
}

export function CodeViewer({ selectedFile }: CodeViewerProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <Code2 className="mr-2 h-5 w-5 text-primary" />
          Code Preview
        </CardTitle>
        {selectedFile && (
          <CardDescription className="truncate">
            {selectedFile.path}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full">
          {selectedFile ? (
            <pre className="p-4 text-sm font-code bg-muted/50 overflow-x-auto h-full">
              <code className="text-foreground">{selectedFile.content}</code>
            </pre>
          ) : (
            <div className="p-4 h-full flex items-center justify-center">
              <p className="text-muted-foreground">Select a file to view its content.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
