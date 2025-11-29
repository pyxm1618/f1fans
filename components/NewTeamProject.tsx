
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Users, Handshake, Zap, Building2, Briefcase, X, Send, QrCode, Cpu, Wind, Timer, AlertTriangle, Crown, Sparkles, ScanLine, ChevronRight } from 'lucide-react';

const fhVideoSrc = new URL('../FH-1.mp4', import.meta.url).href;
const sponsorQrSrc = new URL('../QR.jpg', import.meta.url).href;

const NewTeamProject: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', role: '', contact: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleApply = (role?: string) => {
    if (role) setFormState(prev => ({ ...prev, role }));
    setIsModalOpen(true);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || '提交失败');
      }

      setSubmitSuccess(true);
      setFormState({ name: '', role: '', contact: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : '提交失败，请稍后再试';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDriverRole = formState.role.includes('车手');

  const handleSponsorContact = () => {
    setIsSponsorModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pb-24 md:pt-20 overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-7xl mx-auto relative">
        
        {/* --- AMBIENT BACKGROUND EFFECTS --- */}
        <div className="fixed inset-0 pointer-events-none z-0">
           {/* Moving Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [transform:perspective(1000px)_rotateX(60deg)] origin-top opacity-30"></div>
           {/* Spotlights */}
           <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/10 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>

        {/* --- HERO SECTION: STEALTH CAR REVEAL --- */}
        <div className="relative mb-20 pt-6 z-10">
            <div className="relative z-10 text-center mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/30 backdrop-blur-md mb-6"
                >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">Classified Project // Level 5 Clearance</span>
                </motion.div>
                
                <h1 className="text-5xl md:text-8xl font-racing font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 tracking-tighter drop-shadow-2xl">
                    凤凰计划 <span className="text-emerald-500">FH-1</span>
                </h1>
                <p className="text-slate-400 font-mono text-sm md:text-lg mt-4 tracking-[0.5em] uppercase opacity-70">
                    Next Gen Chassis Concept // 2026 Spec
                </p>
            </div>

            {/* THE HOLOGRAPHIC CAR VISUALIZATION */}
            <div className="relative w-full h-[220px] md:h-[360px] flex items-center justify-center overflow-hidden perspective-[2000px] group">
                
                {/* 1. Base Silhouette (Shadow) */}
                <div className="absolute w-full max-w-6xl opacity-30 blur-sm scale-105">
                     <PhoenixCarSVG fill="#000" stroke="none" />
                </div>

                {/* 2. The Detailed "Phoenix" Livery Car */}
                <div className="absolute w-full max-w-6xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                    {/* Applying specific filters to match the 'dark reveal' aesthetic while keeping the red/gold visible but moody */}
                    <div style={{ filter: 'brightness(0.8) contrast(1.2) saturate(1.1)' }}>
                        <PhoenixCarSVG />
                    </div>
                </div>

                {/* 3. The Green Scanning Light Reveal (Overlay) */}
                <div className="absolute inset-0 flex items-center justify-center mask-scan-container pointer-events-none">
                    <div className="w-full max-w-6xl filter drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">
                        {/* The Wireframe/Green Outline version */}
                        <PhoenixCarSVG stroke="#34d399" strokeWidth="1.5" fill="none" noText />
                    </div>
                </div>

                {/* Scanning Beam Visual */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,1)] z-30 scanner-line pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 w-48 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent z-20 scanner-glow pointer-events-none"></div>
                 
                {/* Floor Reflection */}
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-emerald-900/10 to-transparent blur-3xl opacity-50"></div>
            </div>

            {/* FH-1 Concept Video */}
            <div className="mt-6 md:-mt-2 px-4">
                <div className="max-w-4xl mx-auto bg-black/60 border border-emerald-500/20 rounded-3xl p-4 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                    <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
                        <video
                            src={fhVideoSrc}
                            className="w-full h-full"
                            controls
                            loop
                            playsInline
                        >
                            您的浏览器不支持视频标签。
                        </video>
                    </div>
                </div>
            </div>

        </div>


        {/* --- MANIFESTO SECTION --- */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40 px-6 max-w-6xl mx-auto">
            <div className="lg:col-span-5 space-y-10">
                 <div className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-transparent"></div>
                    <h2 className="text-4xl md:text-5xl font-racing font-bold mb-6 text-white leading-tight">
                        重塑<br/>
                        <span className="text-slate-500">发车格秩序</span>
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-lg font-light">
                        2026年，F1将迎来历史上最大的规则变革。这是旧秩序崩塌的时刻，也是新王登基的契机。
                        <br/><br/>
                        我们不是来凑数的。我们是第12支车队，带着颠覆性的工程理念和对胜利的贪婪，只为在澳大利亚的5盏红灯熄灭时，震惊世界。
                    </p>
                 </div>
                 
                 {/* Partner Badge */}
                 <div className="group bg-slate-900/50 hover:bg-slate-800/50 rounded-xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all cursor-default">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="bg-white/10 p-2 rounded text-white group-hover:text-emerald-400 transition-colors">
                            <Handshake size={24} />
                        </div>
                        <div className="text-xs text-emerald-500 font-mono tracking-widest uppercase">Strategic Partner</div>
                    </div>
                    <div className="text-2xl font-bold text-white group-hover:tracking-wide transition-all duration-500">
                        PHOENIX <span className="text-slate-600">x</span> CADILLAC
                    </div>
                 </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-6">
                <StatusRow 
                    step="01"
                    title="实体构建" 
                    status="COMPLETED"
                    desc="英国运营主体注册完毕。FIA 正式参赛意向书已提交并受理。"
                />
                <StatusRow 
                    step="02"
                    title="核心团队" 
                    status="ASSEMBLED"
                    desc="技术总监（前红牛空气动力学专家）与领队已秘密签署预备合同。"
                />
                <StatusRow 
                    step="03"
                    title="动力单元" 
                    status="LOCKED"
                    desc="2026 规格动力单元供应协议已签署。合作伙伴将于 Q3 公布。"
                />
                 <StatusRow 
                    step="04"
                    title="超级工厂" 
                    status="IN PROGRESS"
                    desc="Silverstone 科技园区总部破土动工。100% 碳中和设施。"
                />
            </div>
        </div>

        {/* --- RECRUITMENT SECTION --- */}
        <div className="relative z-10 mb-40 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-racing font-bold text-white mb-4 flex items-center gap-4">
                        <ScanLine className="text-emerald-500" size={40} /> 人才招募
                    </h2>
                    <p className="text-slate-400 text-xl font-light max-w-2xl">
                        寻找 200 位疯子、天才和梦想家。如果你觉得现在的F1太无趣，加入我们。
                    </p>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-emerald-500 font-mono text-3xl font-bold">12,408</div>
                    <div className="text-slate-600 text-xs uppercase tracking-widest">已收到申请</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <JobCategory 
                    title="车手席位" 
                    roles={["主力车手 (No.1 Driver)", "第二车手 (No.2 Driver)", "模拟器/研发车手"]} 
                    onApply={handleApply} 
                    icon={<Crown size={18} className="text-yellow-500"/>} 
                />
                <JobCategory title="空气动力学" roles={["首席空动专家", "CFD 算法工程师", "风洞模型技师"]} onApply={handleApply} />
                <JobCategory title="车辆设计" roles={["首席设计师 (Chief Designer)", "复合材料工程师", "悬挂系统主管"]} onApply={handleApply} />
                <JobCategory title="赛道工程" roles={["首席比赛工程师", "策略主管", "遥测数据分析师"]} onApply={handleApply} />
                <JobCategory title="数字创意" roles={["全栈开发工程师", "UI/UX 设计师", "3D 视觉艺术家", "赛车涂装设计"]} onApply={handleApply} />
                <JobCategory title="运营与商业" roles={["品牌总监", "车队后勤经理", "合作伙伴关系经理"]} onApply={handleApply} />
            </div>
        </div>

        {/* --- SPONSOR RECRUITMENT --- */}
        <div className="relative z-10 mb-40 px-6">
            <div className="max-w-6xl mx-auto bg-gradient-to-r from-black/80 via-slate-900/80 to-black/80 border border-emerald-500/20 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                    <div>
                        <div className="text-xs font-mono tracking-[0.6em] text-emerald-400 uppercase mb-3">FH-1 PARTNERSHIP</div>
                        <h2 className="text-4xl md:text-5xl font-racing font-bold text-white mb-4">赞助商合作</h2>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                            我们开放 FH-1 赛车涂装与全球赛事资产，为品牌打造沉浸式曝光。合作伙伴的标识将登上赛车进气口、尾翼与维修区，随车队征战 24 场大奖赛，贯穿全季直播与社媒热点。
                        </p>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <button 
                            onClick={handleSponsorContact}
                            className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:scale-105 transition whitespace-nowrap"
                        >
                            申请赞助
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: '赛车涂装曝光', desc: 'Logo 置于 FH-1 进气口 / 尾翼 / 轮毂盖，保证电视转播与赛道摄影高频捕捉。', badge: 'LIVERY' },
                        { title: '全球媒体矩阵', desc: '官方纪录片、社交平台与内容共创同步露出，提供原生素材和采访窗口。', badge: 'MEDIA' },
                        { title: '赛事体验权益', desc: '可定制赛道 VIP 包厢、维修区参观与发车格合影，接待核心客户与内部团队。', badge: 'HOSPITALITY' },
                        { title: '技术共创计划', desc: '共同开发可持续材料、AI 遥测等创新项目，在赛车上标记联名技术徽章。', badge: 'CO-LAB' }
                    ].map((slot, idx) => (
                        <div key={slot.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-emerald-400/40 hover:bg-white/10 transition">
                            <div className="text-[10px] tracking-[0.4em] text-emerald-300 font-mono">{slot.badge}</div>
                            <h3 className="text-2xl font-bold text-white">{slot.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{slot.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- FOOTER / CONTACT --- */}
        <div className="relative z-10 border-t border-white/10 pt-20 pb-12 px-6">
             <div className="bg-gradient-to-b from-slate-900 to-black p-10 md:p-16 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto shadow-2xl">
                 <div className="text-left space-y-6 max-w-xl">
                    <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                        加入 <span className="text-emerald-500">凤凰计划</span> 群聊
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-lg">
                        我们正在构建未来的速度。无论你是赞助商、工程师还是车迷，
                        扫描二维码，进入我们的私密通讯频道。
                    </p>
                    <div className="flex gap-4 pt-2">
                        <div className="px-4 py-2 bg-white/5 rounded border border-white/10 text-xs font-mono text-slate-400">ENCRYPTED</div>
                        <div className="px-4 py-2 bg-white/5 rounded border border-white/10 text-xs font-mono text-slate-400">SECURE</div>
                    </div>
                 </div>

                 <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-48 h-48 bg-white rounded-lg flex items-center justify-center p-2 shadow-2xl">
                         <QrCode className="text-black w-full h-full" strokeWidth={1.5} />
                         {/* Scan Line Overlay */}
                         <div className="absolute top-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-[scan_2s_linear_infinite]"></div>
                    </div>
                 </div>
             </div>

             <div className="text-center mt-20 space-y-2">
                <div className="text-emerald-900/50 font-racing text-5xl md:text-8xl opacity-10 select-none">PHOENIX RACING</div>
                <p className="text-xs md:text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed">
                    本页内容非真实事件，纯属娱乐。不过车迷放心，我们会持续推进凤凰计划，不时更新车队进度，期待明年 FH-1 的表现。
                </p>
             </div>
        </div>

      </div>

      {/* --- APPLICATION MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    {/* Modal Effects */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-600"></div>
                    <div className="absolute -left-20 -top-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={20} /></button>

                    <div className="mb-8">
                        <div className="text-xs font-mono text-emerald-500 mb-2 uppercase tracking-wider">Application Protocol</div>
                        <h3 className="text-3xl font-bold font-racing text-white">申请加入</h3>
                        {submitError && (
                          <p className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                            {submitError}
                          </p>
                        )}
                    </div>

                    {submitSuccess ? (
                        <div className="text-center py-12">
                            <motion.div 
                                initial={{ scale: 0, rotate: -180 }} 
                                animate={{ scale: 1, rotate: 0 }} 
                                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 mb-6 border border-emerald-500/20"
                            >
                                <CheckCircle2 size={40} />
                            </motion.div>
                            <h4 className="text-2xl font-bold text-white mb-2">传输成功</h4>
                            <p className="text-slate-400">您的档案已加密存储。招聘专员将在 48 小时内通过加密频段联系您。</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Spoof Requirement for Drivers */}
                            {isDriverRole && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3"
                                >
                                    <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                                    <div className="text-sm">
                                        <p className="font-bold text-yellow-500 mb-2 uppercase tracking-wide">超级驾照附加条款:</p>
                                        <ul className="space-y-1 text-yellow-200/70 list-disc pl-4 marker:text-yellow-500">
                                            <li>持有 <strong className="text-yellow-100">跑跑卡丁车 L1 驾照</strong> (必须无碰撞完赛)</li>
                                            <li>QQ飞车手游板车上王者段位</li>
                                            <li>马里奥赛车 200cc 全三星通关</li>
                                            <li>GTA5 洛圣都环岛赛纪录保持者</li>
                                        </ul>
                                    </div>
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">代号 / ID</label>
                                    <input type="text" required value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-emerald-500 focus:bg-emerald-950/10 focus:outline-none transition-all placeholder:text-slate-700 font-mono" placeholder="NAME_OR_ALIAS" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">目标岗位</label>
                                    <input type="text" required value={formState.role} onChange={e => setFormState({...formState, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-emerald-500 focus:bg-emerald-950/10 focus:outline-none transition-all font-mono" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">加密通讯方式</label>
                                    <input type="text" required value={formState.contact} onChange={e => setFormState({...formState, contact: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-emerald-500 focus:bg-emerald-950/10 focus:outline-none transition-all placeholder:text-slate-700 font-mono" placeholder="WECHAT_ID / EMAIL" />
                                </div>
                            </div>
                            
                            <button type="submit" disabled={isSubmitting} className="group w-full bg-white text-black hover:bg-emerald-400 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all mt-4 hover:scale-[1.02] active:scale-[0.98]">
                                {isSubmitting ? <span className="animate-pulse">UPLOADING...</span> : <><Send size={18} /> 提交申请 <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0"/></>}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- SPONSOR MODAL --- */}
      <AnimatePresence>
        {isSponsorModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSponsorModalOpen(false)}
                    className="absolute inset-0 bg-black/85 backdrop-blur-xl"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-[#050505] border border-emerald-500/30 w-full max-w-md rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    <button onClick={() => setIsSponsorModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
                    <div className="text-xs font-mono text-emerald-400 mb-2 tracking-[0.5em]">PARTNER LINK</div>
                    <h3 className="text-3xl font-bold font-racing text-white mb-8">赞助意向通道</h3>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-xl blur opacity-30 group-hover:opacity-80 transition"></div>
                            <div className="relative w-48 h-48 bg-white rounded-xl flex items-center justify-center p-2 overflow-hidden">
                                <img src={sponsorQrSrc} alt="赞助洽谈二维码" className="w-full h-full object-cover" />
                                <div className="absolute top-0 w-full h-1 bg-emerald-500/60 animate-[scan_2s_linear_infinite]"></div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed text-center max-w-xs">
                            扫描下方二维码，添加商务负责人微信，备注“品牌名称 + 行业”。我们将在 24 小时内联系进一步商讨合作细节。
                        </p>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <style>{`
         .mask-scan-container {
             mask-image: linear-gradient(to right, transparent 0%, black 50%, transparent 100%);
             mask-size: 50% 100%;
             mask-repeat: no-repeat;
             animation: scan-move 4s infinite linear;
         }
         .scanner-line {
             animation: scan-move 4s infinite linear;
         }
         .scanner-glow {
             animation: scan-move 4s infinite linear;
         }
         @keyframes scan-move {
             0% { left: -50%; mask-position: -50% 0; }
             100% { left: 150%; mask-position: 150% 0; }
         }
         @keyframes scan {
             0% { top: 0%; }
             100% { top: 100%; }
         }
         @font-face {
            font-family: 'Ma Shan Zheng';
            src: url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
         }
      `}</style>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const PhoenixCarSVG = ({ stroke, strokeWidth, fill, className, noText }: { stroke?: string, strokeWidth?: string, fill?: string, className?: string, noText?: boolean }) => (
    <svg viewBox="0 0 1000 300" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bodyRed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="50%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>

        {/* --- CAR BODY SHAPE --- */}
        <path 
            d="M 120 220 L 250 220 L 280 210 L 400 210 L 420 190 L 600 190 C 650 190 680 160 700 160 L 750 160 C 780 160 800 180 820 180 L 900 180 L 920 160 L 980 160 L 980 220 L 880 220 L 860 200 L 800 200 L 780 220 L 400 220 L 380 200 L 150 200 L 130 220 Z"
            fill={fill || "url(#bodyRed)"}
            stroke={stroke || "none"} 
            strokeWidth={strokeWidth} 
        />
        
        {/* --- COCKPIT / HALO --- */}
        <path 
            d="M 550 190 L 580 140 L 680 140 L 700 160"
            fill={fill || "#111"}
            stroke={stroke || "none"}
            strokeWidth={strokeWidth}
        />
        
        {/* --- REAR WING --- */}
        <path 
            d="M 900 160 L 900 120 L 970 120 L 980 160"
            fill={fill || "#000"}
            stroke={stroke || "none"}
            strokeWidth={strokeWidth}
        />

        {/* --- GOLD ACCENTS / PHOENIX WING PATTERN --- */}
        {!fill && (
            <path 
                d="M 450 200 Q 550 180 650 200 Q 600 170 500 190"
                fill="url(#goldGradient)"
                opacity="0.8"
            />
        )}
        {!fill && (
            <path 
                d="M 150 210 L 300 210 L 350 200"
                stroke="url(#goldGradient)"
                strokeWidth="3"
                fill="none"
            />
        )}

        {/* --- BRANDING TEXT (On Engine Cover) --- */}
        {!fill && !noText && (
            <text 
                x="600" 
                y="185" 
                fontFamily="'Microsoft YaHei', sans-serif" 
                fontWeight="bold" 
                fontSize="24" 
                fill="url(#goldGradient)"
                style={{ filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))' }}
                transform="skewX(-10)"
            >
                凤凰计划
            </text>
        )}

        {/* --- WHEELS (Simplified) --- */}
        <circle cx="265" cy="220" r="50" fill="#111" stroke={stroke || "#333"} strokeWidth={strokeWidth || "2"} />
        <circle cx="840" cy="220" r="52" fill="#111" stroke={stroke || "#333"} strokeWidth={strokeWidth || "2"} />
        {/* Wheel Rims */}
        {!fill && (
             <>
                <circle cx="265" cy="220" r="30" stroke="url(#goldGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <circle cx="840" cy="220" r="30" stroke="url(#goldGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <text x="820" y="225" fill="yellow" fontSize="10" fontFamily="sans-serif">PIRELLI</text>
             </>
        )}
    </svg>
);

const TechSpec = ({ label, value, icon, delay }: { label: string, value: string, icon: React.ReactNode, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="bg-white/5 backdrop-blur-md border border-white/5 p-4 md:p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
    >
        <div className="text-slate-500 group-hover:text-emerald-400 transition-colors mb-2 scale-90 group-hover:scale-110 duration-300">{icon}</div>
        <div className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-white font-bold font-mono text-base md:text-xl group-hover:text-emerald-200 transition-colors">{value}</div>
    </motion.div>
);

const StatusRow = ({ step, title, status, desc }: { step: string, title: string, status: string, desc: string }) => (
   <div className="flex gap-6 items-start group">
        <div className="font-mono text-emerald-900 text-xl font-bold pt-1 opacity-50 group-hover:opacity-100 group-hover:text-emerald-500 transition-colors">/{step}</div>
        <div className="flex-1 border-b border-white/10 pb-6 group-hover:border-emerald-500/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{title}</h3>
                <span className="text-[10px] font-bold bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/10 self-start md:self-auto group-hover:text-white group-hover:bg-emerald-900/30 group-hover:border-emerald-500/30 transition-all">{status}</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl group-hover:text-slate-300 transition-colors">{desc}</p>
        </div>
   </div>
);

const JobCategory = ({ title, roles, onApply, icon }: { title: string, roles: string[], onApply: (role: string) => void, icon?: React.ReactNode }) => (
   <div className="bg-white/[0.02] border border-white/5 rounded-lg p-6 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all group hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <h4 className="font-bold text-sm mb-6 flex items-center gap-3 text-slate-300 group-hover:text-white transition-colors uppercase tracking-wider">
          {icon ? icon : <Sparkles size={14} className="text-slate-600 group-hover:text-emerald-500 transition-colors"/>}
          {title}
      </h4>
      <ul className="space-y-3">
         {roles.map((r, i) => (
            <li 
                key={i} 
                className="text-sm text-slate-500 flex items-center justify-between cursor-pointer hover:text-emerald-400 transition-colors group/item" 
                onClick={() => onApply(r)}
            >
               <span className="flex items-center gap-3">
                   <span className="w-1 h-1 rounded-full bg-slate-700 group-hover/item:bg-emerald-500 transition-colors"></span> 
                   {r}
               </span>
               <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
            </li>
         ))}
      </ul>
   </div>
);

export default NewTeamProject;
