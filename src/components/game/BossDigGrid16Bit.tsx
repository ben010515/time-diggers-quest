import React from 'react';
import { BossDigCell, WEAPON_GRADES } from '@/data/bossGameData';

interface BossDigGrid16BitProps {
  grid: BossDigCell[][];
  onCellClick: (r: number, c: number) => void;
}

export const BossDigGrid16Bit: React.FC<BossDigGrid16BitProps> = ({ grid, onCellClick }) => {
  if (grid.length === 0) return null;

  return (
    <div 
      className="p-3 bg-gray-900 border-4 border-black"
      style={{ 
        boxShadow: '4px 4px 0 #000',
        imageRendering: 'pixelated',
      }}
    >
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(5, 1fr)` }}>
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const crackLevel = cell.maxHits > 0 
              ? Math.floor(((cell.maxHits - cell.hitsRemaining) / cell.maxHits) * 3)
              : 0;
            
            const isRevealed = cell.state === 'revealed';
            const hasItem = cell.hasItem && cell.item;
            
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                disabled={isRevealed}
                className={`
                  w-12 h-12 border-4 border-black flex items-center justify-center text-xl
                  transition-all duration-100 font-bold relative overflow-hidden
                  ${!isRevealed ? 'cursor-pointer hover:brightness-110 active:scale-95' : ''}
                `}
                style={{ 
                  background: isRevealed 
                    ? (hasItem 
                      ? `linear-gradient(135deg, ${WEAPON_GRADES[cell.item!.grade].color}88 0%, ${WEAPON_GRADES[cell.item!.grade].color}44 100%)`
                      : 'linear-gradient(135deg, #3d3d3d 0%, #2d2d2d 100%)')
                    : `linear-gradient(180deg, 
                        #8B7355 0%, 
                        #6B5344 40%, 
                        #5B4334 60%, 
                        #4B3324 100%)`,
                  boxShadow: isRevealed 
                    ? 'inset 2px 2px 4px rgba(0,0,0,0.5)'
                    : 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.1)',
                  borderColor: isRevealed && hasItem 
                    ? WEAPON_GRADES[cell.item!.grade].color 
                    : '#000',
                }}
              >
                {/* Crack overlay */}
                {!isRevealed && crackLevel > 0 && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: crackLevel === 1 
                        ? 'linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.3) 45%, transparent 50%)'
                        : crackLevel === 2
                          ? `linear-gradient(45deg, transparent 30%, rgba(0,0,0,0.4) 35%, transparent 45%),
                             linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.3) 55%, transparent 65%)`
                          : `linear-gradient(45deg, transparent 20%, rgba(0,0,0,0.5) 25%, transparent 35%),
                             linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.4) 45%, transparent 55%),
                             linear-gradient(90deg, transparent 60%, rgba(0,0,0,0.3) 65%, transparent 75%)`,
                    }}
                  />
                )}
                
                {/* Content */}
                {isRevealed ? (
                  hasItem ? (
                    <span 
                      title={cell.item!.name}
                      className="drop-shadow-lg animate-bounce"
                    >
                      {cell.item!.icon}
                    </span>
                  ) : (
                    <span className="text-gray-600 text-lg">✗</span>
                  )
                ) : (
                  <span className="text-amber-200 text-lg font-black drop-shadow-md">?</span>
                )}
                
                {/* Pixel highlight */}
                {!isRevealed && (
                  <div 
                    className="absolute top-0 left-0 w-2 h-2 opacity-30"
                    style={{ background: '#fff' }}
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
