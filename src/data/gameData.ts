export interface Artifact {
  name: string;
  icon: string;
  desc: string;
}

export interface Era {
  id: string;
  name: string;
  artifacts: Artifact[];
}

export const ERAS: Era[] = [
  {
    id: 'stone',
    name: 'התקופה הפליאוליתית',
    artifacts: [
      { name: 'אבן יד', icon: '🪨', desc: 'כלי רב-תכליתי מאבן צור, שימש לחיתוך וניפוץ.' },
      { name: 'חוד חנית', icon: '🏹', desc: 'קצה מחודד של כלי ציד קדום.' },
      { name: 'צלמית פריון', icon: '🗿', desc: 'פסלון אבן קטן לפולחן.' }
    ]
  },
  {
    id: 'bronze',
    name: 'תקופת הברונזה',
    artifacts: [
      { name: 'חרפושית', icon: '🪲', desc: 'חותם מצרי בצורת חיפושית.' },
      { name: 'להב מגל', icon: '🌙', desc: 'כלי ברונזה לקצירת תבואה.' },
      { name: 'כד כנעני', icon: '🏺', desc: 'שימש לאגירת שמן ויין.' }
    ]
  },
  {
    id: 'iron',
    name: 'תקופת הברזל',
    artifacts: [
      { name: 'כתובת עברית', icon: '📜', desc: 'חרס עם כיתוב עתיק (אוסטרקון).' },
      { name: 'נר שמן', icon: '🪔', desc: 'נר חרס למאור.' },
      { name: 'ראש חץ', icon: '🗡️', desc: 'עדות לקרבות עתיקים.' }
    ]
  },
  {
    id: 'roman',
    name: 'התקופה הרומית',
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
