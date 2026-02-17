import React, { useState, useEffect } from 'react';
import { useBossGame } from '@/hooks/useBossGame';
import { BossDigGrid } from './BossDigGrid';
import { BossInventory } from './BossInventory';
import { BossBattleArena } from './BossBattleArena';
import { BossShop } from './BossShop';
import { BOSSES } from '@/data/bossGameData';

interface BossGameModeProps {
  score: number;
  setScore: (score: number | ((prev: number) => number)) => void;
  onBackToMenu: () => void;
}

export const BossGameMode: React.FC<BossGameModeProps> = ({ score, setScore, onBackToMenu }) => {
  const [activeTab, setActiveTab] = useState<'dig' | 'shop'>('dig');
  
  const {
    phase,
    currentBoss,
    currentBossIndex,
    digGrid,
    digsRemaining,
    handleDigClick,
    inventory,
    equippedPrimary,
    equippedSecondary,
    arrowCount,
    hasBoazBen,
    equipWeapon,
    player,
    bossHp,
    bossX,
    bossAttacking,
    projectiles,
    startBattle,
    attackBoss,
    shootArrow,
    dragonHits,
    luckBonus,
    defenseBonus,
    purchaseBossItem,
    initBossGame,
    retryBoss,
  } = useBossGame(score, setScore);

  useEffect(() => {
    initBossGame();
  }, []);

  const canStartBattle = digsRemaining === 0 || inventory.length > 0;

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-2">
      <div className="retro-box max-w-[500px] w-full h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 border-b-4 border-black">
          <div className="flex justify-between items-center">
            <button 
              onClick={onBackToMenu}
              className="pixel-btn text-xs px-2 py-1"
            >
              ← חזור
            </button>
            <h1 className="text-xl font-black text-white text-center">
              ⚔️ קרב בוסים ⚔️
            </h1>
            <div className="font-black text-yellow-300">⭐ {score}</div>
          </div>
          <div className="text-center text-white text-sm mt-1">
            שלב {currentBossIndex + 1}/10 - {currentBoss.name} {currentBoss.icon}
          </div>
        </div>

        {/* Phase indicator */}
        <div className="bg-black text-white text-center py-1 font-bold text-sm">
          {phase === 'dig' && `🔍 חפור נשקים (${digsRemaining} נותרו)`}
          {phase === 'battle' && `⚔️ קרב נגד ${currentBoss.name}!`}
          {phase === 'victory' && '🎉 ניצחת את כל הבוסים!'}
          {phase === 'defeat' && '💀 הפסדת! נסה שוב'}
        </div>

        {phase === 'dig' && (
          <>
            {/* Tabs */}
            <div className="flex border-b-4 border-black">
              <button
                onClick={() => setActiveTab('dig')}
                className={`flex-1 py-2 font-black text-sm border-l-4 border-black ${
                  activeTab === 'dig' ? 'bg-amber-200' : 'bg-gray-200'
                }`}
              >
                ⛏️ חפירה
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={`flex-1 py-2 font-black text-sm ${
                  activeTab === 'shop' ? 'bg-purple-200' : 'bg-gray-200'
                }`}
              >
                🛒 חנות
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto">
              {activeTab === 'dig' ? (
                <div className="flex flex-col items-center gap-4">
                  {/* Boss preview */}
                  <div 
                    className="text-center p-3 border-4 border-black w-full"
                    style={{ backgroundColor: currentBoss.color + '33' }}
                  >
                    <div className="text-4xl mb-1">{currentBoss.icon}</div>
                    <div className="font-black">{currentBoss.name}</div>
                    <div className="text-xs text-gray-600">{currentBoss.description}</div>
                    <div className="text-xs mt-1">
                      ❤️ {currentBoss.hp} HP | ⚔️ נזק: {currentBoss.damage} | 🏆 פרס: {currentBoss.reward} נק׳
                    </div>
                  </div>

                  {/* Dig grid */}
                  <BossDigGrid grid={digGrid} onCellClick={handleDigClick} />

                  {/* Start battle button */}
                  <button
                    onClick={startBattle}
                    disabled={!canStartBattle}
                    className={`pixel-btn w-full py-3 text-lg font-black ${
                      canStartBattle ? 'pixel-btn-green' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    ⚔️ התחל קרב!
                  </button>

                  {/* Inventory */}
                  <BossInventory 
                    inventory={inventory}
                    equippedPrimary={equippedPrimary}
                    equippedSecondary={equippedSecondary}
                    arrowCount={arrowCount}
                    onEquip={equipWeapon}
                  />

                  {/* Stats */}
                  <div className="text-xs text-gray-600 text-center">
                    {luckBonus > 0 && <span className="mr-2">🍀 מזל: +{luckBonus}</span>}
                    {defenseBonus > 0 && <span>🛡️ הגנה: +{defenseBonus}</span>}
                  </div>
                </div>
              ) : (
                <BossShop 
                  score={score}
                  hasBoazBen={hasBoazBen}
                  onPurchase={purchaseBossItem}
                />
              )}
            </div>
          </>
        )}

        {phase === 'battle' && (
          <div className="flex-1 p-3 overflow-hidden">
            <BossBattleArena
              boss={currentBoss}
              bossHp={bossHp}
              bossX={bossX}
              bossAttacking={bossAttacking}
              player={player}
              equippedPrimary={equippedPrimary}
              equippedSecondary={equippedSecondary}
              projectiles={projectiles}
              onAttack={attackBoss}
              onShoot={shootArrow}
              arrowCount={arrowCount}
            />
            
            {currentBoss.id === 'diamond_dragon' && (
              <div className="text-center mt-2 text-sm font-bold">
                מכות: {dragonHits} | כל 10 מכות = 25 נק׳
              </div>
            )}
          </div>
        )}

        {phase === 'victory' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-green-600 mb-2">ניצחת!</h2>
            <p className="text-gray-600 mb-4">הרגת את כל 10 הבוסים!</p>
            <button
              onClick={() => { initBossGame(); }}
              className="pixel-btn pixel-btn-green px-6 py-3 text-lg"
            >
              שחק שוב
            </button>
          </div>
        )}

        {phase === 'defeat' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-2xl font-black text-red-600 mb-2">הפסדת!</h2>
            <p className="text-gray-600 mb-4">{currentBoss.name} הביס אותך</p>
            <div className="flex gap-2">
              <button
                onClick={() => { retryBoss(); }}
                className="pixel-btn pixel-btn-yellow px-4 py-2"
              >
                נסה שוב
              </button>
              <button
                onClick={() => { initBossGame(); }}
                className="pixel-btn px-4 py-2"
              >
                התחל מחדש
              </button>
              <button
                onClick={onBackToMenu}
                className="pixel-btn px-4 py-2"
              >
                תפריט ראשי
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
