import React, { useState, useEffect } from 'react';
import { useBossGame } from '@/hooks/useBossGame';
import { BossDigGrid16Bit } from './BossDigGrid16Bit';
import { BossInventory } from './BossInventory';
import { BossBattleArena16Bit } from './BossBattleArena16Bit';
import { BossShop } from './BossShop';
import { BOSSES } from '@/data/bossGameData';

interface BossGameMode16BitProps {
  score: number;
  setScore: (score: number | ((prev: number) => number)) => void;
  onBackToMenu: () => void;
}

export const BossGameMode16Bit: React.FC<BossGameMode16BitProps> = ({ score, setScore, onBackToMenu }) => {
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
  } = useBossGame(score, setScore);

  useEffect(() => {
    initBossGame();
  }, []);

  // Can always start battle, even without weapons
  const canStartBattle = true;

  return (
    <div 
      className="h-screen overflow-hidden flex items-center justify-center p-2"
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        imageRendering: 'pixelated',
      }}
    >
      <div 
        className="max-w-[500px] w-full h-[95vh] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
          border: '6px solid #000',
          boxShadow: '8px 8px 0 #000',
        }}
      >
        {/* Header - 16-bit style */}
        <div 
          className="p-3"
          style={{
            background: 'linear-gradient(180deg, #cc2222 0%, #991111 100%)',
            borderBottom: '4px solid #000',
          }}
        >
          <div className="flex justify-between items-center">
            <button 
              onClick={onBackToMenu}
              className="px-2 py-1 text-xs font-black"
              style={{
                background: 'linear-gradient(180deg, #666 0%, #444 100%)',
                border: '3px solid #000',
                color: '#fff',
                boxShadow: '2px 2px 0 #000',
                fontFamily: 'monospace',
              }}
            >
              ◀ חזור
            </button>
            <h1 
              className="text-lg font-black text-center"
              style={{
                color: '#fff',
                textShadow: '2px 2px 0 #000',
                fontFamily: 'monospace',
              }}
            >
              ⚔️ קרב בוסים ⚔️
            </h1>
            <div 
              className="font-black px-2 py-1"
              style={{
                background: 'linear-gradient(180deg, #ffcc00 0%, #cc9900 100%)',
                border: '2px solid #000',
                fontFamily: 'monospace',
              }}
            >
              ⭐{score}
            </div>
          </div>
          <div 
            className="text-center text-sm mt-1 font-bold"
            style={{ 
              color: '#ffcccc',
              fontFamily: 'monospace',
            }}
          >
            שלב {currentBossIndex + 1}/10 - {currentBoss.name}
          </div>
        </div>

        {/* Phase indicator */}
        <div 
          className="text-center py-2 font-bold text-sm"
          style={{
            background: '#000',
            color: phase === 'dig' ? '#00ff00' : phase === 'battle' ? '#ff4444' : '#ffcc00',
            fontFamily: 'monospace',
            borderBottom: '2px solid #333',
          }}
        >
          {phase === 'dig' && `► חפור נשקים (${digsRemaining} נותרו) ◄`}
          {phase === 'battle' && `► קרב נגד ${currentBoss.name}! ◄`}
          {phase === 'victory' && '★ ניצחת את כל הבוסים! ★'}
          {phase === 'defeat' && '✗ הפסדת! נסה שוב ✗'}
        </div>

        {phase === 'dig' && (
          <>
            {/* Tabs - 16-bit style */}
            <div className="flex" style={{ borderBottom: '4px solid #000' }}>
              <button
                onClick={() => setActiveTab('dig')}
                className="flex-1 py-2 font-black text-sm"
                style={{
                  background: activeTab === 'dig' 
                    ? 'linear-gradient(180deg, #ffa500 0%, #cc8400 100%)'
                    : 'linear-gradient(180deg, #555 0%, #333 100%)',
                  borderLeft: '2px solid #000',
                  color: activeTab === 'dig' ? '#000' : '#888',
                  fontFamily: 'monospace',
                }}
              >
                ⛏️ חפירה
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className="flex-1 py-2 font-black text-sm"
                style={{
                  background: activeTab === 'shop' 
                    ? 'linear-gradient(180deg, #aa44ff 0%, #7722cc 100%)'
                    : 'linear-gradient(180deg, #555 0%, #333 100%)',
                  color: activeTab === 'shop' ? '#fff' : '#888',
                  fontFamily: 'monospace',
                }}
              >
                🛒 חנות
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto" style={{ background: '#1a1a1a' }}>
              {activeTab === 'dig' ? (
                <div className="flex flex-col items-center gap-4">
                  {/* Boss preview - 16-bit card */}
                  <div 
                    className="text-center p-3 w-full"
                    style={{ 
                      background: `linear-gradient(180deg, ${currentBoss.color}44 0%, ${currentBoss.color}22 100%)`,
                      border: '4px solid #000',
                      boxShadow: '4px 4px 0 #000',
                    }}
                  >
                    <div 
                      className="text-4xl mb-1"
                      style={{ filter: 'drop-shadow(2px 2px 0 #000)' }}
                    >
                      {currentBoss.icon}
                    </div>
                    <div 
                      className="font-black text-white"
                      style={{ 
                        textShadow: '2px 2px 0 #000',
                        fontFamily: 'monospace',
                      }}
                    >
                      {currentBoss.name}
                    </div>
                    <div 
                      className="text-xs mt-1"
                      style={{ 
                        color: '#aaa',
                        fontFamily: 'monospace',
                      }}
                    >
                      ❤️{currentBoss.hp} | ⚔️{currentBoss.damage} | 🏆{currentBoss.reward}
                    </div>
                  </div>

                  {/* Dig grid */}
                  <BossDigGrid16Bit grid={digGrid} onCellClick={handleDigClick} />

                  {/* Start battle button */}
                  <button
                    onClick={startBattle}
                    disabled={!canStartBattle}
                    className="w-full py-3 font-black transition-all"
                    style={{
                      background: canStartBattle 
                        ? 'linear-gradient(180deg, #44ff44 0%, #22cc22 50%, #119911 100%)'
                        : 'linear-gradient(180deg, #555 0%, #333 100%)',
                      border: '4px solid #000',
                      boxShadow: canStartBattle ? '4px 4px 0 #000' : 'none',
                      color: canStartBattle ? '#000' : '#666',
                      fontFamily: 'monospace',
                      fontSize: '16px',
                    }}
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
                  <div 
                    className="text-xs text-center"
                    style={{ color: '#888', fontFamily: 'monospace' }}
                  >
                    {luckBonus > 0 && <span className="mr-2">🍀+{luckBonus}</span>}
                    {defenseBonus > 0 && <span>🛡️+{defenseBonus}</span>}
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
          <div className="flex-1 p-3 overflow-hidden" style={{ background: '#0a0a0a' }}>
            <BossBattleArena16Bit
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
              <div 
                className="text-center mt-2 text-sm font-bold"
                style={{ color: '#00ffff', fontFamily: 'monospace' }}
              >
                מכות: {dragonHits} | כל 10 = 25 נק׳
              </div>
            )}
          </div>
        )}

        {phase === 'victory' && (
          <div 
            className="flex-1 flex flex-col items-center justify-center p-4"
            style={{ background: '#0a0a0a' }}
          >
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 
              className="text-2xl font-black mb-2"
              style={{ 
                color: '#44ff44',
                textShadow: '2px 2px 0 #000',
                fontFamily: 'monospace',
              }}
            >
              ★ ניצחת! ★
            </h2>
            <p style={{ color: '#888', fontFamily: 'monospace' }}>
              הרגת את כל 10 הבוסים!
            </p>
            <button
              onClick={() => { initBossGame(); }}
              className="mt-4 px-6 py-3 font-black"
              style={{
                background: 'linear-gradient(180deg, #44ff44 0%, #22aa22 100%)',
                border: '4px solid #000',
                boxShadow: '4px 4px 0 #000',
                fontFamily: 'monospace',
              }}
            >
              שחק שוב
            </button>
          </div>
        )}

        {phase === 'defeat' && (
          <div 
            className="flex-1 flex flex-col items-center justify-center p-4"
            style={{ background: '#0a0a0a' }}
          >
            <div className="text-6xl mb-4">💀</div>
            <h2 
              className="text-2xl font-black mb-2"
              style={{ 
                color: '#ff4444',
                textShadow: '2px 2px 0 #000',
                fontFamily: 'monospace',
              }}
            >
              ✗ הפסדת ✗
            </h2>
            <p style={{ color: '#888', fontFamily: 'monospace' }}>
              {currentBoss.name} הביס אותך
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { initBossGame(); }}
                className="px-4 py-2 font-black"
                style={{
                  background: 'linear-gradient(180deg, #ffcc00 0%, #cc9900 100%)',
                  border: '4px solid #000',
                  boxShadow: '3px 3px 0 #000',
                  fontFamily: 'monospace',
                }}
              >
                התחל מחדש
              </button>
              <button
                onClick={onBackToMenu}
                className="px-4 py-2 font-black"
                style={{
                  background: 'linear-gradient(180deg, #666 0%, #444 100%)',
                  border: '4px solid #000',
                  boxShadow: '3px 3px 0 #000',
                  color: '#fff',
                  fontFamily: 'monospace',
                }}
              >
                תפריט
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
