import React from 'react';

interface HealthBarProps {
  hp: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ hp }) => {
  return (
    <div className="hp-bar-container">
      <div 
        className={`hp-fill ${hp < 30 ? 'low' : ''}`}
        style={{ width: `${Math.max(0, hp)}%` }}
      />
    </div>
  );
};
