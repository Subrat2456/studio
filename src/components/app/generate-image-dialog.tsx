'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, Download, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type GenerateImageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (prompt: string) => void;
  onInsert: (prompt: string, imageDataUri: string) => void;
  isGenerating: boolean;
  generatedImageDataUri: string | null;
  clearGeneratedImage: () => void;
};

export function GenerateImageDialog({
  open,
  onOpenChange,
  onGenerate,
  onInsert,
  isGenerating,
  generatedImageDataUri,
  clearGeneratedImage,
}: GenerateImageDialogProps) {
  const [prompt, setPrompt] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    if (!open) {
      // Clear image when dialog is closed
      clearGeneratedImage();
      setPrompt('');
    }
  }, [open, clearGeneratedImage]);

  const handleDownload = () => {
    if (!generatedImageDataUri) return;
    const link = document.createElement('a');
    link.href = generatedImageDataUri;
    link.download = `${prompt.replace(/\s+/g, '_') || 'generated-image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Image downloaded' });
  };
  
  const handleInsert = () => {
    if (!generatedImageDataUri) return;
    onInsert(prompt, generatedImageDataUri);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Image</DialogTitle>
          <DialogDescription>Describe the image you want to create with AI.</DialogDescription>
        </DialogHeader>
        
        {generatedImageDataUri ? (
          <div className="space-y-4">
             <div className="rounded-md overflow-hidden border">
                <Image src={generatedImageDataUri} alt={prompt} width={400} height={400} className="w-full h-auto" />
             </div>
             <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{prompt}</p>
             <DialogFooter className="gap-2 sm:justify-center">
                 <Button onClick={handleInsert}><Clipboard className="mr-2" /> Insert</Button>
                 <Button onClick={handleDownload} variant="secondary"><Download className="mr-2" /> Download</Button>
                 <Button onClick={clearGeneratedImage} variant="outline">Generate New</Button>
             </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="image-prompt">Prompt</Label>
              <Input
                id="image-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., a photorealistic cat wearing a wizard hat"
              />
            </div>
            {isGenerating && (
                <div className="flex flex-col items-center justify-center gap-4 p-8 bg-muted rounded-md">
                    <Loader className="animate-spin text-primary" size={48} />
                    <p className="text-muted-foreground">Generating your image...</p>
                </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={() => onGenerate(prompt)} disabled={!prompt || isGenerating}>
                    Generate
                </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
