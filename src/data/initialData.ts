import type { Node, Connection } from '@/types';

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'rounded',
    position: { x: 400, y: 350 },
    data: { 
      label: 'Start', 
      inputs: 0, 
      outputs: 1, 
      color: 'purple', 
      size: 'xs', 
      icon: 'play', 
      subIcon: 'arrow-right' 
    }
  },
  {
    id: '2',
    type: 'rectangle',
    position: { x: 590, y: 250 },
    data: { 
      label: 'Process', 
      inputs: 1, 
      outputs: 1, 
      color: 'blue', 
      size: 's', 
      icon: 'settings', 
      subIcon: 'zap' 
    }
  },
  {
    id: '3',
    type: 'circle',
    position: { x: 800, y: 350 },
    data: { 
      label: 'End', 
      inputs: 1, 
      outputs: 0, 
      color: 'red', 
      size: 'xs', 
      icon: 'check', 
      subIcon: 'none' 
    }
  }
];

export const initialConnections: Connection[] = [
  { id: 'c1', source: '1', sourceHandle: 'out-0', target: '2', targetHandle: 'in-0', style: 'solid', animation: 'flow', color: 'blue' },
  { id: 'c2', source: '2', sourceHandle: 'out-0', target: '3', targetHandle: 'in-0', style: 'solid', animation: 'none', color: 'red' }
];