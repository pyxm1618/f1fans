
import React from 'react';
import { Tab } from '../types';
import { Activity, Flame, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  setTab: (tab: Tab) => void;
}

const Hero: React.FC<HeroProps> = ({ setTab }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* --- VIDEO BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-60"
        >
          {/* Using a tech/speed tunnel abstract video as placeholder for the F1 feel */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-speed-tunnel-10022-large.mp4" type="video/mp4" />
        </video>
        {/* Overlay Gradients for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-slate-900/80"></div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto space-y-10 mt-[-5vh]">
        
        {/* Live Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
           <div className="bg-black/60 backdrop-blur border border-red-500/50 text-white px-6 py-2 skew-racing font-bold text-sm tracking-[0.2em] inline-flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
             <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
             LIVE DATA // 实时遥测
           </div>
        </motion.div>

        {/* Main Title with Neon Effect */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-9xl font-racing font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 leading-none drop-shadow-2xl">
            极速<span className="text-red-600 inline-block transform skew-x-[-10deg] ml-2 text-stroke-white">F1</span>
          </h1>
          <p className="text-cyan-400 font-mono text-sm md:text-xl tracking-[0.5em] mt-4 uppercase opacity-80">
            Beyond the Speed Limit
          </p>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-300 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-white/5"
        >
           F1 从组建中国首支F1车队到全网围观的“飞哥洗澡赌约”
           <br className="hidden md:block"/>
           这里定义新一代赛车体验。
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8"
        >
           <button 
             onClick={() => setTab(Tab.NEW_TEAM)}
             className="group relative w-full md:w-auto px-10 py-5 bg-slate-100 text-slate-900 font-bold text-xl rounded skew-racing hover:bg-white transition-all overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
             <span className="flex items-center gap-2"><Flame size={20} className="text-orange-500" /> 中国首支F1车队</span>
           </button>
           
           <button 
             onClick={() => setTab(Tab.SHOWER_BET)}
             className="group relative w-full md:w-auto px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xl rounded skew-racing hover:scale-105 transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-red-400/50"
           >
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-full h-full bg-red-500 blur-xl opacity-20"></div>
             </div>
             <span className="flex items-center gap-2 relative z-10"><Activity className="animate-pulse" /> 围观飞哥洗澡</span>
           </button>
        </motion.div>

        {/* Floating Stats / Ticker */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 border-y border-white/10 bg-black/60 backdrop-blur-md py-4 overflow-hidden relative"
        >
           <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
           <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
           
           <div className="whitespace-nowrap animate-[marquee_25s_linear_infinite] text-slate-300 font-mono text-sm flex items-center gap-12">
      
              <span className="text-slate-600">///</span>
              <span className="flex items-center gap-2"><PlayCircle size={14} className="text-red-500"/> 飞哥直播洗澡事件热度破千万</span>
              <span className="text-slate-600">///</span>
              <span className="flex items-center gap-2">凤凰计划收到 10,000+ 份简历</span>
              <span className="text-slate-600">///</span>
              <span className="flex items-center gap-2 text-yellow-400">突发：皮亚斯特里遭遇神秘力量干扰</span>
           </div>
        </motion.div>
      </div>

      {/* ICP Footer */}
      <div className="absolute bottom-4 w-full text-center z-20 pointer-events-none">
         <a 
           href="https://beian.miit.gov.cn/" 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-[10px] md:text-xs text-slate-600 hover:text-slate-400 transition-colors font-mono pointer-events-auto"
         >
           京ICP备2024069371号-7
         </a>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .text-stroke-white {
            -webkit-text-stroke: 1px rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default Hero;
