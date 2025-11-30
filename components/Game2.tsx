import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Timer } from 'lucide-react';

// Types
type GameState = 'START' | 'PLAYING' | 'GAMEOVER' | 'VICTORY';
type PlayerState = 'RUN' | 'JUMP' | 'DUCK';

interface Obstacle {
  id: number;
  type: 'HIGH' | 'LOW' | 'FLYING' | 'GROUND'; // HIGH=Duck, LOW=Jump
  x: number;
  speed: number;
  emoji: string;
}

const GAME_DURATION = 60; // seconds
const SPAWN_RATE_MIN = 1000; // ms
const SPAWN_RATE_MAX = 2000; // ms
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const GROUND_Y = 0;

const Game2: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  
  // Game Loop Refs (Mutable state for performance)
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const nextSpawnTimeRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>('START'); // Ref for loop logic

  // Sync ref with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  // Player Refs
  const playerY = useRef(0);
  const playerVelocityY = useRef(0);
  const isJumping = useRef(false);
  const isDucking = useRef(false);
  const playerStateRef = useRef<PlayerState>('RUN');
  
  // Obstacles Ref
  const obstaclesRef = useRef<Obstacle[]>([]);

  // Render State (For UI updates)
  const [playerRenderY, setPlayerRenderY] = useState(0);
  const [playerRenderState, setPlayerRenderState] = useState<PlayerState>('RUN');
  const [renderObstacles, setRenderObstacles] = useState<Obstacle[]>([]);

  const startGame = () => {
    setGameState('PLAYING');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    obstaclesRef.current = [];
    playerY.current = 0;
    playerVelocityY.current = 0;
    isJumping.current = false;
    isDucking.current = false;
    lastTimeRef.current = performance.now();
    nextSpawnTimeRef.current = performance.now() + 1000;
    
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const jump = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    if (!isJumping.current) {
      isJumping.current = true;
      playerVelocityY.current = JUMP_FORCE;
      playerStateRef.current = 'JUMP';
    }
  }, [gameState]);

  const duck = useCallback((isDown: boolean) => {
    if (gameState !== 'PLAYING') return;
    isDucking.current = isDown;
    if (!isJumping.current) {
      playerStateRef.current = isDown ? 'DUCK' : 'RUN';
    }
  }, [gameState]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') jump();
      if (e.code === 'ArrowDown') duck(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') duck(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump, duck]);

  const spawnObstacle = (time: number) => {
    const types: Obstacle['type'][] = ['LOW', 'HIGH', 'GROUND', 'FLYING'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let emoji = '🚧';
    if (type === 'LOW' || type === 'GROUND') emoji = ['🦆', '🧼', '🧴'][Math.floor(Math.random() * 3)];
    if (type === 'HIGH' || type === 'FLYING') emoji = ['💦', '❄️', '🧽'][Math.floor(Math.random() * 3)];

    const newObstacle: Obstacle = {
      id: time,
      type,
      x: 1000, // Start off-screen right
      speed: 6 + Math.random() * 4, // Random speed
      emoji
    };
    obstaclesRef.current.push(newObstacle);
  };

  const checkCollision = () => {
    // Simple AABB Collision
    // Player Hitbox (approximate)
    // Run: x=50, y=0, w=40, h=80
    // Duck: x=50, y=0, w=40, h=40
    // Jump: x=50, y=playerY, w=40, h=80

    const pX = 50;
    const pW = 40;
    const pH = isDucking.current ? 40 : 80; // Lower height when ducking
    // Visual Y is inverted in CSS usually (bottom: 0), but let's keep logic simple
    // Logic Y: 0 is ground. + is Up.
    const pY = playerY.current; 

    for (const obs of obstaclesRef.current) {
        // Obstacle Hitbox
        // Ground/Low: y=0, h=50
        // High/Flying: y=70, h=50 (Fly high enough to duck under)
        
        let oY = 0;
        let oH = 50;
        let oW = 40;

        if (obs.type === 'HIGH' || obs.type === 'FLYING') {
            oY = 60; // Needs ducking (player H is 80, so hits head. Duck H is 40, so safe)
        }

        // Check overlap
        // X overlap
        if (pX < obs.x + oW && pX + pW > obs.x) {
            // Y overlap
            if (pY < oY + oH && pY + pH > oY) {
                return true;
            }
        }
    }
    return false;
  };

  const gameLoop = (time: number) => {
    if (gameStateRef.current !== 'PLAYING') return;
    
    const deltaTime = time - (lastTimeRef.current || time);
    lastTimeRef.current = time;

    // Update Player Physics
    if (isJumping.current) {
      playerY.current += playerVelocityY.current;
      playerVelocityY.current += GRAVITY;
      
      if (playerY.current <= GROUND_Y) {
        playerY.current = GROUND_Y;
        isJumping.current = false;
        playerVelocityY.current = 0;
        playerStateRef.current = isDucking.current ? 'DUCK' : 'RUN';
      }
    }

    // Spawn Obstacles
    if (time > nextSpawnTimeRef.current) {
      spawnObstacle(time);
      nextSpawnTimeRef.current = time + SPAWN_RATE_MIN + Math.random() * (SPAWN_RATE_MAX - SPAWN_RATE_MIN);
    }

    // Update Obstacles
    obstaclesRef.current.forEach(obs => {
      obs.x -= obs.speed;
    });
    // Remove off-screen
    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x > -100);

    // Check Collision
    if (checkCollision()) {
      setGameState('GAMEOVER');
      cancelAnimationFrame(requestRef.current!);
      return;
    }

    // Update Timer & Score
    // (We could do this less frequently but for now it's fine)
    // Doing it in setState might be too heavy for every frame if we aren't careful, 
    // but React 18 automatic batching helps. 
    // Better to use a ref for the timer logic and only sync occasionally?
    // Let's just sync render state every frame for smooth movement, 
    // but handle timer separately.
    
    // Sync Render State
    setPlayerRenderY(playerY.current);
    setPlayerRenderState(playerStateRef.current);
    setRenderObstacles([...obstaclesRef.current]); // Copy to trigger re-render

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  // Separate timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'PLAYING') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('VICTORY');
            return 0;
          }
          setScore(s => s + 10);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Clean up
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);


  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-900 overflow-hidden relative select-none">
      {/* Game Container */}
      <div className="w-full max-w-4xl h-[400px] bg-slate-800 rounded-3xl overflow-hidden relative border-4 border-slate-700 shadow-2xl">
        
        {/* Background / Parallax elements could go here */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 text-white">
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur">
            <Timer className="text-yellow-400" size={20} />
            <span className="font-mono font-bold text-xl">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur">
            <Trophy className="text-yellow-400" size={20} />
            <span className="font-mono font-bold text-xl">{score}</span>
          </div>
        </div>

        {/* Game World */}
        <div className="absolute bottom-0 w-full h-[300px] border-b-8 border-slate-600 bg-gradient-to-b from-transparent to-slate-900/50">
          
          {/* Player */}
          <div 
            className="absolute left-[50px] text-5xl transition-transform"
            style={{ 
              bottom: `${playerRenderY}px`,
              transform: playerRenderState === 'DUCK' ? 'scaleY(0.6)' : 'scaleY(1)',
              transformOrigin: 'bottom' 
            }}
          >
            {gameState === 'GAMEOVER' ? '😵' : gameState === 'VICTORY' ? '😎' : '🏎️'}
          </div>

          {/* Obstacles */}
          {renderObstacles.map(obs => (
            <div
              key={obs.id}
              className="absolute text-4xl"
              style={{ 
                left: `${obs.x}px`,
                bottom: obs.type === 'HIGH' || obs.type === 'FLYING' ? '60px' : '0px'
              }}
            >
              {obs.emoji}
            </div>
          ))}

        </div>

        {/* Overlays */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white text-center p-8">
            <h1 className="text-4xl font-bold text-orange-500 mb-2">澡堂大逃杀</h1>
            <p className="text-slate-300 mb-8">躲避队友的"洗澡刑具"，坚持60秒！</p>
            <div className="space-y-2 mb-8 text-sm text-slate-400">
              <p>SPACE / ↑ 跳跃 (躲避地面障碍 🦆)</p>
              <p>↓ 下蹲 (躲避空中袭击 💦)</p>
            </div>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-xl transition-transform hover:scale-105"
            >
              <Play fill="currentColor" /> 开始逃亡
            </button>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-5xl font-bold mb-4">被抓到了！</h2>
            <p className="text-xl mb-8">飞哥没能逃过洗澡的命运...</p>
            <div className="text-2xl font-mono mb-8">最终得分: {score}</div>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3 bg-white text-red-900 hover:bg-slate-200 rounded-xl font-bold text-xl transition-transform hover:scale-105"
            >
              <RotateCcw /> 再试一次
            </button>
          </div>
        )}

        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 bg-green-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-5xl font-bold mb-4 text-yellow-400">逃脱成功！</h2>
            <p className="text-xl mb-8">你成功捍卫了不洗澡的权利！(暂时的)</p>
            <div className="text-2xl font-mono mb-8">最终得分: {score}</div>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-3 bg-yellow-500 text-black hover:bg-yellow-400 rounded-xl font-bold text-xl transition-transform hover:scale-105"
            >
              <Trophy /> 领取荣耀
            </button>
          </div>
        )}

      </div>
      
      {/* Mobile Controls (Optional visual guide) */}
      <div className="absolute bottom-4 right-4 text-slate-500 text-xs hidden md:block">
        [Debug] State: {playerRenderState} | Y: {Math.round(playerRenderY)}
      </div>
    </div>
  );
};

export default Game2;
