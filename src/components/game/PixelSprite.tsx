import React from 'react';
import { Weapon, WEAPON_GRADES } from '@/data/bossGameData';

interface PixelSpriteProps {
  type: 'player' | 'boss';
  variant?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  facingRight?: boolean;
  isAttacking?: boolean;
  isBlocking?: boolean;
  className?: string;
  equippedPrimary?: Weapon | null;
  equippedSecondary?: Weapon | null;
}

// 16-bit style sprite patterns using CSS
export const PixelSprite: React.FC<PixelSpriteProps> = ({
  type,
  variant = 'default',
  size = 'md',
  facingRight = true,
  isAttacking = false,
  isBlocking = false,
  className = '',
  equippedPrimary = null,
  equippedSecondary = null,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80,
  };

  const getBossSprite = (bossId: string) => {
    const sprites: Record<string, { body: string; eye: string; accent: string }> = {
      sand_boss: { body: '#DEB887', eye: '#8B4513', accent: '#F4A460' },
      wood_boss: { body: '#8B4513', eye: '#2F1810', accent: '#A0522D' },
      stone_boss: { body: '#808080', eye: '#2F2F2F', accent: '#A9A9A9' },
      coal_boss: { body: '#2F2F2F', eye: '#FF4500', accent: '#1A1A1A' },
      clay_boss: { body: '#CD853F', eye: '#8B4513', accent: '#D2691E' },
      iron_boss: { body: '#C0C0C0', eye: '#4169E1', accent: '#A9A9A9' },
      gold_boss: { body: '#FFD700', eye: '#FF6347', accent: '#FFA500' },
      bone_boss: { body: '#FFFAF0', eye: '#FF0000', accent: '#F5F5DC' },
      magma_boss: { body: '#FF4500', eye: '#FFFF00', accent: '#8B0000' },
      diamond_dragon: { body: '#00CED1', eye: '#FF1493', accent: '#00FFFF' },
    };
    return sprites[bossId] || sprites.sand_boss;
  };

  const getWeaponColor = (weapon: Weapon | null) => {
    if (!weapon) return '#888';
    return WEAPON_GRADES[weapon.grade]?.color || '#888';
  };

  if (type === 'player') {
    const weaponColor = getWeaponColor(equippedPrimary);
    const shieldColor = getWeaponColor(equippedSecondary);
    const spriteSize = sizePixels[size];
    
    return (
      <div 
        className={`relative ${sizeClasses[size]} ${className}`}
        style={{ 
          transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)',
          imageRendering: 'pixelated',
        }}
      >
        {/* Player body - 16-bit knight style */}
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Helmet */}
          <rect x="4" y="0" width="8" height="3" fill="#708090" />
          <rect x="5" y="3" width="6" height="2" fill="#708090" />
          {/* Face visor */}
          <rect x="6" y="3" width="4" height="1" fill="#2F2F2F" />
          {/* Body armor */}
          <rect x="4" y="5" width="8" height="5" fill="#4682B4" />
          <rect x="5" y="5" width="1" height="4" fill="#87CEEB" />
          {/* Arms */}
          <rect x="2" y="5" width="2" height="4" fill="#4682B4" />
          <rect x="12" y="5" width="2" height="4" fill="#4682B4" />
          {/* Legs */}
          <rect x="5" y="10" width="2" height="4" fill="#4682B4" />
          <rect x="9" y="10" width="2" height="4" fill="#4682B4" />
          {/* Boots */}
          <rect x="4" y="14" width="3" height="2" fill="#8B4513" />
          <rect x="9" y="14" width="3" height="2" fill="#8B4513" />
          
          {/* Weapon in right hand */}
          {equippedPrimary && equippedPrimary.type === 'sword' && (
            <>
              {/* Sword blade */}
              <rect x="14" y={isAttacking ? 0 : 2} width="2" height={isAttacking ? 10 : 8} fill={weaponColor} />
              <rect x="14" y={isAttacking ? 0 : 2} width="1" height={isAttacking ? 10 : 8} fill="#fff" fillOpacity="0.3" />
              {/* Sword handle */}
              <rect x="13" y={isAttacking ? 8 : 6} width="4" height="2" fill="#8B4513" />
            </>
          )}
          {equippedPrimary && equippedPrimary.type === 'spear' && (
            <>
              {/* Spear shaft */}
              <rect x="14" y={isAttacking ? -2 : 0} width="1" height="12" fill="#8B4513" />
              {/* Spear head */}
              <polygon points={isAttacking ? "14,-2 15,-2 14.5,-5" : "14,0 15,0 14.5,-3"} fill={weaponColor} />
            </>
          )}
          {equippedPrimary && equippedPrimary.type === 'bow' && (
            <>
              {/* Bow */}
              <path d="M14,2 Q18,8 14,14" stroke={weaponColor} strokeWidth="1" fill="none" />
              <line x1="14" y1="2" x2="14" y2="14" stroke="#8B4513" strokeWidth="0.5" />
            </>
          )}
          {/* Fist indicator when no weapon */}
          {!equippedPrimary && isAttacking && (
            <circle cx="15" cy="7" r="2" fill="#FFD700" />
          )}
          
          {/* Shield in left hand */}
          {equippedSecondary && equippedSecondary.type === 'shield' && (
            <>
              <rect x={isBlocking ? -2 : 0} y="4" width="4" height="6" fill={shieldColor} />
              <rect x={isBlocking ? -1 : 1} y="5" width="2" height="4" fill="#fff" fillOpacity="0.3" />
              <rect x={isBlocking ? -1 : 1} y="6" width="2" height="2" fill={shieldColor} />
            </>
          )}
        </svg>
        
        {/* Weapon icon label */}
        {equippedPrimary && (
          <div 
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
            style={{ fontSize: spriteSize * 0.25, filter: 'drop-shadow(1px 1px 0 #000)' }}
          >
            {equippedPrimary.icon}
          </div>
        )}
      </div>
    );
  }

  // Boss sprite - unique scary designs for each
  const colors = getBossSprite(variant);

  // Sand Boss - Desert Golem
  if (variant === 'sand_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Sandy body with cracks */}
          <rect x="3" y="3" width="10" height="11" fill="#DEB887" />
          <rect x="4" y="2" width="8" height="2" fill="#F4D03F" />
          {/* Angry glowing eyes */}
          <rect x="4" y="5" width="3" height="3" fill="#000" />
          <rect x="9" y="5" width="3" height="3" fill="#000" />
          <rect x="5" y="6" width="1" height="1" fill="#FF0000" />
          <rect x="10" y="6" width="1" height="1" fill="#FF0000" />
          {/* Jagged mouth */}
          <rect x="5" y="10" width="6" height="2" fill="#000" />
          <rect x="6" y="10" width="1" height="1" fill="#F4D03F" />
          <rect x="9" y="10" width="1" height="1" fill="#F4D03F" />
          {/* Sand particles */}
          <rect x="2" y="8" width="1" height="1" fill="#DEB887" className="animate-pulse" />
          <rect x="13" y="6" width="1" height="1" fill="#DEB887" className="animate-pulse" />
          {/* Claws */}
          <rect x="1" y="7" width="2" height="5" fill="#C4A35A" />
          <rect x="13" y="7" width="2" height="5" fill="#C4A35A" />
        </svg>
      </div>
    );
  }

  // Wood Boss - Evil Tree Monster
  if (variant === 'wood_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Trunk body */}
          <rect x="4" y="4" width="8" height="10" fill="#654321" />
          <rect x="5" y="4" width="2" height="10" fill="#8B4513" />
          {/* Scary face carved in trunk */}
          <rect x="5" y="6" width="2" height="2" fill="#2F0000" />
          <rect x="9" y="6" width="2" height="2" fill="#2F0000" />
          <rect x="5" y="6" width="1" height="1" fill="#00FF00" />
          <rect x="10" y="6" width="1" height="1" fill="#00FF00" />
          {/* Mouth with fangs */}
          <rect x="5" y="10" width="6" height="3" fill="#2F0000" />
          <rect x="6" y="10" width="1" height="2" fill="#FFFACD" />
          <rect x="9" y="10" width="1" height="2" fill="#FFFACD" />
          {/* Branch arms */}
          <rect x="0" y="5" width="4" height="2" fill="#654321" />
          <rect x="12" y="5" width="4" height="2" fill="#654321" />
          <rect x="0" y="4" width="1" height="2" fill="#228B22" />
          <rect x="15" y="4" width="1" height="2" fill="#228B22" />
          {/* Roots */}
          <rect x="3" y="14" width="2" height="2" fill="#3D2914" />
          <rect x="11" y="14" width="2" height="2" fill="#3D2914" />
        </svg>
      </div>
    );
  }

  // Stone Boss - Rock Golem
  if (variant === 'stone_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Rocky body */}
          <rect x="2" y="3" width="12" height="11" fill="#696969" />
          <rect x="4" y="2" width="8" height="2" fill="#808080" />
          <rect x="3" y="4" width="3" height="3" fill="#A9A9A9" />
          <rect x="10" y="7" width="2" height="2" fill="#A9A9A9" />
          {/* Glowing crystal eyes */}
          <rect x="4" y="5" width="3" height="3" fill="#000" />
          <rect x="9" y="5" width="3" height="3" fill="#000" />
          <rect x="5" y="6" width="1" height="1" fill="#FF00FF" />
          <rect x="10" y="6" width="1" height="1" fill="#FF00FF" />
          {/* Cracked mouth */}
          <rect x="5" y="10" width="6" height="2" fill="#2F2F2F" />
          {/* Stone fists */}
          <rect x="0" y="6" width="3" height="4" fill="#808080" />
          <rect x="13" y="6" width="3" height="4" fill="#808080" />
        </svg>
      </div>
    );
  }

  // Coal Boss - Shadow Demon
  if (variant === 'coal_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Dark smoky body */}
          <rect x="3" y="2" width="10" height="12" fill="#1a1a1a" />
          <rect x="2" y="4" width="12" height="8" fill="#2C3E50" />
          {/* Burning ember eyes */}
          <rect x="4" y="5" width="3" height="3" fill="#FF4500" />
          <rect x="9" y="5" width="3" height="3" fill="#FF4500" />
          <rect x="5" y="6" width="1" height="1" fill="#FFFF00" />
          <rect x="10" y="6" width="1" height="1" fill="#FFFF00" />
          {/* Fire mouth */}
          <rect x="5" y="10" width="6" height="3" fill="#FF4500" />
          <rect x="6" y="10" width="1" height="2" fill="#FFFF00" />
          <rect x="9" y="10" width="1" height="2" fill="#FFFF00" />
          {/* Smoke wisps */}
          <rect x="2" y="2" width="1" height="2" fill="#4a4a4a" className="animate-pulse" />
          <rect x="13" y="3" width="1" height="2" fill="#4a4a4a" className="animate-pulse" />
        </svg>
      </div>
    );
  }

  // Clay Boss - Ancient Golem
  if (variant === 'clay_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Clay body */}
          <rect x="3" y="3" width="10" height="11" fill="#CD853F" />
          <rect x="4" y="2" width="8" height="2" fill="#D2691E" />
          {/* Cracked pattern */}
          <rect x="5" y="4" width="1" height="8" fill="#8B4513" />
          <rect x="10" y="5" width="1" height="6" fill="#8B4513" />
          {/* Empty hollow eyes */}
          <rect x="4" y="5" width="3" height="3" fill="#2F1810" />
          <rect x="9" y="5" width="3" height="3" fill="#2F1810" />
          <rect x="5" y="6" width="1" height="1" fill="#8B0000" />
          <rect x="10" y="6" width="1" height="1" fill="#8B0000" />
          {/* Mouth */}
          <rect x="5" y="10" width="6" height="2" fill="#2F1810" />
          {/* Arms */}
          <rect x="1" y="6" width="2" height="5" fill="#CD853F" />
          <rect x="13" y="6" width="2" height="5" fill="#CD853F" />
        </svg>
      </div>
    );
  }

  // Iron Boss - Armored Knight
  if (variant === 'iron_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Helmet */}
          <rect x="3" y="1" width="10" height="5" fill="#C0C0C0" />
          <rect x="4" y="0" width="8" height="2" fill="#A9A9A9" />
          {/* Visor slits (eyes) */}
          <rect x="4" y="3" width="3" height="1" fill="#000" />
          <rect x="9" y="3" width="3" height="1" fill="#000" />
          <rect x="5" y="3" width="1" height="1" fill="#FF0000" />
          <rect x="10" y="3" width="1" height="1" fill="#FF0000" />
          {/* Armor body */}
          <rect x="3" y="6" width="10" height="8" fill="#808080" />
          <rect x="5" y="7" width="6" height="5" fill="#C0C0C0" />
          {/* Sword */}
          <rect x="14" y="4" width="2" height="8" fill="#E8E8E8" />
          <rect x="13" y="8" width="4" height="2" fill="#8B4513" />
          {/* Shield */}
          <rect x="0" y="6" width="3" height="5" fill="#C0C0C0" />
          <rect x="1" y="7" width="1" height="3" fill="#FFD700" />
        </svg>
      </div>
    );
  }

  // Gold Boss - Treasure King
  if (variant === 'gold_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Crown */}
          <rect x="3" y="0" width="10" height="3" fill="#FFD700" />
          <rect x="4" y="0" width="2" height="1" fill="#FF0000" />
          <rect x="10" y="0" width="2" height="1" fill="#0000FF" />
          <rect x="7" y="0" width="2" height="1" fill="#00FF00" />
          {/* Golden body */}
          <rect x="3" y="3" width="10" height="11" fill="#DAA520" />
          <rect x="4" y="4" width="8" height="8" fill="#FFD700" />
          {/* Greedy eyes */}
          <rect x="4" y="5" width="3" height="3" fill="#000" />
          <rect x="9" y="5" width="3" height="3" fill="#000" />
          <rect x="5" y="6" width="1" height="1" fill="#00FF00" />
          <rect x="10" y="6" width="1" height="1" fill="#00FF00" />
          {/* Evil grin */}
          <rect x="5" y="10" width="6" height="2" fill="#000" />
          <rect x="6" y="10" width="4" height="1" fill="#FFD700" />
        </svg>
      </div>
    );
  }

  // Bone Boss - Skeleton Lord
  if (variant === 'bone_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Skull */}
          <rect x="3" y="1" width="10" height="7" fill="#FFFAF0" />
          <rect x="4" y="0" width="8" height="2" fill="#F5F5DC" />
          {/* Empty eye sockets */}
          <rect x="4" y="3" width="3" height="3" fill="#000" />
          <rect x="9" y="3" width="3" height="3" fill="#000" />
          <rect x="5" y="4" width="1" height="1" fill="#FF0000" />
          <rect x="10" y="4" width="1" height="1" fill="#FF0000" />
          {/* Nose hole */}
          <rect x="7" y="5" width="2" height="2" fill="#2F2F2F" />
          {/* Teeth */}
          <rect x="5" y="7" width="6" height="2" fill="#000" />
          <rect x="5" y="7" width="1" height="1" fill="#FFFAF0" />
          <rect x="7" y="7" width="1" height="1" fill="#FFFAF0" />
          <rect x="9" y="7" width="1" height="1" fill="#FFFAF0" />
          {/* Ribcage body */}
          <rect x="4" y="9" width="8" height="5" fill="#2F2F2F" />
          <rect x="5" y="10" width="1" height="3" fill="#FFFAF0" />
          <rect x="7" y="10" width="1" height="3" fill="#FFFAF0" />
          <rect x="9" y="10" width="1" height="3" fill="#FFFAF0" />
          {/* Bone arms */}
          <rect x="1" y="9" width="3" height="1" fill="#FFFAF0" />
          <rect x="12" y="9" width="3" height="1" fill="#FFFAF0" />
          <rect x="0" y="10" width="2" height="4" fill="#FFFAF0" />
          <rect x="14" y="10" width="2" height="4" fill="#FFFAF0" />
        </svg>
      </div>
    );
  }

  // Magma Boss - Lava Demon
  if (variant === 'magma_boss') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 16 16" className="w-full h-full">
          {/* Volcanic body */}
          <rect x="3" y="3" width="10" height="11" fill="#8B0000" />
          <rect x="4" y="2" width="8" height="2" fill="#FF4500" />
          {/* Lava cracks */}
          <rect x="5" y="5" width="1" height="6" fill="#FF6600" />
          <rect x="10" y="4" width="1" height="7" fill="#FF6600" />
          <rect x="7" y="8" width="2" height="1" fill="#FFFF00" />
          {/* Burning eyes */}
          <rect x="4" y="5" width="3" height="3" fill="#FFFF00" />
          <rect x="9" y="5" width="3" height="3" fill="#FFFF00" />
          <rect x="5" y="6" width="1" height="1" fill="#FF0000" />
          <rect x="10" y="6" width="1" height="1" fill="#FF0000" />
          {/* Fire mouth */}
          <rect x="5" y="10" width="6" height="3" fill="#FFFF00" />
          <rect x="6" y="11" width="1" height="2" fill="#FF4500" />
          <rect x="9" y="11" width="1" height="2" fill="#FF4500" />
          {/* Flame horns */}
          <rect x="3" y="0" width="2" height="3" fill="#FF4500" />
          <rect x="11" y="0" width="2" height="3" fill="#FF4500" />
        </svg>
      </div>
    );
  }

  // Diamond Dragon - Ultimate Boss
  if (variant === 'diamond_dragon') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
        <svg viewBox="0 0 24 20" className="w-full h-full">
          {/* Dragon head */}
          <rect x="16" y="2" width="6" height="5" fill="#00CED1" />
          <rect x="18" y="0" width="4" height="3" fill="#00FFFF" />
          {/* Glowing eyes */}
          <rect x="18" y="3" width="2" height="2" fill="#FF1493" />
          <rect x="19" y="3" width="1" height="1" fill="#FFFFFF" />
          {/* Fire breath mouth */}
          <rect x="22" y="4" width="2" height="3" fill="#FF4500" />
          {/* Neck */}
          <rect x="12" y="4" width="5" height="5" fill="#00CED1" />
          {/* Body with crystal pattern */}
          <rect x="3" y="6" width="12" height="9" fill="#00CED1" />
          <rect x="5" y="8" width="2" height="2" fill="#00FFFF" />
          <rect x="9" y="7" width="2" height="3" fill="#00FFFF" />
          <rect x="12" y="9" width="2" height="2" fill="#00FFFF" />
          {/* Wings */}
          <rect x="7" y="0" width="5" height="7" fill="#E0FFFF" />
          <rect x="3" y="2" width="4" height="5" fill="#E0FFFF" />
          <rect x="4" y="3" width="1" height="3" fill="#00FFFF" />
          {/* Tail with spike */}
          <rect x="0" y="10" width="4" height="2" fill="#00CED1" />
          <rect x="0" y="8" width="2" height="3" fill="#00FFFF" />
          {/* Legs with claws */}
          <rect x="5" y="15" width="3" height="4" fill="#00CED1" />
          <rect x="12" y="15" width="3" height="4" fill="#00CED1" />
          <rect x="4" y="18" width="5" height="2" fill="#2F2F2F" />
          <rect x="11" y="18" width="5" height="2" fill="#2F2F2F" />
        </svg>
      </div>
    );
  }

  // Default monster (fallback)
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`} style={{ imageRendering: 'pixelated' }}>
      <svg viewBox="0 0 16 16" className="w-full h-full">
        <rect x="2" y="4" width="12" height="10" fill={colors.body} />
        <rect x="4" y="2" width="8" height="2" fill={colors.body} />
        <rect x="4" y="6" width="3" height="3" fill="white" />
        <rect x="9" y="6" width="3" height="3" fill="white" />
        <rect x="5" y="7" width="2" height="2" fill={colors.eye} />
        <rect x="10" y="7" width="2" height="2" fill={colors.eye} />
        <rect x="5" y="11" width="6" height="2" fill="#2F2F2F" />
        <rect x="0" y="6" width="2" height="6" fill={colors.body} />
        <rect x="14" y="6" width="2" height="6" fill={colors.body} />
        <rect x="3" y="14" width="4" height="2" fill={colors.body} />
        <rect x="9" y="14" width="4" height="2" fill={colors.body} />
      </svg>
    </div>
  );
};
