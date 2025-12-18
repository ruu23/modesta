import { useState, useRef, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Layers, Move, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClosetItem } from '@/types/closet';

export interface CanvasItem {
  id: string;
  item: ClosetItem;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface OutfitCanvasProps {
  canvasItems: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  background: string;
  setBackground: (bg: string) => void;
}

const BACKGROUNDS = [
  { value: 'white', label: 'White', color: '#ffffff' },
  { value: 'cream', label: 'Cream', color: '#f5f5dc' },
  { value: 'gray', label: 'Gray', color: '#e5e5e5' },
  { value: 'outdoor', label: 'Outdoor', gradient: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)' },
  { value: 'office', label: 'Office', gradient: 'linear-gradient(180deg, #d4d4d4 0%, #a3a3a3 100%)' },
  { value: 'evening', label: 'Evening', gradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' },
];

export function OutfitCanvas({
  canvasItems,
  setCanvasItems,
  selectedItemId,
  setSelectedItemId,
  background,
  setBackground,
}: OutfitCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showLayers, setShowLayers] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data || !canvasRef.current) return;

    const item: ClosetItem = JSON.parse(data);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - 60;
    const y = (e.clientY - rect.top) / zoom - 60;

    const newCanvasItem: CanvasItem = {
      id: `${item.id}-${Date.now()}`,
      item,
      x: Math.max(0, Math.min(x, rect.width / zoom - 120)),
      y: Math.max(0, Math.min(y, rect.height / zoom - 120)),
      width: 120,
      height: 150,
      zIndex: canvasItems.length,
    };

    setCanvasItems(prev => [...prev, newCanvasItem]);
  }, [canvasItems.length, setCanvasItems, zoom]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleItemMouseDown = (e: React.MouseEvent, canvasItem: CanvasItem) => {
    e.stopPropagation();
    setSelectedItemId(canvasItem.id);
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedItemId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - dragOffset.x;
    const y = (e.clientY - rect.top) / zoom - dragOffset.y;

    setCanvasItems(prev => prev.map(ci => 
      ci.id === selectedItemId
        ? { ...ci, x: Math.max(0, x), y: Math.max(0, y) }
        : ci
    ));
  }, [isDragging, selectedItemId, dragOffset, zoom, setCanvasItems]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const removeItem = (id: string) => {
    setCanvasItems(prev => prev.filter(ci => ci.id !== id));
    setSelectedItemId(null);
  };

  const resizeItem = (id: string, delta: number) => {
    setCanvasItems(prev => prev.map(ci => 
      ci.id === id
        ? { 
            ...ci, 
            width: Math.max(60, ci.width + delta),
            height: Math.max(75, ci.height + delta * 1.25)
          }
        : ci
    ));
  };

  const reorderLayer = (id: string, direction: 'up' | 'down') => {
    setCanvasItems(prev => {
      const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
      const index = sorted.findIndex(ci => ci.id === id);
      if (direction === 'up' && index < sorted.length - 1) {
        const temp = sorted[index].zIndex;
        sorted[index].zIndex = sorted[index + 1].zIndex;
        sorted[index + 1].zIndex = temp;
      } else if (direction === 'down' && index > 0) {
        const temp = sorted[index].zIndex;
        sorted[index].zIndex = sorted[index - 1].zIndex;
        sorted[index - 1].zIndex = temp;
      }
      return sorted;
    });
  };

  const bgStyle = BACKGROUNDS.find(b => b.value === background);

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card">
        <h2 className="text-lg font-semibold text-foreground">Build Your Outfit</h2>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Layers Toggle */}
          <Button
            variant={showLayers ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowLayers(!showLayers)}
          >
            <Layers className="w-4 h-4" />
          </Button>

          {/* Reset */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(1)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 p-4 overflow-auto">
          <div
            ref={canvasRef}
            className="relative w-full h-full min-h-[500px] rounded-xl shadow-inner overflow-hidden"
            style={{
              background: bgStyle?.gradient || bgStyle?.color,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => setSelectedItemId(null)}
          >
            {/* Human Silhouette */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <svg viewBox="0 0 100 200" className="h-[80%] fill-foreground">
                <ellipse cx="50" cy="20" rx="15" ry="18" />
                <path d="M35 38 L35 90 L20 140 L30 145 L45 100 L50 100 L55 100 L70 145 L80 140 L65 90 L65 38 Z" />
                <path d="M35 45 L15 85 L25 90 L40 60" />
                <path d="M65 45 L85 85 L75 90 L60 60" />
              </svg>
            </div>

            {/* Canvas Items */}
            {canvasItems
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(canvasItem => (
                <div
                  key={canvasItem.id}
                  className={`absolute cursor-move transition-shadow ${
                    selectedItemId === canvasItem.id
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:ring-1 hover:ring-primary/50'
                  }`}
                  style={{
                    left: canvasItem.x,
                    top: canvasItem.y,
                    width: canvasItem.width,
                    height: canvasItem.height,
                    zIndex: canvasItem.zIndex + 10,
                  }}
                  onMouseDown={(e) => handleItemMouseDown(e, canvasItem)}
                >
                  <img
                    src={canvasItem.item.images[0]}
                    alt={canvasItem.item.name}
                    className="w-full h-full object-contain drop-shadow-md"
                    draggable={false}
                  />
                  
                  {selectedItemId === canvasItem.id && (
                    <>
                      {/* Delete Button */}
                      <button
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(canvasItem.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Resize Handle */}
                      <div
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-sm cursor-se-resize flex items-center justify-center"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const startY = e.clientY;
                          const handleResize = (moveE: MouseEvent) => {
                            const delta = (moveE.clientY - startY) / zoom;
                            resizeItem(canvasItem.id, delta / 5);
                          };
                          const handleUp = () => {
                            document.removeEventListener('mousemove', handleResize);
                            document.removeEventListener('mouseup', handleUp);
                          };
                          document.addEventListener('mousemove', handleResize);
                          document.addEventListener('mouseup', handleUp);
                        }}
                      >
                        <Move className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    </>
                  )}
                </div>
              ))}

            {/* Empty State */}
            {canvasItems.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-3">
                  <Layers className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Drag items here</p>
                <p className="text-xs">to build your outfit</p>
              </div>
            )}
          </div>
        </div>

        {/* Layers Panel */}
        {showLayers && (
          <div className="w-48 border-l border-border bg-card p-3">
            <h3 className="text-sm font-medium text-foreground mb-2">Layers</h3>
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {[...canvasItems]
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map(canvasItem => (
                    <div
                      key={canvasItem.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                        selectedItemId === canvasItem.id
                          ? 'bg-primary/10'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedItemId(canvasItem.id)}
                    >
                      <GripVertical className="w-3 h-3 text-muted-foreground" />
                      <img
                        src={canvasItem.item.images[0]}
                        alt=""
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-xs truncate flex-1">{canvasItem.item.name}</span>
                      <div className="flex flex-col gap-0.5">
                        <button
                          className="text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderLayer(canvasItem.id, 'up');
                          }}
                        >
                          ▲
                        </button>
                        <button
                          className="text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderLayer(canvasItem.id, 'down');
                          }}
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Background Selector */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Background:</span>
          <div className="flex gap-1.5">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg.value}
                onClick={() => setBackground(bg.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  background === bg.value
                    ? 'border-primary scale-110'
                    : 'border-border hover:border-muted-foreground'
                }`}
                style={{ background: bg.gradient || bg.color }}
                title={bg.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
