export interface FileNode {
  id: string; // full path
  name: string;
  type: 'file' | 'folder';
  content?: string; // only for files
  children?: FileNode[];
  path: string;
}

export function buildFileTree(files: Record<string, string>): FileNode[] {
  const root: FileNode = { id: 'root', name: 'root', type: 'folder', children: [], path: '' };

  Object.entries(files).forEach(([path, content]) => {
    const parts = path.split('/');
    let currentNode = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      let childNode = currentNode.children?.find(child => child.name === part);

      if (!childNode) {
        childNode = {
          id: parts.slice(0, index + 1).join('/'),
          name: part,
          type: isFile ? 'file' : 'folder',
          path: parts.slice(0, index + 1).join('/'),
          ...(isFile ? { content } : { children: [] }),
        };
        currentNode.children?.push(childNode);
      }
      currentNode = childNode;
    });
  });
  return root.children || [];
}

export function downloadFileContent(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
