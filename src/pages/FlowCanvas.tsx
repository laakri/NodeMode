import React, { useState, useRef } from 'react';
import type{ Node, Connection, NodeType } from '@/types';
import { ConnectionLayer } from '@/components/nodes/ConnectionLayer';
import { ZoomControls } from '@/components/nodes/ZoomControls';
import { InfoPanel } from '@/components/nodes/InfoPanel';
import { GridBackground } from '@/components/nodes/GridBackground';
import { ContextMenu } from '@/components/nodes/ContextMenu';
import { ConnectionContextMenu } from '@/components/nodes/ConnectionContextMenu';
import { CanvasContextMenu } from '@/components/nodes/CanvasContextMenu';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import { useZoom } from '@/hooks/useZoom';
import { NodeComponent } from '@/components/nodes/NodeComponent';
import { initialConnections, initialNodes } from '@/data/initialData';

const FlowCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [contextMenu, setContextMenu] = useState<{ node: Node; x: number; y: number } | null>(null);
  const [canvasContextMenu, setCanvasContextMenu] = useState<{ x: number; y: number; worldX: number; worldY: number } | null>(null);

  const {
    zoom,
    pan,
    setPan,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleWheel
  } = useZoom();

  const {
    isPanning,
    selectedNode,
    handleNodeMouseDown,
    handleCanvasMouseDown
  } = useCanvasInteraction(nodes, setNodes, zoom, pan, setPan);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [linkStart, setLinkStart] = useState<{ nodeId: string; index: number; isInput?: boolean } | null>(null);
  const [tempTo, setTempTo] = useState<{ x: number; y: number } | null>(null);
  const [connectionContextMenu, setConnectionContextMenu] = useState<{ connection: Connection; x: number; y: number } | null>(null);

  const clientToWorld = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  };

  const handleHandleMouseDown = (e: React.MouseEvent, nodeId: string, type: 'in' | 'out', index: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (type === 'out') {
      setLinkStart({ nodeId, index });
      setTempTo(clientToWorld(e.clientX, e.clientY));
    } else if (type === 'in') {
      // Allow reverse connection from input to output
      setLinkStart({ nodeId, index, isInput: true });
      setTempTo(clientToWorld(e.clientX, e.clientY));
    }
  };

  const handleHandleMouseUp = (e: React.MouseEvent, nodeId: string, type: 'in' | 'out', index: number) => {
    e.stopPropagation();
    e.preventDefault();
    // finalize connection
    if (linkStart) {
      if (linkStart.isInput && type === 'out') {
        // Connection from input to output
        const newConn: Connection = {
          id: Date.now().toString(),
          source: linkStart.nodeId,
          sourceHandle: `in-${linkStart.index}`,
          target: nodeId,
          targetHandle: `out-${index}`
        };
        setConnections(prev => [...prev, newConn]);
      } else if (linkStart.isInput && type === 'in') {
        // Connection from input to input
        const newConn: Connection = {
          id: Date.now().toString(),
          source: linkStart.nodeId,
          sourceHandle: `in-${linkStart.index}`,
          target: nodeId,
          targetHandle: `in-${index}`
        };
        setConnections(prev => [...prev, newConn]);
      } else if (!linkStart.isInput && type === 'out') {
        // Connection from output to output
        const newConn: Connection = {
          id: Date.now().toString(),
          source: linkStart.nodeId,
          sourceHandle: `out-${linkStart.index}`,
          target: nodeId,
          targetHandle: `out-${index}`
        };
        setConnections(prev => [...prev, newConn]);
      } else if (!linkStart.isInput && type === 'in') {
        // Connection from output to input
        const newConn: Connection = {
          id: Date.now().toString(),
          source: linkStart.nodeId,
          sourceHandle: `out-${linkStart.index}`,
          target: nodeId,
          targetHandle: `in-${index}`
        };
        setConnections(prev => [...prev, newConn]);
      }
    }
    setLinkStart(null);
    setTempTo(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (linkStart) {
      const worldCoords = clientToWorld(e.clientX, e.clientY);
      setTempTo(worldCoords);
    }
  };

  // Global mouse up listener to cancel linking if released outside a handle
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (linkStart) {
        setLinkStart(null);
        setTempTo(null);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [linkStart]);

  // Click outside to close connection context menu
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (connectionContextMenu) {
        setConnectionContextMenu(null);
      }
    };

    if (connectionContextMenu) {
      setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [connectionContextMenu]);

  // Click outside to close canvas context menu
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (canvasContextMenu) {
        setCanvasContextMenu(null);
      }
    };

    if (canvasContextMenu) {
      setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [canvasContextMenu]);

  const addNode = (type: NodeType, position?: { x: number; y: number }) => {
    // Default icons for different node types
    const defaultIcons: Record<NodeType, { icon?: string; subIcon?: string }> = {
      rounded: { icon: 'circle', subIcon: 'arrow-right' },
      rectangle: { icon: 'square', subIcon: 'grid-2x2' },
      circle: { icon: 'circle-dot', subIcon: 'target' },
      diamond: { icon: 'diamond', subIcon: 'alert-triangle' },
      hexagon: { icon: 'hexagon', subIcon: 'layers' },
      halfmoon: { icon: 'moon', subIcon: 'star' },
      pill: { icon: 'pill', subIcon: 'heart' },
      iconCircle: { icon: 'circle', subIcon: undefined },
      iconSquare: { icon: 'square', subIcon: undefined },
    };

    const newNode: Node = {
      id: Date.now().toString(),
      type,
      position: position || { x: 200 - pan.x / zoom, y: 200 - pan.y / zoom },
      data: {
        label: type === 'iconCircle' || type === 'iconSquare' ? undefined : 'New Node',
        inputs: 1,
        outputs: 1,
        icon: defaultIcons[type]?.icon,
        subIcon: defaultIcons[type]?.subIcon,
        size: 's'
      }
    };
    setNodes(prev => [...prev, newNode]);
  };

  

  const handleNodeContextMenu = (e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ node, x: e.clientX, y: e.clientY });
    setCanvasContextMenu(null); // Close canvas menu if open
  };

  const updateNode = (nodeId: string, updates: Partial<Node['data']>) => {
    setNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
    ));
    
    // If reducing inputs or outputs, remove affected connections
    if (updates.inputs !== undefined || updates.outputs !== undefined) {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        setConnections(prev => prev.filter(conn => {
          // Remove connections to inputs that no longer exist
          if (updates.inputs !== undefined && conn.target === nodeId) {
            const handleIndex = parseInt(conn.targetHandle.split('-')[1]);
            if (handleIndex >= updates.inputs) return false;
          }
          // Remove connections from outputs that no longer exist
          if (updates.outputs !== undefined && conn.source === nodeId) {
            const handleIndex = parseInt(conn.sourceHandle.split('-')[1]);
            if (handleIndex >= updates.outputs) return false;
          }
          return true;
        }));
      }
    }
  };

  const deleteNodeById = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.source !== nodeId && c.target !== nodeId));
    setContextMenu(null);
  };

  const deleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
    setConnectionContextMenu(null);
  };

  const updateConnection = (connectionId: string, updates: Partial<Connection>) => {
    setConnections(prev => prev.map(c => 
      c.id === connectionId ? { ...c, ...updates } : c
    ));
  };

  const handleConnectionContextMenu = (e: React.MouseEvent, connection: Connection) => {
    e.preventDefault();
    e.stopPropagation();
    setConnectionContextMenu({ connection, x: e.clientX, y: e.clientY });
    setCanvasContextMenu(null); // Close canvas menu if open
  };

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const worldCoords = clientToWorld(e.clientX, e.clientY);
    setCanvasContextMenu({ x: e.clientX, y: e.clientY, worldX: worldCoords.x, worldY: worldCoords.y });
  };

  const deleteAllNodes = () => {
    setNodes([]);
    setConnections([]);
  };

  const deleteAllConnections = () => {
    setConnections([]);
  };

  return (
    <div className="w-full h-screen bg-background overflow-hidden relative">

      <ZoomControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
      />

      <div
        ref={containerRef}
        className="w-full h-full cursor-move relative"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onWheel={handleWheel}
        onContextMenu={handleCanvasContextMenu}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <GridBackground zoom={zoom} pan={pan} />

        <ConnectionLayer 
          connections={connections} 
          nodes={nodes} 
          zoom={zoom} 
          pan={pan}
          temp={linkStart ? { 
            sourceId: linkStart.nodeId, 
            sourceHandleIndex: linkStart.index, 
            isInput: linkStart.isInput,
            to: tempTo 
          } : null}
          onConnectionContextMenu={handleConnectionContextMenu}
        />

        <div style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}>
          {nodes.map(node => (
            <NodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onMouseDown={handleNodeMouseDown}
              onHandleMouseDown={handleHandleMouseDown}
              onHandleMouseUp={handleHandleMouseUp}
              onContextMenu={(e) => handleNodeContextMenu(e, node)}
            />
          ))}
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          node={contextMenu.node}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onAddInput={() => {
            updateNode(contextMenu.node.id, { 
              inputs: (contextMenu.node.data.inputs || 0) + 1 
            });
          }}
          onRemoveInput={() => {
            updateNode(contextMenu.node.id, { 
              inputs: Math.max(0, (contextMenu.node.data.inputs || 0) - 1)
            });
          }}
          onAddOutput={() => {
            updateNode(contextMenu.node.id, { 
              outputs: (contextMenu.node.data.outputs || 0) + 1 
            });
          }}
          onRemoveOutput={() => {
            updateNode(contextMenu.node.id, { 
              outputs: Math.max(0, (contextMenu.node.data.outputs || 0) - 1)
            });
          }}
          onChangeColor={(color) => {
            updateNode(contextMenu.node.id, { color });
          }}
          onChangeIcon={(icon) => {
            updateNode(contextMenu.node.id, { icon });
          }}
          onChangeSubIcon={(subIcon) => {
            updateNode(contextMenu.node.id, { subIcon });
          }}
          onChangeSize={(size) => {
            updateNode(contextMenu.node.id, { size });
          }}
          onChangeName={(name) => {
            updateNode(contextMenu.node.id, { label: name });
          }}
          onDelete={() => deleteNodeById(contextMenu.node.id)}
        />
      )}

      {connectionContextMenu && (
        <ConnectionContextMenu
          connection={connectionContextMenu.connection}
          position={{ x: connectionContextMenu.x, y: connectionContextMenu.y }}
          onClose={() => setConnectionContextMenu(null)}
          onDelete={() => deleteConnection(connectionContextMenu.connection.id)}
          onChangeStyle={(style) => {
            updateConnection(connectionContextMenu.connection.id, { style });
          }}
          onChangeAnimation={(animation) => {
            updateConnection(connectionContextMenu.connection.id, { animation });
          }}
          onChangeColor={(color) => {
            updateConnection(connectionContextMenu.connection.id, { color });
          }}
        />
      )}

      {canvasContextMenu && (
        <CanvasContextMenu
          position={{ x: canvasContextMenu.x, y: canvasContextMenu.y }}
          worldPosition={{ x: canvasContextMenu.worldX, y: canvasContextMenu.worldY }}
          onClose={() => setCanvasContextMenu(null)}
          onAddNode={(type, position) => addNode(type, position)}
          onDeleteAll={deleteAllNodes}
          onDeleteAllConnections={deleteAllConnections}
          onResetView={handleResetView}
          hasSelection={selectedNode !== null}
        />
      )}

      <InfoPanel />
    </div>
  );
};

export default FlowCanvas;