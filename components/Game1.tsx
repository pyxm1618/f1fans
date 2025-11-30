import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Share2, MessageCircle, CheckCircle2 } from 'lucide-react';

type Stage = 'INTRO' | 'Q1' | 'Q2' | 'Q3' | 'ENDING';

interface Choice {
  id: string;
  text: string;
  description?: string;
}

const Game1: React.FC = () => {
  const [stage, setStage] = useState<Stage>('INTRO');
  const [history, setHistory] = useState<string[]>([]);
  const [ending, setEnding] = useState<number>(0);

  const resetGame = () => {
    setStage('INTRO');
    setHistory([]);
    setEnding(0);
  };

  const handleChoice = (choiceId: string) => {
    const newHistory = [...history, choiceId];
    setHistory(newHistory);

    if (stage === 'Q1') setStage('Q2');
    else if (stage === 'Q2') setStage('Q3');
    else if (stage === 'Q3') {
      calculateEnding(newHistory);
      setStage('ENDING');
    }
  };

  const calculateEnding = (finalHistory: string[]) => {
    // Simple logic to determine ending based on combination of choices
    // Count A's, B's, C's or specific combinations
    const countA = finalHistory.filter(h => h.endsWith('A')).length;
    const countB = finalHistory.filter(h => h.endsWith('B')).length;
    const countC = finalHistory.filter(h => h.endsWith('C')).length;

    if (countA >= 2) setEnding(1); // Stealth/Professional
    else if (countB >= 2) setEnding(2); // Chaos/Dangerous
    else if (countC >= 2) setEnding(3); // Science/Public
    else setEnding(4); // Balanced/Weird Mixed
  };

  const renderContent = () => {
    switch (stage) {
      case 'INTRO':
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl mb-4">🚿</div>
            <h1 className="text-3xl font-bold text-white mb-2">飞哥洗澡模拟器</h1>
            <p className="text-slate-400 text-lg mb-8">
              帮助飞哥完成一次"史诗级洗澡"。你的每一个选择都至关重要！
            </p>
            <button
              onClick={() => setStage('Q1')}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-900/50"
            >
              开始洗澡
            </button>
          </div>
        );

      case 'Q1':
        return (
          <QuestionBlock
            title="第一关：选择良辰吉日"
            description="飞哥站在浴室门口，犹豫不决... 什么时候进去最合适？"
            choices={[
              { id: '1A', text: '深夜12点', description: '偷偷洗，避开队友，享受孤独的宁静' },
              { id: '1B', text: '赛后直接冲', description: '全队围观，展现真正的技术' },
              { id: '1C', text: '颁奖台前', description: '一边喷香槟一边洗，直播效果拉满' },
            ]}
            onSelect={handleChoice}
          />
        );

      case 'Q2':
        return (
          <QuestionBlock
            title="第二关：选择战术顾问"
            description="面对复杂的浴室环境，你需要专业的战术指导。"
            choices={[
              { id: '2A', text: '请诺里斯指导', description: '获得"专业车手视角"，走位风骚' },
              { id: '2B', text: '问潘子拿水枪', description: '危险选择！可能会引发浴室战争' },
              { id: '2C', text: '自己研究物理学', description: '计算水流抛物线，科学洗澡' },
            ]}
            onSelect={handleChoice}
          />
        );

      case 'Q3':
        return (
          <QuestionBlock
            title="第三关：突发状况！"
            description="警报！警报！出现意料之外的情况！"
            choices={[
              { id: '3A', text: '队友在门口偷拍', description: '立刻摆Pose，不能输了气势' },
              { id: '3B', text: '肥皂掉了', description: '那个... 捡还是不捡？这是一个问题' },
              { id: '3C', text: '水温骤降', description: '启动人体发热引擎，硬抗！' },
            ]}
            onSelect={handleChoice}
          />
        );

      case 'ENDING':
        return <EndingScreen endingId={ending} onReset={resetGame} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-900 font-sans">
      <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700 p-6 md:p-10 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const QuestionBlock: React.FC<{
  title: string;
  description: string;
  choices: Choice[];
  onSelect: (id: string) => void;
}> = ({ title, description, choices, onSelect }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-orange-400">{title}</h2>
      <p className="text-slate-300 text-lg">{description}</p>
    </div>
    <div className="space-y-3 mt-8">
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => onSelect(choice.id)}
          className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-600 border border-slate-600 hover:border-orange-500/50 rounded-xl transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white group-hover:text-orange-400 transition-colors">
              {choice.text}
            </span>
            <MessageCircle size={18} className="text-slate-500 group-hover:text-orange-400" />
          </div>
          {choice.description && (
            <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-300">
              {choice.description}
            </p>
          )}
        </button>
      ))}
    </div>
  </div>
);

const EndingScreen: React.FC<{ endingId: number; onReset: () => void }> = ({ endingId, onReset }) => {
  const endings = {
    1: {
      title: "结局一：隐形守护者",
      desc: "你成功在深夜完成了洗澡任务，没有惊动任何人。诺里斯为你点赞：这才是顶级车手的隐秘行动！",
      icon: "🥷",
      color: "text-purple-400"
    },
    2: {
      title: "结局二：澡堂战神",
      desc: "场面一度失控！你拿着潘子的水枪和队友在浴室展开了激战。虽然澡没洗干净，但你赢得了快乐。",
      icon: "🔫",
      color: "text-red-500"
    },
    3: {
      title: "结局三：科学怪人",
      desc: "你通过精确计算水流角度和温度，完成了一次理论上完美的洗澡。虽然大家都觉得你疯了。",
      icon: "👨‍🔬",
      color: "text-blue-400"
    },
    4: {
      title: "结局四：这就是F1吗",
      desc: "经历了一系列离谱的选择，你终于洗完了。这是一个充满意外但又莫名其妙合理的结局。",
      icon: "🏎️",
      color: "text-yellow-400"
    }
  };

  const currentEnding = endings[endingId as keyof typeof endings];

  return (
    <div className="text-center space-y-6">
      <div className="text-8xl mb-4 animate-bounce">{currentEnding.icon}</div>
      <h2 className={`text-3xl font-bold ${currentEnding.color}`}>{currentEnding.title}</h2>
      <p className="text-slate-300 text-lg leading-relaxed px-4">
        {currentEnding.desc}
      </p>
      
      <div className="flex flex-col gap-3 pt-6">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
        >
          <RotateCcw size={20} />
          再玩一次
        </button>
        <button
          onClick={() => alert('分享功能开发中... 假装你已经分享了！')}
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg font-semibold transition-colors"
        >
          <Share2 size={20} />
          分享结局
        </button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <div className="flex justify-center gap-4 text-slate-500 text-sm">
          <span className={endingId === 1 ? "text-purple-400 font-bold" : ""}>[结局1]</span>
          <span className={endingId === 2 ? "text-red-500 font-bold" : ""}>[结局2]</span>
          <span className={endingId === 3 ? "text-blue-400 font-bold" : ""}>[结局3]</span>
          <span className={endingId === 4 ? "text-yellow-400 font-bold" : ""}>[结局4]</span>
        </div>
        <p className="mt-2 text-xs text-slate-600">收集所有结局解锁... 什么也没有</p>
      </div>
    </div>
  );
};

export default Game1;
