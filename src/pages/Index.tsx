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
import { CheatModal } from '@/components/game/CheatModal';
import { StatsPanel } from '@/components/game/StatsPanel';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dig' | 'museum' | 'shop'>('dig');
  const [showHelp, setShowHelp] = useState(false);
  const [showCheat, setShowCheat] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
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
    currentDifficulty,
    completedLevels,
    hintCount,
    xrayCount,
    claimedGift,
    initGame,
    handleCellClick,
    collectArtifact,
    restartLevel,
    purchaseItem,
    getRowHints,
    getColHints,
    useHint,
    useXray,
    sellArtifact,
    addCheatPoints,
    skipLevel,
    addRandomArtifact,
  } = useGame();

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-2">
      <div className="retro-box max-w-[500px] w-full h-[95vh] flex flex-col">
        <GameHeader 
          eraName={currentEra.name} 
          location={currentEra.location}
          score={score}
          onHelpClick={() => setShowHelp(true)}
          onStatsClick={() => setShowStats(true)}
        />
        
        <GameTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'dig' ? (
          <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center">
            {/* Level Progress Indicator */}
            <div className="w-full bg-gradient-to-r from-amber-200 to-amber-300 border-4 border-black p-2 mb-3 text-center shadow-md">
              <div className="font-black text-amber-900">
                רמה {currentDifficulty.level} | לוח: {currentDifficulty.gridSize}x{currentDifficulty.gridSize} | נקודות: x{currentDifficulty.pointsMultiplier} | נזק: {Math.round(currentDifficulty.damageMultiplier * 100)}%
              </div>
            </div>

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
                {hintCount > 0 && (
                  <button 
                    onClick={useHint}
                    className="bg-purple-100 border-2 border-purple-400 px-2 py-1 text-sm font-bold cursor-pointer hover:bg-purple-200" 
                    title="לחץ להפעלת רמז"
                  >
                    💡 {hintCount}
                  </button>
                )}
                {xrayCount > 0 && (
                  <button 
                    onClick={useXray}
                    className="bg-cyan-100 border-2 border-cyan-400 px-2 py-1 text-sm font-bold cursor-pointer hover:bg-cyan-200" 
                    title="לחץ להפעלת רנטגן"
                  >
                    👓 {xrayCount}
                  </button>
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
          <Museum collection={museumCollection} onSellArtifact={sellArtifact} />
        ) : (
          <Shop 
            score={score} 
            onPurchase={purchaseItem} 
            ownedItems={ownedItems} 
            claimedGift={claimedGift}
            onLuckyCharmClick={() => setShowCheat(true)}
          />
        )}

        {/* Modals */}
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        <DiscoveryModal 
          isOpen={showDiscoveryModal} 
          artifact={lastFoundArtifact} 
          onCollect={collectArtifact} 
        />
        <FailModal isOpen={showFailModal} onRestart={restartLevel} />
        <CheatModal 
          isOpen={showCheat} 
          onClose={() => setShowCheat(false)}
          onAddPoints={addCheatPoints}
          onSkipLevel={skipLevel}
          onAddArtifact={addRandomArtifact}
        />
        <StatsPanel isOpen={showStats} onClose={() => setShowStats(false)} />
      </div>
    </div>
  );
};

export default Index;
