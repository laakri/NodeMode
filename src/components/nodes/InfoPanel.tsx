import React from 'react';
import dcVZqurIcon from '../../assets/dcV-zqur.svg';

export const InfoPanel: React.FC = () => {
  return (
    <div className="absolute bottom-3 right-3 z-20 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md p-2.5 text-foreground text-xs max-w-[200px]">
      <h3 className="font-semibold text-sm mb-1.5 text-muted-foreground">
        Controls
      </h3>
      <div className="space-y-0.5 text-muted-foreground/80">
        <p>• Drag nodes to move</p>
        <p>• Click canvas to pan</p>
        <p>• Scroll to zoom</p>
      </div>
      <div className="flex items-center gap-1 mt-2 opacity-80">
        <img src={dcVZqurIcon} alt="LAAKRI Icon" width={18} height={18} style={{ display: 'inline', verticalAlign: 'middle' }} />
        <span className="ml-1 tracking-widest font-bold">LAAKRI</span>
      </div>
    </div>
  );
};