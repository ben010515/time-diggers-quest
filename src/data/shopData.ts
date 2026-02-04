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
    price: 15,
    type: 'boost',
  },
  {
    id: 'heal_full',
    name: 'תיקון מלא',
    icon: '🛠️',
    description: 'משחזר את כל הכלים (100 HP)',
    price: 40,
    type: 'boost',
  },
  {
    id: 'shield',
    name: 'מגן זמני',
    icon: '🛡️',
    description: 'הטעות הבאה לא תפגע בכלים',
    price: 20,
    type: 'boost',
  },
  {
    id: 'double_shield',
    name: 'מגן כפול',
    icon: '🛡️🛡️',
    description: '2 טעויות לא יפגעו בכלים',
    price: 35,
    type: 'boost',
  },
  {
    id: 'hint',
    name: 'רמז',
    icon: '💡',
    description: 'לחץ להפעלה - חושף משבצת בטוחה',
    price: 10,
    type: 'tool',
    isUsable: true,
  },
  {
    id: 'hint_pack',
    name: 'חבילת רמזים',
    icon: '💡💡💡',
    description: '3 רמזים במחיר מוזל',
    price: 25,
    type: 'tool',
    isUsable: true,
  },
  {
    id: 'xray',
    name: 'משקפי רנטגן',
    icon: '👓',
    description: 'לחץ להפעלה - מראה את כל האוצרות',
    price: 30,
    type: 'tool',
    isUsable: true,
  },
  {
    id: 'golden_trowel',
    name: 'כף זהב',
    icon: '✨',
    description: 'נקודה כפולה בשלב הבא',
    price: 25,
    type: 'cosmetic',
  },
  {
    id: 'lucky_charm',
    name: 'קמע מזל',
    icon: '🍀',
    description: 'סיכוי גבוה יותר לממצאים נדירים',
    price: 50,
    type: 'cosmetic',
  },
  {
    id: 'pickaxe_upgrade',
    name: 'שדרוג מכוש',
    icon: '⛏️',
    description: 'מפחית לחיצה אחת לחציבה (קבוע)',
    price: 75,
    type: 'tool',
  },
  {
    id: 'extra_life',
    name: 'חיים נוספים',
    icon: '❤️',
    description: 'מתחיל עם 150 HP במקום 100',
    price: 60,
    type: 'boost',
  },
];
