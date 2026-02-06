import React from 'react';

export type GameMode = 'archaeology' | 'boss_battle';

interface ModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-b from-amber-100 to-amber-200">
      <div className="retro-box max-w-[600px] w-full p-6">
        <h1 className="text-3xl font-black text-center mb-2 text-amber-900">
          🎮 בחר מצב משחק 🎮
        </h1>
        <p className="text-center text-amber-700 mb-6 font-bold">
          בחר את ההרפתקה שלך!
        </p>
        
        <div className="grid gap-4">
          {/* Archaeology Mode */}
          <button
            onClick={() => onSelectMode('archaeology')}
            className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 
                       border-4 border-black p-6 text-right transition-all duration-300
                       hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">🏛️</div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white mb-1">מצב ארכיאולוגיה</h2>
                <p className="text-amber-100 font-bold text-sm">
                  חפור וגלה ממצאים עתיקים מתקופות שונות בהיסטוריה
                </p>
              </div>
              <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
                ⛏️
              </div>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
          
          {/* Boss Battle Mode */}
          <button
            onClick={() => onSelectMode('boss_battle')}
            className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 
                       border-4 border-black p-6 text-right transition-all duration-300
                       hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">⚔️</div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white mb-1">מצב קרב בוסים</h2>
                <p className="text-red-100 font-bold text-sm">
                  חפור נשקים והילחם נגד 10 בוסים אפיים!
                </p>
              </div>
              <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
                🐉
              </div>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-amber-600 font-bold">
            💡 הנקודות משותפות בין שני המצבים!
          </p>
        </div>
      </div>
    </div>
  );
};
