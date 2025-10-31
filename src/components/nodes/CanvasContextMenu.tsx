import React from 'react';
import { Plus, Trash2, Maximize2 } from 'lucide-react';
import type { NodeType } from '@/types';

interface CanvasContextMenuProps {
  position: { x: number; y: number };
  worldPosition: { x: number; y: number };
  onClose: () => void;
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void;
  onDeleteAll: () => void;
  onDeleteAllConnections: () => void;
  onResetView: () => void;
  hasSelection: boolean;
}

export const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  position,
  worldPosition,
  onClose,
  onAddNode,
  onDeleteAll,
  onDeleteAllConnections,
  onResetView,
}) => {
  const [showAddNodeMenu, setShowAddNodeMenu] = React.useState(false);

  const nodeTypes: Array<{ type: NodeType; label: string; icon: string }> = [
    { type: 'rounded', label: 'Rounded', icon: '▢' },
    { type: 'rectangle', label: 'Rectangle', icon: '□' },
    { type: 'circle', label: 'Circle', icon: '○' },
    { type: 'diamond', label: 'Diamond', icon: '◇' },
    { type: 'hexagon', label: 'Hexagon', icon: '⬡' },
    { type: 'halfmoon', label: 'Half Moon', icon: '◐' },
    { type: 'pill', label: 'Pill', icon: '⬭' },
    { type: 'iconCircle', label: 'Icon Circle', icon: '◉' },
    { type: 'iconSquare', label: 'Icon Square', icon: '▣' },
  ];

  React.useEffect(() => {
    const handleClickOutside = () => onClose();
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  // Adjust position to keep menu in viewport
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = React.useState(position);

  React.useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Adjust horizontal position
      if (rect.right > viewportWidth) {
        newX = viewportWidth - rect.width - 10;
      }
      if (newX < 10) {
        newX = 10;
      }

      // Adjust vertical position
      if (rect.bottom > viewportHeight) {
        newY = viewportHeight - rect.height - 10;
      }
      if (newY < 10) {
        newY = 10;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position, showAddNodeMenu]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-card border border-border rounded-lg shadow-xl p-1 z-50 min-w-[200px] max-h-[90vh] overflow-y-auto"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Add Node Section */}
      <div className="border-b border-border pb-1 mb-1">
        <button
          onClick={() => setShowAddNodeMenu(!showAddNodeMenu)}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Node
        </button>
        {showAddNodeMenu && (
          <div className="grid grid-cols-1 gap-1 p-2 bg-muted/50 rounded mt-1 max-h-[300px] overflow-y-auto">
            {nodeTypes.map((nodeType) => (
              <button
                key={nodeType.type}
                onClick={() => {
                  onAddNode(nodeType.type, worldPosition);
                  setShowAddNodeMenu(false);
                  onClose();
                }}
                className="px-3 py-2 text-xs rounded bg-muted hover:bg-accent transition-colors text-left flex items-center gap-2"
              >
                <span className="text-lg">{nodeType.icon}</span>
                <span>{nodeType.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Common Nodes */}
      <div className="border-b border-border pb-1 mb-1">
        <div className="px-2 py-1 text-xs text-muted-foreground font-medium">Quick Add</div>
        <button
          onClick={() => {
            onAddNode('rounded', worldPosition);
            onClose();
          }}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <span className="text-lg">▢</span> Rounded Node
        </button>
        <button
          onClick={() => {
            onAddNode('rectangle', worldPosition);
            onClose();
          }}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <span className="text-lg">□</span> Rectangle Node
        </button>
        <button
          onClick={() => {
            onAddNode('circle', worldPosition);
            onClose();
          }}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <span className="text-lg">○</span> Circle Node
        </button>
      </div>

      {/* View Controls */}
      <div className="border-b border-border pb-1 mb-1">
        <div className="px-2 py-1 text-xs text-muted-foreground font-medium">View</div>
        <button
          onClick={() => {
            onResetView();
            onClose();
          }}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <Maximize2 size={16} /> Reset View
        </button>
      </div>

      {/* Danger Zone */}
      <div>
        <div className="px-2 py-1 text-xs text-muted-foreground font-medium">Danger Zone</div>
        <button
          onClick={() => {
            if (confirm('Delete all connections? This cannot be undone.')) {
              onDeleteAllConnections();
              onClose();
            }
          }}
          className="w-full px-3 py-2 text-sm text-orange-600 hover:bg-orange-600/10 rounded flex items-center gap-2"
        >
          <Trash2 size={16} /> Clear All Connections
        </button>
        <button
          onClick={() => {
            if (confirm('Delete everything? This cannot be undone.')) {
              onDeleteAll();
              onClose();
            }
          }}
          className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded flex items-center gap-2"
        >
          <Trash2 size={16} /> Clear Canvas
        </button>
      </div>
    </div>
  );
};
