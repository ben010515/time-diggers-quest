import React from 'react';
import { Boss, BossPlayer, Weapon } from '@/data/bossGameData';
import { PixelSprite } from './PixelSprite';

interface BossBattleArena16BitProps {
  boss: Boss;
  bossHp: number;
  bossX: number;
  bossAttacking: boolean;
  player: BossPlayer;
  equippedPrimary: Weapon | null;
  equippedSecondary: Weapon | null;
  projectiles: Array<{ x: number; y: number; velocityX: number; icon: string }>;
  onAttack: () => void;
  onShoot: () => void;
  arrowCount: number;
}

export const BossBattleArena16Bit: React.FC<BossBattleArena16BitProps> = ({
  boss,
  bossHp,
  bossX,
  bossAttacking,
  player,
  equippedPrimary,
  equippedSecondary,
  projectiles,
  onAttack,
  onShoot,
  arrowCount,
}) => {
  // Touch controls for mobile
  const handleLeftButton = (pressed: boolean) => {
    const event = new KeyboardEvent(pressed ? 'keydown' : 'keyup', { key: 'a' });
    window.dispatchEvent(event);
  };

  const handleRightButton = (pressed: boolean) => {
    const event = new KeyboardEvent(pressed ? 'keydown' : 'keyup', { key: 'd' });
    window.dispatchEvent(event);
  };

  const handleJumpButton = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
    }, 100);
  };

  const handleAttackButton = () => {
    if (equippedPrimary?.type === 'bow') {
      onShoot();
    } else {
      onAttack();
    }
  };

  const handleBlockButton = (pressed: boolean) => {
    const event = new KeyboardEvent(pressed ? 'keydown' : 'keyup', { key: 'Shift' });
    window.dispatchEvent(event);
  };

  const hpPercentage = (bossHp / boss.hp) * 100;
  const playerHpPercentage = (player.hp / player.maxHp) * 100;

  return (
    <div className="w-full">
      {/* Boss HP Bar - 16-bit style */}
      <div className="mb-2 p-2 bg-black border-4 border-gray-600">
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-sm text-white pixel-text">{boss.name}</span>
          <span className="text-xs font-bold text-red-400">{bossHp}/{boss.hp}</span>
        </div>
        <div className="h-4 bg-gray-800 border-2 border-gray-600 overflow-hidden">
          <div 
            className="h-full transition-all duration-200"
            style={{ 
              width: `${hpPercentage}%`,
              background: `repeating-linear-gradient(90deg, ${boss.color} 0px, ${boss.color} 4px, ${boss.color}99 4px, ${boss.color}99 8px)`,
            }}
          />
        </div>
      </div>

      {/* Arena - 16-bit platformer style */}
      <div 
        className="relative border-4 border-black overflow-hidden"
        style={{ 
          height: '220px', 
          width: '100%',
          imageRendering: 'pixelated',
          background: `linear-gradient(180deg, 
            #1a1a2e 0%, 
            #16213e 30%, 
            #0f3460 60%, 
            #533483 100%)`,
        }}
      >
        {/* Pixel stars background */}
        <div className="absolute inset-0 opacity-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 13) % 40}%`,
                opacity: 0.3 + (i % 3) * 0.3,
              }}
            />
          ))}
        </div>

        {/* Ground - pixel blocks */}
        <div className="absolute bottom-0 w-full h-12 flex">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border-t-2 border-l border-gray-600"
              style={{
                background: i % 2 === 0 
                  ? `linear-gradient(180deg, #654321 0%, #3d2914 50%, #2d1f0f 100%)`
                  : `linear-gradient(180deg, #5a3d1f 0%, #3a2815 50%, #261a0c 100%)`,
              }}
            />
          ))}
        </div>

        {/* Grass layer */}
        <div className="absolute bottom-12 w-full h-2 flex">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                background: i % 3 === 0 ? '#228B22' : i % 3 === 1 ? '#2E8B2E' : '#1E7B1E',
                borderTop: '1px solid #32CD32',
              }}
            />
          ))}
        </div>

        {/* Player - 16-bit sprite */}
        <div
          className={`absolute transition-all duration-75 ${player.isAttacking ? 'animate-pulse' : ''}`}
          style={{
            left: player.x,
            bottom: 220 - player.y - 60,
          }}
        >
          <PixelSprite 
            type="player" 
            size="lg"
            facingRight={player.facingRight}
            isAttacking={player.isAttacking}
            isBlocking={player.isBlocking}
          />
          {/* Equipped weapon indicator */}
          {equippedPrimary && (
            <div 
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs bg-black/50 px-1 rounded"
              style={{ fontSize: '10px' }}
            >
              {equippedPrimary.icon}
            </div>
          )}
        </div>

        {/* Boss - 16-bit sprite */}
        <div
          className={`absolute transition-all duration-200 ${bossAttacking ? 'animate-bounce' : ''}`}
          style={{
            right: 400 - bossX - 80,
            bottom: 14,
          }}
        >
          <PixelSprite 
            type="boss" 
            variant={boss.id}
            size="xl"
            isAttacking={bossAttacking}
          />
        </div>

        {/* Projectiles - pixel style */}
        {projectiles.map((proj, idx) => (
          <div
            key={idx}
            className="absolute flex items-center justify-center"
            style={{
              left: proj.x,
              bottom: 220 - proj.y - 20,
              width: '16px',
              height: '8px',
              background: proj.velocityX > 0 ? '#C0C0C0' : boss.color,
              border: '2px solid #000',
              transform: proj.velocityX < 0 ? 'scaleX(-1)' : 'none',
              imageRendering: 'pixelated',
            }}
          />
        ))}

        {/* Attack effect */}
        {bossAttacking && boss.attackType === 'melee' && (
          <div 
            className="absolute w-8 h-8 bg-yellow-400 border-2 border-black animate-ping"
            style={{ 
              right: 400 - bossX - 100, 
              bottom: 50,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          />
        )}
      </div>

      {/* Player HP Bar - 16-bit style */}
      <div className="mt-2 p-2 bg-black border-4 border-gray-600">
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-sm text-white">❤️ שחקן</span>
          <span className="text-xs font-bold text-green-400">{player.hp}/{player.maxHp}</span>
        </div>
        <div className="h-4 bg-gray-800 border-2 border-gray-600 overflow-hidden">
          <div 
            className={`h-full transition-all duration-200`}
            style={{ 
              width: `${playerHpPercentage}%`,
              background: playerHpPercentage < 30 
                ? 'repeating-linear-gradient(90deg, #ff4444 0px, #ff4444 4px, #ff6666 4px, #ff6666 8px)'
                : 'repeating-linear-gradient(90deg, #44ff44 0px, #44ff44 4px, #66ff66 4px, #66ff66 8px)',
            }}
          />
        </div>
      </div>

      {/* Mobile Controls - 16-bit style */}
      <div className="mt-3 flex justify-between items-center">
        {/* D-Pad style movement */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleJumpButton}
            className="w-10 h-10 bg-gray-700 border-4 border-black text-white text-lg font-black 
                     active:bg-gray-900 shadow-[2px_2px_0_#000]"
            style={{ imageRendering: 'pixelated' }}
          >
            ▲
          </button>
          <div className="flex gap-1">
            <button
              onTouchStart={() => handleLeftButton(true)}
              onTouchEnd={() => handleLeftButton(false)}
              onMouseDown={() => handleLeftButton(true)}
              onMouseUp={() => handleLeftButton(false)}
              className="w-10 h-10 bg-gray-700 border-4 border-black text-white text-lg font-black 
                       active:bg-gray-900 shadow-[2px_2px_0_#000]"
            >
              ◀
            </button>
            <button
              onTouchStart={() => handleRightButton(true)}
              onTouchEnd={() => handleRightButton(false)}
              onMouseDown={() => handleRightButton(true)}
              onMouseUp={() => handleRightButton(false)}
              className="w-10 h-10 bg-gray-700 border-4 border-black text-white text-lg font-black 
                       active:bg-gray-900 shadow-[2px_2px_0_#000]"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onTouchStart={() => handleBlockButton(true)}
            onTouchEnd={() => handleBlockButton(false)}
            onMouseDown={() => handleBlockButton(true)}
            onMouseUp={() => handleBlockButton(false)}
            disabled={!equippedSecondary || equippedSecondary.type !== 'shield'}
            className="w-14 h-14 bg-blue-600 border-4 border-black text-xl 
                     active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-[3px_3px_0_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          >
            🛡️
          </button>
          <button
            onClick={handleAttackButton}
            className="w-14 h-14 bg-red-500 border-4 border-black text-xl font-black 
                     active:bg-red-700
                     shadow-[3px_3px_0_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
          >
            {equippedPrimary?.type === 'bow' ? (
              <span className="text-sm">🏹{arrowCount}</span>
            ) : (
              '⚔️'
            )}
          </button>
        </div>
      </div>

      {/* Controls hint */}
      <div className="text-center text-xs text-gray-400 mt-2 font-bold" style={{ fontFamily: 'monospace' }}>
        [WASD/חיצים] תנועה | [רווח] התקפה | [SHIFT] הגנה
      </div>
    </div>
  );
};
