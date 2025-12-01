
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
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-50 relative flex items-center justify-center overflow-hidden">
        {/* 卷轴背景装饰 */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg4ODg4OCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-md p-4 border-b-2 border-orange-500/30 flex items-center justify-between shadow-2xl">
            <button onClick={() => setScreen(AppScreen.MENU)} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
                <span>⬅</span> <span className="font-bold">主菜单</span>
            </button>
            <h2 className="text-2xl font-racing text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500">2025 赛季征程</h2>
            <div className="text-sm text-white/50 font-mono px-3 py-2 bg-black/20 rounded-lg">
                {unlockedLevelId}/{LEVELS.length}
            </div>
        </div>

        {/* 卷轴容器 */}
        <div className="relative w-full h-screen pt-20 pb-8 overflow-x-auto overflow-y-hidden" ref={scrollRef}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* 左侧卷轴杆 */}
                <div className="absolute left-0 top-20 bottom-8 w-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 rounded-r-full shadow-2xl border-r-4 border-emerald-900/50">
                    <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-emerald-900/50 via-transparent to-emerald-900/50"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-6 h-20 bg-amber-900/30 rounded-full"></div>
                </div>
                
                {/* 右侧卷轴杆 */}
                <div className="absolute right-0 top-20 bottom-8 w-8 bg-gradient-to-l from-emerald-800 via-emerald-700 to-emerald-600 rounded-l-full shadow-2xl border-l-4 border-emerald-900/50">
                    <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-b from-emerald-900/50 via-transparent to-emerald-900/50"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-6 h-20 bg-amber-900/30 rounded-full"></div>
                </div>
            </div>

            {/* 赛道卷轴内容 */}
            <div className="relative min-w-max h-full px-16 py-8 flex items-center">
                {/* 赛道背景装饰 */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ minWidth: `${LEVELS.length * 180}px` }}>
                    {/* 赛道路径曲线 */}
                    <path 
                        d={`M 100 ${window.innerHeight / 2} ${LEVELS.map((_, i) => {
                            const x = 200 + i * 180;
                            const y = window.innerHeight / 2 + Math.sin(i * 0.5) * 80;
                            return `L ${x} ${y}`;
                        }).join(' ')}`}
                        stroke="url(#roadGradient)"
                        strokeWidth="60"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* 关卡节点 */}
                <div className="relative flex items-center gap-6" style={{ minWidth: `${LEVELS.length * 180}px` }}>
                    {LEVELS.map((level, index) => {
                        const isLocked = level.id > unlockedLevelId;
                        const isCurrent = level.id === unlockedLevelId;
                        const isCompleted = level.id < unlockedLevelId;
                        const yOffset = Math.sin(index * 0.5) * 80;

                        return (
                            <div key={level.id} id={`level-${level.id}`} className="relative flex flex-col items-center" style={{ marginTop: `${yOffset}px` }}>
                                {/* 连接线（祥云效果） */}
                                {index < LEVELS.length - 1 && (
                                    <div className={`absolute left-full top-1/2 -translate-y-1/2 w-6 h-1 ${isLocked ? 'bg-gray-400' : 'bg-gradient-to-r from-orange-400 to-yellow-400'}`}>
                                        <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-full h-3 blur-sm ${isLocked ? 'bg-gray-400/50' : 'bg-orange-400/50'}`}></div>
                                    </div>
                                )}

                                {/* 关卡按钮 */}
                                <button
                                    disabled={isLocked}
                                    onClick={() => startLevel(level.id)}
                                    className={`relative group transition-all duration-500 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {/* 外圈光晕 */}
                                    {isCurrent && (
                                        <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                                    )}
                                    
                                    {/* 关卡圆形容器 */}
                                    <div className={`relative w-28 h-28 rounded-full border-4 overflow-hidden transition-all duration-300
                                        ${isLocked ? 'border-gray-500 bg-gray-700 scale-90 grayscale' : 
                                          isCurrent ? 'border-orange-400 bg-gradient-to-br from-orange-300 to-red-400 shadow-[0_0_30px_rgba(251,146,60,0.8)] scale-110' :
                                          isCompleted ? 'border-yellow-400 bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg scale-100' :
                                          'border-orange-300 bg-gradient-to-br from-orange-200 to-orange-300 scale-100'}
                                        ${!isLocked && 'hover:scale-115 hover:shadow-2xl'}
                                    `}>
                                        {/* 关卡背景图案 */}
                                        <div className="absolute inset-0 bg-black/10">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                        </div>
                                        
                                        {/* 关卡内容 */}
                                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                                            {/* 国旗 */}
                                            <div className="text-4xl mb-1 drop-shadow-lg">{level.flag}</div>
                                            
                                            {/* 关卡编号 */}
                                            <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${isLocked ? 'bg-gray-600 text-gray-300' : 'bg-black/30 text-white'}`}>
                                                R{level.id}
                                            </div>
                                            
                                            {/* 完成标记 */}
                                            {isCompleted && (
                                                <div className="absolute -top-2 -right-2 text-2xl drop-shadow-lg animate-bounce">
                                                    🏆
                                                </div>
                                            )}
                                            
                                            {/* 锁定标记 */}
                                            {isLocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                                    <span className="text-3xl">🔒</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* 关卡名称标签 */}
                                    <div className={`mt-3 px-4 py-2 rounded-lg shadow-lg text-center transition-all duration-300 ${
                                        isLocked ? 'bg-gray-600/80 text-gray-300' :
                                        isCurrent ? 'bg-orange-500 text-white scale-105' :
                                        'bg-white/90 text-gray-800'
                                    } ${!isLocked && 'group-hover:scale-105'}`}>
                                        <div className="font-racing font-bold text-sm whitespace-nowrap">{level.name}</div>
                                        <div className="text-xs opacity-70 truncate max-w-[140px]">{level.location}</div>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                    
                    {/* 终点标记 */}
                    <div className="flex flex-col items-center ml-12">
                        <div className="relative">
                            <div className="absolute -inset-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                                <span className="text-6xl drop-shadow-lg">🏁</span>
                            </div>
                        </div>
                        <div className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-xl">
                            <div className="font-racing font-bold text-white text-lg">赛季终点</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 底部提示 */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-xl">
            <p className="text-white/80 text-sm flex items-center gap-2">
                <span className="text-orange-400">←→</span> 滑动查看所有分站
            </p>
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
