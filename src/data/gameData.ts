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
