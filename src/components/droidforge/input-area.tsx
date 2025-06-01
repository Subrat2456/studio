'use client';

import type { GenerateAndroidProjectInput } from '@/ai/flows/generate-android-project';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface InputAreaProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: (input: GenerateAndroidProjectInput) => Promise<void>;
  isLoading: boolean;
}

export function InputArea({ prompt, onPromptChange, onSubmit, isLoading }: InputAreaProps) {
  const handleSubmit = () => {
    onSubmit({ command: prompt });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          Describe Your Android App
        </CardTitle>
        <CardDescription>
          Enter a natural language command to generate your Android Studio project. For example: &quot;Create a Kotlin app with a login screen and Firebase Auth.&quot;
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="prompt-input" className="text-sm font-medium">
              Your Command
            </Label>
            <Textarea
              id="prompt-input"
              placeholder="e.g., Create a Java app with bottom navigation and 3 fragments..."
              value={prompt}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onPromptChange(e.target.value)}
              rows={4}
              className="mt-1 resize-none"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
