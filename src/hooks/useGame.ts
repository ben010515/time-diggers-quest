import { useState, useCallback, useMemo } from 'react';
import { ERAS, calculateDifficulty, CellData, CollectedArtifact } from '@/data/gameData';
import { ShopItem } from '@/data/shopData';

export type Tool = 'dig' | 'flag';

export const useGame = () => {
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const [currentArtifactIndex, setCurrentArtifactIndex] = useState(0);
  const [gridData, setGridData] = useState<CellData[][]>([]);
  const [currentTool, setCurrentTool] = useState<Tool>('dig');
  const [hp, setHp] = useState(100);
  const [artifactsTotal, setArtifactsTotal] = useState(0);
  const [artifactsFound, setArtifactsFound] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [museumCollection, setMuseumCollection] = useState<CollectedArtifact[]>([]);
  const [score, setScore] = useState(0);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [hasShield, setHasShield] = useState(false);
  const [doublePoints, setDoublePoints] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [lastFoundArtifact, setLastFoundArtifact] = useState<CollectedArtifact | null>(null);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [xrayCount, setXrayCount] = useState(0);
  const [claimedGift, setClaimedGift] = useState(false);

  // Progressive difficulty based on completed levels
  const currentDifficulty = useMemo(() => calculateDifficulty(completedLevels), [completedLevels]);

  const gridSize = currentDifficulty.gridSize;
  const currentEra = ERAS[currentEraIndex];

  const generateLevel = useCallback((density: number = 0.45) => {
    let valid = false;
    let newGridData: CellData[][] = [];
    let totalArtifacts = 0;

    while (!valid) {
      newGridData = [];
      totalArtifacts = 0;

      for (let r = 0; r < gridSize; r++) {
        const row: CellData[] = [];
        for (let c = 0; c < gridSize; c++) {
          const hasArtifact = Math.random() < density;
          if (hasArtifact) totalArtifacts++;
          row.push({ hasArtifact, state: 'hidden' });
        }
        newGridData.push(row);
      }

      if (totalArtifacts > 2 && totalArtifacts < gridSize * gridSize - 2) {
        let hasAnchor = false;
        
        // Check rows
        for (let i = 0; i < gridSize; i++) {
          const rowCount = newGridData[i].filter(c => c.hasArtifact).length;
          if (rowCount === 0 || rowCount === gridSize) hasAnchor = true;
        }
        
        // Check columns
        for (let i = 0; i < gridSize; i++) {
          let colCount = 0;
          for (let r = 0; r < gridSize; r++) {
            if (newGridData[r][i].hasArtifact) colCount++;
          }
          if (colCount === 0 || colCount === gridSize) hasAnchor = true;
        }
        
        if (hasAnchor) valid = true;
      }
    }

    setGridData(newGridData);
    setArtifactsTotal(totalArtifacts);
  }, [gridSize]);

  const initGame = useCallback(() => {
    setHp(100);
    setIsGameActive(true);
    setArtifactsFound(0);
    generateLevel(0.45);
  }, [generateLevel]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (!isGameActive) return;
    
    const cellData = gridData[r][c];
    if (cellData.state === 'revealed') return;

    const newGridData = [...gridData.map(row => [...row])];

    if (currentTool === 'flag') {
      if (cellData.state === 'flagged') {
        newGridData[r][c] = { ...cellData, state: 'hidden' };
      } else {
        newGridData[r][c] = { ...cellData, state: 'flagged' };
      }
      setGridData(newGridData);
      return;
    }

    if (cellData.state === 'flagged') return;

    if (cellData.hasArtifact) {
      newGridData[r][c] = { ...cellData, state: 'revealed' };
      setGridData(newGridData);
      const newFound = artifactsFound + 1;
      setArtifactsFound(newFound);
      
      if (newFound === artifactsTotal) {
        setIsGameActive(false);
        setCompletedLevels(prev => prev + 1); // Increase difficulty for next level
        const pointsToAdd = (doublePoints ? 2 : 1) * currentDifficulty.pointsMultiplier;
        setScore(prev => prev + pointsToAdd);
        setDoublePoints(false);
        setTimeout(() => {
          const era = ERAS[currentEraIndex];
          const artifact = era.artifacts[currentArtifactIndex % era.artifacts.length];
          setLastFoundArtifact({ ...artifact, eraName: era.name });
          setShowDiscoveryModal(true);
        }, 500);
      }
    } else {
      newGridData[r][c] = { ...cellData, state: 'revealed' };
      setGridData(newGridData);
      
      if (hasShield) {
        setHasShield(false);
      } else {
        const damage = Math.round(15 * currentDifficulty.damageMultiplier);
        const newHp = hp - damage;
        setHp(newHp);
        
        if (newHp <= 0) {
          setIsGameActive(false);
          setShowFailModal(true);
        }
      }
    }
  }, [isGameActive, gridData, currentTool, artifactsFound, artifactsTotal, hp, currentEraIndex, currentArtifactIndex, hasShield, doublePoints, currentDifficulty]);

  const useHint = useCallback(() => {
    if (hintCount <= 0 || !isGameActive) return;
    
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (gridData[r][c].state === 'hidden' && !gridData[r][c].hasArtifact) {
          const newGridData = [...gridData.map(row => [...row])];
          newGridData[r][c] = { ...gridData[r][c], state: 'revealed' };
          setGridData(newGridData);
          setHintCount(prev => prev - 1);
          return;
        }
      }
    }
  }, [hintCount, isGameActive, gridData, gridSize]);

  const useXray = useCallback(() => {
    if (xrayCount <= 0 || !isGameActive) return;
    
    setXrayCount(prev => prev - 1);
    const xrayGrid = gridData.map(row => 
      row.map(cell => cell.hasArtifact && cell.state === 'hidden' 
        ? { ...cell, state: 'revealed' as const } 
        : cell
      )
    );
    setGridData(xrayGrid);
    setTimeout(() => {
      setGridData(prev => prev.map(row => 
        row.map(cell => cell.hasArtifact && cell.state === 'revealed' 
          ? { ...cell, state: 'hidden' as const } 
          : cell
        )
      ));
    }, 1500);
  }, [xrayCount, isGameActive, gridData]);

  const purchaseItem = useCallback((item: ShopItem) => {
    if (item.id === 'gift_points') {
      if (claimedGift) return;
      setScore(prev => prev + 50);
      setClaimedGift(true);
      return;
    }
    
    if (score < item.price) return;
    
    // For usable items, allow multiple purchases
    if (item.isUsable) {
      setScore(prev => prev - item.price);
      if (item.id === 'hint') {
        setHintCount(prev => prev + 1);
      } else if (item.id === 'xray') {
        setXrayCount(prev => prev + 1);
      }
      return;
    }
    
    if (ownedItems.includes(item.id)) return;
    
    setScore(prev => prev - item.price);
    
    switch (item.id) {
      case 'heal':
        setHp(prev => Math.min(100, prev + 30));
        break;
      case 'shield':
        setHasShield(true);
        setOwnedItems(prev => [...prev, item.id]);
        break;
      case 'golden_trowel':
        setDoublePoints(true);
        setOwnedItems(prev => [...prev, item.id]);
        break;
    }
  }, [score, ownedItems, claimedGift]);

  const sellArtifact = useCallback((index: number) => {
    const artifact = museumCollection[index];
    if (!artifact) return;
    
    const prices: Record<string, number> = {
      'התקופה הפליאוליתית': 10,
      'תקופת הברונזה': 15,
      'תקופת הברזל': 20,
      'התקופה הרומית': 25,
    };
    const sellPrice = prices[artifact.eraName] || 10;
    
    setScore(prev => prev + sellPrice);
    setMuseumCollection(prev => prev.filter((_, i) => i !== index));
  }, [museumCollection]);

  const collectArtifact = useCallback(() => {
    if (lastFoundArtifact) {
      setMuseumCollection(prev => [...prev, lastFoundArtifact]);
    }
    setShowDiscoveryModal(false);

    let newArtifactIndex = currentArtifactIndex + 1;
    let newEraIndex = currentEraIndex;

    if (newArtifactIndex >= ERAS[currentEraIndex].artifacts.length) {
      newArtifactIndex = 0;
      newEraIndex++;
      if (newEraIndex >= ERAS.length) {
        alert('סיימת את כל התקופות! כל הכבוד!');
        newEraIndex = 0;
      }
    }

    setCurrentArtifactIndex(newArtifactIndex);
    setCurrentEraIndex(newEraIndex);
    
    // Reset for new game
    setTimeout(() => {
      setHp(100);
      setIsGameActive(true);
      setArtifactsFound(0);
      generateLevel(0.45);
    }, 100);
  }, [lastFoundArtifact, currentArtifactIndex, currentEraIndex, generateLevel]);

  const restartLevel = useCallback(() => {
    setShowFailModal(false);
    setOwnedItems(prev => prev.filter(id => id !== 'shield' && id !== 'golden_trowel'));
    setHasShield(false);
    setDoublePoints(false);
    initGame();
  }, [initGame]);

  const getRowHints = useCallback(() => {
    return gridData.map(row => row.filter(c => c.hasArtifact).length);
  }, [gridData]);

  const getColHints = useCallback(() => {
    const hints: number[] = [];
    for (let c = 0; c < gridSize; c++) {
      let count = 0;
      for (let r = 0; r < gridSize; r++) {
        if (gridData[r]?.[c]?.hasArtifact) count++;
      }
      hints.push(count);
    }
    return hints;
  }, [gridData, gridSize]);

  return {
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
    artifactsTotal,
    artifactsFound,
    isGameActive,
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
    setShowDiscoveryModal,
    useHint,
    useXray,
    sellArtifact,
  };
};
