import React from 'react';

interface HealthBarProps {
  hp: number;
  maxHp?: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ hp, maxHp = 100 }) => {
  const percentage = Math.max(0, (hp / maxHp) * 100);
  
  return (
    <div className="hp-bar-container">
      <div 
        className={`hp-fill ${hp < 30 ? 'low' : ''}`}
        style={{ width: `${percentage}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700" style={{ textShadow: '0 0 2px white' }}>
        {hp}/{maxHp}
      </span>
    </div>
  );
};
