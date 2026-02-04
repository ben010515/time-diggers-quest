import React, { useMemo } from 'react';
import { CellData } from '@/data/gameData';

// Different artifact discovery effects
const ARTIFACT_EFFECTS = ['✨', '💎', '🌟', '⭐', '🔮', '💫', '🏺', '🗿', '📿', '🎭'];

interface GameGridProps {
  gridData: CellData[][];
  rowHints: number[];
  colHints: number[];
  onCellClick: (r: number, c: number) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  gridData,
  rowHints,
  colHints,
  onCellClick,
}) => {
  const rows = gridData.length;
  const cols = gridData[0]?.length ?? 0;

  const isAnchorRow = (value: number) => value === 0 || value === cols;
  const isAnchorCol = (value: number) => value === 0 || value === rows;

  // Generate random effects for each cell position (stable per render)
  const cellEffects = useMemo(() => {
    const effects: string[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        const randomIndex = Math.floor(Math.random() * ARTIFACT_EFFECTS.length);
        row.push(ARTIFACT_EFFECTS[randomIndex]);
      }
      effects.push(row);
    }
    return effects;
  }, [rows, cols]);

  if (rows === 0 || cols === 0) return null;

  return (
    <div className="grid-wrapper mb-6">
      <div 
        className="grid gap-0.5"
        style={{ 
          gridTemplateColumns: `30px repeat(${cols}, 36px)`,
        }}
      >
        {/* Empty corner cell */}
        <div className="w-[30px] h-[30px]" />
        
        {/* Column hints */}
        {colHints.slice(0, cols).map((hint, c) => (
          <div 
            key={`col-${c}`}
            className={`grid-header h-[30px] ${isAnchorCol(hint) ? 'anchor' : ''}`}
          >
            {hint}
          </div>
        ))}

        {/* Rows with hints and cells */}
        {gridData.map((row, r) => (
          <React.Fragment key={`row-${r}`}>
            <div className={`grid-header w-[30px] ${isAnchorRow(rowHints[r] ?? 0) ? 'anchor' : ''}`}>
              {rowHints[r] ?? 0}
            </div>
            {row.map((cell, c) => {
              let cellClasses = 'game-cell';
              let content = '';

              if (cell.state === 'revealed') {
                if (cell.hasArtifact) {
                  cellClasses += ' revealed-artifact';
                  content = cellEffects[r]?.[c] || '✨';
                } else {
                  cellClasses += ' revealed-dirt error';
                }
              } else if (cell.state === 'flagged') {
                cellClasses += ' flagged';
              } else if (cell.state === 'hidden' && cell.hitsRemaining < cell.maxHits) {
                // Show cracking progress
                const progress = 1 - (cell.hitsRemaining / cell.maxHits);
                cellClasses += ' cracking';
                if (progress >= 0.66) {
                  cellClasses += ' crack-heavy';
                } else if (progress >= 0.33) {
                  cellClasses += ' crack-medium';
                } else {
                  cellClasses += ' crack-light';
                }
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
