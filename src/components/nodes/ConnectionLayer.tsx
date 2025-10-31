import type { Node,Connection } from '@/types';
import React from 'react';

interface ConnectionLayerProps {
  connections: Connection[];
  nodes: Node[];
  zoom: number;
  pan: { x: number; y: number };
  // optional temporary connection preview
  temp?: {
    sourceId: string;
    sourceHandleIndex: number;
    isInput?: boolean; // whether starting from input handle
    to?: { x: number; y: number } | null; // world coordinates
  } | null;
  onConnectionContextMenu?: (e: React.MouseEvent, connection: Connection) => void;
}

export const ConnectionLayer: React.FC<ConnectionLayerProps> = ({ 
  connections, 
  nodes, 
  zoom, 
  pan,
  temp,
  onConnectionContextMenu
}) => {
  // Size configurations matching NodeComponent
  const sizeConfig = {
    xs: { width: 80, height: 60 },
    s: { width: 100, height: 70 },
    md: { width: 120, height: 80 },
    lg: { width: 150, height: 100 },
    xl: { width: 180, height: 120 },
  };

  const getNodeDimensions = (node: Node) => {
    const size = node.data.size || 'md';
    return sizeConfig[size];
  };

  const getStrokeDashArray = (style?: string) => {
    switch (style) {
      case 'dashed': return '8,4';
      case 'dotted': return '2,4';
      case 'double': return undefined;
      default: return undefined;
    }
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'red': return 'text-red-500';
      case 'purple': return 'text-purple-500';
      case 'orange': return 'text-orange-500';
      case 'pink': return 'text-pink-500';
      case 'cyan': return 'text-cyan-500';
      default: return 'text-muted-foreground';
    }
  };

  const getAnimationClass = (animation?: string) => {
    switch (animation) {
      case 'flow': return 'connection-flow';
      case 'pulse': return 'connection-pulse';
      case 'glow': return 'connection-glow';
      default: return '';
    }
  };

  const getConnectionPath = (conn: any) => {
    // If conn has start/end numeric coords (temporary preview)
    if (conn && 'start' in conn && 'end' in conn) {
      const { start, end } = conn as any;
      const midX = (start.x + end.x) / 2;
      return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
    }

    // Otherwise it's a Connection object referencing nodes
    const connection = conn as Connection;
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    if (!sourceNode || !targetNode) return '';
    
    const sourceDim = getNodeDimensions(sourceNode);
    const targetDim = getNodeDimensions(targetNode);
    
    // compute handle positions based on counts so vertical placement matches the DOM handles
    const sourceHandleIndex = parseInt(connection.sourceHandle.split('-')[1]);
    const targetHandleIndex = parseInt(connection.targetHandle.split('-')[1]);

    const outputs = sourceNode.data.outputs || 1;
    const inputs = targetNode.data.inputs || 1;

    const startX = sourceNode.position.x + sourceDim.width;
    const startY = sourceNode.position.y + ((sourceHandleIndex + 1) / (outputs + 1)) * sourceDim.height;

    const endX = targetNode.position.x;
    const endY = targetNode.position.y + ((targetHandleIndex + 1) / (inputs + 1)) * targetDim.height;

    const midX = (startX + endX) / 2;

    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  };
  
  return (
    <>
      <style>{`
        @keyframes connection-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -20; }
        }
        @keyframes connection-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes connection-glow {
          0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
          50% { filter: drop-shadow(0 0 8px currentColor); }
        }
        .connection-flow {
          stroke-dasharray: 10, 10;
          animation: connection-flow 1s linear infinite;
        }
        .connection-pulse {
          animation: connection-pulse 2s ease-in-out infinite;
        }
        .connection-glow {
          animation: connection-glow 2s ease-in-out infinite;
        }
      `}</style>
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1, pointerEvents: 'none' }}>
        <defs>
          {/* For double line effect */}
          {connections.filter(c => c.style === 'double').map(conn => (
            <g key={`double-${conn.id}`}>
              <marker
                id={`arrowhead-${conn.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
              </marker>
            </g>
          ))}
        </defs>
        <g style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}>
          {connections.map(conn => {
            const colorClass = getColorClass(conn.color);
            const animationClass = getAnimationClass(conn.animation);
            const strokeDashArray = getStrokeDashArray(conn.style);
            
            if (conn.style === 'double') {
              return (
                <g key={conn.id}>
                  <path
                    d={getConnectionPath(conn)}
                    className={`stroke-current ${colorClass} hover:opacity-80 transition-opacity cursor-pointer ${animationClass}`}
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                    style={{ pointerEvents: 'stroke' }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onConnectionContextMenu) {
                        onConnectionContextMenu(e, conn);
                      }
                    }}
                  />
                  <path
                    d={getConnectionPath(conn)}
                    className="stroke-current text-background"
                    strokeWidth={2}
                    strokeLinecap="round"
                    fill="none"
                    style={{ pointerEvents: 'none' }}
                  />
                </g>
              );
            }
            
            return (
              <path
                key={conn.id}
                d={getConnectionPath(conn)}
                className={`stroke-current ${colorClass} hover:opacity-80 transition-opacity cursor-pointer ${animationClass}`}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={strokeDashArray}
                fill="none"
                style={{ pointerEvents: 'stroke' }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onConnectionContextMenu) {
                    onConnectionContextMenu(e, conn);
                  }
                }}
              />
            );
          })}

        {/* temporary connection preview */}
        {temp && temp.to && (() => {
          const sourceNode = nodes.find(n => n.id === temp.sourceId);
          if (!sourceNode) return null;
          
          const sourceDim = getNodeDimensions(sourceNode);
          
          let start;
          if (temp.isInput) {
            // Starting from input (left side)
            const inputs = sourceNode.data.inputs || 1;
            start = {
              x: sourceNode.position.x,
              y: sourceNode.position.y + ((temp.sourceHandleIndex + 1) / (inputs + 1)) * sourceDim.height
            };
          } else {
            // Starting from output (right side)
            const outputs = sourceNode.data.outputs || 1;
            start = {
              x: sourceNode.position.x + sourceDim.width,
              y: sourceNode.position.y + ((temp.sourceHandleIndex + 1) / (outputs + 1)) * sourceDim.height
            };
          }
          
          const end = temp.to;
          const d = getConnectionPath({ start, end } as any);
          return (
            <path
              d={d}
              className="stroke-current text-primary"
              strokeWidth={3}
              strokeDasharray="8 4"
              strokeLinecap="round"
              fill="none"
              opacity={0.7}
            />
          );
        })()}
        </g>
      </svg>
    </>
  );
};
