import React from 'react';
import { Plus, Minus, Palette, Package, Trash2, Maximize2, Sparkles, Type } from 'lucide-react';
import type { Node } from '@/types';
import * as LucideIcons from 'lucide-react';

interface ContextMenuProps {
  node: Node;
  position: { x: number; y: number };
  onClose: () => void;
  onAddInput: () => void;
  onRemoveInput: () => void;
  onAddOutput: () => void;
  onRemoveOutput: () => void;
  onChangeColor: (color: string) => void;
  onChangeIcon: (icon: string) => void;
  onChangeSubIcon: (subIcon: string) => void;
  onChangeSize: (size: 'xs' | 's' | 'md' | 'lg' | 'xl') => void;
  onChangeName: (name: string) => void;
  onDelete: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  node,
  position,
  onClose,
  onAddInput,
  onRemoveInput,
  onAddOutput,
  onRemoveOutput,
  onChangeColor,
  onChangeIcon,
  onChangeSubIcon,
  onChangeSize,
  onChangeName,
  onDelete,
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showIconPicker, setShowIconPicker] = React.useState(false);
  const [showSubIconPicker, setShowSubIconPicker] = React.useState(false);
  const [showSizePicker, setShowSizePicker] = React.useState(false);
  const [showNameInput, setShowNameInput] = React.useState(false);
  const [nodeName, setNodeName] = React.useState(node.data.label || '');

  const colors = [
    'default', 'primary', 'secondary', 'accent',
    'green', 'blue', 'purple', 'red', 'orange', 'yellow',
    'pink', 'cyan', 'indigo', 'emerald', 'teal', 'sky',
    'violet', 'fuchsia', 'rose', 'amber', 'lime'
  ];

  const colorStyles: Record<string, string> = {
    default: 'bg-gray-500',
    primary: 'bg-blue-600',
    secondary: 'bg-slate-600',
    accent: 'bg-purple-600',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500',
    cyan: 'bg-cyan-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    sky: 'bg-sky-500',
    violet: 'bg-violet-500',
    fuchsia: 'bg-fuchsia-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    lime: 'bg-lime-500',
  };

  const icons = [
    'play', 'pause', 'stop', 'skip-forward', 'skip-back',
    'heart', 'star', 'bookmark', 'flag', 'tag',
    'mail', 'phone', 'message-circle', 'send', 'inbox',
    'database', 'server', 'cloud', 'hard-drive', 'cpu',
    'code', 'terminal', 'git-branch', 'package', 'box',
    'settings', 'cog', 'wrench', 'tool', 'sliders',
    'users', 'user', 'user-plus', 'user-check', 'user-x',
    'home', 'building', 'map', 'compass', 'navigation',
    'check', 'x', 'plus', 'minus', 'alert-circle',
    'info', 'help-circle', 'alert-triangle', 'shield', 'lock',
    'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'corner-down-right',
    'zap', 'flame', 'sun', 'moon', 'circle',
    'square', 'triangle', 'hexagon', 'diamond', 'octagon'
  ];

  const sizes: Array<'xs' | 's' | 'md' | 'lg' | 'xl'> = ['xs', 's', 'md', 'lg', 'xl'];

  // Function to get icon component
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    const pascalCase = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    return (LucideIcons as any)[pascalCase] || null;
  };

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
  }, [position, showColorPicker, showIconPicker, showSubIconPicker, showSizePicker, showNameInput]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-card border border-border rounded-lg shadow-xl p-1 z-50 min-w-[200px] max-h-[90vh] overflow-y-auto"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Node Name Input */}
      <div className="border-b border-border pb-1 mb-1">
        <button
          onClick={() => setShowNameInput(!showNameInput)}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <Type size={16} /> Change Name
        </button>
        {showNameInput && (
          <div className="p-2 bg-muted/50 rounded mt-1">
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onChangeName(nodeName);
                  setShowNameInput(false);
                }
              }}
              placeholder="Enter node name..."
              className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => {
                  onChangeName(nodeName);
                  setShowNameInput(false);
                }}
                className="flex-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setNodeName(node.data.label || '');
                  setShowNameInput(false);
                }}
                className="flex-1 px-2 py-1 text-xs bg-muted rounded hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input/Output Controls */}
      <div className="border-b border-border pb-1 mb-1">
        <button
          onClick={onAddInput}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Input
        </button>
        <button
          onClick={onRemoveInput}
          disabled={node.data.inputs === 0}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={16} /> Remove Input
        </button>
        <button
          onClick={onAddOutput}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Output
        </button>
        <button
          onClick={onRemoveOutput}
          disabled={node.data.outputs === 0}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={16} /> Remove Output
        </button>
      </div>

      {/* Color Picker */}
      <div className="border-b border-border pb-1 mb-1">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <Palette size={16} /> Change Color
        </button>
        {showColorPicker && (
          <div className="grid grid-cols-5 gap-1 p-2 bg-muted/50 rounded mt-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChangeColor(color);
                  setShowColorPicker(false);
                }}
                className={`w-8 h-8 rounded border-2 ${
                  node.data.color === color ? 'border-primary' : 'border-border'
                } hover:border-primary/50 transition-colors ${colorStyles[color]}`}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Icon Picker (for icon nodes) */}
      {(node.type === 'iconCircle' || node.type === 'iconSquare') && (
        <div className="border-b border-border pb-1 mb-1">
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
          >
            <Package size={16} /> Change Icon
          </button>
          {showIconPicker && (
            <div className="grid grid-cols-6 gap-1 p-2 bg-muted/50 rounded mt-1 max-h-48 overflow-y-auto">
              {icons.map((icon) => {
                const IconComp = getIconComponent(icon);
                return (
                  <button
                    key={icon}
                    onClick={() => {
                      onChangeIcon(icon);
                      setShowIconPicker(false);
                    }}
                    className={`w-8 h-8 rounded flex items-center justify-center ${
                      node.data.icon === icon ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                    } transition-colors`}
                    title={icon}
                  >
                    {IconComp ? <IconComp size={16} /> : icon.charAt(0).toUpperCase()}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Icon Picker (for regular nodes) */}
      {node.type !== 'iconCircle' && node.type !== 'iconSquare' && (
        <div className="border-b border-border pb-1 mb-1">
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
          >
            <Package size={16} /> Change Main Icon
          </button>
          {showIconPicker && (
            <div className="p-2 bg-muted/50 rounded mt-1">
              <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto mb-2">
                {icons.map((icon) => {
                  const IconComp = getIconComponent(icon);
                  return (
                    <button
                      key={icon}
                      onClick={() => {
                        onChangeIcon(icon);
                        setShowIconPicker(false);
                      }}
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        node.data.icon === icon ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                      } transition-colors`}
                      title={icon}
                    >
                      {IconComp ? <IconComp size={16} /> : icon.charAt(0).toUpperCase()}
                    </button>
                  );
                })}
              </div>
              {node.data.icon && (
                <button
                  onClick={() => {
                    onChangeIcon('');
                    setShowIconPicker(false);
                  }}
                  className="w-full px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
                >
                  Remove Icon
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sub Icon Picker (for regular nodes) */}
      {node.type !== 'iconCircle' && node.type !== 'iconSquare' && (
        <div className="border-b border-border pb-1 mb-1">
          <button
            onClick={() => setShowSubIconPicker(!showSubIconPicker)}
            className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
          >
            <Sparkles size={16} /> Change Sub Icon
          </button>
          {showSubIconPicker && (
            <div className="p-2 bg-muted/50 rounded mt-1">
              <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto mb-2">
                {icons.map((icon) => {
                  const IconComp = getIconComponent(icon);
                  return (
                    <button
                      key={icon}
                      onClick={() => {
                        onChangeSubIcon(icon);
                        setShowSubIconPicker(false);
                      }}
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        node.data.subIcon === icon ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                      } transition-colors`}
                      title={icon}
                    >
                      {IconComp ? <IconComp size={14} /> : icon.charAt(0).toUpperCase()}
                    </button>
                  );
                })}
              </div>
              {node.data.subIcon && (
                <button
                  onClick={() => {
                    onChangeSubIcon('');
                    setShowSubIconPicker(false);
                  }}
                  className="w-full px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
                >
                  Remove Sub Icon
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Size Picker */}
      <div className="border-b border-border pb-1 mb-1">
        <button
          onClick={() => setShowSizePicker(!showSizePicker)}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <Maximize2 size={16} /> Change Size
        </button>
        {showSizePicker && (
          <div className="flex gap-1 p-2 bg-muted/50 rounded mt-1">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  onChangeSize(size);
                  setShowSizePicker(false);
                }}
                className={`px-3 py-1 text-xs rounded ${
                  node.data.size === size ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                } transition-colors uppercase font-medium`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded flex items-center gap-2"
      >
        <Trash2 size={16} /> Delete Node
      </button>
    </div>
  );
};
