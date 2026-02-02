import React from 'react';
import { SHOP_ITEMS, ShopItem } from '@/data/shopData';

interface ShopProps {
  score: number;
  onPurchase: (item: ShopItem) => void;
  ownedItems: string[];
  claimedGift: boolean;
  onLuckyCharmClick?: () => void;
}

export const Shop: React.FC<ShopProps> = ({ score, onPurchase, ownedItems, claimedGift, onLuckyCharmClick }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center bg-purple-100">
      <h2 className="text-2xl font-black text-center mb-2 border-b-4 border-purple-300 pb-2 w-full">
        החנות 🛒
      </h2>
      <div className="text-center mb-4 font-bold text-purple-700">
        הנקודות שלך: ⭐ {score}
      </div>
      <div className="w-full space-y-3">
        {SHOP_ITEMS.map((item) => {
          const isGift = item.id === 'gift_points';
          const isLuckyCharm = item.id === 'lucky_charm';
          const canAfford = score >= item.price || isGift;
          const isOwned = ownedItems.includes(item.id);
          const isGiftClaimed = isGift && claimedGift;
          const isUsable = item.isUsable;
          
          return (
            <div 
              key={item.id} 
              className={`bg-white border-4 border-black p-3 flex gap-3 items-center ${!canAfford && !isOwned && !isGiftClaimed ? 'opacity-50' : ''}`}
              style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}
            >
              <div 
                className={`w-12 h-12 flex items-center justify-center text-2xl border-4 ${isLuckyCharm ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                style={{ 
                  backgroundColor: isGift ? 'hsl(45 100% 85%)' : 'hsl(280 60% 85%)',
                  borderColor: isGift ? 'hsl(45 80% 50%)' : 'hsl(280 40% 50%)'
                }}
                onClick={isLuckyCharm ? onLuckyCharmClick : undefined}
                title={isLuckyCharm ? 'לחץ לסודות...' : undefined}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-black text-gray-800">{item.name}</div>
                <div className="text-xs text-gray-600 font-bold">{item.description}</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                {!isGift && (
                  <div className="font-black text-amber-600">⭐ {item.price}</div>
                )}
                <button
                  onClick={() => onPurchase(item)}
                  disabled={isGiftClaimed || (!isGift && !canAfford) || (!isUsable && isOwned)}
                  className={`pixel-btn text-xs px-3 py-1 ${
                    isGiftClaimed 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isGift
                        ? 'pixel-btn-green'
                        : isOwned && !isUsable
                          ? 'pixel-btn-green' 
                          : canAfford 
                            ? 'pixel-btn-yellow' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGiftClaimed ? '✓ נלקח' : isGift ? 'קבל!' : isOwned && !isUsable ? '✓' : isUsable ? 'קנה +1' : 'קנה'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
