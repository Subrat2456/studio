'use client';

import type { FileNode } from '@/lib/file-utils';
import { buildFileTree } from '@/lib/file-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderTree } from 'lucide-react';
import { FileTreeNodeView } from './file-tree-node-view';
import { useMemo } from 'react';

interface ProjectStructureViewerProps {
  projectFiles: Record<string, string> | null;
  onFileSelect: (path: string, content: string) => void;
  selectedFilePath: string | null;
}

export function ProjectStructureViewer({ projectFiles, onFileSelect, selectedFilePath }: ProjectStructureViewerProps) {
  const fileTree = useMemo(() => {
    if (!projectFiles) return [];
    return buildFileTree(projectFiles);
  }, [projectFiles]);

  if (!projectFiles || fileTree.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center">
            <FolderTree className="mr-2 h-5 w-5 text-primary" />
            Project Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Project structure will appear here once generated.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <FolderTree className="mr-2 h-5 w-5 text-primary" />
          Project Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {fileTree.map(node => (
            <FileTreeNodeView
              key={node.id}
              node={node}
              onFileSelect={onFileSelect}
              selectedFilePath={selectedFilePath}
            />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
