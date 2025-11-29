
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, X, Clock, Trophy, Calendar as CalendarIcon, Flag, Timer, Ruler, RotateCw, Hand } from 'lucide-react';
import { RaceEvent } from '../types';
import { fetchSchedule2025 } from '../services/f1Data';

// --- Subcomponent: Interactive 3D Track ---
const InteractiveTrack = ({ path, rotation }: { path: string, rotation: number }) => {
  const [rotX, setRotX] = useState(45);
  const [rotZ, setRotZ] = useState(rotation);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;
    setRotZ(prev => prev + deltaX * 0.5);
    setRotX(prev => Math.max(0, Math.min(80, prev - deltaY * 0.5)));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="relative w-full h-64 md:h-80 perspective-[1000px] cursor-move touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      title="拖拽旋转赛道"
    >
        {/* Helper Hint */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400/50 flex items-center gap-1 pointer-events-none z-20">
            <Hand size={10} /> 360° 拖拽查看
        </div>

        {/* Laser Grid Base */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)] pointer-events-none"></div>

        {/* Floating Track */}
        <div 
            className="w-full h-full transition-transform duration-75 ease-out"
            style={{ 
                transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(0.7)`,
                transformStyle: 'preserve-3d'
            }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible pointer-events-none">
                {/* Shadow/Glow */}
                <path 
                    d={path} 
                    fill="none" 
                    stroke="rgba(239, 68, 68, 0.3)" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="blur-sm translate-z-[-20px]"
                />
                {/* Core Track */}
                <path 
                    d={path} 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_15px_rgba(239,68,68,1)]"
                />
            </svg>
        </div>
    </div>
  );
};

// --- Subcomponent: Race Results ---
const RaceResults = ({ results }: { results: RaceEvent['results'] }) => {
  if (!results) return null;
  return (
    <div className="space-y-4">
      {/* Podium */}
      <div className="grid grid-cols-3 gap-2 items-end mb-6 min-h-[140px]">
         {/* P2 */}
         <div className="bg-slate-800/50 p-2 rounded-t-lg flex flex-col items-center justify-end h-[80%] border-t-2 border-slate-600 relative">
            <div className="absolute -top-3 bg-slate-700 text-xs px-2 py-0.5 rounded text-slate-300">2nd</div>
            <div className="w-8 h-1 mb-2" style={{ backgroundColor: results.p2.teamColor }}></div>
            <div className="text-sm font-bold text-center leading-tight">{results.p2.name}</div>
            <div className="text-[10px] text-slate-400">{results.p2.time}</div>
         </div>
         {/* P1 */}
         <div className="bg-slate-800 p-2 rounded-t-lg flex flex-col items-center justify-end h-[100%] border-t-4 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] relative z-10">
            <div className="absolute -top-3 bg-yellow-500 text-black font-bold text-xs px-2 py-0.5 rounded">1st</div>
            <Trophy size={20} className="text-yellow-500 mb-1" />
            <div className="w-8 h-1 mb-2" style={{ backgroundColor: results.p1.teamColor }}></div>
            <div className="text-lg font-bold text-center leading-tight">{results.p1.name}</div>
            <div className="text-xs text-yellow-500 font-mono">{results.p1.time}</div>
         </div>
         {/* P3 */}
         <div className="bg-slate-800/50 p-2 rounded-t-lg flex flex-col items-center justify-end h-[70%] border-t-2 border-slate-600 relative">
            <div className="absolute -top-3 bg-slate-700 text-xs px-2 py-0.5 rounded text-slate-300">3rd</div>
            <div className="w-8 h-1 mb-2" style={{ backgroundColor: results.p3.teamColor }}></div>
            <div className="text-sm font-bold text-center leading-tight">{results.p3.name}</div>
            <div className="text-[10px] text-slate-400">{results.p3.time}</div>
         </div>
      </div>

      {/* Fastest Lap */}
      <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Timer size={16} className="text-purple-400" />
            <span className="text-sm font-bold text-purple-200">最快圈速</span>
         </div>
         <div className="text-right">
             <div className="text-white font-mono font-bold">{results.fastestLap.time}</div>
             <div className="text-[10px] text-purple-300">{results.fastestLap.driver}</div>
         </div>
      </div>
    </div>
  );
};

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<RaceEvent[]>([]);
  const [selectedRace, setSelectedRace] = useState<RaceEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const nextRaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const races = await fetchSchedule2025();
      setSchedule(races);
      setLoading(false);
    };
    loadData();
  }, []);

  // Auto-scroll to next race
  useEffect(() => {
    if (!loading && nextRaceRef.current) {
        setTimeout(() => {
            nextRaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
  }, [loading, schedule]);

  // Find next race
  const nextRaceIndex = schedule.findIndex(r => r.status === 'UPCOMING');
  const nextRace = nextRaceIndex !== -1 ? schedule[nextRaceIndex] : null;

  // Calculate progress
  const progressPercent = nextRaceIndex === -1 
      ? (schedule.length > 0 ? 100 : 0) 
      : (nextRaceIndex / schedule.length) * 100;

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-white font-racing text-xl animate-pulse">正在同步赛历...</h2>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 pb-24 md:pt-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
                <h2 className="text-4xl md:text-5xl font-racing font-bold flex items-center gap-3">
                    <span className="w-3 h-12 bg-red-600 block skew-racing shadow-[0_0_15px_rgba(220,38,38,0.8)]"></span>
                    2025 赛季
                </h2>
                <div className="text-slate-400 mt-2 font-mono text-sm flex items-center gap-2">
                    <CalendarIcon size={14} /> 
                    当前时区: <span className="text-cyan-400 font-bold">北京时间 (UTC+8)</span>
                </div>
            </div>

            {/* Next Race Countdown Banner */}
            {nextRace ? (
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-6 shadow-xl">
                    <div className="text-center">
                        <div className="text-xs text-slate-400 font-bold tracking-widest mb-1">下一站</div>
                        <div className="text-3xl font-racing font-bold text-white">{nextRace.round}</div>
                    </div>
                    <div className="h-10 w-px bg-slate-700"></div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{nextRace.flag}</span>
                            <span className="font-bold text-lg">{nextRace.location}</span>
                        </div>
                        <div className="text-red-500 font-mono text-sm">{nextRace.date} • {nextRace.bjTime}</div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-6 shadow-xl">
                    <div className="text-center">
                        <div className="text-xs text-slate-400 font-bold tracking-widest mb-1">状态</div>
                        <div className="text-xl font-racing font-bold text-green-500">已完结</div>
                    </div>
                </div>
            )}
        </div>

        {/* Scrollable Timeline */}
        <div className="grid grid-cols-1 gap-4 relative">
            {/* Timeline Line */}
            <div className="absolute left-[3.5rem] md:left-[5rem] top-0 bottom-0 w-0.5 bg-slate-800 hidden md:block">
                <div 
                    className="absolute top-0 w-full bg-gradient-to-b from-red-600 to-cyan-500 transition-all duration-1000"
                    style={{ height: `${progressPercent}%` }}
                ></div>
            </div>

            {schedule.map((race, index) => {
                const isNext = race.id === nextRace?.id;
                const isCompleted = race.status === 'COMPLETED';

                return (
                <motion.div 
                    key={race.id}
                    ref={isNext ? nextRaceRef : null} // Anchor for scrolling
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedRace(race)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.01] border 
                        ${isNext ? 'bg-slate-800 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-1 ring-red-500' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'}
                        ${isCompleted ? 'opacity-80 hover:opacity-100' : ''}
                    `}
                >
                    <div className="flex flex-col md:flex-row items-stretch min-h-[100px]">
                        
                        {/* Date Box */}
                        <div className={`md:w-40 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r transition-colors
                            ${isNext ? 'bg-red-600 text-white' : 'bg-slate-900/80 border-slate-700 text-slate-400'}
                        `}>
                            <span className="font-racing text-2xl md:text-3xl font-bold">{race.day}</span>
                            <span className={`font-bold tracking-wider text-xs md:text-sm ${isNext ? 'text-white/80' : 'text-slate-500'}`}>{race.month}</span>
                            <span className="text-[10px] mt-1 font-mono opacity-60">R{race.round}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 md:p-6 flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-2xl shadow-sm">{race.flag}</span>
                                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{race.location}</span>
                                    {race.status === 'LIVE' && (
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">进行中</span>
                                    )}
                                    {isCompleted && (
                                        <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                            <Flag size={10} /> 已结束
                                        </span>
                                    )}
                                    {race.isSprint && (
                                        <span className="bg-orange-600/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-600/50">
                                            冲刺赛周末
                                        </span>
                                    )}
                                </div>
                                <h3 className={`text-lg md:text-2xl font-bold font-racing ${isNext ? 'text-white' : 'text-slate-200'} group-hover:text-red-400 transition-colors`}>
                                    {race.name}
                                </h3>
                                
                                {isCompleted && race.winner && (
                                    <div className="mt-2 flex items-center gap-2 text-yellow-500 font-bold text-sm animate-in fade-in slide-in-from-left-2">
                                        <Trophy size={14} /> 冠军: {race.winner}
                                    </div>
                                )}
                                {!isCompleted && (
                                    <p className="text-slate-500 text-xs md:text-sm mt-1 flex items-center gap-2">
                                        <MapPin size={12} /> {race.circuitName}
                                    </p>
                                )}
                            </div>
                            
                            {/* Arrow */}
                            <div className="hidden md:flex items-center justify-center w-10">
                                <ChevronRight className={`transition-transform transform group-hover:translate-x-1 ${isNext ? 'text-red-500' : 'text-slate-600'}`} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )})}
        </div>

        {/* DETAILS MODAL */}
        <AnimatePresence>
            {selectedRace && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedRace(null)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div 
                        layoutId={`card-${selectedRace.id}`}
                        initial={{ scale: 0.95, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 50 }}
                        className="relative bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-600 shadow-2xl flex flex-col md:flex-row overflow-hidden"
                    >
                        <button 
                            onClick={() => setSelectedRace(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Left: 3D Visual & Circuit Stats */}
                        <div className="w-full md:w-5/12 bg-gradient-to-b from-slate-800 to-slate-900 p-8 flex flex-col relative min-h-[400px]">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            
                            <div className="z-10 text-center mb-6">
                                <div className="text-3xl font-racing font-bold text-white mb-1">{selectedRace.location}</div>
                                <div className="text-xs font-mono text-cyan-400 tracking-[0.5em] uppercase">Circuit Telemetry</div>
                            </div>
                            
                            {selectedRace.trackGeo && (
                                <InteractiveTrack path={selectedRace.trackGeo.path} rotation={selectedRace.trackGeo.rotation} />
                            )}

                            {/* Circuit Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 z-10 mt-auto">
                                <div className="bg-black/40 p-3 rounded border border-white/5">
                                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1"><Ruler size={10} /> 单圈长度</div>
                                    <div className="text-white font-mono font-bold">{selectedRace.circuitInfo?.length || 'N/A'}</div>
                                </div>
                                <div className="bg-black/40 p-3 rounded border border-white/5">
                                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1"><RotateCw size={10} /> 比赛圈数</div>
                                    <div className="text-white font-mono font-bold">{selectedRace.circuitInfo?.laps || 'N/A'} Laps</div>
                                </div>
                                <div className="bg-black/40 p-3 rounded border border-white/5 col-span-2">
                                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1"><Timer size={10} /> 最快圈速 (Lap Record)</div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-white font-mono font-bold text-lg">{selectedRace.circuitInfo?.lapRecord.time || 'N/A'}</div>
                                        <div className="text-xs text-slate-400 text-right">
                                            {selectedRace.circuitInfo?.lapRecord.driver}<br/>
                                            {selectedRace.circuitInfo?.lapRecord.year}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Event Schedule & Details */}
                        <div className="w-full md:w-7/12 p-8 bg-slate-900">
                             <div className="mb-8 border-b border-slate-700 pb-6">
                                <div className="flex items-center gap-2 mb-2">
                                   <span className="text-3xl">{selectedRace.flag}</span>
                                   <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">ROUND {selectedRace.round}</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{selectedRace.name}</h3>
                                <p className="text-slate-400 font-mono text-sm flex items-center gap-2">
                                    <MapPin size={14} /> {selectedRace.circuitName}
                                </p>
                             </div>

                             {/* Dynamic Content: Schedule OR Results */}
                             {selectedRace.status === 'COMPLETED' && selectedRace.results ? (
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Trophy size={16} className="text-yellow-500" /> 比赛结果 (Race Result)
                                    </h4>
                                    <RaceResults results={selectedRace.results} />
                                    <div className="mt-8 p-4 bg-green-900/20 border border-green-500/30 rounded-xl text-center">
                                        <span className="text-green-400 font-bold">比赛已完结</span>
                                    </div>
                                </div>
                             ) : (
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Clock size={16} className="text-red-500" /> 周末时刻表 (北京时间)
                                    </h4>
                                    <div className="space-y-2 mb-8">
                                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded hover:bg-slate-700 transition-colors">
                                            <span className="text-slate-400 text-sm">一练 (FP1)</span>
                                            <span className="font-mono text-white">{selectedRace.sessions?.fp1 || 'TBA'}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded hover:bg-slate-700 transition-colors">
                                            <span className="text-slate-400 text-sm">二练 (FP2)</span>
                                            <span className="font-mono text-white">{selectedRace.sessions?.fp2 || 'TBA'}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded hover:bg-slate-700 transition-colors">
                                            <span className="text-slate-400 text-sm">三练 (FP3)</span>
                                            <span className="font-mono text-white">{selectedRace.sessions?.fp3 || 'TBA'}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-slate-800 border border-red-900/30 rounded hover:bg-slate-700 transition-colors">
                                            <span className="text-white font-bold text-sm">排位赛 (Qualifying)</span>
                                            <span className="font-mono text-red-400 font-bold">{selectedRace.sessions?.qualifying || 'TBA'}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-900/50 to-slate-800 border-l-4 border-red-600 rounded">
                                            <span className="text-white font-racing text-sm">正赛 (Race)</span>
                                            <span className="font-mono text-white font-bold">{selectedRace.sessions?.race || 'TBA'}</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl skew-racing transition-all hover:bg-slate-200">
                                        同步至日历
                                    </button>
                                </div>
                             )}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        
        <style>{`
            .perspective-[1000px] { perspective: 1000px; }
            .preserve-3d { transform-style: preserve-3d; }
            .translate-z-\[-20px\] { transform: translateZ(-20px); }
        `}</style>
      </div>
    </div>
  );
};

export default Schedule;
