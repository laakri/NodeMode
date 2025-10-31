import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onResetView 
}) => {
  return (
    <div className="absolute  bottom-3 left-3 z-20 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md p-1.5 flex flex-col gap-1">
      <button 
        onClick={onZoomIn} 
        className="p-1.5 bg-muted hover:bg-accent text-foreground rounded transition-all"
        title="Zoom In"
      >
        <ZoomIn size={16} />
      </button>
      <button 
        onClick={onZoomOut} 
        className="p-1.5 bg-muted hover:bg-accent text-foreground rounded transition-all"
        title="Zoom Out"
      >
        <ZoomOut size={16} />
      </button>
      <button 
        onClick={onResetView} 
        className="p-1.5 bg-muted hover:bg-accent text-foreground rounded transition-all"
        title="Reset View"
      >
        <Maximize2 size={16} />
      </button>
      <div className="px-1.5 py-1 bg-muted text-foreground text-xs rounded text-center font-medium">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};