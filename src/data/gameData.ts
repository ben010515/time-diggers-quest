export interface Artifact {
  name: string;
  icon: string;
  desc: string;
}

export interface Era {
  id: string;
  name: string;
  location: string;
  artifacts: Artifact[];
}

// Progressive difficulty - calculated based on completed levels
export const calculateDifficulty = (completedLevels: number) => {
  // Points increase with each level: 1, 2, 3, 4...
  const pointsMultiplier = completedLevels + 1;
  
  // Damage INCREASES with each level: 100%, 110%, 120%... max 200%
  const damageMultiplier = Math.min(2, 1 + (completedLevels * 0.1));
  
  // Grid size grows: 5, 5, 6, 6, 7, 7, 8 (max 8)
  const gridSize = Math.min(8, 5 + Math.floor(completedLevels / 2));
  
  return {
    level: completedLevels + 1,
    pointsMultiplier,
    damageMultiplier,
    gridSize,
  };
};

export const ERAS: Era[] = [
  {
    id: 'stone',
    name: 'התקופה הפליאוליתית',
    location: 'מערת הגמל',
    artifacts: [
      { name: 'אבן יד', icon: '🪨', desc: 'כלי רב-תכליתי מאבן צור, שימש לחיתוך וניפוץ.' },
      { name: 'חוד חנית', icon: '🏹', desc: 'קצה מחודד של כלי ציד קדום.' },
      { name: 'צלמית פריון', icon: '🗿', desc: 'פסלון אבן קטן לפולחן.' }
    ]
  },
  {
    id: 'neolithic',
    name: 'התקופה הניאוליתית',
    location: 'עין גדי',
    artifacts: [
      { name: 'כלי חרס ראשון', icon: '🫖', desc: 'כד חרס פרימיטיבי לאחסון.' },
      { name: 'מגל צור', icon: '🌾', desc: 'כלי לקצירת תבואה.' },
      { name: 'פסלון אלה', icon: '👤', desc: 'דמות אנושית מחרס.' }
    ]
  },
  {
    id: 'chalcolithic',
    name: 'תקופת האבן-נחושת',
    location: 'נחל משמר',
    artifacts: [
      { name: 'כתר נחושת', icon: '👑', desc: 'עטרה טקסית עתיקה.' },
      { name: 'קרן שנהב', icon: '🦣', desc: 'כלי פולחני מפיל.' },
      { name: 'צלמית פריון', icon: '🧿', desc: 'סמל לפריון ושפע.' }
    ]
  },
  {
    id: 'bronze',
    name: 'תקופת הברונזה',
    location: 'תל מגידו',
    artifacts: [
      { name: 'חרפושית', icon: '🪲', desc: 'חותם מצרי בצורת חיפושית.' },
      { name: 'להב מגל', icon: '🌙', desc: 'כלי ברונזה לקצירת תבואה.' },
      { name: 'כד כנעני', icon: '🏺', desc: 'שימש לאגירת שמן ויין.' }
    ]
  },
  {
    id: 'iron',
    name: 'תקופת הברזל',
    location: 'עיר דוד',
    artifacts: [
      { name: 'כתובת עברית', icon: '📜', desc: 'חרס עם כיתוב עתיק (אוסטרקון).' },
      { name: 'נר שמן', icon: '🪔', desc: 'נר חרס למאור.' },
      { name: 'ראש חץ', icon: '🗡️', desc: 'עדות לקרבות עתיקים.' }
    ]
  },
  {
    id: 'persian',
    name: 'התקופה הפרסית',
    location: 'תל דור',
    artifacts: [
      { name: 'מטבע פרסי', icon: '🪙', desc: 'מטבע דריוס הגדול.' },
      { name: 'חותם גלילי', icon: '🔮', desc: 'חותם להטבעה על חרס.' },
      { name: 'צלמית רוכב', icon: '🐴', desc: 'פסלון של פרש פרסי.' }
    ]
  },
  {
    id: 'hellenistic',
    name: 'התקופה ההלניסטית',
    location: 'בית שאן',
    artifacts: [
      { name: 'מסכת תיאטרון', icon: '🎭', desc: 'מסכה יוונית לתיאטרון.' },
      { name: 'אמפורה', icon: '🍷', desc: 'כד יוני לשינוע יין.' },
      { name: 'פסל אתנה', icon: '🏛️', desc: 'פסלון של אלת החוכמה.' }
    ]
  },
  {
    id: 'roman',
    name: 'התקופה הרומית',
    location: 'קיסריה',
    artifacts: [
      { name: 'מטבע קיסר', icon: '🏅', desc: 'מטבע כסף עם דיוקן הקיסר.' },
      { name: 'כלי זכוכית', icon: '🧪', desc: 'בקבוקון בושם עדין.' },
      { name: 'פסיפס', icon: '💠', desc: 'חלק מרצפה של וילה רומית.' }
    ]
  },
  {
    id: 'byzantine',
    name: 'התקופה הביזנטית',
    location: 'כנסיית הקבר',
    artifacts: [
      { name: 'צלב זהב', icon: '✝️', desc: 'צלב עדין מזהב טהור.' },
      { name: 'איקון', icon: '🖼️', desc: 'ציור דתי על עץ.' },
      { name: 'נר ברונזה', icon: '🕯️', desc: 'מנורת שמן מעוטרת.' }
    ]
  },
  {
    id: 'islamic',
    name: 'התקופה המוסלמית',
    location: 'רמלה',
    artifacts: [
      { name: 'קערת פיינס', icon: '🍵', desc: 'כלי חרס מזוגג יפהפה.' },
      { name: 'מטבע דינר', icon: '💰', desc: 'מטבע זהב אומיי.' },
      { name: 'כתובת ערבית', icon: '📿', desc: 'לוח עם פסוק מהקוראן.' }
    ]
  },
  {
    id: 'crusader',
    name: 'תקופת הצלבנים',
    location: 'עכו',
    artifacts: [
      { name: 'חרב אביר', icon: '⚔️', desc: 'חרב של אביר צלבני.' },
      { name: 'מגן טמפלרי', icon: '🛡️', desc: 'מגן עם צלב אדום.' },
      { name: 'כד יין', icon: '🍶', desc: 'כד יין מהמנזר.' }
    ]
  },
  {
    id: 'ottoman',
    name: 'התקופה העות\'מאנית',
    location: 'יפו העתיקה',
    artifacts: [
      { name: 'נרגילה', icon: '💨', desc: 'כלי עישון מסורתי.' },
      { name: 'אריח איזניק', icon: '🔷', desc: 'אריח קרמיקה מעוטר.' },
      { name: 'פינג\'אן קפה', icon: '☕', desc: 'כוס קפה טורקית.' }
    ]
  }
];

export interface CellData {
  hasArtifact: boolean;
  state: 'hidden' | 'revealed' | 'flagged';
}

export interface CollectedArtifact extends Artifact {
  eraName: string;
}
