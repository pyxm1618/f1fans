
import React, { useState, useEffect, useRef } from 'react';
import { Game } from './components/Game';
import { PlayerCarSVG, HUDTrophySVG } from './components/CarAssets';
import { LEVELS } from './types';

enum AppScreen {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  GAME = 'GAME',
  RESULT = 'RESULT'
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.MENU);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [unlockedLevelId, setUnlockedLevelId] = useState(1);
  const [lastResult, setLastResult] = useState<{ won: boolean; score: number; trophies: number } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('piastri_rush_level_v3');
    if (saved) setUnlockedLevelId(parseInt(saved));
  }, []);

  // Auto scroll to current level
  useEffect(() => {
    if (screen === AppScreen.LEVEL_SELECT && scrollRef.current) {
        const activeLevel = document.getElementById(`level-${unlockedLevelId}`);
        if (activeLevel) {
            setTimeout(() => activeLevel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }
    }
  }, [screen, unlockedLevelId]);

  const handleLevelComplete = (score: number, trophies: number) => {
    const nextLevel = currentLevelId + 1;
    if (nextLevel > unlockedLevelId && nextLevel <= LEVELS.length) {
        setUnlockedLevelId(nextLevel);
        localStorage.setItem('piastri_rush_level_v3', nextLevel.toString());
    }
    setLastResult({ won: true, score, trophies });
    setScreen(AppScreen.RESULT);
  };

  const handleGameOver = (score: number, trophies: number) => {
    setLastResult({ won: false, score, trophies });
    setScreen(AppScreen.RESULT);
  };

  const startLevel = (id: number) => {
      setCurrentLevelId(id);
      setScreen(AppScreen.GAME);
  };

  const renderMenu = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center bg-[url('https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 bg-black/70 backdrop-blur-md p-8 rounded-2xl border-t-4 border-orange-500 shadow-[0_0_50px_rgba(255,165,0,0.3)] max-w-md w-full animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-yellow-300 to-orange-500 font-racing mb-2 drop-shadow-sm tracking-tighter">
          拯救飞哥
        </h1>
        <p className="text-blue-300 font-bold tracking-[0.3em] mb-8 text-sm uppercase">2025 World Tour</p>
        
        <div className="my-8 relative h-24 w-full flex justify-center items-center">
            <div className="w-20 absolute top-0 left-1/2 -translate-x-1/2 animate-bounce">
                <PlayerCarSVG />
            </div>
            <div className="absolute bottom-0 w-32 h-4 bg-black/50 blur-md rounded-full"></div>
        </div>

        <button 
          onClick={() => setScreen(AppScreen.LEVEL_SELECT)}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-racing text-2xl rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
        >
          START SEASON
        </button>
      </div>
    </div>
  );

  const renderLevelSelect = () => (
    <div className="min-h-screen bg-slate-900 relative flex flex-col items-center overflow-hidden">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur p-4 border-b border-white/10 flex items-center justify-between shadow-lg">
            <button onClick={() => setScreen(AppScreen.MENU)} className="text-white/70 hover:text-white">⬅ Menu</button>
            <h2 className="text-xl font-racing text-orange-400">2025 SEASON MAP</h2>
            <div className="w-12"></div>
        </div>

        {/* Map Container */}
        <div className="w-full max-w-md flex-1 overflow-y-auto pt-24 pb-32 px-6 scroll-smooth" ref={scrollRef}>
            <div className="relative flex flex-col items-center gap-12">
                {/* Dashed Path Line */}
                <div className="absolute top-0 bottom-0 w-2 border-l-4 border-dashed border-gray-700 left-1/2 -translate-x-1/2 z-0"></div>

                {LEVELS.map((level, index) => {
                    const isLocked = level.id > unlockedLevelId;
                    const isCurrent = level.id === unlockedLevelId;
                    const isCompleted = level.id < unlockedLevelId;

                    return (
                        <div key={level.id} id={`level-${level.id}`} className={`relative z-10 w-full flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                            
                            {/* Connector Line to center */}
                            <div className={`absolute top-1/2 w-1/2 h-1 ${index % 2 === 0 ? 'right-0' : 'left-0'} ${isLocked ? 'bg-gray-800' : 'bg-orange-500/50'} -z-10`}></div>

                            <button
                                disabled={isLocked}
                                onClick={() => startLevel(level.id)}
                                className={`w-[85%] relative group transition-all duration-300
                                    ${isLocked ? 'opacity-50 grayscale scale-95' : 'hover:scale-105'}
                                    ${isCurrent ? 'scale-105 ring-4 ring-orange-400 ring-offset-4 ring-offset-slate-900' : ''}
                                `}
                            >
                                <div className={`p-4 rounded-2xl border-2 shadow-xl text-left relative overflow-hidden
                                     ${isLocked ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-slate-700 to-slate-800 border-white/20'}
                                `}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-black/40 px-2 py-1 rounded text-xs text-gray-400 font-mono">
                                            R{level.id}
                                        </div>
                                        <div className="text-2xl">{level.flag}</div>
                                    </div>
                                    
                                    <h3 className={`text-lg font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                                        {level.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 truncate">{level.location}</p>

                                    {isCompleted && (
                                        <div className="absolute top-2 right-2 text-yellow-400 text-xl drop-shadow-lg">🏆</div>
                                    )}
                                    {isCurrent && (
                                        <div className="absolute -right-2 -top-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                                    )}
                                </div>
                            </button>
                        </div>
                    );
                })}
                
                {/* Finale Marker */}
                <div className="relative z-10 bg-gradient-to-b from-yellow-400 to-orange-600 p-6 rounded-full border-4 border-white shadow-[0_0_50px_rgba(255,215,0,0.5)]">
                    <span className="text-4xl">🏁</span>
                </div>
            </div>
        </div>
    </div>
  );

  const renderResult = () => {
    const isWin = lastResult?.won;
    const isSeasonFinale = isWin && currentLevelId === LEVELS.length;
    const trophies = lastResult?.trophies || 0;

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className={`p-8 rounded-3xl border-4 shadow-2xl max-w-md w-full relative overflow-hidden ${isWin ? 'bg-orange-900/90 border-yellow-400' : 'bg-slate-800 border-red-500'}`}>
            
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-white to-transparent animate-pulse"></div>

            <h2 className="text-4xl font-racing mb-2 text-white relative z-10">
            {isWin ? "PODIUM!" : "CRASHED!"}
            </h2>
            <div className="text-sm text-white/60 mb-6 font-bold uppercase tracking-widest">
                {LEVELS[currentLevelId-1].name} Grand Prix
            </div>

            <div className="my-6 text-8xl relative z-10 animate-bounce">
            {isWin ? "🏆" : "💥"}
            </div>

            <div className="bg-black/40 p-4 rounded-xl mb-6 relative z-10">
                <div className="flex justify-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <HUDTrophySVG key={i} filled={i < trophies} />
                    ))}
                </div>
                <div className="text-gray-400 text-xs uppercase">Trophies Collected</div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-xl text-left mb-8 relative z-10 border border-white/5">
                <p className="text-gray-200 text-sm italic">
                    <span className="text-orange-400 font-bold not-italic block mb-1">🎙️ 飞哥连线:</span>
                    {isWin 
                        ? (isSeasonFinale ? "不可思议！皮亚斯特里是世界冠军！飞哥的浴室安全了！" : "干得漂亮！虽然很惊险，但我们活下来了。")
                        : "完了... 我已经听到放水的声音了。皮亚斯特里，你欠我一个解释！"}
                </p>
            </div>

            <div className="flex gap-3 flex-col relative z-10">
                {isWin && !isSeasonFinale && (
                    <button 
                        onClick={() => startLevel(currentLevelId + 1)}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-700 hover:scale-[1.02] transition-transform text-white font-black text-lg rounded-xl shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1"
                    >
                        下一站 ➡️
                    </button>
                )}
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setScreen(AppScreen.LEVEL_SELECT)}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
                    >
                        返回地图
                    </button>
                    {!isWin && (
                        <button 
                            onClick={() => startLevel(currentLevelId)}
                            className="flex-1 py-3 bg-white text-slate-900 hover:bg-gray-200 font-bold rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1"
                        >
                            重试
                        </button>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden font-sans select-none text-white">
      {screen === AppScreen.MENU && renderMenu()}
      {screen === AppScreen.LEVEL_SELECT && renderLevelSelect()}
      {screen === AppScreen.GAME && (
        <Game 
          levelId={currentLevelId}
          onLevelComplete={handleLevelComplete}
          onGameOver={handleGameOver}
          onExit={() => setScreen(AppScreen.MENU)}
        />
      )}
      {screen === AppScreen.RESULT && renderResult()}
    </div>
  );
}
