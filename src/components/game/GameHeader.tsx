import React from 'react';

interface GameHeaderProps {
  eraName: string;
  onHelpClick: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ eraName, onHelpClick }) => {
  return (
    <header className="p-4 border-b-4 border-black bg-amber-200 flex justify-between items-center">
      <div>
        <h1 
          className="text-2xl font-black text-amber-900"
          style={{ textShadow: '2px 2px 0 #fff' }}
        >
          החופר בזמן
        </h1>
        <div className="text-sm font-bold text-amber-800 mt-1">מיקום: תל-מגידו</div>
      </div>
      <button 
        onClick={onHelpClick}
        className="pixel-btn pixel-btn-blue w-10 h-10 text-2xl p-0"
        title="איך משחקים"
      >
        ❓
      </button>
    </header>
  );
};
