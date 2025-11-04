'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { WhiteboardToolbar } from './whiteboard-toolbar';
import { Button } from '@/components/ui/button';
import { X, Download, Save } from 'lucide-react';
import { usePremium } from '@/hooks/use-premium';
import { useRouter } from 'next/navigation';

export type DrawingTool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text';
export type WhiteboardState = {
  paths: Array<{
    tool: DrawingTool;
    points: Array<{ x: number; y: number }>;
    color: string;
    width: number;
    text?: string;
  }>;
};

interface WhiteboardCanvasProps {
  meetingId: string;
  onClose: () => void;
  onSave?: (data: WhiteboardState) => void;
}

export function WhiteboardCanvas({ meetingId, onClose, onSave }: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [paths, setPaths] = useState<WhiteboardState['paths']>([]);
  const [currentPath, setCurrentPath] = useState<WhiteboardState['paths'][0] | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const { isPremium } = usePremium();
  const router = useRouter();

  // Draw all paths on canvas
  const drawPaths = useCallback((ctx: CanvasRenderingContext2D, pathsToDraw: WhiteboardState['paths']) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    pathsToDraw.forEach((path) => {
      ctx.strokeStyle = path.color;
      ctx.fillStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (path.tool === 'pen' && path.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }
        ctx.stroke();
      } else if (path.tool === 'rectangle' && path.points.length === 2) {
        const [start, end] = path.points;
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.strokeRect(start.x, start.y, width, height);
      } else if (path.tool === 'circle' && path.points.length === 2) {
        const [start, end] = path.points;
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (path.tool === 'line' && path.points.length === 2) {
        const [start, end] = path.points;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else if (path.tool === 'arrow' && path.points.length === 2) {
        const [start, end] = path.points;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        
        // Draw arrowhead
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle - Math.PI / 6),
          end.y - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle + Math.PI / 6),
          end.y - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      } else if (path.tool === 'text' && path.text && path.points.length > 0) {
        ctx.font = `${path.width * 5}px Arial`;
        ctx.fillText(path.text, path.points[0].x, path.points[0].y);
      }
    });
  }, []);

  // Redraw canvas when paths change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    drawPaths(ctx, paths);
    if (currentPath) {
      drawPaths(ctx, [...paths, currentPath]);
    }
  }, [paths, currentPath, drawPaths]);

  const getPointFromEvent = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.clientX - rect.left;
    const y = 'touches' in e
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;

    return { x, y };
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPremium && currentTool !== 'pen') {
      return;
    }

    const point = getPointFromEvent(e);
    if (!point) return;

    setIsDrawing(true);
    setStartPoint(point);

    if (currentTool === 'pen' || currentTool === 'eraser') {
      setCurrentPath({
        tool: currentTool,
        points: [point],
        color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
        width: currentTool === 'eraser' ? lineWidth * 3 : lineWidth,
      });
    } else {
      setCurrentPath({
        tool: currentTool,
        points: [point],
        color: currentColor,
        width: lineWidth,
      });
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath) return;

    const point = getPointFromEvent(e);
    if (!point) return;

    if (currentTool === 'pen' || currentTool === 'eraser') {
      setCurrentPath({
        ...currentPath,
        points: [...currentPath.points, point],
      });
    } else if (startPoint) {
      setCurrentPath({
        ...currentPath,
        points: [startPoint, point],
      });
    }
  };

  const handleEnd = () => {
    if (!isDrawing || !currentPath) return;

    setPaths([...paths, currentPath]);
    setCurrentPath(null);
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleUndo = () => {
    setPaths(paths.slice(0, -1));
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath(null);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${meetingId}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ paths });
    }
  };

  if (!isPremium) {
    return (
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md mx-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="text-muted-foreground mb-4">
            Interactive whiteboard is available for premium users only.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => router.push('/upgrade')}>
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Whiteboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <WhiteboardToolbar
        currentTool={currentTool}
        currentColor={currentColor}
        lineWidth={lineWidth}
        onToolChange={setCurrentTool}
        onColorChange={setCurrentColor}
        onWidthChange={setLineWidth}
        onUndo={handleUndo}
        onClear={handleClear}
        canUndo={paths.length > 0}
      />

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
    </div>
  );
}

