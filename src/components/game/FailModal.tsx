import React from 'react';

interface FailModalProps {
  isOpen: boolean;
  onRestart: () => void;
}

export const FailModal: React.FC<FailModalProps> = ({ isOpen, onRestart }) => {
  if (!isOpen) return null;

  return (
    <div className="pixel-modal">
      <div className="modal-box bg-red-50">
        <div className="text-6xl mb-2">💥</div>
        <h2 className="text-3xl font-black mb-2 text-red-600">הכלים נשברו!</h2>
        <p className="mb-6 font-bold text-gray-700">
          עשית יותר מדי טעויות והאתר קרס. נסה שוב בזהירות.
        </p>
        <button onClick={onRestart} className="pixel-btn pixel-btn-red w-full py-3">
          נסה שוב
        </button>
      </div>
    </div>
  );
};
