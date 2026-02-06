import React from 'react';
import { BossShopItem, BOSS_SHOP_ITEMS } from '@/data/bossGameData';

interface BossShopProps {
  score: number;
  hasBoazBen: boolean;
  onPurchase: (item: BossShopItem) => void;
}

export const BossShop: React.FC<BossShopProps> = ({ score, hasBoazBen, onPurchase }) => {
  return (
    <div className="bg-white border-4 border-black p-3 w-full">
      <h3 className="font-black text-center mb-2 border-b-2 border-gray-300 pb-1">🏪 חנות הקרב</h3>
      <div className="text-center mb-3 font-bold text-purple-700">
        ⭐ {score} נקודות
      </div>
      
      <div className="space-y-2">
        {BOSS_SHOP_ITEMS.map((item) => {
          const canAfford = score >= item.price;
          const isBoazBen = item.id === 'boaz_ben';
          const alreadyOwned = isBoazBen && hasBoazBen;
          
          return (
            <div 
              key={item.id}
              className={`flex items-center gap-2 p-2 border-2 border-gray-300 ${!canAfford && !alreadyOwned ? 'opacity-50' : ''}`}
            >
              <div className="text-2xl w-8 text-center">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{item.name}</div>
                <div className="text-xs text-gray-600 truncate">{item.description}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-amber-600">⭐ {item.price}</div>
                <button
                  onClick={() => onPurchase(item)}
                  disabled={!canAfford || alreadyOwned}
                  className={`text-xs px-2 py-1 font-bold border-2 border-black ${
                    alreadyOwned 
                      ? 'bg-green-300 cursor-not-allowed'
                      : canAfford 
                        ? 'bg-yellow-400 hover:bg-yellow-300 cursor-pointer' 
                        : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {alreadyOwned ? '✓' : 'קנה'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
