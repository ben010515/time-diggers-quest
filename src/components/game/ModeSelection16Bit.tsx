import React from 'react';

export type GameMode = 'archaeology' | 'boss_battle';

interface ModeSelection16BitProps {
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelection16Bit: React.FC<ModeSelection16BitProps> = ({ onSelectMode }) => {
  return (
    <div 
      className="h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(180deg, 
          #1a1a2e 0%, 
          #16213e 30%, 
          #0f3460 60%, 
          #e94560 100%)`,
        imageRendering: 'pixelated',
      }}
    >
      {/* Pixel stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white animate-pulse"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 7) % 60}%`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0.3 + (i % 4) * 0.2,
            }}
          />
        ))}
      </div>

      <div 
        className="max-w-[500px] w-full p-6 relative"
        style={{
          background: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
          border: '6px solid #000',
          boxShadow: '8px 8px 0 #000, inset 0 0 0 2px #444',
          imageRendering: 'pixelated',
        }}
      >
        {/* Title with pixel effect */}
        <div className="text-center mb-6">
          <h1 
            className="text-3xl font-black text-yellow-400 mb-2"
            style={{
              textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
              fontFamily: 'monospace',
              letterSpacing: '2px',
            }}
          >
            🎮 בחר מצב 🎮
          </h1>
          <p 
            className="text-cyan-400 font-bold text-sm"
            style={{ fontFamily: 'monospace' }}
          >
            ► בחר את ההרפתקה שלך ◄
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Archaeology Mode - 16-bit button */}
          <button
            onClick={() => onSelectMode('archaeology')}
            className="w-full relative overflow-hidden transition-all duration-100 
                     hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
            style={{
              background: 'linear-gradient(180deg, #ffa500 0%, #cc8400 50%, #995500 100%)',
              border: '4px solid #000',
              boxShadow: '4px 4px 0 #000',
              padding: '16px',
            }}
          >
            <div className="flex items-center gap-4 text-right">
              <div 
                className="text-4xl"
                style={{ 
                  filter: 'drop-shadow(2px 2px 0 #000)',
                  imageRendering: 'pixelated',
                }}
              >
                🏛️
              </div>
              <div className="flex-1">
                <h2 
                  className="text-xl font-black text-white mb-1"
                  style={{ 
                    textShadow: '2px 2px 0 #000',
                    fontFamily: 'monospace',
                  }}
                >
                  מצב ארכיאולוגיה
                </h2>
                <p 
                  className="text-yellow-200 font-bold text-xs"
                  style={{ fontFamily: 'monospace' }}
                >
                  חפור וגלה ממצאים עתיקים
                </p>
              </div>
              <div className="text-3xl opacity-70">⛏️</div>
            </div>
            {/* Scanline effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              }}
            />
          </button>
          
          {/* Boss Battle Mode - 16-bit button */}
          <button
            onClick={() => onSelectMode('boss_battle')}
            className="w-full relative overflow-hidden transition-all duration-100 
                     hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
            style={{
              background: 'linear-gradient(180deg, #ff4444 0%, #cc2222 50%, #991111 100%)',
              border: '4px solid #000',
              boxShadow: '4px 4px 0 #000',
              padding: '16px',
            }}
          >
            <div className="flex items-center gap-4 text-right">
              <div 
                className="text-4xl"
                style={{ 
                  filter: 'drop-shadow(2px 2px 0 #000)',
                  imageRendering: 'pixelated',
                }}
              >
                ⚔️
              </div>
              <div className="flex-1">
                <h2 
                  className="text-xl font-black text-white mb-1"
                  style={{ 
                    textShadow: '2px 2px 0 #000',
                    fontFamily: 'monospace',
                  }}
                >
                  מצב קרב בוסים
                </h2>
                <p 
                  className="text-red-200 font-bold text-xs"
                  style={{ fontFamily: 'monospace' }}
                >
                  חפור נשקים והילחם נגד 10 בוסים!
                </p>
              </div>
              <div className="text-3xl opacity-70">🐉</div>
            </div>
            {/* Scanline effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              }}
            />
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p 
            className="text-xs text-cyan-400 font-bold animate-pulse"
            style={{ fontFamily: 'monospace' }}
          >
            ★ הנקודות משותפות בין המצבים ★
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-yellow-500" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-yellow-500" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-yellow-500" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-yellow-500" />
      </div>
    </div>
  );
};
