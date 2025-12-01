
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameStatus, Entity, EntityType, LEVELS, Segment, Team, TEAM_COLORS } from '../types';
import { PlayerCarSVG, EnemyCarSVG, TrophySVG, PuddleSVG, WrenchSVG, HeartSVG, HUDTrophySVG } from './CarAssets';
import { generateCommentary } from '../services/geminiService';

interface GameProps {
  levelId: number;
  onLevelComplete: (score: number, trophies: number) => void;
  onGameOver: (score: number, trophies: number) => void;
  onExit: () => void;
}

const CAR_WIDTH_PCT = 12;
const CAR_HEIGHT_PCT = 8;
const TRACK_PADDING = 5;

// Generate track layout procedurally based on ID
const generateTrackSegments = (distance: number, seed: number): Segment[] => {
    const segments: Segment[] = [];
    let covered = 0;
    
    // First segment is always straight
    segments.push({ type: 'STRAIGHT', intensity: 0, length: 1000 });
    covered += 1000;

    let i = 0;
    while (covered < distance) {
        i++;
        const remaining = distance - covered;
        const length = Math.min(remaining, 800 + (Math.sin(seed + i) * 400)); // Randomish length 400-1200
        
        // Alternate curves and straights
        const typeRoll = Math.sin(seed * i * 35.2);
        let type: Segment['type'] = 'STRAIGHT';
        let intensity = 0;

        if (typeRoll > 0.3) {
            type = 'CURVE_RIGHT';
            intensity = 0.3 + (Math.abs(Math.cos(i)) * 0.5); // 0.3 to 0.8
        } else if (typeRoll < -0.3) {
            type = 'CURVE_LEFT';
            intensity = 0.3 + (Math.abs(Math.cos(i)) * 0.5);
        }

        // Increase intensity at end of race
        if (covered > distance * 0.7) intensity = Math.min(1, intensity * 1.5);

        segments.push({ type, intensity, length });
        covered += length;
    }
    return segments;
};

