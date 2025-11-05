'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pen, Eraser, Square, Circle, Minus, ArrowRight, Type, Undo2, Trash2 } from 'lucide-react';
import type { DrawingTool } from './whiteboard-canvas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WhiteboardToolbarProps {
  currentTool: DrawingTool;
  currentColor: string;
  lineWidth: number;
  onToolChange: (tool: DrawingTool) => void;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  onUndo: () => void;
  onClear: () => void;
  canUndo: boolean;
}

export function WhiteboardToolbar({
  currentTool,
  currentColor,
  lineWidth,
  onToolChange,
  onColorChange,
  onWidthChange,
  onUndo,
  onClear,
  canUndo,
}: WhiteboardToolbarProps) {
  const tools: Array<{ tool: DrawingTool; icon: React.ReactNode; label: string }> = [
    { tool: 'pen', icon: <Pen className="h-4 w-4" />, label: 'Pen' },
    { tool: 'eraser', icon: <Eraser className="h-4 w-4" />, label: 'Eraser' },
    { tool: 'rectangle', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
    { tool: 'circle', icon: <Circle className="h-4 w-4" />, label: 'Circle' },
    { tool: 'line', icon: <Minus className="h-4 w-4" />, label: 'Line' },
    { tool: 'arrow', icon: <ArrowRight className="h-4 w-4" />, label: 'Arrow' },
    { tool: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  ];

  return (
    <div className="border-b p-2 sm:p-4 bg-muted/50 overflow-x-auto">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-max sm:min-w-0">
        {/* Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {tools.map(({ tool, icon, label }) => (
            <Button
              key={tool}
              variant={currentTool === tool ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToolChange(tool)}
              title={label}
              className="min-w-[44px] min-h-[44px] touch-target"
            >
              {icon}
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* Color Picker */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Label htmlFor="color-picker" className="text-xs sm:text-sm hidden sm:inline">Color:</Label>
          <div className="flex gap-1">
            {colors.slice(0, 6).map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`w-6 h-6 sm:w-6 sm:h-6 rounded border-2 touch-target ${
                  currentColor === color ? 'border-primary' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <Input
            id="color-picker"
            type="color"
            value={currentColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 sm:w-10 sm:h-8 p-0 border-0 touch-target"
          />
        </div>

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* Line Width */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Label htmlFor="line-width" className="text-xs sm:text-sm hidden sm:inline">Width:</Label>
          <Input
            id="line-width"
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className="w-16 sm:w-24 touch-target"
          />
          <span className="text-xs sm:text-sm text-muted-foreground w-6 sm:w-8">{lineWidth}px</span>
        </div>

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className="min-w-[44px] min-h-[44px] touch-target"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            title="Clear"
            className="min-w-[44px] min-h-[44px] touch-target"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

