import React from 'react';

interface GameHeaderProps {
  eraName: string;
  location: string;
  score: number;
  onHelpClick: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ eraName, location, score, onHelpClick }) => {
  return (
    <header className="p-4 border-b-4 border-black bg-amber-200 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <h1 
            className="text-2xl font-black text-amber-900"
            style={{ textShadow: '2px 2px 0 #fff' }}
          >
            החופר בזמן
          </h1>
          <div className="bg-amber-400 border-2 border-amber-600 px-2 py-1 font-black text-amber-900 flex items-center gap-1">
            ⭐ {score}
          </div>
        </div>
        <div className="text-sm font-bold text-amber-800 mt-1">מיקום: {location}</div>
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
