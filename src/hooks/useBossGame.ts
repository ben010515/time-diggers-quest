import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Boss, 
  BOSSES, 
  Weapon, 
  WEAPONS,
  BossDigCell, 
  BossPlayer, 
  BossShopItem,
  BOSS_SHOP_ITEMS,
  BOAZ_BEN_SWORD,
  getRandomWeapon 
} from '@/data/bossGameData';

export type BossGamePhase = 'dig' | 'battle' | 'victory' | 'defeat';

const GRID_SIZE = 5;
const BASE_DIG_SLOTS = 10;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 6;
const GROUND_Y = 180; // Lower ground so player is visible
const ARENA_WIDTH = 350; // Smaller arena so player can reach boss
const JUMP_COOLDOWN = 500; // ms between jumps

export const useBossGame = (sharedScore: number, setSharedScore: (score: number | ((prev: number) => number)) => void) => {
  // Game phase
  const [phase, setPhase] = useState<BossGamePhase>('dig');
  const [currentBossIndex, setCurrentBossIndex] = useState(0);
  
  // Dig phase state
  const [digGrid, setDigGrid] = useState<BossDigCell[][]>([]);
  const [digsRemaining, setDigsRemaining] = useState(BASE_DIG_SLOTS);
  const [extraDigs, setExtraDigs] = useState(0);
  const [luckBonus, setLuckBonus] = useState(0);
  
  // Inventory
  const [inventory, setInventory] = useState<Weapon[]>([]);
  const [equippedPrimary, setEquippedPrimary] = useState<Weapon | null>(null);
  const [equippedSecondary, setEquippedSecondary] = useState<Weapon | null>(null);
  const [arrowCount, setArrowCount] = useState(0);
  const [hasBoazBen, setHasBoazBen] = useState(false);
  
  // Player state
  const [player, setPlayer] = useState<BossPlayer>({
    x: 50,
    y: GROUND_Y,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    hp: 100,
    maxHp: 100,
    defense: 0,
    facingRight: true,
    isAttacking: false,
    isBlocking: false,
  });
  
  // Boss state
  const [bossHp, setBossHp] = useState(0);
  const [bossX, setBossX] = useState(ARENA_WIDTH - 80);
  const [bossAttacking, setBossAttacking] = useState(false);
  const [projectiles, setProjectiles] = useState<Array<{ x: number; y: number; velocityX: number; icon: string }>>([]);
  
  // Stats
  const [dragonHits, setDragonHits] = useState(0);
  const [defenseBonus, setDefenseBonus] = useState(0);
  
  // Input state
  const keysPressed = useRef<Set<string>>(new Set());
  const lastJumpTime = useRef<number>(0);
  
  const currentBoss = BOSSES[currentBossIndex];
  
  // Generate dig grid
  const generateDigGrid = useCallback(() => {
    const totalSlots = BASE_DIG_SLOTS + extraDigs;
    const grid: BossDigCell[][] = [];
    const itemPositions = new Set<string>();
    
    // Place items randomly
    while (itemPositions.size < totalSlots) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      itemPositions.add(`${r},${c}`);
    }
    
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: BossDigCell[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const hasItem = itemPositions.has(`${r},${c}`);
        row.push({
          hasItem,
          item: hasItem ? getRandomWeapon(luckBonus) : undefined,
          state: 'hidden',
          hitsRemaining: 2,
          maxHits: 2,
        });
      }
      grid.push(row);
    }
    
    setDigGrid(grid);
    setDigsRemaining(totalSlots);
  }, [extraDigs, luckBonus]);
  
  // Initialize game - RESET EVERYTHING
  const initBossGame = useCallback(() => {
    setCurrentBossIndex(0);
    setPhase('dig');
    setInventory([]);
    setEquippedPrimary(null);
    setEquippedSecondary(null);
    setArrowCount(0);
    setHasBoazBen(false); // Reset Boaz Ben so it can be bought again!
    setLuckBonus(0); // Reset luck
    setExtraDigs(0); // Reset extra digs
    setPlayer({
      x: 50,
      y: GROUND_Y,
      velocityX: 0,
      velocityY: 0,
      isJumping: false,
      hp: 100,
      maxHp: 100,
      defense: 0,
      facingRight: true,
      isAttacking: false,
      isBlocking: false,
    });
    setDefenseBonus(0);
    setDragonHits(0);
    generateDigGrid();
  }, [generateDigGrid]);
  
  // Handle dig cell click
  const handleDigClick = useCallback((r: number, c: number) => {
    if (phase !== 'dig' || digsRemaining <= 0) return;
    
    const cell = digGrid[r][c];
    if (cell.state === 'revealed') return;
    
    const newGrid = [...digGrid.map(row => [...row])];
    const newHits = cell.hitsRemaining - 1;
    
    if (newHits > 0) {
      newGrid[r][c] = { ...cell, hitsRemaining: newHits };
      setDigGrid(newGrid);
      return;
    }
    
    // Reveal cell - this counts as one dig regardless of content
    newGrid[r][c] = { ...cell, state: 'revealed', hitsRemaining: 0 };
    setDigGrid(newGrid);
    setDigsRemaining(prev => prev - 1);
    
    if (cell.hasItem && cell.item) {
      // Add to inventory
      if (cell.item.type === 'arrow') {
        setArrowCount(prev => prev + 5);
      } else {
        setInventory(prev => [...prev, cell.item!]);
      }
    }
  }, [phase, digGrid, digsRemaining]);
  
  // Start battle - reset player HP!
  const startBattle = useCallback(() => {
    setPhase('battle');
    setBossHp(currentBoss.hp);
    setBossX(ARENA_WIDTH - 60); // Boss on the right side
    setProjectiles([]);
    setPlayer(prev => ({
      ...prev,
      x: 30, // Player starts on the left
      y: GROUND_Y,
      velocityX: 0,
      velocityY: 0,
      isJumping: false,
      hp: prev.maxHp, // RESET HP to full!
      defense: defenseBonus + (equippedSecondary?.defense || 0),
    }));
  }, [currentBoss, defenseBonus, equippedSecondary]);
  
  // Equip weapon - returns old weapon to inventory
  const equipWeapon = useCallback((weapon: Weapon, slot: 'primary' | 'secondary') => {
    if (slot === 'primary') {
      // Return old equipped weapon to inventory
      if (equippedPrimary) {
        setInventory(prev => [...prev.filter(w => w.id !== weapon.id), equippedPrimary]);
      } else {
        setInventory(prev => prev.filter(w => w.id !== weapon.id));
      }
      setEquippedPrimary(weapon);
    } else {
      // Return old equipped weapon to inventory
      if (equippedSecondary) {
        setInventory(prev => [...prev.filter(w => w.id !== weapon.id), equippedSecondary]);
      } else {
        setInventory(prev => prev.filter(w => w.id !== weapon.id));
      }
      setEquippedSecondary(weapon);
    }
  }, [equippedPrimary, equippedSecondary]);
  
  // Attack boss (with weapon or fists)
  const attackBoss = useCallback(() => {
    if (phase !== 'battle') return;
    
    setPlayer(prev => ({ ...prev, isAttacking: true }));
    
    // Check if in range - fists have short range, weapons have longer
    const distance = Math.abs(player.x - bossX);
    const attackRange = equippedPrimary ? equippedPrimary.range : 60; // Fist range = 60
    const inRange = distance < attackRange;
    
    console.log('Attack! Distance:', distance, 'Range:', attackRange, 'In range:', inRange);
    
    if (inRange) {
      // Fist damage = 5, weapon damage = weapon.damage
      let damage = equippedPrimary ? equippedPrimary.damage : 5;
      
      // Check for Boaz Ben sword against dragon
      if (currentBoss.id === 'diamond_dragon' && equippedPrimary?.id === 'boaz_ben') {
        damage = 99999;
      }
      
      const newHp = bossHp - damage;
      setBossHp(Math.max(0, newHp));
      
      console.log('Hit! Damage:', damage, 'Boss HP:', newHp);
      
      if (currentBoss.id === 'diamond_dragon') {
        setDragonHits(prev => {
          const newHits = prev + 1;
          if (newHits % 10 === 0) {
            setSharedScore(s => s + 25);
          }
          return newHits;
        });
      }
      
      if (newHp <= 0) {
        // Boss defeated
        setSharedScore(s => s + currentBoss.reward);
        
        if (currentBossIndex < BOSSES.length - 1) {
          // Next boss
          setCurrentBossIndex(prev => prev + 1);
          setPhase('dig');
          generateDigGrid();
        } else {
          setPhase('victory');
        }
      }
    }
    
    setTimeout(() => {
      setPlayer(prev => ({ ...prev, isAttacking: false }));
    }, 300);
  }, [phase, equippedPrimary, player.x, bossX, bossHp, currentBoss, currentBossIndex, setSharedScore, generateDigGrid]);
  
  // Block with shield
  const block = useCallback((isBlocking: boolean) => {
    if (equippedSecondary?.type === 'shield') {
      setPlayer(prev => ({ ...prev, isBlocking }));
    }
  }, [equippedSecondary]);
  
  // Shoot arrow
  const shootArrow = useCallback(() => {
    if (phase !== 'battle' || arrowCount <= 0 || !equippedPrimary || equippedPrimary.type !== 'bow') return;
    
    setArrowCount(prev => prev - 1);
    
    // Create arrow projectile going toward boss
    const direction = player.facingRight ? 1 : -1;
    setProjectiles(prev => [...prev, {
      x: player.x + (direction > 0 ? 40 : -10),
      y: player.y - 20,
      velocityX: direction * 10,
      icon: '➵'
    }]);
  }, [phase, arrowCount, equippedPrimary, player.x, player.y, player.facingRight]);
  
  // Purchase boss shop item
  const purchaseBossItem = useCallback((item: BossShopItem) => {
    if (sharedScore < item.price) return;
    
    setSharedScore(s => s - item.price);
    
    switch (item.id) {
      case 'luck_boost':
        setLuckBonus(prev => prev + 1);
        break;
      case 'random_sword':
        const randomSword = WEAPONS.filter(w => w.type === 'sword')[Math.floor(Math.random() * 5)];
        setInventory(prev => [...prev, randomSword]);
        break;
      case 'heal_player':
        setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 50) }));
        break;
      case 'defense_boost':
        setDefenseBonus(prev => prev + 5);
        break;
      case 'extra_dig':
        setExtraDigs(prev => prev + 5);
        break;
      case 'boaz_ben':
        setHasBoazBen(true);
        setInventory(prev => [...prev, BOAZ_BEN_SWORD]);
        break;
    }
  }, [sharedScore, setSharedScore]);
  
  // Boss movement direction and speed
  const bossDirection = useRef<number>(1); // 1 = right, -1 = left
  const bossMoveCooldown = useRef<number>(0);
  
  // Game loop for battle phase
  useEffect(() => {
    if (phase !== 'battle') return;
    
    const gameLoop = setInterval(() => {
      // Update player position
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelocityY = prev.velocityY;
        let isJumping = prev.isJumping;
        let facingRight = prev.facingRight;
        
        // Horizontal movement
        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
          newX = Math.max(0, prev.x - MOVE_SPEED);
          facingRight = false;
        }
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
          newX = Math.min(ARENA_WIDTH - 40, prev.x + MOVE_SPEED);
          facingRight = true;
        }
        
        // Jumping with cooldown
        const now = Date.now();
        if ((keysPressed.current.has('w') || keysPressed.current.has('arrowup') || keysPressed.current.has(' ')) && !isJumping && (now - lastJumpTime.current > JUMP_COOLDOWN)) {
          newVelocityY = JUMP_FORCE;
          isJumping = true;
          lastJumpTime.current = now;
        }
        
        // Apply gravity
        newVelocityY += GRAVITY;
        newY += newVelocityY;
        
        // Ground collision
        if (newY >= GROUND_Y) {
          newY = GROUND_Y;
          newVelocityY = 0;
          isJumping = false;
        }
        
        return { ...prev, x: newX, y: newY, velocityY: newVelocityY, isJumping, facingRight };
      });
      
      // Boss movement AI - move toward player but keep distance
      setBossX(prev => {
        const distanceToPlayer = prev - player.x;
        const idealDistance = 80; // Boss tries to stay this far from player
        const bossSpeed = currentBoss.speed || 2; // Boss speed based on boss data
        
        // Decrease cooldown
        if (bossMoveCooldown.current > 0) {
          bossMoveCooldown.current--;
        }
        
        // Random direction changes
        if (Math.random() < 0.01) {
          bossDirection.current *= -1;
          bossMoveCooldown.current = 30; // Brief pause after direction change
        }
        
        // Chase player if too far
        if (distanceToPlayer > idealDistance + 50) {
          return Math.max(60, prev - bossSpeed);
        }
        // Back up if too close
        if (distanceToPlayer < idealDistance - 30) {
          return Math.min(ARENA_WIDTH - 60, prev + bossSpeed);
        }
        
        // Random patrol movement when at ideal distance
        if (bossMoveCooldown.current === 0 && Math.random() < 0.3) {
          const move = bossDirection.current * bossSpeed * 0.5;
          const newPos = prev + move;
          // Keep boss in bounds
          if (newPos < 60 || newPos > ARENA_WIDTH - 60) {
            bossDirection.current *= -1;
            return prev;
          }
          return newPos;
        }
        
        return prev;
      });
      
      // Boss AI - attack with cooldown
      if (Math.random() < 0.05 && !bossAttacking) {
        setBossAttacking(true);
        
        if (currentBoss.attackType === 'ranged' && currentBoss.projectileIcon) {
          // Shoot projectile
          setProjectiles(prev => [...prev, {
            x: bossX,
            y: GROUND_Y - 30,
            velocityX: -6,
            icon: currentBoss.projectileIcon!
          }]);
        } else if (currentBoss.attackType === 'jump') {
          // Jump toward player and deal damage on landing
          setBossX(prev => Math.max(player.x + 30, prev - 100));
          // Deal damage after jump lands
          setTimeout(() => {
            setPlayer(p => {
              if (Math.abs(p.x - player.x) < 80) {
                const blocked = p.isBlocking;
                const damage = blocked ? Math.max(1, currentBoss.damage - p.defense * 2) : Math.max(1, currentBoss.damage - p.defense);
                const newHp = p.hp - damage;
                if (newHp <= 0) {
                  setPhase('defeat');
                }
                return { ...p, hp: Math.max(0, newHp) };
              }
              return p;
            });
          }, 200);
        } else if (currentBoss.attackType === 'melee') {
          // Melee attack - check if in range and deal damage ONCE
          if (Math.abs(player.x - bossX) < 70) {
            setPlayer(p => {
              const blocked = p.isBlocking;
              const damage = blocked ? Math.max(1, currentBoss.damage - p.defense * 2) : Math.max(1, currentBoss.damage - p.defense);
              const newHp = p.hp - damage;
              if (newHp <= 0) {
                setPhase('defeat');
              }
              return { ...p, hp: Math.max(0, newHp) };
            });
          }
        }
        
        // Attack cooldown
        setTimeout(() => setBossAttacking(false), 600);
      }
      
      // Update projectiles
      setProjectiles(prev => {
        return prev
          .map(p => ({ ...p, x: p.x + p.velocityX }))
          .filter(p => p.x > -50 && p.x < ARENA_WIDTH + 50);
      });
      
      // Check projectile collisions with player
      setProjectiles(prev => {
        const remaining: typeof prev = [];
        for (const proj of prev) {
          if (proj.velocityX < 0) { // Boss projectile
            if (Math.abs(proj.x - player.x) < 30 && Math.abs(proj.y - player.y) < 40) {
              // Hit player - deal damage
              setPlayer(p => {
                const blocked = p.isBlocking;
                const damage = blocked ? Math.max(1, currentBoss.damage - p.defense * 2) : Math.max(1, currentBoss.damage - p.defense);
                const newHp = p.hp - damage;
                if (newHp <= 0) {
                  setPhase('defeat');
                }
                return { ...p, hp: Math.max(0, newHp) };
              });
            } else {
              remaining.push(proj);
            }
          } else { // Player arrow
            if (Math.abs(proj.x - bossX) < 50) {
              // Hit boss
              const arrowDamage = inventory.find(w => w.type === 'arrow')?.damage || 5;
              setBossHp(prev => Math.max(0, prev - arrowDamage));
              
              if (currentBoss.id === 'diamond_dragon') {
                setDragonHits(p => {
                  const n = p + 1;
                  if (n % 10 === 0) setSharedScore(s => s + 25);
                  return n;
                });
              }
            } else {
              remaining.push(proj);
            }
          }
        }
        return remaining;
      });
      
    }, 1000 / 60);
    
    return () => clearInterval(gameLoop);
  }, [phase, currentBoss, bossX, player.x, player.y, player.isBlocking, player.defense, bossAttacking, inventory, setSharedScore]);
  
  // Keyboard and mouse listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      
      // Attack on space or enter
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (equippedPrimary?.type === 'bow') {
          shootArrow();
        } else {
          attackBoss();
        }
      }
      
      // Block with shift
      if (e.key === 'Shift') {
        block(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
      
      if (e.key === 'Shift') {
        block(false);
      }
    };
    
    // LEFT CLICK = attack
    const handleMouseDown = (e: MouseEvent) => {
      if (phase !== 'battle') return;
      
      if (e.button === 0) { // Left click
        e.preventDefault();
        if (equippedPrimary?.type === 'bow') {
          shootArrow();
        } else {
          attackBoss();
        }
      } else if (e.button === 2) { // Right click
        e.preventDefault();
        block(true);
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) { // Right click release
        block(false);
      }
    };
    
    // Prevent context menu on right click
    const handleContextMenu = (e: MouseEvent) => {
      if (phase === 'battle') {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [phase, attackBoss, shootArrow, block, equippedPrimary]);
  
  return {
    // Phase
    phase,
    currentBoss,
    currentBossIndex,
    
    // Dig
    digGrid,
    digsRemaining,
    handleDigClick,
    
    // Inventory
    inventory,
    equippedPrimary,
    equippedSecondary,
    arrowCount,
    hasBoazBen,
    equipWeapon,
    
    // Battle
    player,
    bossHp,
    bossX,
    bossAttacking,
    projectiles,
    startBattle,
    attackBoss,
    block,
    shootArrow,
    dragonHits,
    
    // Shop
    luckBonus,
    defenseBonus,
    purchaseBossItem,
    
    // Actions
    initBossGame,
    generateDigGrid,
  };
};
