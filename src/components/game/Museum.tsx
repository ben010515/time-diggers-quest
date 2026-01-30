import React, { forwardRef } from 'react';
import { CollectedArtifact } from '@/data/gameData';

interface MuseumProps {
  collection: CollectedArtifact[];
  onSellArtifact: (index: number) => void;
}

export const Museum = forwardRef<HTMLDivElement, MuseumProps>(({ collection, onSellArtifact }, ref) => {
  // Calculate sell price based on era (later eras worth more)
  const getSellPrice = (eraName: string) => {
    const prices: Record<string, number> = {
      'התקופה הפליאוליתית': 10,
      'התקופה הניאוליתית': 12,
      'תקופת האבן-נחושת': 14,
      'תקופת הברונזה': 16,
      'תקופת הברזל': 18,
      'התקופה הפרסית': 20,
      'התקופה ההלניסטית': 22,
      'התקופה הרומית': 24,
      'התקופה הביזנטית': 26,
      'התקופה המוסלמית': 28,
      'תקופת הצלבנים': 30,
      'התקופה העות\'מאנית': 35,
    };
    return prices[eraName] || 10;
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center bg-amber-100">
      <h2 className="text-2xl font-black text-center mb-4 border-b-4 border-amber-300 pb-2 w-full">
        האוסף שלי
      </h2>
      <div className="w-full">
        {collection.length === 0 ? (
          <div className="text-center text-gray-500 font-bold mt-10">
            האוסף ריק...<br />צא לחפור!
          </div>
        ) : (
          [...collection].reverse().map((item, reversedIndex) => {
            const actualIndex = collection.length - 1 - reversedIndex;
            const sellPrice = getSellPrice(item.eraName);
            return (
              <div key={actualIndex} className="museum-item">
                <div className="item-icon-box">{item.icon}</div>
                <div className="flex-1 text-right">
                  <div className="font-black text-lg text-gray-800">{item.name}</div>
                  <div className="text-xs font-bold text-amber-700 uppercase">{item.eraName}</div>
                  <div className="text-sm text-gray-600 mt-1 font-bold">{item.desc}</div>
                </div>
                <button
                  onClick={() => onSellArtifact(actualIndex)}
                  className="ml-2 bg-green-500 hover:bg-green-600 text-white font-black px-3 py-2 border-4 border-black shadow-md text-sm"
                  title={`מכור תמורת ${sellPrice} נקודות`}
                >
                  מכור<br />⭐{sellPrice}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

Museum.displayName = 'Museum';
