import { useState, useCallback } from 'react';
import { ERAS, CellData, CollectedArtifact, Artifact } from '@/data/gameData';

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
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [lastFoundArtifact, setLastFoundArtifact] = useState<CollectedArtifact | null>(null);

  const gridSize = Math.min(8, 5 + Math.floor(currentEraIndex / 2));
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
        setScore(prev => prev + 1); // Add a point!
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
      const newHp = hp - 15;
      setHp(newHp);
      
      if (newHp <= 0) {
        setIsGameActive(false);
        setShowFailModal(true);
      }
    }
  }, [isGameActive, gridData, currentTool, artifactsFound, artifactsTotal, hp, currentEraIndex, currentArtifactIndex]);

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
    artifactsTotal,
    artifactsFound,
    isGameActive,
    museumCollection,
    showDiscoveryModal,
    showFailModal,
    lastFoundArtifact,
    initGame,
    handleCellClick,
    collectArtifact,
    restartLevel,
    getRowHints,
    getColHints,
    setShowDiscoveryModal,
  };
};
