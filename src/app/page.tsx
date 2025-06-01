'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/droidforge/app-header';
import { InputArea } from '@/components/droidforge/input-area';
import { ProjectStructureViewer } from '@/components/droidforge/project-structure-viewer';
import { CodeViewer } from '@/components/droidforge/code-viewer';
import { DownloadManager } from '@/components/droidforge/download-manager';
import { generateAndroidProject, type GenerateAndroidProjectInput, type GenerateAndroidProjectOutput } from '@/ai/flows/generate-android-project';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";

export default function DroidForgePage() {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handleSubmitPrompt = async (input: GenerateAndroidProjectInput) => {
    setIsLoading(true);
    setError(null);
    setGeneratedFiles(null);
    setSelectedFile(null);

    try {
      const result: GenerateAndroidProjectOutput = await generateAndroidProject(input);
      if (result.projectFiles && Object.keys(result.projectFiles).length > 0) {
        setGeneratedFiles(result.projectFiles);
        toast({
          title: "Project Generated!",
          description: "Your Android project files are ready.",
        });
      } else {
        setError('The AI returned an empty project. Please try a different prompt.');
         toast({
          title: "Generation Issue",
          description: "The AI returned an empty project. Please try a different prompt.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error('Error generating project:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate project: ${errorMessage}`);
      toast({
        title: "Generation Failed",
        description: `An error occurred: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (path: string, content: string) => {
    setSelectedFile({ path, content });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <InputArea
          prompt={prompt}
          onPromptChange={handlePromptChange}
          onSubmit={handleSubmitPrompt}
          isLoading={isLoading}
        />

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
          <div className="md:col-span-1 h-full">
            {isLoading && !generatedFiles ? (
              <div className="space-y-2 p-4 border rounded-lg bg-card h-full">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/6" />
                <Skeleton className="h-6 w-5/6" />
              </div>
            ) : (
              <ProjectStructureViewer
                projectFiles={generatedFiles}
                onFileSelect={handleFileSelect}
                selectedFilePath={selectedFile?.path ?? null}
              />
            )}
          </div>
          <div className="md:col-span-2 h-full flex flex-col">
             {isLoading && !selectedFile && !generatedFiles ? (
                <div className="space-y-2 p-4 border rounded-lg bg-card h-full">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-64 w-full" />
                </div>
             ) : (
                <div className="flex-grow overflow-hidden h-[calc(100%-80px)]"> {/* Adjust height based on DownloadManager */}
                     <CodeViewer selectedFile={selectedFile} />
                </div>
             )}
            <DownloadManager projectFiles={generatedFiles} selectedFile={selectedFile} />
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        Powered by AI & Firebase Studio
      </footer>
    </div>
  );
}
