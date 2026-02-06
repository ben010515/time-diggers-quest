import React, { useEffect, useRef } from 'react';
import { Boss, BossPlayer, WEAPON_GRADES, Weapon } from '@/data/bossGameData';

interface BossBattleArenaProps {
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

export const BossBattleArena: React.FC<BossBattleArenaProps> = ({
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
  const arenaRef = useRef<HTMLDivElement>(null);

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
      {/* Boss HP Bar */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-sm">{boss.name} {boss.icon}</span>
          <span className="text-xs font-bold">{bossHp}/{boss.hp}</span>
        </div>
        <div className="h-4 bg-gray-300 border-2 border-black overflow-hidden">
          <div 
            className="h-full transition-all duration-200"
            style={{ 
              width: `${hpPercentage}%`,
              backgroundColor: boss.color 
            }}
          />
        </div>
      </div>

      {/* Arena */}
      <div 
        ref={arenaRef}
        className="relative border-4 border-black overflow-hidden"
        style={{ 
          height: '200px', 
          width: '100%',
          background: `linear-gradient(180deg, #87CEEB 0%, #87CEEB 60%, ${boss.color}33 100%)`,
        }}
      >
        {/* Ground */}
        <div 
          className="absolute bottom-0 w-full h-12"
          style={{ backgroundColor: boss.color, opacity: 0.5 }}
        />

        {/* Player */}
        <div
          className={`absolute transition-transform duration-100 ${player.isAttacking ? 'scale-110' : ''}`}
          style={{
            left: player.x,
            bottom: 200 - player.y - 50,
            transform: `scaleX(${player.facingRight ? 1 : -1})`,
          }}
        >
          <div className="text-4xl">🧑</div>
          {player.isBlocking && equippedSecondary && (
            <div className="absolute -left-2 top-2 text-2xl">{equippedSecondary.icon}</div>
          )}
          {player.isAttacking && equippedPrimary && (
            <div className="absolute -right-4 top-0 text-2xl animate-pulse">{equippedPrimary.icon}</div>
          )}
        </div>

        {/* Boss */}
        <div
          className={`absolute transition-all duration-200 ${bossAttacking ? 'scale-110 animate-pulse' : ''}`}
          style={{
            right: 400 - bossX - 60,
            bottom: 12,
          }}
        >
          <div className="text-5xl">{boss.icon}</div>
        </div>

        {/* Projectiles */}
        {projectiles.map((proj, idx) => (
          <div
            key={idx}
            className="absolute text-2xl"
            style={{
              left: proj.x,
              bottom: 200 - proj.y - 20,
              transform: proj.velocityX < 0 ? 'scaleX(-1)' : 'none',
            }}
          >
            {proj.icon}
          </div>
        ))}

        {/* Boss attack indicator */}
        {bossAttacking && boss.attackType === 'melee' && (
          <div 
            className="absolute text-3xl animate-ping"
            style={{ right: 400 - bossX - 80, bottom: 40 }}
          >
            💥
          </div>
        )}
      </div>

      {/* Player HP Bar */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-sm">❤️ חיים</span>
          <span className="text-xs font-bold">{player.hp}/{player.maxHp}</span>
        </div>
        <div className="h-4 bg-gray-300 border-2 border-black overflow-hidden">
          <div 
            className={`h-full transition-all duration-200 ${playerHpPercentage < 30 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${playerHpPercentage}%` }}
          />
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 flex justify-between items-center">
        {/* Movement */}
        <div className="flex gap-2">
          <button
            onTouchStart={() => handleLeftButton(true)}
            onTouchEnd={() => handleLeftButton(false)}
            onMouseDown={() => handleLeftButton(true)}
            onMouseUp={() => handleLeftButton(false)}
            className="w-12 h-12 bg-gray-700 text-white border-4 border-black text-2xl font-black active:bg-gray-900"
          >
            ←
          </button>
          <button
            onTouchStart={() => handleRightButton(true)}
            onTouchEnd={() => handleRightButton(false)}
            onMouseDown={() => handleRightButton(true)}
            onMouseUp={() => handleRightButton(false)}
            className="w-12 h-12 bg-gray-700 text-white border-4 border-black text-2xl font-black active:bg-gray-900"
          >
            →
          </button>
          <button
            onClick={handleJumpButton}
            className="w-12 h-12 bg-blue-500 text-white border-4 border-black text-2xl font-black active:bg-blue-700"
          >
            ↑
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onTouchStart={() => handleBlockButton(true)}
            onTouchEnd={() => handleBlockButton(false)}
            onMouseDown={() => handleBlockButton(true)}
            onMouseUp={() => handleBlockButton(false)}
            className="w-12 h-12 bg-blue-600 text-white border-4 border-black text-xl active:bg-blue-800"
            disabled={!equippedSecondary || equippedSecondary.type !== 'shield'}
          >
            🛡️
          </button>
          <button
            onClick={handleAttackButton}
            className="w-16 h-12 bg-red-500 text-white border-4 border-black text-xl font-black active:bg-red-700"
          >
            {equippedPrimary?.type === 'bow' ? `🏹${arrowCount}` : '⚔️'}
          </button>
        </div>
      </div>

      {/* Controls hint */}
      <div className="text-center text-xs text-gray-600 mt-2">
        מחשב: WASD/חצים לתנועה | רווח להתקפה | Shift להגנה
      </div>
    </div>
  );
};
