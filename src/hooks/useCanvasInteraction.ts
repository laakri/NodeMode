import { useState, useCallback, useEffect } from 'react';
import type { Node } from '@/types';

export const useCanvasInteraction = (
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  zoom: number,
  pan: { x: number; y: number },
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
) => {
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return;
    
    // Don't start dragging if clicking on a handle
    const target = e.target as HTMLElement;
    if (target.closest('[data-handle]')) {
      return;
    }
    
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setSelectedNode(nodeId);
    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - node.position.x * zoom - pan.x,
      y: e.clientY - node.position.y * zoom - pan.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggingNode) {
      const newX = (e.clientX - dragOffset.x - pan.x) / zoom;
      const newY = (e.clientY - dragOffset.y - pan.y) / zoom;
      
      setNodes(prev => prev.map(node => 
        node.id === draggingNode 
          ? { ...node, position: { x: newX, y: newY } }
          : node
      ));
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [draggingNode, dragOffset, pan, zoom, isPanning, panStart, setNodes, setPan]);

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
    setIsPanning(false);
  }, []);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggingNode) {
      setSelectedNode(null);
      setIsPanning(true);
      setPanStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    draggingNode,
    isPanning,
    selectedNode,
    setSelectedNode,
    handleNodeMouseDown,
    handleCanvasMouseDown
  };
};