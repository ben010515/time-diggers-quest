// Weapon and equipment types for Boss Battle mode

export type WeaponGrade = 'wood' | 'stone' | 'iron' | 'gold' | 'diamond';

export interface Weapon {
  id: string;
  name: string;
  icon: string;
  type: 'sword' | 'shield' | 'spear' | 'bow' | 'arrow';
  grade: WeaponGrade;
  damage: number;
  defense: number;
  range: number;
}

export const WEAPON_GRADES: Record<WeaponGrade, { multiplier: number; color: string; name: string }> = {
  wood: { multiplier: 1, color: '#8B4513', name: 'עץ' },
  stone: { multiplier: 1.5, color: '#808080', name: 'אבן' },
  iron: { multiplier: 2, color: '#C0C0C0', name: 'ברזל' },
  gold: { multiplier: 2.5, color: '#FFD700', name: 'זהב' },
  diamond: { multiplier: 3.5, color: '#00FFFF', name: 'יהלום' },
};

export const WEAPONS: Weapon[] = [
  // Swords - melee damage
  { id: 'sword_wood', name: 'חרב עץ', icon: '🗡️', type: 'sword', grade: 'wood', damage: 10, defense: 0, range: 50 },
  { id: 'sword_stone', name: 'חרב אבן', icon: '🗡️', type: 'sword', grade: 'stone', damage: 15, defense: 0, range: 50 },
  { id: 'sword_iron', name: 'חרב ברזל', icon: '⚔️', type: 'sword', grade: 'iron', damage: 20, defense: 0, range: 55 },
  { id: 'sword_gold', name: 'חרב זהב', icon: '⚔️', type: 'sword', grade: 'gold', damage: 25, defense: 0, range: 55 },
  { id: 'sword_diamond', name: 'חרב יהלום', icon: '💎', type: 'sword', grade: 'diamond', damage: 35, defense: 0, range: 60 },
  
  // Shields - defense
  { id: 'shield_wood', name: 'מגן עץ', icon: '🛡️', type: 'shield', grade: 'wood', damage: 0, defense: 5, range: 0 },
  { id: 'shield_stone', name: 'מגן אבן', icon: '🛡️', type: 'shield', grade: 'stone', damage: 0, defense: 8, range: 0 },
  { id: 'shield_iron', name: 'מגן ברזל', icon: '🛡️', type: 'shield', grade: 'iron', damage: 0, defense: 12, range: 0 },
  { id: 'shield_gold', name: 'מגן זהב', icon: '🛡️', type: 'shield', grade: 'gold', damage: 0, defense: 15, range: 0 },
  { id: 'shield_diamond', name: 'מגן יהלום', icon: '💎', type: 'shield', grade: 'diamond', damage: 0, defense: 20, range: 0 },
  
  // Spears - medium range melee
  { id: 'spear_wood', name: 'חנית עץ', icon: '🔱', type: 'spear', grade: 'wood', damage: 8, defense: 0, range: 80 },
  { id: 'spear_stone', name: 'חנית אבן', icon: '🔱', type: 'spear', grade: 'stone', damage: 12, defense: 0, range: 80 },
  { id: 'spear_iron', name: 'חנית ברזל', icon: '🔱', type: 'spear', grade: 'iron', damage: 16, defense: 0, range: 85 },
  { id: 'spear_gold', name: 'חנית זהב', icon: '🔱', type: 'spear', grade: 'gold', damage: 20, defense: 0, range: 85 },
  { id: 'spear_diamond', name: 'חנית יהלום', icon: '💎', type: 'spear', grade: 'diamond', damage: 28, defense: 0, range: 90 },
  
  // Bows - ranged
  { id: 'bow_wood', name: 'קשת עץ', icon: '🏹', type: 'bow', grade: 'wood', damage: 6, defense: 0, range: 200 },
  { id: 'bow_stone', name: 'קשת אבן', icon: '🏹', type: 'bow', grade: 'stone', damage: 9, defense: 0, range: 220 },
  { id: 'bow_iron', name: 'קשת ברזל', icon: '🏹', type: 'bow', grade: 'iron', damage: 12, defense: 0, range: 240 },
  { id: 'bow_gold', name: 'קשת זהב', icon: '🏹', type: 'bow', grade: 'gold', damage: 15, defense: 0, range: 260 },
  { id: 'bow_diamond', name: 'קשת יהלום', icon: '💎', type: 'bow', grade: 'diamond', damage: 21, defense: 0, range: 280 },
  
  // Arrows - ammo for bows
  { id: 'arrow_wood', name: 'חץ עץ', icon: '➵', type: 'arrow', grade: 'wood', damage: 5, defense: 0, range: 0 },
  { id: 'arrow_stone', name: 'חץ אבן', icon: '➵', type: 'arrow', grade: 'stone', damage: 7, defense: 0, range: 0 },
  { id: 'arrow_iron', name: 'חץ ברזל', icon: '➵', type: 'arrow', grade: 'iron', damage: 10, defense: 0, range: 0 },
  { id: 'arrow_gold', name: 'חץ זהב', icon: '➵', type: 'arrow', grade: 'gold', damage: 12, defense: 0, range: 0 },
  { id: 'arrow_diamond', name: 'חץ יהלום', icon: '💎', type: 'arrow', grade: 'diamond', damage: 18, defense: 0, range: 0 },
];

