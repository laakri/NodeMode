import React from 'react';
import type { Node } from '@/types';
import { NodeShapes } from './NodeShapes';
import * as LucideIcons from 'lucide-react';

interface NodeComponentProps {
  node: Node;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onHandleMouseDown?: (e: React.MouseEvent, nodeId: string, type: 'in' | 'out', index: number) => void;
  onHandleMouseUp?: (e: React.MouseEvent, nodeId: string, type: 'in' | 'out', index: number) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

// Function to get icon component by name
const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;
  
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  return (LucideIcons as any)[pascalCase] || null;
};

export const NodeComponent: React.FC<NodeComponentProps> = ({ 
  node, 
  isSelected, 
  onMouseDown,
  onHandleMouseDown, 
  onHandleMouseUp,
  onContextMenu
}) => {
  // Size configurations - made smaller
  const sizeConfig = {
    xs: { width: 80, height: 60 },
    s: { width: 100, height: 70 },
    md: { width: 120, height: 80 },
    lg: { width: 150, height: 100 },
    xl: { width: 180, height: 120 },
  };

  const size = node.data.size || 'md';
  const { width: NODE_WIDTH, height: NODE_HEIGHT } = sizeConfig[size];

  // Get icon components
  const MainIcon = getIconComponent(node.data.icon);
  const SubIcon = getIconComponent(node.data.subIcon);

  // Calculate vertical position for each handle evenly distributed
  const getHandleY = (index: number, total: number) => {
    return ((index + 1) / (total + 1)) * NODE_HEIGHT;
  };

  return (
    <div
      className={`absolute transition-shadow ${isSelected ? 'ring-2 ring-blue-500/50' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
      onContextMenu={onContextMenu}
    >
      {/* Node Shape */}
      <div 
        className="relative w-full h-full cursor-move"
        onMouseDown={(e) => onMouseDown(e, node.id)}
      >
        {node.type === 'iconCircle' || node.type === 'iconSquare' 
          ? NodeShapes[node.type](node.data.color, node.data.icon)
          : NodeShapes[node.type](node.data.color)}
        
        {/* Main Icon - centered in node */}
        {MainIcon && node.type !== 'iconCircle' && node.type !== 'iconSquare' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <MainIcon className="w-8 h-8 text-foreground/80" strokeWidth={2} />
          </div>
        )}

        {/* SubIcon - smaller, bottom-right corner of node */}
        {SubIcon && node.type !== 'iconCircle' && node.type !== 'iconSquare' && (
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <SubIcon className="w-4 h-4 text-foreground/60" strokeWidth={2} />
          </div>
        )}

        {/* Input Handles - Left side with better UI */}
        <div className="absolute left-0 top-0 w-0 h-full pointer-events-none">
          {Array.from({ length: node.data.inputs }).map((_, i) => {
            const handleY = getHandleY(i, node.data.inputs);
            return (
              <div
                key={`in-${i}`}
                className="absolute pointer-events-auto"
                style={{ 
                  left: '-8px',
                  top: `${handleY}px`,
                  transform: 'translateY(-50%)'
                }}
              >
                <div 
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onHandleMouseDown && onHandleMouseDown(e, node.id, 'in', i);
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onHandleMouseUp && onHandleMouseUp(e, node.id, 'in', i);
                  }}
                  className="relative group"
                  data-handle="input"
                >
                  {/* Handle circle */}
                  <div 
                    className="w-4 h-4 bg-background border-2 border-border rounded-full hover:border-primary hover:bg-muted transition-all cursor-crosshair"
                    data-handle="input"
                  />
                  
                  {/* Hover label */}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded border border-border shadow-md">
                      Input {i + 1}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Output Handles - Right side with better UI */}
        <div className="absolute right-0 top-0 w-0 h-full pointer-events-none">
          {Array.from({ length: node.data.outputs }).map((_, i) => {
            const handleY = getHandleY(i, node.data.outputs);
            return (
              <div
                key={`out-${i}`}
                className="absolute pointer-events-auto"
                style={{ 
                  right: '-8px',
                  top: `${handleY}px`,
                  transform: 'translateY(-50%)'
                }}
              >
                <div 
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onHandleMouseDown && onHandleMouseDown(e, node.id, 'out', i);
                  }}
                  className="relative group"
                  data-handle="output"
                >
                  {/* Handle circle */}
                  <div 
                    className="w-4 h-4 bg-background border-2 border-border rounded-full hover:border-primary hover:bg-muted transition-all cursor-crosshair"
                    data-handle="output"
                  />
                  
                  {/* Hover label */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded border border-border shadow-md">
                      Output {i + 1}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Label - below the node */}
      {node.data.label && (
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none mt-2 whitespace-nowrap"
             style={{ top: NODE_HEIGHT }}>
          <span className="text-foreground/90 font-medium text-xs bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-border/50">
            {node.data.label}
          </span>
        </div>
      )}
    </div>
  );
};