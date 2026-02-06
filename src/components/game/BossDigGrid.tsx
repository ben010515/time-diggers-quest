import React from 'react';
import { BossDigCell } from '@/data/bossGameData';
import { WEAPON_GRADES } from '@/data/bossGameData';

interface BossDigGridProps {
  grid: BossDigCell[][];
  onCellClick: (r: number, c: number) => void;
}

export const BossDigGrid: React.FC<BossDigGridProps> = ({ grid, onCellClick }) => {
  if (grid.length === 0) return null;

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(5, 1fr)` }}>
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const crackLevel = cell.maxHits > 0 
            ? Math.floor(((cell.maxHits - cell.hitsRemaining) / cell.maxHits) * 3)
            : 0;
          
          const crackClass = crackLevel === 1 ? 'crack-light' : crackLevel === 2 ? 'crack-medium' : crackLevel >= 3 ? 'crack-heavy' : '';
          
          return (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              disabled={cell.state === 'revealed'}
              className={`
                w-14 h-14 border-4 border-black flex items-center justify-center text-2xl
                transition-all duration-200 font-bold
                ${cell.state === 'hidden' ? 'bg-amber-600 hover:bg-amber-500 cursor-pointer' : ''}
                ${cell.state === 'revealed' && cell.hasItem ? 'bg-green-300' : ''}
                ${cell.state === 'revealed' && !cell.hasItem ? 'bg-gray-300' : ''}
                ${crackClass}
              `}
              style={{ 
                boxShadow: cell.state === 'hidden' ? '3px 3px 0 rgba(0,0,0,0.3)' : 'none',
                borderColor: cell.state === 'revealed' && cell.item 
                  ? WEAPON_GRADES[cell.item.grade].color 
                  : undefined
              }}
            >
              {cell.state === 'revealed' && cell.hasItem && cell.item ? (
                <span title={cell.item.name}>{cell.item.icon}</span>
              ) : cell.state === 'revealed' ? (
                '✗'
              ) : (
                '?'
              )}
            </button>
          );
        })
      )}
    </div>
  );
};
