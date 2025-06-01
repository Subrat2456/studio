'use client';

import type { FileNode } from '@/lib/file-utils';
import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileTreeNodeViewProps {
  node: FileNode;
  onFileSelect: (path: string, content: string) => void;
  selectedFilePath: string | null;
  level?: number;
}

export function FileTreeNodeView({ node, onFileSelect, selectedFilePath, level = 0 }: FileTreeNodeViewProps) {
  const [isOpen, setIsOpen] = useState(level < 2); // Auto-open first few levels

  const isSelected = node.path === selectedFilePath;

  if (node.type === 'folder') {
    return (
      <div className="text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full justify-start h-8 pl-2',
            `ml-${level * 4}` 
          )}
          aria-expanded={isOpen}
          aria-controls={`folder-content-${node.id}`}
        >
          {isOpen ? <ChevronDown className="h-4 w-4 mr-2 shrink-0" /> : <ChevronRight className="h-4 w-4 mr-2 shrink-0" />}
          <Folder className="h-4 w-4 mr-2 text-sky-500 shrink-0" />
          <span className="truncate">{node.name}</span>
        </Button>
        {isOpen && node.children && (
          <div id={`folder-content-${node.id}`} role="region">
            {node.children.map(child => (
              <FileTreeNodeView
                key={child.id}
                node={child}
                onFileSelect={onFileSelect}
                selectedFilePath={selectedFilePath}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else { // file
    return (
      <div className="text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFileSelect(node.path, node.content ?? '')}
          className={cn(
            'w-full justify-start h-8 pl-2',
            `ml-${level * 4}`,
            isSelected && 'bg-accent text-accent-foreground hover:bg-accent/90'
          )}
          aria-pressed={isSelected}
        >
          <FileText className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
          <span className="truncate">{node.name}</span>
        </Button>
      </div>
    );
  }
}