// Boss definitions
export interface Boss {
  id: string;
  name: string;
  icon: string;
  level: number;
  hp: number;
  damage: number;
  attackType: 'melee' | 'ranged' | 'jump';
  projectileIcon?: string;
  color: string;
  reward: number;
  description: string;
}

export const BOSSES: Boss[] = [
  {
    id: 'sand_boss',
    name: 'בוס חול',
    icon: '🏜️',
    level: 1,
    hp: 50,
    damage: 3,
    attackType: 'melee',
    color: '#F4D03F',
    reward: 10,
    description: 'מכה עם אגרופי חול'
  },
  {
    id: 'wood_boss',
    name: 'בוס עץ',
    icon: '🌲',
    level: 2,
    hp: 70,
    damage: 4,
    attackType: 'ranged',
    projectileIcon: '🪵',
    color: '#8B4513',
    reward: 20,
    description: 'יורה בולי עץ'
  },
  {
    id: 'stone_boss',
    name: 'בוס אבן',
    icon: '🪨',
    level: 3,
    hp: 100,
    damage: 5,
    attackType: 'jump',
    color: '#808080',
    reward: 30,
    description: 'קופץ ומכה'
  },
  {
    id: 'coal_boss',
    name: 'בוס פחם',
    icon: '⬛',
    level: 4,
    hp: 130,
    damage: 6,
    attackType: 'ranged',
    projectileIcon: '⚫',
    color: '#2C3E50',
    reward: 40,
    description: 'יורה כדורי פחם מהפה'
  },
  {
    id: 'clay_boss',
    name: 'בוס חרס',
    icon: '🏺',
    level: 5,
    hp: 160,
    damage: 7,
    attackType: 'ranged',
    projectileIcon: '🟤',
    color: '#CD853F',
    reward: 50,
    description: 'יורה כדורי חרס'
  },
  {
    id: 'iron_boss',
    name: 'בוס ברזל',
    icon: '⚙️',
    level: 6,
    hp: 200,
    damage: 8,
    attackType: 'melee',
    color: '#C0C0C0',
    reward: 60,
    description: 'מרביץ עם חרב ברזל'
  },
  {
    id: 'gold_boss',
    name: 'בוס זהב',
    icon: '👑',
    level: 7,
    hp: 250,
    damage: 10,
    attackType: 'ranged',
    projectileIcon: '🪙',
    color: '#FFD700',
    reward: 70,
    description: 'יורה מטבעות זהב'
  },
  {
    id: 'bone_boss',
    name: 'בוס עצמות',
    icon: '💀',
    level: 8,
    hp: 300,
    damage: 12,
    attackType: 'melee',
    color: '#FFFACD',
    reward: 80,
    description: 'מרביץ עם עצם'
  },
  {
    id: 'magma_boss',
    name: 'בוס מגמה',
    icon: '🌋',
    level: 9,
    hp: 400,
    damage: 15,
    attackType: 'ranged',
    projectileIcon: '🔥',
    color: '#FF4500',
    reward: 90,
    description: 'לבה עם אבנים שחורות'
  },
  {
    id: 'diamond_dragon',
    name: 'דרקון יהלום',
    icon: '🐉',
    level: 10,
    hp: 99999, // Almost invincible
    damage: 20,
    attackType: 'ranged',
    projectileIcon: '💎',
    color: '#00FFFF',
    reward: 25, // Per 10 hits
    description: 'יורה יהלומים ומכה עם הזנב'
  },
];

