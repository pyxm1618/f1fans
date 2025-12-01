
import React, { useState, useEffect } from 'react';
import { Driver, Constructor } from '../types';
import { fetchStandings } from '../services/f1Data';
import { Trophy, Activity, TrendingUp, ChevronDown, ChevronUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Standings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');
  const [data, setData] = useState<{drivers: Driver[], constructors: Constructor[]} | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchStandings();
      setData(res);
    };
    load();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (!data) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
       <div className="text-center animate-pulse">
          <div className="text-2xl font-bold mb-2">正在获取遥测数据...</div>
          <div className="text-slate-400">CONNECTING TO FIA SERVERS</div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 pb-24 md:pt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-700 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">实时更新</span>
              <span className="text-slate-400 font-mono text-xs">SEASON 2025 // LIVE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-racing font-bold italic tracking-tighter">
              年度 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">冠军争夺战</span>
            </h2>
          </div>
          
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setActiveTab('DRIVERS')}
              className={`px-6 py-2 rounded font-bold text-sm transition-all ${activeTab === 'DRIVERS' ? 'bg-slate-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              车手榜
            </button>
            <button 
              onClick={() => setActiveTab('CONSTRUCTORS')}
              className={`px-6 py-2 rounded font-bold text-sm transition-all ${activeTab === 'CONSTRUCTORS' ? 'bg-slate-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              车队榜
            </button>
          </div>
        </div>

        {/* Top 3 Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
           {(activeTab === 'DRIVERS' ? data.drivers.slice(0, 3) : data.constructors.slice(0, 3)).map((item, idx) => {
              // Reorder for Podium: 2nd, 1st, 3rd visually
              let orderClass = "";
              if (idx === 0) orderClass = "md:order-2 md:-mt-8 z-10 scale-105"; // 1st
              if (idx === 1) orderClass = "md:order-1 mt-4"; // 2nd
              if (idx === 2) orderClass = "md:order-3 mt-8"; // 3rd

              const isDriver = 'code' in item;
              const d = isDriver ? item as Driver : null;
              const c = !isDriver ? item as Constructor : null;

              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className={`relative ${orderClass}`}
                >
                   <div className="absolute inset-0 bg-gradient-to-b from-slate-700/50 to-slate-900 rounded-2xl transform skew-y-2 translate-y-2 opacity-50"></div>
                   <div className="relative bg-slate-800 rounded-2xl overflow-hidden border-t-4 shadow-2xl group" style={{ borderColor: isDriver ? d?.teamColor : c?.color }}>
                      
                      {/* Rank Badge */}
                      <div className="absolute top-0 right-0 bg-slate-900/90 px-4 py-2 rounded-bl-xl border-l border-b border-slate-700 z-20">
                         <div className="text-2xl font-racing font-bold text-white">#{item.position}</div>
                      </div>

                      {/* Content */}
                      <div className="p-6 text-center space-y-2 relative">
                        {/* Driver Image Background Effect */}
                        {isDriver && d?.headshotUrl && (
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/20 shadow-lg relative z-10 bg-slate-700">
                                <img src={d.headshotUrl} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                        )}
                        {!isDriver && (
                            <div className="w-16 h-1 bg-white/20 mx-auto rounded-full mb-4"></div>
                        )}
                        
                        <h3 className="text-3xl font-racing font-bold truncate">{item.name}</h3>
                        {isDriver && <div className="text-slate-400 font-mono text-sm tracking-widest uppercase">{d?.team}</div>}
                        
                        <div className="py-4">
                           <div className="text-5xl font-mono font-bold text-white tracking-tighter">
                             {item.points} <span className="text-base font-normal text-slate-500">PTS</span>
                           </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
                           <div className="bg-black/20 rounded p-2">
                              <div className="text-xs text-slate-500">分站冠军</div>
                              <div className="font-bold text-lg text-yellow-500">{item.wins}</div>
                           </div>
                           <div className="bg-black/20 rounded p-2">
                              {isDriver ? (
                                <>
                                  <div className="text-xs text-slate-500">赛车号码</div>
                                  <div className="font-bold text-lg text-slate-300 font-racing">#{d?.number}</div>
                                </>
                              ) : (
                                <>
                                  <div className="text-xs text-slate-500">胜场</div>
                                  <div className="font-bold text-lg text-slate-300">{item.wins}</div>
                                </>
                              )}
                           </div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              );
           })}
        </div>

        {/* Full Table */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden mt-8">
           <table className="w-full">
              <thead className="bg-slate-900/80 text-xs font-mono text-slate-400 uppercase tracking-wider">
                 <tr>
                    <th className="px-6 py-4 text-left">排名</th>
                    <th className="px-6 py-4 text-left">{activeTab === 'DRIVERS' ? '车手' : '车队'}</th>
                    {activeTab === 'DRIVERS' && <th className="hidden md:table-cell px-6 py-4 text-center">车号</th>}
                    <th className="px-6 py-4 text-right">积分</th>
                    <th className="hidden md:table-cell px-6 py-4 text-right">胜场</th>
                    <th className="w-10"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                 {(activeTab === 'DRIVERS' ? data.drivers : data.constructors).slice(3).map((item) => {
                    const isDriver = 'code' in item;
                    const d = isDriver ? item as Driver : null;
                    const c = !isDriver ? item as Constructor : null;
                    const isExpanded = expandedRow === item.id;
                    
                    return (
                      <React.Fragment key={item.id}>
                        <tr 
                            onClick={() => toggleRow(item.id)}
                            className={`transition-colors cursor-pointer group ${isExpanded ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'}`}
                        >
                            <td className="px-6 py-4">
                                <span className="font-mono font-bold text-slate-300 group-hover:text-white">{item.position}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: isDriver ? d?.teamColor : c?.color }}></div>
                                <div>
                                    <div className="font-bold text-lg leading-tight flex items-center gap-2">
                                        {isDriver && d?.countryCode && <span className="text-sm grayscale opacity-50">{d.countryCode}</span>}
                                        {item.name}
                                    </div>
                                    {isDriver && <div className="text-xs text-slate-500">{d?.team}</div>}
                                </div>
                                </div>
                            </td>
                            {activeTab === 'DRIVERS' && (
                                <td className="hidden md:table-cell px-6 py-4 text-center font-racing text-slate-500">
                                {d?.number}
                                </td>
                            )}
                            <td className="px-6 py-4 text-right font-mono font-bold text-xl">
                                {item.points}
                            </td>
                            <td className="hidden md:table-cell px-6 py-4 text-right text-slate-400">
                                {item.wins}
                            </td>
                            <td className="px-6 py-4 text-center text-slate-600">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </td>
                        </tr>
                        {/* Expandable Profile Card */}
                        <AnimatePresence>
                            {isExpanded && isDriver && (
                                <tr>
                                    <td colSpan={6} className="p-0 border-b border-slate-700/50 bg-slate-800/30">
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                                                {/* Driver Photo */}
                                                <div className="w-32 h-32 bg-slate-700 rounded-full border-4 shadow-xl overflow-hidden flex-shrink-0" style={{ borderColor: d?.teamColor }}>
                                                    {d?.headshotUrl ? (
                                                        <img src={d.headshotUrl} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <User className="w-full h-full p-6 text-slate-500" />
                                                    )}
                                                </div>
                                                
                                                {/* Info Block */}
                                                <div className="flex-1 space-y-4 text-center md:text-left">
                                                    <div>
                                                        <div className="text-4xl font-racing font-bold text-white">{d?.firstName} <span className="text-red-500">{d?.lastName}</span></div>
                                                        <div className="text-xl text-slate-400 font-mono flex items-center justify-center md:justify-start gap-2">
                                                            {d?.countryCode} <span className="w-1 h-1 bg-slate-500 rounded-full"></span> {d?.team}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-8 justify-center md:justify-start">
                                                        <div className="text-center md:text-left">
                                                            <div className="text-xs text-slate-500 uppercase">Points</div>
                                                            <div className="text-2xl font-bold font-mono">{d?.points}</div>
                                                        </div>
                                                        <div className="text-center md:text-left">
                                                            <div className="text-xs text-slate-500 uppercase">Wins</div>
                                                            <div className="text-2xl font-bold font-mono">{d?.wins}</div>
                                                        </div>
                                                        <div className="text-center md:text-left">
                                                            <div className="text-xs text-slate-500 uppercase">Number</div>
                                                            <div className="text-2xl font-bold font-racing">#{d?.number}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                 })}
              </tbody>
           </table>
        </div>

      </div>
    </div>
  );
};

export default Standings;
