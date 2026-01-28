import React from 'react';
import { CollectedArtifact } from '@/data/gameData';

interface MuseumProps {
  collection: CollectedArtifact[];
}

export const Museum: React.FC<MuseumProps> = ({ collection }) => {
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
          [...collection].reverse().map((item, index) => (
            <div key={index} className="museum-item">
              <div className="item-icon-box">{item.icon}</div>
              <div className="flex-1 text-right">
                <div className="font-black text-lg text-gray-800">{item.name}</div>
                <div className="text-xs font-bold text-amber-700 uppercase">{item.eraName}</div>
                <div className="text-sm text-gray-600 mt-1 font-bold">{item.desc}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
