
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, TrendingUp, Play, Share2, Award, Zap, Activity, Droplets, Flame, BarChart3, RotateCcw, AlertCircle } from 'lucide-react';
import GameApp from '../game/App';

const VOTE_OPTIONS = [
  { id: 1, label: '小黄鸭泡泡浴', color: 'bg-yellow-500' },
  { id: 2, label: '零下10度冰桶挑战', color: 'bg-cyan-500' },
  { id: 3, label: '消防高压水枪', color: 'bg-red-500' },
  { id: 4, label: '搓澡巾 + 红酒浴', color: 'bg-purple-500' }
];

// --- SUBCOMPONENT: COUNTDOWN TIMER ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target: Abu Dhabi GP 2025 (Dec 7, 2025 23:00 Beijing Time / UTC+8)
    const targetDate = new Date('2025-12-07T23:00:00+08:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeBox = ({ val, label }: { val: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800 border border-slate-700 w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-red-600/10 skew-y-12 transform scale-0 group-hover:scale-150 transition-transform duration-500"></div>
         <span className="text-2xl md:text-4xl font-racing font-bold text-white relative z-10">{val.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mt-2 tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      <TimeBox val={timeLeft.days} label="Days" />
      <TimeBox val={timeLeft.hours} label="Hrs" />
      <TimeBox val={timeLeft.minutes} label="Mins" />
      <TimeBox val={timeLeft.seconds} label="Secs" />
    </div>
  );
};

