'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from './theme-provider';

export type FontSettings = {
  family: string;
  size: number;
  weight: 'normal' | 'bold';
  style: 'normal' | 'italic';
  color: string;
};

type FontDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (settings: FontSettings) => void;
  initialSettings: FontSettings;
};

export function FontDialog({ open, onOpenChange, onApply, initialSettings }: FontDialogProps) {
  const [settings, setSettings] = React.useState<FontSettings>(initialSettings);
  const { theme } = useTheme();
  const [defaultColor, setDefaultColor] = React.useState('#000000');


  React.useEffect(() => {
    if (open) {
      setSettings(initialSettings);
    }
  }, [open, initialSettings]);

  React.useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDefaultColor(isDark ? '#FFFFFF' : '#000000');
  }, [theme]);

  const handleApply = () => {
    onApply(settings);
    onOpenChange(false);
  };

  const handleResetColor = () => {
    setSettings(s => ({ ...s, color: '' }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Font</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <Select
              value={settings.family}
              onValueChange={(value) => setSettings(s => ({ ...s, family: value }))}
            >
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monospace">Monospace</SelectItem>
                <SelectItem value="Inter">Inter (Sans-Serif)</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Input
              id="font-size"
              type="number"
              value={settings.size}
              onChange={(e) => setSettings(s => ({ ...s, size: parseInt(e.target.value, 10) || 14 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="font-weight">Font Weight</Label>
             <Select
              value={settings.weight}
              onValueChange={(value: 'normal' | 'bold') => setSettings(s => ({ ...s, weight: value }))}
            >
              <SelectTrigger id="font-weight">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-end space-x-2 pb-2">
            <Checkbox
              id="font-style"
              checked={settings.style === 'italic'}
              onCheckedChange={(checked) => setSettings(s => ({ ...s, style: checked ? 'italic' : 'normal' }))}
            />
            <Label htmlFor="font-style" className="font-normal">Italic</Label>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="font-color-picker">Text Color</Label>
            <div className="flex items-center gap-2">
                <Input
                    id="font-color-picker"
                    type="color"
                    value={settings.color || defaultColor}
                    onChange={(e) => setSettings(s => ({ ...s, color: e.target.value }))}
                    className="p-1 h-10 w-16"
                />
                 <Input
                    id="font-color-text"
                    type="text"
                    value={settings.color}
                    onChange={(e) => setSettings(s => ({ ...s, color: e.target.value }))}
                    placeholder="Default"
                    className="w-full"
                />
                <Button variant="outline" onClick={handleResetColor}>Reset</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleApply}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
