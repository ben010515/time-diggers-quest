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

const GROUND_Y = 180; // Must match useBossGame

// Background themes for each boss
const getBossBackground = (bossId: string) => {
  const backgrounds: Record<string, { sky: string; ground: string; groundAccent: string; grass?: string }> = {
    sand_boss: { 
      sky: 'linear-gradient(180deg, #87CEEB 0%, #F4D03F 50%, #DEB887 100%)', 
      ground: '#F4D03F', 
      groundAccent: '#DEB887',
    },
    wood_boss: { 
      sky: 'linear-gradient(180deg, #228B22 0%, #2E8B2E 50%, #1E7B1E 100%)', 
      ground: '#8B4513', 
      groundAccent: '#654321',
      grass: '#228B22',
    },
    stone_boss: { 
      sky: 'linear-gradient(180deg, #708090 0%, #A9A9A9 50%, #808080 100%)', 
      ground: '#696969', 
      groundAccent: '#808080',
    },
    coal_boss: { 
      sky: 'linear-gradient(180deg, #1a1a1a 0%, #2C3E50 50%, #1a1a2e 100%)', 
      ground: '#2F2F2F', 
      groundAccent: '#1a1a1a',
    },
    clay_boss: { 
      sky: 'linear-gradient(180deg, #DEB887 0%, #CD853F 50%, #A0522D 100%)', 
      ground: '#CD853F', 
      groundAccent: '#8B4513',
    },
    iron_boss: { 
      sky: 'linear-gradient(180deg, #A9A9A9 0%, #C0C0C0 50%, #D3D3D3 100%)', 
      ground: '#808080', 
      groundAccent: '#A9A9A9',
    },
    gold_boss: { 
      sky: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)', 
      ground: '#DAA520', 
      groundAccent: '#B8860B',
    },
    bone_boss: { 
      sky: 'linear-gradient(180deg, #2F2F2F 0%, #483D8B 50%, #1a1a2e 100%)', 
      ground: '#FFFAF0', 
      groundAccent: '#F5F5DC',
    },
    magma_boss: { 
      sky: 'linear-gradient(180deg, #8B0000 0%, #FF4500 50%, #FF6347 100%)', 
      ground: '#2F2F2F', 
      groundAccent: '#FF4500',
    },
    diamond_dragon: { 
      sky: 'linear-gradient(180deg, #00CED1 0%, #00FFFF 30%, #E0FFFF 60%, #87CEEB 100%)', 
      ground: '#00CED1', 
      groundAccent: '#00FFFF',
    },
  };
  return backgrounds[bossId] || backgrounds.sand_boss;
};

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
  const bossTheme = getBossBackground(boss.id);

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

      {/* Arena - 16-bit platformer style with boss-specific background */}
      <div 
        className="relative border-4 border-black overflow-hidden"
        style={{ 
          height: '220px', 
          width: '100%',
          imageRendering: 'pixelated',
          background: bossTheme.sky,
        }}
      >
        {/* Decorative elements based on boss */}
        {boss.id === 'sand_boss' && (
          <>
            {/* Sand dunes */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  bottom: 48,
                  left: `${i * 25}%`,
                  width: '60px',
                  height: '30px',
                  background: '#DEB887',
                  borderRadius: '50% 50% 0 0',
                  opacity: 0.7,
                }}
              />
            ))}
            {/* Sun */}
            <div 
              className="absolute"
              style={{
                top: '10px',
                right: '20px',
                width: '40px',
                height: '40px',
                background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
                borderRadius: '50%',
                boxShadow: '0 0 20px #FFD700',
              }}
            />
          </>
        )}
        
        {boss.id === 'magma_boss' && (
          <>
            {/* Lava bubbles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  bottom: 48 + (i % 3) * 10,
                  left: `${(i * 15) % 100}%`,
                  width: '10px',
                  height: '10px',
                  background: '#FF4500',
                  borderRadius: '50%',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Ground - pixel blocks with boss theme */}
        <div className="absolute bottom-0 w-full h-12 flex">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border-t-2 border-l border-black/20"
              style={{
                background: i % 2 === 0 
                  ? bossTheme.ground
                  : bossTheme.groundAccent,
              }}
            />
          ))}
        </div>

        {/* Grass layer (if applicable) */}
        {bossTheme.grass && (
          <div className="absolute bottom-12 w-full h-2 flex">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  background: bossTheme.grass,
                  borderTop: '1px solid #32CD32',
                }}
              />
            ))}
          </div>
        )}

        {/* Player - 16-bit sprite */}
        <div
          className={`absolute transition-all duration-75 ${player.isAttacking ? 'scale-110' : ''} ${player.isBlocking ? 'brightness-150' : ''}`}
          style={{
            left: player.x,
            bottom: 14 + Math.max(0, (GROUND_Y - player.y)),
            zIndex: 10,
          }}
        >
          <PixelSprite 
            type="player" 
            size="lg"
            facingRight={player.facingRight}
            isAttacking={player.isAttacking}
            isBlocking={player.isBlocking}
            equippedPrimary={equippedPrimary}
            equippedSecondary={equippedSecondary}
          />
          
          {/* Player attack effect */}
          {player.isAttacking && (
            <div 
              className="absolute animate-ping"
              style={{
                left: player.facingRight ? '100%' : '-30px',
                top: '30%',
                width: '30px',
                height: '30px',
                background: equippedPrimary 
                  ? 'radial-gradient(circle, #ffff00 0%, #ff8800 50%, transparent 70%)'
                  : 'radial-gradient(circle, #ffcc00 0%, #ff6600 50%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 15,
              }}
            />
          )}
          
          {/* Block effect */}
          {player.isBlocking && equippedSecondary && (
            <div 
              className="absolute animate-pulse"
              style={{
                left: player.facingRight ? '-10px' : '100%',
                top: '20%',
                fontSize: '24px',
                filter: 'drop-shadow(0 0 5px #00aaff)',
              }}
            >
              🛡️
            </div>
          )}
        </div>

        {/* Boss - 16-bit sprite with animations */}
        <div
          className={`absolute transition-all duration-200 ${bossAttacking ? 'boss-attack-animation' : 'boss-idle-animation'}`}
          style={{
            left: bossX,
            bottom: 14,
            zIndex: 10,
            animation: bossAttacking 
              ? 'bossAttack 0.3s ease-in-out' 
              : 'bossIdle 2s ease-in-out infinite',
          }}
        >
          <PixelSprite 
            type="boss" 
            variant={boss.id}
            size="xl"
            isAttacking={bossAttacking}
          />
          
          {/* Boss attack effect - different per attack type */}
          {bossAttacking && boss.attackType === 'melee' && (
            <div 
              className="absolute"
              style={{
                right: '80%',
                top: '20%',
                width: '60px',
                height: '60px',
                background: `radial-gradient(circle, ${boss.color} 0%, transparent 70%)`,
                borderRadius: '50%',
                animation: 'meleeSwing 0.3s ease-out',
                zIndex: 15,
              }}
            />
          )}
          
          {bossAttacking && boss.attackType === 'ranged' && (
            <div 
              className="absolute animate-pulse"
              style={{
                right: '60%',
                top: '40%',
                fontSize: '24px',
                filter: `drop-shadow(0 0 10px ${boss.color})`,
                animation: 'rangedCharge 0.3s ease-out',
              }}
            >
              {boss.projectileIcon}
            </div>
          )}
          
          {bossAttacking && boss.attackType === 'jump' && (
            <div 
              className="absolute"
              style={{
                left: '50%',
                bottom: '-20px',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '20px',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
                animation: 'jumpShadow 0.3s ease-out',
              }}
            />
          )}
        </div>
        
        {/* Boss damage indicator */}
        <style>{`
          @keyframes bossIdle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes bossAttack {
            0% { transform: translateX(0) scale(1); }
            50% { transform: translateX(-20px) scale(1.15); }
            100% { transform: translateX(0) scale(1); }
          }
          @keyframes meleeSwing {
            0% { transform: rotate(0deg) scale(0); opacity: 1; }
            100% { transform: rotate(-45deg) scale(1.5); opacity: 0; }
          }
          @keyframes rangedCharge {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes jumpShadow {
            0% { transform: translateX(-50%) scale(0.5); }
            50% { transform: translateX(-50%) scale(1.5); }
            100% { transform: translateX(-50%) scale(1); }
          }
        `}</style>

        {/* Projectiles - pixel style */}
        {projectiles.map((proj, idx) => (
          <div
            key={idx}
            className="absolute flex items-center justify-center animate-pulse"
            style={{
              left: proj.x,
              bottom: 14 + Math.max(0, (GROUND_Y - proj.y)),
              width: proj.velocityX > 0 ? '20px' : '24px',
              height: proj.velocityX > 0 ? '8px' : '16px',
              background: proj.velocityX > 0 
                ? 'linear-gradient(90deg, #888 0%, #C0C0C0 50%, #fff 100%)'
                : `linear-gradient(270deg, ${boss.color} 0%, ${boss.color}cc 100%)`,
              border: '2px solid #000',
              borderRadius: proj.velocityX > 0 ? '2px 8px 8px 2px' : '50%',
              boxShadow: `0 0 8px ${proj.velocityX > 0 ? '#888' : boss.color}`,
              zIndex: 20,
            }}
          >
            <span style={{ fontSize: '10px' }}>{proj.icon}</span>
          </div>
        ))}

        {/* Melee attack shockwave from boss */}
        {bossAttacking && boss.attackType === 'melee' && (
          <div 
            className="absolute"
            style={{ 
              left: bossX - 60, 
              bottom: 14,
              width: '70px',
              height: '70px',
              background: `radial-gradient(circle, ${boss.color}88 0%, transparent 70%)`,
              borderRadius: '50%',
              animation: 'meleeSwing 0.3s ease-out',
              zIndex: 15,
            }}
          />
        )}
        
        {/* Jump attack landing effect */}
        {bossAttacking && boss.attackType === 'jump' && (
          <div 
            className="absolute"
            style={{ 
              left: bossX - 20, 
              bottom: 10,
              width: '120px',
              height: '20px',
              background: 'radial-gradient(ellipse, rgba(255,100,0,0.6) 0%, transparent 70%)',
              animation: 'jumpShadow 0.5s ease-out',
              zIndex: 15,
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
