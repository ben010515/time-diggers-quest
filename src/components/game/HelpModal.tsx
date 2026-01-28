import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="pixel-modal">
      <div className="modal-box bg-blue-50">
        <div className="close-btn" onClick={onClose}>X</div>
        <h2 className="text-2xl font-black mb-4 text-blue-800 border-b-4 border-blue-200 pb-2">
          איך משחקים?
        </h2>
        <div className="text-right space-y-3 text-sm font-bold text-gray-800">
          <p>
            1. <span className="text-blue-600">המטרה:</span> למצוא את כל הממצאים המוסתרים באדמה מבלי לשבור את כלי העבודה.
          </p>
          <p>
            2. <span className="text-green-600">מספרים:</span> המספר בראש כל שורה וטור אומר כמה ממצאים מסתתרים בהם.
          </p>
          <p>
            3. <span className="text-amber-600">חפירה (🔨):</span> לחץ כדי לחשוף משבצת. אם יש שם אוצר - זכית! אם אין - הכלים נפגעים.
          </p>
          <p>
            4. <span className="text-red-600">סימון (🚩):</span> אם אתה בטוח שמשבצת ריקה, סמן אותה כדי לא לחפור בה בטעות.
          </p>
          <div className="bg-yellow-100 p-2 border-2 border-yellow-400 mt-4 text-center text-xs">
            טיפ: חפש שורות עם המספר 0 או שורות מלאות כדי להתחיל!
          </div>
        </div>
        <button onClick={onClose} className="pixel-btn pixel-btn-blue w-full mt-6 py-2">
          הבנתי, לעבודה!
        </button>
      </div>
    </div>
  );
};