// --- SUBCOMPONENT: PROBABILITY CALCULATOR ---
const ProbabilityCalculator = () => {
  const [prob, setProb] = useState(68);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl p-6 relative overflow-hidden h-full flex flex-col justify-center">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={100} className="text-red-500" />
        </div>
        
        <h3 className="text-xl font-racing font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <TrendingUp className="text-red-500" /> 洗澡概率模型
        </h3>

        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            {/* Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                    <circle 
                        cx="80" cy="80" r="70" 
                        stroke="#ef4444" strokeWidth="12" fill="transparent" 
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * prob) / 100}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute text-center">
                    <span className="text-4xl font-racing font-bold text-white">{prob}%</span>
                    <div className="text-[10px] text-slate-400 uppercase">Risk Level</div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase">模拟变量输入</label>
                    <div className="flex gap-2">
                        <button onClick={() => setProb(30)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300 transition-colors">
                            潘子和诺里斯双退
                        </button>
                        <button onClick={() => setProb(95)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs text-slate-300 transition-colors">
                            五星毒奶
                        </button>
                    </div>
                </div>
                <div className="p-3 bg-red-900/20 border-l-2 border-red-500 rounded text-sm text-slate-300">
                    <span className="text-red-400 font-bold">AI 分析：</span> 根据蒙特卡洛反复模拟，如果皮亚斯特里不解决来自东方的神秘力量，他将注定无缘首冠。
                </div>
            </div>
        </div>
    </div>
  );
};

// --- SUBCOMPONENT: VOTING SYSTEM ---
const VotingSystem = () => {
  const [voted, setVoted] = useState<number | null>(null);
  const [optionStats, setOptionStats] = useState(() => VOTE_OPTIONS.map(opt => ({ ...opt, votes: 0 })));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mapTotalsToOptions = (totals?: Record<string, number>) => {
    return VOTE_OPTIONS.map(opt => ({
      ...opt,
      votes: totals?.[opt.id.toString()] ?? 0
    }));
  };

  const fetchTotals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/votes');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '无法获取投票数据');
      }
      setOptionStats(mapTotalsToOptions(data.totals));
    } catch (err) {
      const message = err instanceof Error ? err.message : '无法获取投票数据';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  const totalVotes = optionStats.reduce((acc, curr) => acc + curr.votes, 0);

  const handleVote = async (optionId: number) => {
    if (voted || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '投票失败');
      }
      setOptionStats(mapTotalsToOptions(data.totals));
      setVoted(optionId);
    } catch (err) {
      const message = err instanceof Error ? err.message : '投票失败，请稍后再试';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 h-full">
        <h3 className="text-2xl font-racing font-bold text-white mb-2 flex items-center gap-2">
            <BarChart3 className="text-red-500" /> 洗澡形式公投
        </h3>
        <p className="text-slate-400 mb-4">如果不幸言中，你希望看到哪种兑现方式？</p>
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-4">
            {optionStats.map((opt) => {
                const isSelected = voted === opt.id;
                const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                
                return (
                    <div
                      key={opt.id}
                      className={`relative group ${voted || !loading ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                      onClick={() => {
                        if (loading || submitting) return;
                        if (!voted) handleVote(opt.id);
                      }}
                    >
                        {/* Background Bar */}
                        <div className="absolute inset-0 bg-slate-800 rounded-lg overflow-hidden">
                            {(voted || !loading) && (
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full opacity-20 ${opt.color}`}
                                ></motion.div>
                            )}
                        </div>
                        
                        {/* Content */}
                        <div className={`relative p-4 rounded-lg border transition-all flex justify-between items-center
                            ${isSelected ? 'border-red-500 bg-red-500/5' : 'border-slate-700 hover:border-slate-500'}
                        `}>
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-red-500' : 'border-slate-500'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                </div>
                                <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{opt.label}</span>
                            </div>
                            {(voted || !loading) && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">{opt.votes.toLocaleString()} 票</span>
                                    <span className="font-mono font-bold text-white">{percent}%</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          {loading ? '统计加载中…' : `已收到 ${totalVotes.toLocaleString()} 份有效投票 // 实时区块链存证`}
        </p>
        {submitting && <p className="text-center text-[10px] text-slate-500 mt-2">投票提交中…</p>}
    </div>
  );
};

// --- MAIN COMPONENT ---
const YeFeiShowerBet: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f1012] text-white selection:bg-red-500 selection:text-white">
      
      {/* 1. HERO & DASHBOARD SECTION */}
      <section className="relative pt-24 pb-12 px-4 md:pt-32 border-b border-slate-800">
         <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                
                {/* Text Content */}
                <div className="space-y-6 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider animate-pulse w-fit">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span> Live Event Tracker
                    </div>
                    <h1 className="text-5xl md:text-7xl font-racing font-black italic uppercase leading-none">
                        决战 <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">洗澡间</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed border-l-4 border-red-600 pl-4">
                        当 F1 遇上玄学。主持人叶飞立下“最毒”Flag：如果皮亚斯特里本赛季不夺冠，将全网直播洗澡。
                    </p>
                    
                    {/* Countdown */}
                    <div className="pt-4 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                           <Timer size={14} className="text-red-500"/>
                           距离赛季收官 (阿布扎比大奖赛)
                        </p>
                        <CountdownTimer />
                    </div>
                </div>

                {/* Telemetry Dashboard */}
                <div>
                    <ProbabilityCalculator />
                </div>
            </div>
         </div>
         
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/10 to-transparent pointer-events-none"></div>
      </section>

      {/* 2. VIDEO & CONTENT SECTION */}
      <section className="py-16 px-4 bg-slate-900/50">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Video Player */}
            <div className="lg:col-span-8">
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 aspect-video relative group">
                    {/* Bilibili Iframe */}
                    <iframe 
                        src="//player.bilibili.com/player.html?bvid=BV1hasmzPEg7&page=1&t=4040&high_quality=1&danmaku=0&autoplay=0" 
                        allowFullScreen={true}
                        allow="autoplay"
                        width="100%" 
                        height="100%"
                        className="w-full h-full"
                        style={{ border: 'none' }}
                        title="Ye Fei Bilibili Video"
                    ></iframe>
                </div>
                {/* Annotation */}
                <div className="mt-4 p-4 bg-red-900/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                        <h4 className="text-red-400 font-bold text-sm">精彩空降坐标：1:07:20</h4>
                        <p className="text-slate-400 text-xs mt-1">
                            已为您自动跳转到正片开始处。回顾那个立下 Flag 的“名场面”。
                        </p>
                    </div>
                </div>
            </div>

            {/* Voting Side */}
            <div className="lg:col-span-4">
               <VotingSystem />
            </div>
         </div>
      </section>

      {/* 3. GAME & INTERACTION SECTION */}
      <section className="py-16 px-4 pb-32">
        <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-4xl font-racing font-bold text-white mb-4">拯救飞哥 <span className="text-red-600">2025</span></h2>
            <p className="text-slate-400">在等待赛季结束的同时，帮助皮亚斯特里赢得冠军，拯救飞哥免于洗澡！</p>
        </div>

        <div className="max-w-3xl mx-auto">
            <GameApp />
        </div>

        {/* Share Bar - Temporarily hidden */}
        {/* <div className="max-w-md mx-auto mt-12 flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors">
                <Share2 size={18} /> 分享赌约
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white font-bold rounded-full hover:bg-[#1ed760] transition-colors">
                <Zap size={18} /> 生成海报
            </button>
        </div> */}
      </section>

    </div>
  );
};

export default YeFeiShowerBet;
