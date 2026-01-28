export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  type: 'tool' | 'boost' | 'cosmetic';
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'heal',
    name: 'ערכת תיקון',
    icon: '🔧',
    description: 'מתקן את כלי העבודה (+30 HP)',
    price: 2,
    type: 'boost',
  },
  {
    id: 'shield',
    name: 'מגן זמני',
    icon: '🛡️',
    description: 'הטעות הבאה לא תפגע בכלים',
    price: 3,
    type: 'boost',
  },
  {
    id: 'hint',
    name: 'רמז',
    icon: '💡',
    description: 'חושף משבצת אחת בטוחה',
    price: 1,
    type: 'tool',
  },
  {
    id: 'xray',
    name: 'משקפי רנטגן',
    icon: '👓',
    description: 'מראה את כל האוצרות לשנייה',
    price: 5,
    type: 'tool',
  },
  {
    id: 'golden_trowel',
    name: 'כף זהב',
    icon: '✨',
    description: 'נקודה כפולה בשלב הבא',
    price: 4,
    type: 'cosmetic',
  },
];
