import React from 'react';

interface GameTabsProps {
  activeTab: 'dig' | 'museum' | 'shop';
  onTabChange: (tab: 'dig' | 'museum' | 'shop') => void;
}

export const GameTabs: React.FC<GameTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-amber-200 pt-2 px-4" style={{ marginBottom: '-4px', zIndex: 10 }}>
      <div 
        className={`tab ${activeTab === 'dig' ? 'active' : ''}`}
        onClick={() => onTabChange('dig')}
      >
        חפירה ⛏️
      </div>
      <div 
        className={`tab ${activeTab === 'museum' ? 'active' : ''}`}
        onClick={() => onTabChange('museum')}
      >
        אוסף 🏺
      </div>
      <div 
        className={`tab ${activeTab === 'shop' ? 'active' : ''}`}
        onClick={() => onTabChange('shop')}
      >
        חנות 🛒
      </div>
    </div>
  );
};
