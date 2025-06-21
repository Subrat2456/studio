'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type FindReplaceOptions = {
    find: string;
    replace: string;
    matchCase: boolean;
    wholeWord: boolean;
}

type FindReplaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFindNext: (options: FindReplaceOptions) => void;
  onReplace: (options: FindReplaceOptions) => void;
  onReplaceAll: (options: FindReplaceOptions) => void;
};

export function FindReplaceDialog({ 
    open, 
    onOpenChange,
    onFindNext,
    onReplace,
    onReplaceAll
}: FindReplaceDialogProps) {
  const [options, setOptions] = React.useState<FindReplaceOptions>({
    find: '',
    replace: '',
    matchCase: false,
    wholeWord: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (name: keyof Omit<FindReplaceOptions, 'find' | 'replace'>) => {
    setOptions(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <Tabs defaultValue="find" className="pt-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="find">Find</TabsTrigger>
                <TabsTrigger value="replace">Replace</TabsTrigger>
            </TabsList>
            <TabsContent value="find">
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="find-text">Find what:</Label>
                        <Input id="find-text" name="find" value={options.find} onChange={handleInputChange} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="matchCaseFind" checked={options.matchCase} onCheckedChange={() => handleCheckboxChange('matchCase')} />
                        <Label htmlFor="matchCaseFind" className='font-normal'>Match case</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="wholeWordFind" checked={options.wholeWord} onCheckedChange={() => handleCheckboxChange('wholeWord')} />
                        <Label htmlFor="wholeWordFind" className='font-normal'>Match whole word</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onFindNext(options)} disabled={!options.find}>Find Next</Button>
                </DialogFooter>
            </TabsContent>
            <TabsContent value="replace">
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="find-text-replace">Find what:</Label>
                        <Input id="find-text-replace" name="find" value={options.find} onChange={handleInputChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="replace-text">Replace with:</Label>
                        <Input id="replace-text" name="replace" value={options.replace} onChange={handleInputChange} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="matchCaseReplace" checked={options.matchCase} onCheckedChange={() => handleCheckboxChange('matchCase')} />
                        <Label htmlFor="matchCaseReplace" className='font-normal'>Match case</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="wholeWordReplace" checked={options.wholeWord} onCheckedChange={() => handleCheckboxChange('wholeWord')} />
                        <Label htmlFor="wholeWordReplace" className='font-normal'>Match whole word</Label>
                    </div>
                </div>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onFindNext(options)} disabled={!options.find}>Find Next</Button>
                    <Button onClick={() => onReplace(options)} disabled={!options.find}>Replace</Button>
                    <Button onClick={() => onReplaceAll(options)} disabled={!options.find}>Replace All</Button>
                </DialogFooter>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