// Special legendary sword
export const BOAZ_BEN_SWORD: Weapon = {
  id: 'boaz_ben',
  name: 'חרב בועז בן',
  icon: '⚡',
  type: 'sword',
  grade: 'diamond',
  damage: 9999, // One-hit kill on dragon
  defense: 0,
  range: 70,
};

// Dig cell for boss mode
export interface BossDigCell {
  hasItem: boolean;
  item?: Weapon;
  state: 'hidden' | 'revealed' | 'flagged';
  hitsRemaining: number;
  maxHits: number;
}

// Player state in boss battle
export interface BossPlayer {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  hp: number;
  maxHp: number;
  defense: number;
  facingRight: boolean;
  isAttacking: boolean;
  isBlocking: boolean;
}

// Boss mode shop items
export interface BossShopItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
}

export const BOSS_SHOP_ITEMS: BossShopItem[] = [
  {
    id: 'luck_boost',
    name: 'מזל מוגבר',
    icon: '🍀',
    description: 'סיכוי גבוה יותר לנשקים טובים',
    price: 30,
  },
  {
    id: 'random_sword',
    name: 'חרב אקראית',
    icon: '🗡️',
    description: 'מקבל חרב בדרגה אקראית',
    price: 50,
  },
  {
    id: 'heal_player',
    name: 'ריפוי',
    icon: '❤️',
    description: 'מוסיף 50 חיים לשחקן',
    price: 25,
  },
  {
    id: 'defense_boost',
    name: 'הגנה מוגברת',
    icon: '🛡️',
    description: 'הבוסים מורידים פחות נזק',
    price: 40,
  },
  {
    id: 'extra_dig',
    name: '+5 חפירות',
    icon: '⛏️',
    description: '5 מקומות נוספים לחפור בשלב',
    price: 35,
  },
  {
    id: 'boaz_ben',
    name: 'חרב בועז בן',
    icon: '⚡',
    description: 'היחידה שיכולה להרוג את הדרקון!',
    price: 10000,
  },
];

// Helper to get random weapon based on luck
export const getRandomWeapon = (luckBonus: number = 0): Weapon => {
  const gradeChances: { grade: WeaponGrade; chance: number }[] = [
    { grade: 'wood', chance: 40 - luckBonus * 5 },
    { grade: 'stone', chance: 30 },
    { grade: 'iron', chance: 20 + luckBonus * 2 },
    { grade: 'gold', chance: 8 + luckBonus * 2 },
    { grade: 'diamond', chance: 2 + luckBonus },
  ];
  
  const totalChance = gradeChances.reduce((sum, g) => sum + Math.max(0, g.chance), 0);
  let random = Math.random() * totalChance;
  
  let selectedGrade: WeaponGrade = 'wood';
  for (const { grade, chance } of gradeChances) {
    random -= Math.max(0, chance);
    if (random <= 0) {
      selectedGrade = grade;
      break;
    }
  }
  
  const types: Array<'sword' | 'shield' | 'spear' | 'bow' | 'arrow'> = ['sword', 'shield', 'spear', 'bow', 'arrow'];
  const selectedType = types[Math.floor(Math.random() * types.length)];
  
  const weapon = WEAPONS.find(w => w.grade === selectedGrade && w.type === selectedType);
  return weapon || WEAPONS[0];
};