export const Game: React.FC<GameProps> = ({ levelId, onLevelComplete, onGameOver, onExit }) => {
  const currentLevelConfig = LEVELS.find(l => l.id === levelId) || LEVELS[0];
  
  // Track layout
  const [trackSegments] = useState(() => generateTrackSegments(currentLevelConfig.distance, levelId * 999));

  // Trophy spawn points (Fixed 5 points)
  const [trophyMilestones] = useState(() => {
     const points = [0.15, 0.35, 0.55, 0.75, 0.90];
     return points.map(p => Math.floor(currentLevelConfig.distance * p));
  });

  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.INSTRUCTION,
    currentLevelId: levelId,
    score: 0,
    distance: 0,
    lives: 3,
    maxLives: 3,
    speedMultiplier: 1,
    commentary: "等待发车...",
    isBlinded: false,
    playerX: 50,
    trophiesCollected: 0,
    currentCurvature: 0
  });

  const [entities, setEntities] = useState<Entity[]>([]);
  const [showDamage, setShowDamage] = useState(false);
  
  const requestRef = useRef<number>();
  const frameCountRef = useRef(0);
  const lastCommentaryRef = useRef(0);
  const isInvincible = useRef(false);
  const invincibleTimer = useRef<ReturnType<typeof setTimeout>>();
  const playerXRef = useRef(50);
  const spawnedTrophiesRef = useRef(0);
  const trophiesRef = useRef(0);

  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const triggerCommentary = useCallback(async (event: 'start' | 'crash' | 'overtake' | 'slip' | 'repair' | 'win' | 'lose') => {
    const now = Date.now();
    if (now - lastCommentaryRef.current < 5000 && event !== 'win' && event !== 'lose' && event !== 'start') return;
    lastCommentaryRef.current = now;
    const text = await generateCommentary(event, gameState.score, currentLevelConfig.name, currentLevelConfig.location);
    setGameState(prev => ({ ...prev, commentary: text }));
  }, [gameState.score, currentLevelConfig]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, status: GameStatus.PLAYING }));
    triggerCommentary('start');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };
    const handleTouchMove = (e: TouchEvent) => {
        if (gameState.status !== GameStatus.PLAYING) return;
        const touch = e.touches[0];
        const pct = (touch.clientX / window.innerWidth) * 100;
        playerXRef.current = Math.max(TRACK_PADDING, Math.min(100 - TRACK_PADDING, pct));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState.status]);

  const takeDamage = () => {
    if (isInvincible.current) return;
    
    setShowDamage(true);
    setTimeout(() => setShowDamage(false), 300);

    setGameState(prev => {
       const newLives = prev.lives - 1;
       if (newLives <= 0) {
           cancelAnimationFrame(requestRef.current!);
           triggerCommentary('lose');
           setTimeout(() => onGameOver(prev.score, trophiesRef.current), 2000);
           return { ...prev, status: GameStatus.GAME_OVER, lives: 0 };
       }
       triggerCommentary('crash');
       return { ...prev, lives: newLives };
    });

    isInvincible.current = true;
    if (invincibleTimer.current) clearTimeout(invincibleTimer.current);
    invincibleTimer.current = setTimeout(() => {
        isInvincible.current = false;
    }, 2000);
  };

  const slipCar = () => {
    if (isInvincible.current) return;
    triggerCommentary('slip');
    const slipAmount = (Math.random() - 0.5) * 50;
    playerXRef.current = Math.max(TRACK_PADDING, Math.min(100 - TRACK_PADDING, playerXRef.current + slipAmount));
    setGameState(prev => ({ ...prev, playerX: playerXRef.current, isBlinded: true }));
    setTimeout(() => setGameState(prev => ({ ...prev, isBlinded: false })), 2000);
  };

  const updateGame = useCallback(() => {
    if (gameState.status !== GameStatus.PLAYING) return;

    // 1. Calculate Progression & Curvature
    setGameState(prev => {
      let newDistance = prev.distance + (currentLevelConfig.baseSpeed * prev.speedMultiplier);
      let newSpeedMult = Math.min(2.8, prev.speedMultiplier + 0.0002); // Gradual speed up

      if (newDistance >= currentLevelConfig.distance) {
        cancelAnimationFrame(requestRef.current!);
        triggerCommentary('win');
        setTimeout(() => onLevelComplete(prev.score, trophiesRef.current), 2000);
        return { ...prev, status: GameStatus.LEVEL_COMPLETE, distance: currentLevelConfig.distance };
      }

      // Find current segment
      let distSum = 0;
      let currentSeg: Segment = trackSegments[0];
      for (const seg of trackSegments) {
          if (newDistance < distSum + seg.length) {
              currentSeg = seg;
              break;
          }
          distSum += seg.length;
      }

      // Smoothly interpolate curvature
      let targetCurve = 0;
      if (currentSeg.type === 'CURVE_LEFT') targetCurve = -currentSeg.intensity;
      if (currentSeg.type === 'CURVE_RIGHT') targetCurve = currentSeg.intensity;
      
      const newCurve = prev.currentCurvature + (targetCurve - prev.currentCurvature) * 0.05;

      return {
        ...prev,
        distance: newDistance,
        speedMultiplier: newSpeedMult,
        score: prev.score + 1,
        currentCurvature: newCurve
      };
    });

    // 2. Physics & Movement
    // Centrifugal Force: If curve is + (Right), force pushes Player - (Left).
    // Player must steer + (Right) to counter.
    const centrifugalForce = gameState.currentCurvature * -1.5 * gameState.speedMultiplier;
    playerXRef.current += centrifugalForce;

    // Manual Steering
    const steeringSpeed = 1.8;
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
        playerXRef.current = Math.max(TRACK_PADDING, playerXRef.current - steeringSpeed);
    }
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
        playerXRef.current = Math.min(100 - TRACK_PADDING, playerXRef.current + steeringSpeed);
    }

    // Keep in bounds logic (soft wall)
    if (playerXRef.current < TRACK_PADDING) {
        playerXRef.current = TRACK_PADDING;
        // speed penalty?
    }
    if (playerXRef.current > 100 - TRACK_PADDING) {
        playerXRef.current = 100 - TRACK_PADDING;
    }

    // Sync ref to state for render (occasionally or every frame? Every frame for smoothness)
    setGameState(prev => ({ ...prev, playerX: playerXRef.current }));

    // 3. Entity Management
    setEntities(prevEntities => {
      const nextEntities: Entity[] = [];
      const playerRect = {
          l: playerXRef.current - (CAR_WIDTH_PCT/2) + 2,
          r: playerXRef.current + (CAR_WIDTH_PCT/2) - 2,
          t: 80 + 2,
          b: 80 + CAR_HEIGHT_PCT - 2
      };
      
      prevEntities.forEach(entity => {
        // Objects follow curve visually (simple approximation)
        // If curve is Right (+), objects appear to move Left (-).
        // Actually, they just move down, but we shift their X to simulate road bending?
        // No, standard vertical scrolling usually keeps objects straight relative to road, 
        // but since we skew the CONTAINER, objects move with it.
        // So we only need to move Y.
        
        const moveSpeed = (currentLevelConfig.baseSpeed * gameState.speedMultiplier) + entity.speedOffset;
        const nextY = entity.y + moveSpeed;

        // Collision
        const entityRect = {
            l: entity.x - (entity.width/2),
            r: entity.x + (entity.width/2),
            t: nextY,
            b: nextY + entity.height
        };

        const isColliding = !(playerRect.r < entityRect.l || 
                            playerRect.l > entityRect.r || 
                            playerRect.b < entityRect.t || 
                            playerRect.t > entityRect.b);

        if (isColliding) {
           if (entity.type === EntityType.COIN) {
             setGameState(s => {
                 trophiesRef.current = Math.min(5, s.trophiesCollected + 1);
                 return { ...s, score: s.score + 1000, trophiesCollected: trophiesRef.current };
             });
             triggerCommentary('overtake');
           } else if (entity.type === EntityType.REPAIR) {
             setGameState(s => ({ ...s, lives: Math.min(s.maxLives, s.lives + 1) }));
             triggerCommentary('repair');
           } else if (entity.type === EntityType.PUDDLE) {
             slipCar();
           } else if (entity.type === EntityType.ENEMY) {
             takeDamage();
           }
           return; // Remove
        }

        if (nextY < 120) {
          nextEntities.push({ ...entity, y: nextY });
        }
      });

      // 4. Spawning Logic
      frameCountRef.current++;
      const adjustedSpawnRate = currentLevelConfig.spawnRate / gameState.speedMultiplier;
      
      // A. Trophies (Fixed 5 positions)
      const nextTrophyIdx = spawnedTrophiesRef.current;
      if (nextTrophyIdx < 5 && gameState.distance >= trophyMilestones[nextTrophyIdx]) {
          spawnedTrophiesRef.current++;
          nextEntities.push({
              id: `trophy-${nextTrophyIdx}`,
              type: EntityType.COIN,
              x: 20 + Math.random() * 60, // Keep central
              y: -20,
              width: 10,
              height: 10,
              speedOffset: 0
          });
      }

      // B. Obstacles
      if (frameCountRef.current > adjustedSpawnRate) {
        frameCountRef.current = 0;
        const xPos = 10 + Math.random() * 80;
        
        const typeRoll = Math.random();
        let type = EntityType.ENEMY;
        let width = CAR_WIDTH_PCT;
        let height = CAR_HEIGHT_PCT;
        let speedOffset = 0.3;
        let team = undefined;

        if (typeRoll < 0.03) {
            type = EntityType.REPAIR;
            width = 8;
            height = 8;
            speedOffset = 0;
        }
        else if (typeRoll < 0.15) {
            type = EntityType.PUDDLE;
            width = 12;
            height = 10;
            speedOffset = 0;
        }
        else {
            // Random F1 Team
            const teams = Object.values(Team);
            team = teams[Math.floor(Math.random() * teams.length)];
        }

        nextEntities.push({
          id: Date.now().toString() + Math.random(),
          type,
          x: xPos,
          y: -20, 
          width,
          height,
          speedOffset,
          team
        });
      }

      return nextEntities;
    });

    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState.status, gameState.speedMultiplier, gameState.currentCurvature, gameState.distance, trackSegments]);

  useEffect(() => {
    if (gameState.status === GameStatus.PLAYING) {
        requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [updateGame, gameState.status]);

  // --- RENDERING ---

  // Calculate skew transform for the road container
  // A curve intensity of 1 means max skew (e.g., 30deg)
  // Negative curvature = Left turn = Skew positive? 
  // SkewX(-20deg) tilts top to right.
  const skewAngle = gameState.currentCurvature * -25;
  const rotateAngle = gameState.playerX * 0.1 - 5; // Slight tilt of car based on position

  return (
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b ${currentLevelConfig.theme.sky}`}>
      {gameState.status === GameStatus.INSTRUCTION && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="bg-slate-800 border-2 border-orange-500 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
                <h2 className="text-3xl font-racing text-white mb-2">{currentLevelConfig.name}大奖赛</h2>
                <div className="text-4xl mb-4">{currentLevelConfig.flag}</div>
                <p className="text-gray-300 mb-6 text-sm">{currentLevelConfig.description}</p>
                <div className="space-y-4 mb-8 text-left bg-black/30 p-4 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span> 
                        <span>收集5个奖杯 (可选)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏁</span> 
                        <span>完赛即胜利 (约1圈)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⤴️</span> 
                        <span>弯道会自动把车甩向外侧！</span>
                    </div>
                </div>
                <button onClick={startGame} className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-racing text-xl rounded-xl shadow-lg animate-pulse">READY? GO!</button>
            </div>
        </div>
      )}
      
      {/* Background Parallax */}
      <div className="absolute inset-0 transition-transform duration-75 ease-linear" 
           style={{ transform: `translateX(${gameState.currentCurvature * -100}px)` }}>
          <div className="w-[120%] h-full -ml-[10%]" style={{ backgroundColor: currentLevelConfig.theme.grass }}></div>
      </div>
      
      {/* Road Container with Perspective Skew */}
      <div className="absolute inset-x-0 bottom-0 top-0 flex justify-center perspective-[500px]">
          <div className="relative w-full md:w-[600px] h-full shadow-2xl overflow-hidden origin-bottom transition-transform duration-300 ease-out" 
               style={{ 
                   backgroundColor: currentLevelConfig.theme.road,
                   transform: `skewX(${skewAngle}deg)`
               }}>
            
            {/* Road Markings */}
            <div className={`absolute inset-0 opacity-30 pointer-events-none ${gameState.status === GameStatus.PLAYING ? 'animate-road' : ''}`}
                 style={{ 
                    backgroundImage: 'linear-gradient(0deg, transparent 50%, #ffffff 50%)',
                    backgroundSize: '100% 120px',
                    width: '4px', left: '33%', position: 'absolute'
                 }}></div>
            <div className={`absolute inset-0 opacity-30 pointer-events-none ${gameState.status === GameStatus.PLAYING ? 'animate-road' : ''}`}
                 style={{ 
                    backgroundImage: 'linear-gradient(0deg, transparent 50%, #ffffff 50%)',
                    backgroundSize: '100% 120px',
                    width: '4px', right: '33%', position: 'absolute'
                 }}></div>
            
            {/* Kerbs */}
            <div className={`absolute left-0 top-0 bottom-0 w-4 ${gameState.status === GameStatus.PLAYING ? 'animate-road' : ''}`}
                style={{ backgroundImage: `repeating-linear-gradient(0deg, ${currentLevelConfig.theme.accent} 0px, ${currentLevelConfig.theme.accent} 40px, white 40px, white 80px)`, backgroundSize: '100% 80px' }}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-4 ${gameState.status === GameStatus.PLAYING ? 'animate-road' : ''}`}
                style={{ backgroundImage: `repeating-linear-gradient(0deg, ${currentLevelConfig.theme.accent} 0px, ${currentLevelConfig.theme.accent} 40px, white 40px, white 80px)`, backgroundSize: '100% 80px' }}></div>

            {/* Entities */}
            {entities.map(entity => (
                <div key={entity.id} className="absolute transition-none"
                    style={{
                        left: `${entity.x}%`, top: `${entity.y}%`, width: `${entity.width}%`, height: `${entity.height}%`,
                        transform: 'translate(-50%, 0)'
                    }}>
                    {entity.type === EntityType.ENEMY && <EnemyCarSVG team={entity.team} />}
                    {entity.type === EntityType.COIN && <TrophySVG />}
                    {entity.type === EntityType.PUDDLE && <PuddleSVG />}
                    {entity.type === EntityType.REPAIR && <WrenchSVG />}
                </div>
            ))}

            {/* Player */}
            <div className={`absolute bottom-[12%] transition-none z-20 ${isInvincible.current ? 'opacity-50 animate-pulse' : ''}`}
                style={{
                    left: `${gameState.playerX}%`, width: `${CAR_WIDTH_PCT}%`, height: `${CAR_HEIGHT_PCT}%`,
                    transform: `translate(-50%, 0) rotate(${gameState.currentCurvature * 15}deg)` // Car tilts into turn
                }}>
                <PlayerCarSVG />
            </div>
          </div>
      </div>

      {/* Screen Effects */}
      {showDamage && <div className="absolute inset-0 bg-red-500/40 pointer-events-none z-50"></div>}
      {gameState.isBlinded && (
        <div className="absolute inset-0 z-40 pointer-events-none bg-blue-500/60 flex items-center justify-center backdrop-blur-[2px]">
           <div className="text-6xl animate-bounce">💧</div>
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex flex-col z-30 pointer-events-none">
        <div className="flex justify-between items-start mb-2">
             <div className="bg-black/60 p-2 rounded-lg backdrop-blur-md border border-white/10">
                 <div className="flex items-center gap-2 mb-1">
                     <span className="text-2xl">{currentLevelConfig.flag}</span>
                     <div className="text-white font-bold leading-none">{currentLevelConfig.name.toUpperCase()}</div>
                 </div>
                 <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-green-500 to-green-300" style={{ width: `${(gameState.distance / currentLevelConfig.distance) * 100}%` }}></div>
                 </div>
             </div>
             
             {/* Lives */}
             <div className="flex gap-1 bg-black/40 p-2 rounded-full backdrop-blur-sm">
                {[...Array(gameState.maxLives)].map((_, i) => (
                    <HeartSVG key={i} filled={i < gameState.lives} />
                ))}
             </div>
        </div>

        {/* Trophies HUD */}
        <div className="self-center bg-black/50 p-2 rounded-xl backdrop-blur-md flex gap-4 border border-yellow-500/30">
            {[...Array(5)].map((_, i) => (
                <HUDTrophySVG key={i} filled={i < gameState.trophiesCollected} />
            ))}
        </div>
      </div>

      {/* Fei Ge Commentary Bubble */}
      <div className="absolute bottom-24 md:bottom-10 left-0 right-0 flex justify-center z-30 px-4 pointer-events-none">
         <div className="bg-slate-900/95 border border-orange-500/50 p-3 rounded-2xl shadow-2xl max-w-lg w-full flex items-start gap-4 animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-white flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=FeiGe2&backgroundColor=transparent`} className="w-full h-full" alt="Fei Ge" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">五星体育 Live</span>
                    <span className="text-[10px] text-gray-500">刚刚</span>
                </div>
                <p className="text-white font-medium text-sm md:text-base leading-snug">"{gameState.commentary}"</p>
            </div>
         </div>
      </div>

      <button onClick={onExit} className="absolute top-4 right-4 z-50 text-white/50 hover:text-white font-bold text-sm bg-black/20 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm pointer-events-auto">
        暂停/退出
      </button>
    </div>
  );
};
