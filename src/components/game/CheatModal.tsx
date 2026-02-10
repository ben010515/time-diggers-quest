import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface CheatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoints: (points: number) => void;
  onSkipLevel: () => void;
  onAddArtifact: () => void;
}

export const CheatModal: React.FC<CheatModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddPoints,
  onSkipLevel,
  onAddArtifact
}) => {
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState('100');

  if (!isOpen) return null;

  const handleCodeSubmit = () => {
    if (code === '010515') {
      setIsUnlocked(true);
    }
  };

  const handleClose = () => {
    setCode('');
    setIsUnlocked(false);
    onClose();
  };

  return (
    <div className="pixel-modal">
      <div className="modal-box bg-gradient-to-b from-purple-100 to-purple-200" style={{ maxWidth: '320px' }}>
        <button 
          onClick={handleClose}
          className="absolute top-2 left-2 w-8 h-8 bg-red-500 text-white font-black border-2 border-black flex items-center justify-center hover:bg-red-600"
        >
          ✕
        </button>
        
        {!isUnlocked ? (
          <>
            <div className="text-4xl mb-3">🍀</div>
            <h2 className="text-xl font-black mb-4 text-purple-800">קמע הסודות</h2>
            <p className="text-sm font-bold text-purple-600 mb-4">הכנס קוד סודי...</p>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="הקלד קוד"
              className="text-center font-black text-xl mb-3 border-4 border-purple-400"
              maxLength={6}
            />
            <button 
              onClick={handleCodeSubmit}
              className="pixel-btn pixel-btn-purple w-full py-2"
            >
              אשר
            </button>
          </>
        ) : (
          <>
            <div className="text-4xl mb-3">✨</div>
            <h2 className="text-xl font-black mb-4 text-amber-600">!!! מצב מפתחים !!!</h2>
            
            <div className="space-y-3">
              <div className="bg-white p-3 border-4 border-amber-400">
                <div className="font-bold text-sm mb-2 text-gray-700">הוסף נקודות:</div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={pointsToAdd}
                    onChange={(e) => setPointsToAdd(e.target.value)}
                    className="flex-1 border-2 border-gray-300 text-center font-bold"
                    min="1"
                  />
                  <button 
                    onClick={() => onAddPoints(parseInt(pointsToAdd) || 0)}
                    className="pixel-btn pixel-btn-yellow px-3"
                  >
                    ⭐ הוסף
                  </button>
                </div>
              </div>
              
              <button 
                onClick={onSkipLevel}
                className="pixel-btn pixel-btn-green w-full py-3 text-lg"
              >
                🎯 דלג לשלב הבא
              </button>
              
              <button 
                onClick={onAddArtifact}
                className="pixel-btn pixel-btn-blue w-full py-3 text-lg"
              >
                🏺 הוסף ממצא אקראי
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
