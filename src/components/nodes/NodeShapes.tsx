import * as LucideIcons from 'lucide-react';

const colorMap: Record<string, { border: string; bg: string }> = {
  default: { border: 'border-border', bg: 'bg-muted/50' },
  primary: { border: 'border-primary', bg: 'bg-primary/10' },
  secondary: { border: 'border-muted-foreground', bg: 'bg-secondary/50' },
  accent: { border: 'border-accent-foreground', bg: 'bg-accent/50' },
  green: { border: 'border-green-500', bg: 'bg-green-500/10' },
  blue: { border: 'border-blue-500', bg: 'bg-blue-500/10' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-500/10' },
  red: { border: 'border-red-500', bg: 'bg-red-500/10' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-500/10' },
  yellow: { border: 'border-yellow-500', bg: 'bg-yellow-500/10' },
  pink: { border: 'border-pink-500', bg: 'bg-pink-500/10' },
  cyan: { border: 'border-cyan-500', bg: 'bg-cyan-500/10' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-500/10' },
  emerald: { border: 'border-emerald-500', bg: 'bg-emerald-500/10' },
  teal: { border: 'border-teal-500', bg: 'bg-teal-500/10' },
  sky: { border: 'border-sky-500', bg: 'bg-sky-500/10' },
  violet: { border: 'border-violet-500', bg: 'bg-violet-500/10' },
  fuchsia: { border: 'border-fuchsia-500', bg: 'bg-fuchsia-500/10' },
  rose: { border: 'border-rose-500', bg: 'bg-rose-500/10' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-500/10' },
  lime: { border: 'border-lime-500', bg: 'bg-lime-500/10' },
};

const getColorClasses = (color?: string) => {
  return colorMap[color || 'default'] || colorMap.default;
};

// Function to get icon component by name
const getIconComponent = (iconName?: string) => {
  if (!iconName) return LucideIcons.Circle;
  
  // Convert icon name to PascalCase (e.g., 'arrow-right' => 'ArrowRight')
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  return (LucideIcons as any)[pascalCase] || LucideIcons.Circle;
};

export const NodeShapes = {
  rectangle: (color?: string) => {
    const { border, bg } = getColorClasses(color);
    return <div className={`w-full h-full ${bg} ${border} border-2 shadow-md rounded-md backdrop-blur-sm`} />;
  },
  rounded: (color?: string) => {
    const { border, bg } = getColorClasses(color);
    return <div className={`w-full h-full ${bg} ${border} border-2 shadow-md rounded-2xl backdrop-blur-sm`} />;
  },
  circle: (color?: string) => {
    const { border, bg } = getColorClasses(color);
    return <div className={`w-full h-full ${bg} ${border} border-2 shadow-md rounded-full backdrop-blur-sm`} />;
  },
  diamond: (color?: string) => {
    const { border, bg } = getColorClasses(color);
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className={`w-[85%] h-[85%] ${bg} ${border} border-2 shadow-md backdrop-blur-sm`} 
             style={{ transform: 'rotate(45deg)' }} />
      </div>
    );
  },
  hexagon: (color?: string) => {
    const { border, bg } = getColorClasses(color);
    return (
      <div className={`w-full h-full ${bg} ${border} border-2 shadow-md backdrop-blur-sm`}
           style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
    );
  },
  halfmoon: (color?: string) => {
    const { border, bg } = getColorClasses(color);
    return (
      <div className={`w-full h-full ${bg} ${border} border-2 shadow-md backdrop-blur-sm rounded-l-full`} />
    );
  },
  pill: (color?: string) => {
    const { border, bg } = getColorClasses(color);
    return <div className={`w-full h-full ${bg} ${border} border-2 shadow-md backdrop-blur-sm rounded-full`} />;
  },
  iconCircle: (color?: string, icon?: string) => {
    const { border, bg } = getColorClasses(color);
    const IconComponent = getIconComponent(icon);
    return (
      <div className={`w-full h-full ${bg} ${border} border-2 shadow-md rounded-full backdrop-blur-sm flex items-center justify-center`}>
        <IconComponent className="w-1/2 h-1/2 text-foreground" strokeWidth={1.5} />
      </div>
    );
  },
  iconSquare: (color?: string, icon?: string) => {
    const { border, bg } = getColorClasses(color);
    const IconComponent = getIconComponent(icon);
    return (
      <div className={`w-full h-full ${bg} ${border} border-2 shadow-md rounded-lg backdrop-blur-sm flex items-center justify-center`}>
        <IconComponent className="w-1/2 h-1/2 text-foreground" strokeWidth={1.5} />
      </div>
    );
  },
};