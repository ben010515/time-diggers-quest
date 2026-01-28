import React, { useState, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { GameHeader } from '@/components/game/GameHeader';
import { GameTabs } from '@/components/game/GameTabs';
import { HealthBar } from '@/components/game/HealthBar';
import { GameGrid } from '@/components/game/GameGrid';
import { ToolBar } from '@/components/game/ToolBar';
import { Museum } from '@/components/game/Museum';
import { Shop } from '@/components/game/Shop';
import { HelpModal } from '@/components/game/HelpModal';
import { DiscoveryModal } from '@/components/game/DiscoveryModal';
import { FailModal } from '@/components/game/FailModal';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dig' | 'museum' | 'shop'>('dig');
  const [showHelp, setShowHelp] = useState(false);
  
  const {
    currentEra,
    gridData,
    gridSize,
    currentTool,
    setCurrentTool,
    hp,
    score,
    ownedItems,
    hasShield,
    doublePoints,
    museumCollection,
    showDiscoveryModal,
    showFailModal,
    lastFoundArtifact,
    initGame,
    handleCellClick,
    collectArtifact,
    restartLevel,
    purchaseItem,
    getRowHints,
    getColHints,
  } = useGame();

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-2">
      <div className="retro-box max-w-[500px] w-full h-[95vh] flex flex-col">
        <GameHeader 
          eraName={currentEra.name} 
          score={score}
          onHelpClick={() => setShowHelp(true)} 
        />
        
        <GameTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'dig' ? (
          <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center">
            {/* Info Panel */}
            <div className="w-full bg-white border-4 border-black p-2 mb-4 flex justify-between items-end shadow-md">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">תקופה</div>
                <div className="font-black text-lg text-amber-700">{currentEra.name}</div>
              </div>
              <div className="flex gap-2">
                {hasShield && (
                  <div className="bg-blue-100 border-2 border-blue-400 px-2 py-1 text-sm font-bold" title="מגן פעיל">
                    🛡️
                  </div>
                )}
                {doublePoints && (
                  <div className="bg-yellow-100 border-2 border-yellow-400 px-2 py-1 text-sm font-bold" title="נקודות כפולות">
                    ✨x2
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs font-bold text-gray-500 mb-1">עמידות כלים</div>
                <HealthBar hp={hp} />
              </div>
            </div>

            {/* Game Grid */}
            {gridData.length > 0 && (
              <GameGrid
                gridData={gridData}
                gridSize={gridSize}
                rowHints={getRowHints()}
                colHints={getColHints()}
                onCellClick={handleCellClick}
              />
            )}

            {/* Tool Bar */}
            <ToolBar currentTool={currentTool} onToolChange={setCurrentTool} />
          </div>
        ) : activeTab === 'museum' ? (
          <Museum collection={museumCollection} />
        ) : (
          <Shop score={score} onPurchase={purchaseItem} ownedItems={ownedItems} />
        )}

        {/* Modals */}
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        <DiscoveryModal 
          isOpen={showDiscoveryModal} 
          artifact={lastFoundArtifact} 
          onCollect={collectArtifact} 
        />
        <FailModal isOpen={showFailModal} onRestart={restartLevel} />
      </div>
    </div>
  );
};

export default Index;
