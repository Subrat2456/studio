'use client';

import { Button } from '@/components/ui/button';
import { downloadFileContent } from '@/lib/file-utils';
import { Download, FileArchive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadManagerProps {
  projectFiles: Record<string, string> | null;
  selectedFile: { path: string; content: string } | null;
}

export function DownloadManager({ projectFiles, selectedFile }: DownloadManagerProps) {
  const { toast } = useToast();

  const handleDownloadProject = () => {
    // Actual ZIP functionality is not implemented due to no jszip.
    // This is a placeholder action.
    toast({
      title: "Download Full Project",
      description: "Generating and downloading the full project as a ZIP file is not yet fully implemented in this version.",
      variant: "default",
    });
    // if (projectFiles) {
    //   // For demonstration, download a dummy file or the first file.
    //   const firstFileName = Object.keys(projectFiles)[0];
    //   if (firstFileName) {
    //      downloadFileContent("project_preview.txt", `This is a placeholder for the full project ZIP.\nContains ${Object.keys(projectFiles).length} files.`);
    //   }
    // }
  };

  const handleDownloadSelectedFile = () => {
    if (selectedFile) {
      const fileName = selectedFile.path.split('/').pop() || 'downloaded-file';
      downloadFileContent(fileName, selectedFile.content);
    } else {
      toast({
        title: "No file selected",
        description: "Please select a file from the project structure to download.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4 p-4 border-t bg-card">
      <Button
        onClick={handleDownloadProject}
        disabled={!projectFiles}
        variant="outline"
        className="flex-1"
      >
        <FileArchive className="mr-2 h-4 w-4" />
        Download Full Project (ZIP)
      </Button>
      <Button
        onClick={handleDownloadSelectedFile}
        disabled={!selectedFile}
        className="flex-1"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Selected File
      </Button>
    </div>
  );
}
