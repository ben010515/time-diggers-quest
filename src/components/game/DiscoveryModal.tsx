import React from 'react';
import { CollectedArtifact } from '@/data/gameData';

interface DiscoveryModalProps {
  isOpen: boolean;
  artifact: CollectedArtifact | null;
  onCollect: () => void;
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ isOpen, artifact, onCollect }) => {
  if (!isOpen || !artifact) return null;

  return (
    <div className="pixel-modal">
      <div className="modal-box bg-yellow-50">
        <div className="text-amber-600 font-black text-sm mb-2 uppercase">!!! ממצא חדש !!!</div>
        <div className="item-icon-box mx-auto mb-4 text-4xl bg-white">{artifact.icon}</div>
        <h2 className="text-2xl font-black mb-2 text-gray-800">{artifact.name}</h2>
        <div className="bg-white border-2 border-gray-300 p-3 mb-4 text-sm leading-tight font-bold">
          <p>{artifact.desc}</p>
        </div>
        <div className="text-xs font-bold bg-amber-200 inline-block px-2 py-1 border-2 border-amber-400 mb-4 text-amber-900">
          {artifact.eraName}
        </div>
        <button onClick={onCollect} className="pixel-btn pixel-btn-green w-full py-3 text-lg">
          שמור במוזיאון
        </button>
      </div>
    </div>
  );
};
