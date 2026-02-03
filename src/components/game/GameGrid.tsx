import React, { useMemo } from 'react';
import { CellData } from '@/data/gameData';

// Different artifact discovery effects
const ARTIFACT_EFFECTS = ['✨', '💎', '🌟', '⭐', '🔮', '💫', '🏺', '🗿', '📿', '🎭'];

interface GameGridProps {
  gridData: CellData[][];
  gridSize: number;
  rowHints: number[];
  colHints: number[];
  onCellClick: (r: number, c: number) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  gridData,
  gridSize,
  rowHints,
  colHints,
  onCellClick,
}) => {
  const isAnchor = (value: number) => value === 0 || value === gridSize;

  // Generate random effects for each cell position (stable per render)
  const cellEffects = useMemo(() => {
    const effects: string[][] = [];
    for (let r = 0; r < gridSize; r++) {
      const row: string[] = [];
      for (let c = 0; c < gridSize; c++) {
        const randomIndex = Math.floor(Math.random() * ARTIFACT_EFFECTS.length);
        row.push(ARTIFACT_EFFECTS[randomIndex]);
      }
      effects.push(row);
    }
    return effects;
  }, [gridSize]);

  return (
    <div className="grid-wrapper mb-6">
      <div 
        className="grid gap-0.5"
        style={{ 
          gridTemplateColumns: `30px repeat(${gridSize}, 36px)`,
        }}
      >
        {/* Empty corner cell */}
        <div className="w-[30px] h-[30px]" />
        
        {/* Column hints */}
        {colHints.map((hint, c) => (
          <div 
            key={`col-${c}`}
            className={`grid-header h-[30px] ${isAnchor(hint) ? 'anchor' : ''}`}
          >
            {hint}
          </div>
        ))}

        {/* Rows with hints and cells */}
        {gridData.map((row, r) => (
          <React.Fragment key={`row-${r}`}>
            <div className={`grid-header w-[30px] ${isAnchor(rowHints[r]) ? 'anchor' : ''}`}>
              {rowHints[r]}
            </div>
            {row.map((cell, c) => {
              let cellClasses = 'game-cell';
              let content = '';

              if (cell.state === 'revealed') {
                if (cell.hasArtifact) {
                  cellClasses += ' revealed-artifact';
                  // Use the pre-generated random effect for this cell
                  content = cellEffects[r]?.[c] || '✨';
                } else {
                  cellClasses += ' revealed-dirt error';
                }
              } else if (cell.state === 'flagged') {
                cellClasses += ' flagged';
              }

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className={cellClasses}
                  onClick={() => onCellClick(r, c)}
                >
                  {content}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
