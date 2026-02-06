import React from 'react';
import { Weapon, WEAPON_GRADES } from '@/data/bossGameData';

interface BossInventoryProps {
  inventory: Weapon[];
  equippedPrimary: Weapon | null;
  equippedSecondary: Weapon | null;
  arrowCount: number;
  onEquip: (weapon: Weapon, slot: 'primary' | 'secondary') => void;
}

export const BossInventory: React.FC<BossInventoryProps> = ({
  inventory,
  equippedPrimary,
  equippedSecondary,
  arrowCount,
  onEquip,
}) => {
  return (
    <div className="bg-white border-4 border-black p-3 w-full">
      <h3 className="font-black text-center mb-2 border-b-2 border-gray-300 pb-1">🎒 המלאי שלך</h3>
      
      {/* Equipped slots */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-red-100 border-2 border-red-400 p-2 text-center">
          <div className="text-xs font-bold text-red-700">ראשי (התקפה)</div>
          {equippedPrimary ? (
            <div 
              className="text-2xl" 
              title={equippedPrimary.name}
              style={{ color: WEAPON_GRADES[equippedPrimary.grade].color }}
            >
              {equippedPrimary.icon}
            </div>
          ) : (
            <div className="text-gray-400">—</div>
          )}
        </div>
        <div className="flex-1 bg-blue-100 border-2 border-blue-400 p-2 text-center">
          <div className="text-xs font-bold text-blue-700">משני (הגנה)</div>
          {equippedSecondary ? (
            <div 
              className="text-2xl" 
              title={equippedSecondary.name}
              style={{ color: WEAPON_GRADES[equippedSecondary.grade].color }}
            >
              {equippedSecondary.icon}
            </div>
          ) : (
            <div className="text-gray-400">—</div>
          )}
        </div>
      </div>
      
      {/* Arrow count */}
      {arrowCount > 0 && (
        <div className="text-center mb-2 text-sm font-bold">
          ➵ חצים: {arrowCount}
        </div>
      )}
      
      {/* Inventory grid */}
      <div className="grid grid-cols-5 gap-1">
        {inventory.map((weapon, idx) => (
          <div 
            key={idx}
            className="aspect-square border-2 border-gray-400 flex items-center justify-center text-xl cursor-pointer hover:bg-gray-100 relative group"
            style={{ borderColor: WEAPON_GRADES[weapon.grade].color }}
            title={`${weapon.name} - לחץ להצטייד`}
          >
            <span>{weapon.icon}</span>
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
              <div className="font-bold">{weapon.name}</div>
              <div>נזק: {weapon.damage} | הגנה: {weapon.defense}</div>
              <div className="flex gap-1 mt-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEquip(weapon, 'primary'); }}
                  className="bg-red-500 px-2 py-0.5 rounded text-xs"
                >
                  ראשי
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEquip(weapon, 'secondary'); }}
                  className="bg-blue-500 px-2 py-0.5 rounded text-xs"
                >
                  משני
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {inventory.length === 0 && (
          <div className="col-span-5 text-center text-gray-500 text-sm py-2">
            חפור כדי למצוא נשקים!
          </div>
        )}
      </div>
    </div>
  );
};
