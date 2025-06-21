'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LifeBuoy } from 'lucide-react';

type HelpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LifeBuoy className="text-primary" />
            Help
          </DialogTitle>
          <DialogDescription>Frequently Asked Questions and Keyboard Shortcuts</DialogDescription>
        </DialogHeader>
        <div className="text-sm text-muted-foreground space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <h3 className="font-semibold text-foreground">What is ProText AI?</h3>
            <p>ProText AI is a modern text editor with AI-powered features to help you write better and faster.</p>

            <h3 className="font-semibold text-foreground">Keyboard Shortcuts</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold">Ctrl/Cmd + N:</span> New File</li>
                <li><span className="font-semibold">Ctrl/Cmd + O:</span> Open File</li>
                <li><span className="font-semibold">Ctrl/Cmd + S:</span> Save File</li>
                <li><span className="font-semibold">Ctrl/Cmd + P:</span> Print File</li>
                <li><span className="font-semibold">Ctrl/Cmd + F:</span> Find</li>
                <li><span className="font-semibold">F3:</span> Find Next</li>
                <li><span className="font-semibold">Ctrl/Cmd + H:</span> Replace</li>
                <li><span className="font-semibold">Ctrl/Cmd + Z:</span> Undo</li>
                <li><span className="font-semibold">Ctrl/Cmd + X:</span> Cut</li>
                <li><span className="font-semibold">Ctrl/Cmd + C:</span> Copy</li>
                <li><span className="font-semibold">Ctrl/Cmd + V:</span> Paste</li>
                <li><span className="font-semibold">Ctrl/Cmd + A:</span> Select All</li>
                <li><span className="font-semibold">F5:</span> Insert Time/Date</li>
            </ul>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
