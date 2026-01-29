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

export interface Difficulty {
  id: string;
  name: string;
  pointsMultiplier: number;
  damageMultiplier: number;
  description: string;
}

export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy', name: 'קל', pointsMultiplier: 1, damageMultiplier: 1, description: 'מתאים למתחילים' },
  { id: 'normal', name: 'רגיל', pointsMultiplier: 2, damageMultiplier: 0.8, description: 'אתגר מאוזן' },
  { id: 'hard', name: 'קשה', pointsMultiplier: 3, damageMultiplier: 0.6, description: 'לחופרים מנוסים' },
];

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
    id: 'roman',
    name: 'התקופה הרומית',
    location: 'קיסריה',
    artifacts: [
      { name: 'מטבע קיסר', icon: '🪙', desc: 'מטבע כסף עם דיוקן הקיסר.' },
      { name: 'כלי זכוכית', icon: '🧪', desc: 'בקבוקון בושם עדין.' },
      { name: 'פסיפס', icon: '💠', desc: 'חלק מרצפה של וילה רומית.' }
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
