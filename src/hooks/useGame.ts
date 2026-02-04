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
  const [shieldCount, setShieldCount] = useState(0); // Number of shields remaining
  const [doublePoints, setDoublePoints] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [lastFoundArtifact, setLastFoundArtifact] = useState<CollectedArtifact | null>(null);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [xrayCount, setXrayCount] = useState(0);
  const [claimedGift, setClaimedGift] = useState(false);
  const [maxHp, setMaxHp] = useState(100); // Base max HP, can be increased

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
    setHp(maxHp);
    setIsGameActive(true);
    setArtifactsFound(0);
    generateLevel(0.45);
  }, [generateLevel, maxHp]);

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
          // Pick a random artifact from a random era for variety
          const randomEraIndex = Math.floor(Math.random() * ERAS.length);
          const randomEra = ERAS[randomEraIndex];
          const randomArtifactIndex = Math.floor(Math.random() * randomEra.artifacts.length);
          const artifact = randomEra.artifacts[randomArtifactIndex];
          setLastFoundArtifact({ ...artifact, eraName: randomEra.name });
          setShowDiscoveryModal(true);
        }, 500);
      }
    } else {
      newGridData[r][c] = { ...cellData, state: 'revealed' };
      setGridData(newGridData);
      
      // Check for shield protection
      if (shieldCount > 0) {
        setShieldCount(prev => prev - 1);
        if (shieldCount <= 1) {
          setHasShield(false);
        }
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
  }, [isGameActive, gridData, currentTool, artifactsFound, artifactsTotal, hp, currentEraIndex, currentArtifactIndex, shieldCount, doublePoints, currentDifficulty]);

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
      } else if (item.id === 'hint_pack') {
        setHintCount(prev => prev + 3);
      } else if (item.id === 'xray') {
        setXrayCount(prev => prev + 1);
      }
      return;
    }
    
    // Items that can be purchased multiple times (consumables)
    const consumableItems = ['heal', 'heal_full', 'shield', 'double_shield'];
    if (!consumableItems.includes(item.id) && ownedItems.includes(item.id)) return;
    
    setScore(prev => prev - item.price);
    
    switch (item.id) {
      case 'heal':
        setHp(prev => Math.min(maxHp, prev + 30));
        break;
      case 'heal_full':
        setHp(maxHp);
        break;
      case 'shield':
        setHasShield(true);
        setShieldCount(1);
        break;
      case 'double_shield':
        setHasShield(true);
        setShieldCount(2);
        break;
      case 'golden_trowel':
        setDoublePoints(true);
        setOwnedItems(prev => [...prev, item.id]);
        break;
      case 'lucky_charm':
        // Lucky charm just opens the cheat menu (handled in Shop component)
        break;
      case 'extra_life':
        setMaxHp(150);
        setHp(prev => Math.min(150, prev + 50));
        setOwnedItems(prev => [...prev, item.id]);
        break;
    }
  }, [score, ownedItems, claimedGift, maxHp]);

  const sellArtifact = useCallback((index: number) => {
    const artifact = museumCollection[index];
    if (!artifact) return;
    
    const prices: Record<string, number> = {
      'התקופה הפליאוליתית': 10,
      'התקופה הניאוליתית': 12,
      'תקופת האבן-נחושת': 14,
      'תקופת הברונזה': 16,
      'תקופת הברזל': 18,
      'התקופה הפרסית': 20,
      'התקופה ההלניסטית': 22,
      'התקופה הרומית': 24,
      'התקופה הביזנטית': 26,
      'התקופה המוסלמית': 28,
      'תקופת הצלבנים': 30,
      'התקופה העות\'מאנית': 35,
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

    // Progress to next era for location display
    let newArtifactIndex = currentArtifactIndex + 1;
    let newEraIndex = currentEraIndex;

    if (newArtifactIndex >= ERAS[currentEraIndex].artifacts.length) {
      newArtifactIndex = 0;
      newEraIndex++;
      if (newEraIndex >= ERAS.length) {
        newEraIndex = 0;
      }
    }

    setCurrentArtifactIndex(newArtifactIndex);
    setCurrentEraIndex(newEraIndex);
    
    // Reset for new game - use requestAnimationFrame to ensure state is settled
    requestAnimationFrame(() => {
      setHp(maxHp);
      setIsGameActive(true);
      setArtifactsFound(0);
      generateLevel(0.45);
    });
  }, [lastFoundArtifact, currentArtifactIndex, currentEraIndex, generateLevel, maxHp]);

  // Cheat functions
  const addCheatPoints = useCallback((points: number) => {
    setScore(prev => prev + points);
  }, []);

  const skipLevel = useCallback(() => {
    setCompletedLevels(prev => prev + 1);
    // Pick a random artifact to show
    const randomEraIndex = Math.floor(Math.random() * ERAS.length);
    const randomEra = ERAS[randomEraIndex];
    const randomArtifactIndex = Math.floor(Math.random() * randomEra.artifacts.length);
    const artifact = randomEra.artifacts[randomArtifactIndex];
    setLastFoundArtifact({ ...artifact, eraName: randomEra.name });
    setShowDiscoveryModal(true);
  }, []);

  const addRandomArtifact = useCallback(() => {
    const randomEraIndex = Math.floor(Math.random() * ERAS.length);
    const randomEra = ERAS[randomEraIndex];
    const randomArtifactIndex = Math.floor(Math.random() * randomEra.artifacts.length);
    const artifact = randomEra.artifacts[randomArtifactIndex];
    setMuseumCollection(prev => [...prev, { ...artifact, eraName: randomEra.name }]);
  }, []);

  const restartLevel = useCallback(() => {
    setShowFailModal(false);
    setOwnedItems(prev => prev.filter(id => id !== 'shield' && id !== 'golden_trowel' && id !== 'double_shield'));
    setHasShield(false);
    setShieldCount(0);
    setDoublePoints(false);
    initGame();
  }, [initGame]);

  const getRowHints = useCallback(() => {
    return gridData.map(row => row.filter(c => c.hasArtifact).length);
  }, [gridData]);

  const getColHints = useCallback(() => {
    // חשוב: להשתמש במימדים בפועל של gridData כדי למנוע מצב שבו ה-difficulty
    // כבר התעדכן (gridSize חדש) אבל הלוח עדיין ישן – מה שיוצר “קפיצה” רגעית.
    if (gridData.length === 0) return [];

    const rows = gridData.length;
    const cols = gridData[0]?.length ?? 0;
    const hints: number[] = [];

    for (let c = 0; c < cols; c++) {
      let count = 0;
      for (let r = 0; r < rows; r++) {
        if (gridData[r]?.[c]?.hasArtifact) count++;
      }
      hints.push(count);
    }

    return hints;
  }, [gridData]);

  return {
    currentEra,
    gridData,
    gridSize,
    currentTool,
    setCurrentTool,
    hp,
    maxHp,
    score,
    ownedItems,
    hasShield,
    shieldCount,
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
    addCheatPoints,
    skipLevel,
    addRandomArtifact,
  };
};
