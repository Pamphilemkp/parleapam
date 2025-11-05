'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { WhiteboardToolbar } from './whiteboard-toolbar';
import { Button } from '@/components/ui/button';
import { X, Download, Save } from 'lucide-react';
import { usePremium } from '@/hooks/use-premium';
import { useRouter } from 'next/navigation';
import type { Call } from '@stream-io/video-react-sdk';

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

// Type for window extension with whiteboard sync function
interface WindowWithWhiteboard {
  __whiteboardSend?: (path: WhiteboardState['paths'][number] | null, action: 'path' | 'clear' | 'undo') => void;
  __aiDraw?: (command: string) => void;
}

interface WhiteboardCanvasProps {
  meetingId: string;
  onClose: () => void;
  onSave?: (data: WhiteboardState) => void;
  demo?: boolean;
  call?: Call;
  agentId?: string;
}

export function WhiteboardCanvas({ meetingId, onClose, onSave, demo = false, call, agentId }: WhiteboardCanvasProps) {
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
  
  // AI-driven whiteboard command parser and executor
  const executeAIDrawingCommand = useCallback((command: string) => {
    if (!isPremium || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasWidth = canvas.offsetWidth || 800;
    const canvasHeight = canvas.offsetHeight || 600;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    const cmd = command.toLowerCase().trim();
    
    // Parse drawing commands
    // Draw circle
    if (cmd.includes('circle') || cmd.includes('draw a circle')) {
      const radius = cmd.match(/\d+/)?.[0] ? parseInt(cmd.match(/\d+/)?.[0] || '50') : 50;
      const newPath: WhiteboardState['paths'][number] = {
        tool: 'circle',
        points: [
          { x: centerX - radius, y: centerY },
          { x: centerX + radius, y: centerY }
        ],
        color: currentColor,
        width: lineWidth,
      };
      setPaths(prev => [...prev, newPath]);
      return;
    }
    
    // Draw rectangle
    if (cmd.includes('rectangle') || cmd.includes('square') || cmd.includes('box')) {
      const size = cmd.match(/\d+/)?.[0] ? parseInt(cmd.match(/\d+/)?.[0] || '100') : 100;
      const newPath: WhiteboardState['paths'][number] = {
        tool: 'rectangle',
        points: [
          { x: centerX - size/2, y: centerY - size/2 },
          { x: centerX + size/2, y: centerY + size/2 }
        ],
        color: currentColor,
        width: lineWidth,
      };
      setPaths(prev => [...prev, newPath]);
      return;
    }
    
    // Draw line
    if (cmd.includes('line') || cmd.includes('draw a line')) {
      const newPath: WhiteboardState['paths'][number] = {
        tool: 'line',
        points: [
          { x: centerX - 100, y: centerY },
          { x: centerX + 100, y: centerY }
        ],
        color: currentColor,
        width: lineWidth,
      };
      setPaths(prev => [...prev, newPath]);
      return;
    }
    
    // Draw arrow
    if (cmd.includes('arrow') || cmd.includes('point to')) {
      const newPath: WhiteboardState['paths'][number] = {
        tool: 'arrow',
        points: [
          { x: centerX - 100, y: centerY },
          { x: centerX + 100, y: centerY }
        ],
        color: currentColor,
        width: lineWidth,
      };
      setPaths(prev => [...prev, newPath]);
      return;
    }
    
    // Write text
    if (cmd.includes('write') || cmd.includes('text') || cmd.includes('say')) {
      const textMatch = cmd.match(/(?:write|text|say)\s+(.+)/);
      const text = textMatch?.[1] || 'AI Note';
      const newPath: WhiteboardState['paths'][number] = {
        tool: 'text',
        points: [{ x: centerX - 100, y: centerY }],
        color: currentColor,
        width: lineWidth,
        text: text.substring(0, 50), // Limit text length
      };
      setPaths(prev => [...prev, newPath]);
      return;
    }
    
    // Clear whiteboard
    if (cmd.includes('clear') || cmd.includes('erase all') || cmd.includes('clean')) {
      setPaths([]);
      setCurrentPath(null);
      return;
    }
    
    // Draw diagram (flowchart)
    if (cmd.includes('diagram') || cmd.includes('flowchart') || cmd.includes('process')) {
      // Draw a simple flowchart
      const box1: WhiteboardState['paths'][number] = {
        tool: 'rectangle',
        points: [
          { x: centerX - 150, y: centerY - 100 },
          { x: centerX - 50, y: centerY - 50 }
        ],
        color: '#0ea5e9',
        width: 3,
      };
      const arrow1: WhiteboardState['paths'][number] = {
        tool: 'arrow',
        points: [
          { x: centerX - 50, y: centerY - 75 },
          { x: centerX + 50, y: centerY - 75 }
        ],
        color: '#ef4444',
        width: 3,
      };
      const box2: WhiteboardState['paths'][number] = {
        tool: 'rectangle',
        points: [
          { x: centerX + 50, y: centerY - 100 },
          { x: centerX + 150, y: centerY - 50 }
        ],
        color: '#10b981',
        width: 3,
      };
      setPaths(prev => [...prev, box1, arrow1, box2]);
      return;
    }
  }, [isPremium, currentColor, lineWidth]);
  
  // Listen for AI commands via window events
  // Note: Real-time transcript listening can be added when Stream SDK provides transcript events
  useEffect(() => {
    if (!isPremium || !agentId) return;
    
    // Listen via window for AI command injection
    // This can be triggered by:
    // 1. Manual demo commands
    // 2. Transcript parsing (when Stream SDK transcript events are available)
    // 3. External integrations
    const handleWindowCommand = (e: CustomEvent<{ command: string }>) => {
      executeAIDrawingCommand(e.detail.command);
    };
    
    window.addEventListener('ai-whiteboard-command', handleWindowCommand as EventListener);
    
    return () => {
      window.removeEventListener('ai-whiteboard-command', handleWindowCommand as EventListener);
    };
  }, [isPremium, agentId, executeAIDrawingCommand]);
  
  // Real-time whiteboard sync using Stream app messages (placeholder for future implementation)
  // Note: Stream Video SDK real-time sync requires additional setup with app messages or data channels
  // For now, whiteboard state is saved to database and can be synced via polling or WebSocket
  useEffect(() => {
    if (!call || !isPremium) return;

    // Placeholder for real-time sync - will be implemented with proper Stream SDK data channels
    // For MVP, whiteboard syncs via database saves that other participants can poll
    const sendPath = (path: WhiteboardState['paths'][number] | null, action: 'path' | 'clear' | 'undo') => {
      // Real-time sync will be implemented with Stream SDK data channels in future update
      // For now, state is persisted via onSave callback
      if (onSave && action === 'path' && path) {
        // Save state periodically
        const currentState = { paths: [...paths, path] };
        onSave(currentState);
      }
    };

    // Store send function for use in handlers (for future sync implementation)
    (window as WindowWithWhiteboard).__whiteboardSend = sendPath;
    
    // Store AI command executor for external access
    (window as WindowWithWhiteboard).__aiDraw = executeAIDrawingCommand;

    return () => {
      delete (window as WindowWithWhiteboard).__whiteboardSend;
      delete (window as WindowWithWhiteboard).__aiDraw;
    };
  }, [call, isPremium, paths, onSave, executeAIDrawingCommand]);

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

  // Rich branded demo sequence: comprehensive drawing showcase
  useEffect(() => {
    if (!demo) return;
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const canvasWidth = canvas.offsetWidth || 800;
    const canvasHeight = canvas.offsetHeight || 600;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const addPath = (path: WhiteboardState['paths'][number], delay: number) => {
      window.setTimeout(() => {
        if (cancelled) return;
        setPaths((prev) => [...prev, path]);
      }, delay);
    };

    // Step 1: Title with brand colors
    addPath({ 
      tool: 'text', 
      points: [{ x: centerX - 120, y: 50 }], 
      color: '#0ea5e9', 
      width: 4, 
      text: 'Parle à Pam AI' 
    }, 500);

    // Step 2: Main concept box (branded)
    addPath({ 
      tool: 'rectangle', 
      points: [{ x: centerX - 200, y: centerY - 100 }, { x: centerX + 200, y: centerY + 100 }], 
      color: '#10b981', 
      width: 4 
    }, 1500);

    // Step 3: Connecting arrows (flow diagram)
    addPath({ 
      tool: 'arrow', 
      points: [{ x: centerX - 250, y: centerY - 150 }, { x: centerX - 200, y: centerY - 100 }], 
      color: '#ef4444', 
      width: 3 
    }, 2300);
    addPath({ 
      tool: 'arrow', 
      points: [{ x: centerX + 200, y: centerY }, { x: centerX + 250, y: centerY }], 
      color: '#ef4444', 
      width: 3 
    }, 2800);

    // Step 4: Process flow circle
    addPath({ 
      tool: 'circle', 
      points: [{ x: centerX, y: centerY - 150 }, { x: centerX + 80, y: centerY - 150 }], 
      color: '#8b5cf6', 
      width: 3 
    }, 3500);

    // Step 5: Hand-drawn explanation curve
    const curve: WhiteboardState['paths'][number] = { 
      tool: 'pen', 
      points: [], 
      color: '#f59e0b', 
      width: 3 
    };
    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const x = centerX - 150 + t * 300;
      const y = centerY + 50 + Math.sin(t * Math.PI * 2) * 40;
      curve.points.push({ x, y });
    }
    addPath(curve, 4200);

    // Step 6: Text annotation
    addPath({ 
      tool: 'text', 
      points: [{ x: centerX - 100, y: centerY + 120 }], 
      color: '#6366f1', 
      width: 3, 
      text: 'Interactive Learning' 
    }, 5200);

    // Step 7: Additional diagram elements
    addPath({ 
      tool: 'line', 
      points: [{ x: centerX - 150, y: centerY + 80 }, { x: centerX - 150, y: centerY + 150 }], 
      color: '#06b6d4', 
      width: 2 
    }, 6000);
    addPath({ 
      tool: 'line', 
      points: [{ x: centerX + 150, y: centerY + 80 }, { x: centerX + 150, y: centerY + 150 }], 
      color: '#06b6d4', 
      width: 2 
    }, 6500);

    return () => {
      cancelled = true;
    };
  }, [demo]);

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

    const newPaths = [...paths, currentPath];
    setPaths(newPaths);
    
    // Sync to other participants
    const sendFn = (window as WindowWithWhiteboard).__whiteboardSend;
    if (call && sendFn) {
      sendFn(currentPath, 'path');
    }
    
    setCurrentPath(null);
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleUndo = () => {
    setPaths(paths.slice(0, -1));
    
    // Sync undo to other participants
    const sendFn = (window as WindowWithWhiteboard).__whiteboardSend;
    if (call && sendFn) {
      sendFn(null, 'undo');
    }
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath(null);
    
    // Sync clear to other participants
    const sendFn = (window as WindowWithWhiteboard).__whiteboardSend;
    if (call && sendFn) {
      sendFn(null, 'clear');
    }
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
    <div className="absolute inset-0 bg-background z-50 flex flex-col w-full h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b flex-shrink-0">
        <h2 className="text-base sm:text-lg font-semibold truncate">Whiteboard</h2>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleExport} className="min-w-[44px] min-h-[44px] text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} className="min-w-[44px] min-h-[44px] text-xs sm:text-sm">
            <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="min-w-[44px] min-h-[44px]">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex-shrink-0">
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
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden min-h-0 w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={(e) => {
            e.preventDefault();
            handleMove(e);
          }}
          onTouchEnd={handleEnd}
        />
      </div>
    </div>
  );
}

