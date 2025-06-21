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
import { ScrollArea } from '@/components/ui/scroll-area';

type GrammarCheckDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  correctedText: string;
  onApply: () => void;
};

export function GrammarCheckDialog({
  open,
  onOpenChange,
  originalText,
  correctedText,
  onApply,
}: GrammarCheckDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Grammar & Spelling Corrections</DialogTitle>
          <DialogDescription>
            AI has suggested the following corrections. Review the changes and apply them if you approve.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 max-h-[50vh]">
            <div>
                <h3 className="font-semibold mb-2">Original</h3>
                <ScrollArea className="h-full rounded-md border p-4 font-code text-sm">
                    <pre className="whitespace-pre-wrap">{originalText}</pre>
                </ScrollArea>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Corrected</h3>
                <ScrollArea className="h-full rounded-md border p-4 font-code text-sm bg-primary/10">
                    <pre className="whitespace-pre-wrap">{correctedText}</pre>
                </ScrollArea>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onApply}>Apply Corrections</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
