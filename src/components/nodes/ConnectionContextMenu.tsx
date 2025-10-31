import React from 'react';
import { Trash2, Minus, Circle, MoreHorizontal, Zap, Radio, Sparkles } from 'lucide-react';
import type { Connection } from '@/types';

interface ConnectionContextMenuProps {
  connection: Connection;
  position: { x: number; y: number };
  onClose: () => void;
  onDelete: () => void;
  onChangeStyle: (style: 'solid' | 'dashed' | 'dotted' | 'double') => void;
  onChangeAnimation: (animation: 'none' | 'flow' | 'pulse' | 'glow') => void;
  onChangeColor: (color: string) => void;
}

export const ConnectionContextMenu: React.FC<ConnectionContextMenuProps> = ({
  connection,
  position,
  onClose,
  onDelete,
  onChangeStyle,
  onChangeAnimation,
  onChangeColor,
}) => {
  const [showStylePicker, setShowStylePicker] = React.useState(false);
  const [showAnimationPicker, setShowAnimationPicker] = React.useState(false);
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const styles: Array<'solid' | 'dashed' | 'dotted' | 'double'> = ['solid', 'dashed', 'dotted', 'double'];
  const animations: Array<'none' | 'flow' | 'pulse' | 'glow'> = ['none', 'flow', 'pulse', 'glow'];
  
  const colors = [
    { name: 'default', class: 'bg-slate-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'red', class: 'bg-red-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'pink', class: 'bg-pink-500' },
    { name: 'cyan', class: 'bg-cyan-500' },
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
  }, [position, showStylePicker, showAnimationPicker, showColorPicker]);

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'solid': return <Minus size={16} />;
      case 'dashed': return <MoreHorizontal size={16} />;
      case 'dotted': return <Circle size={16} />;
      case 'double': return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="0" y1="5" x2="16" y2="5"/><line x1="0" y1="11" x2="16" y2="11"/></svg>;
      default: return <Minus size={16} />;
    }
  };

  const getAnimationIcon = (animation: string) => {
    switch (animation) {
      case 'none': return <Circle size={16} />;
      case 'flow': return <Zap size={16} />;
      case 'pulse': return <Radio size={16} />;
      case 'glow': return <Sparkles size={16} />;
      default: return <Circle size={16} />;
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-card border border-border rounded-lg shadow-xl p-1 z-50 min-w-[200px] max-h-[90vh] overflow-y-auto"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Style Picker */}
      <div className="border-b border-border pb-1 mb-1">
        <button
          onClick={() => setShowStylePicker(!showStylePicker)}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          {getStyleIcon(connection.style || 'solid')} Line Style
        </button>
        {showStylePicker && (
          <div className="grid grid-cols-2 gap-1 p-2 bg-muted/50 rounded mt-1">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => {
                  onChangeStyle(style);
                  setShowStylePicker(false);
                }}
                className={`px-3 py-2 text-xs rounded flex items-center gap-2 ${
                  connection.style === style || (!connection.style && style === 'solid')
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-accent'
                } transition-colors capitalize`}
              >
                {getStyleIcon(style)} {style}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Animation Picker */}
      <div className="border-b border-border pb-1 mb-1">
        <button
          onClick={() => setShowAnimationPicker(!showAnimationPicker)}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          {getAnimationIcon(connection.animation || 'none')} Animation
        </button>
        {showAnimationPicker && (
          <div className="grid grid-cols-2 gap-1 p-2 bg-muted/50 rounded mt-1">
            {animations.map((animation) => (
              <button
                key={animation}
                onClick={() => {
                  onChangeAnimation(animation);
                  setShowAnimationPicker(false);
                }}
                className={`px-3 py-2 text-xs rounded flex items-center gap-2 ${
                  connection.animation === animation || (!connection.animation && animation === 'none')
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-accent'
                } transition-colors capitalize`}
              >
                {getAnimationIcon(animation)} {animation}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Picker */}
      <div className="border-b border-border pb-1 mb-1">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded flex items-center gap-2"
        >
          <div className={`w-4 h-4 rounded ${colors.find(c => c.name === connection.color)?.class || 'bg-slate-500'}`} />
          Color
        </button>
        {showColorPicker && (
          <div className="grid grid-cols-4 gap-1 p-2 bg-muted/50 rounded mt-1">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => {
                  onChangeColor(color.name);
                  setShowColorPicker(false);
                }}
                className={`w-8 h-8 rounded border-2 ${
                  connection.color === color.name || (!connection.color && color.name === 'default')
                    ? 'border-primary' 
                    : 'border-border'
                } hover:border-primary/50 transition-colors ${color.class}`}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded flex items-center gap-2"
      >
        <Trash2 size={16} /> Delete Connection
      </button>
    </div>
  );
};
