import React from 'react';
import { Tool } from '@/hooks/useGame';

interface ToolBarProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export const ToolBar: React.FC<ToolBarProps> = ({ currentTool, onToolChange }) => {
  return (
    <div className="flex gap-4 w-full max-w-xs justify-center">
      <button 
        className={`pixel-btn pixel-btn-yellow flex-1 py-2 ${currentTool === 'dig' ? 'active' : ''}`}
        onClick={() => onToolChange('dig')}
      >
        <span>🔨</span> חפור
      </button>
      <button 
        className={`pixel-btn pixel-btn-green flex-1 py-2 ${currentTool === 'flag' ? 'active' : ''}`}
        onClick={() => onToolChange('flag')}
      >
        <span>🚩</span> סמן
      </button>
    </div>
  );
};
