export interface Position {
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  style?: 'solid' | 'dashed' | 'dotted' | 'double';
  animation?: 'none' | 'flow' | 'pulse' | 'glow';
  color?: string;
}

export interface NodeData {
  label?: string;
  inputs: number;
  outputs: number;
  color?: string;
  size?: 'xs' | 's' | 'md' | 'lg' | 'xl';
  icon?: string; 
  subIcon?: string; 
}

export interface Node {
  id: string;
  type: 'rectangle' | 'rounded' | 'circle' | 'diamond' | 'hexagon' | 'halfmoon' | 'pill' | 'iconCircle' | 'iconSquare';
  position: Position;
  data: NodeData;
}

export type NodeType = Node['type'];