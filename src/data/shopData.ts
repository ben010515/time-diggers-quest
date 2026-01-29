export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  type: 'tool' | 'boost' | 'cosmetic' | 'gift';
  isUsable?: boolean; // Can be activated by clicking
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'gift_points',
    name: 'מתנת פתיחה',
    icon: '🎁',
    description: 'קבל 50 נקודות בחינם!',
    price: 0,
    type: 'gift',
  },
  {
    id: 'heal',
    name: 'ערכת תיקון',
    icon: '🔧',
    description: 'מתקן את כלי העבודה (+30 HP)',
    price: 5,
    type: 'boost',
  },
  {
    id: 'shield',
    name: 'מגן זמני',
    icon: '🛡️',
    description: 'הטעות הבאה לא תפגע בכלים',
    price: 8,
    type: 'boost',
  },
  {
    id: 'hint',
    name: 'רמז',
    icon: '💡',
    description: 'לחץ להפעלה - חושף משבצת בטוחה',
    price: 3,
    type: 'tool',
    isUsable: true,
  },
  {
    id: 'xray',
    name: 'משקפי רנטגן',
    icon: '👓',
    description: 'לחץ להפעלה - מראה את כל האוצרות',
    price: 12,
    type: 'tool',
    isUsable: true,
  },
  {
    id: 'golden_trowel',
    name: 'כף זהב',
    icon: '✨',
    description: 'נקודה כפולה בשלב הבא',
    price: 10,
    type: 'cosmetic',
  },
];
