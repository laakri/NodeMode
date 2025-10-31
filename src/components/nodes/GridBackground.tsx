import React from 'react';

interface GridBackgroundProps {
  zoom: number;
  pan: { x: number; y: number };
}


export const GridBackground: React.FC<GridBackgroundProps> = ({ zoom, pan }) => {
  const dotSize = 1
  const spacing = 24 * zoom

  return (
    <div
      className="absolute inset-0 bg-background"
      style={{
        backgroundColor: "hsl(var(--background))",
        backgroundImage: `
          radial-gradient(circle, rgba(255,255,255,0.08) ${dotSize}px, transparent ${dotSize}px)
        `,
        backgroundSize: `${spacing}px ${spacing}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    />
  )
}
