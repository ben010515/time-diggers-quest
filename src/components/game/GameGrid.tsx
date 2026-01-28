import React from 'react';
import { CellData } from '@/data/gameData';

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
                  content = '✨';
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
