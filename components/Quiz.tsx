
import React, { useState } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Loader2, CheckCircle2, XCircle, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Quiz: React.FC = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const loadQuestion = async () => {
    setLoading(true);
    setIsAnswered(false);
    setSelectedAnswer(null);
    const q = await generateQuizQuestion();
    setQuestion(q);
    setLoading(false);
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 pb-20 md:pt-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
           <h2 className="text-3xl font-racing font-bold text-white flex items-center justify-center gap-2">
             <Brain className="text-cyan-400" />
             F1 极速问答
           </h2>
           <p className="text-slate-400 mt-2">Powered by Gemini AI</p>
        </div>

        {!question && !loading && (
          <div className="text-center">
            <button 
              onClick={loadQuestion}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded skew-racing shadow-lg shadow-red-900/50 transition-all hover:scale-105"
            >
              启动引擎 (开始答题)
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-red-500 w-12 h-12" />
          </div>
        )}

        {question && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl relative overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-blue-600"></div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                let btnClass = "w-full text-left p-4 rounded-lg border border-slate-600 transition-all duration-200 font-medium ";
                
                if (isAnswered) {
                   if (idx === question.correctAnswer) btnClass += "bg-green-500/20 border-green-500 text-green-300";
                   else if (idx === selectedAnswer) btnClass += "bg-red-500/20 border-red-500 text-red-300";
                   else btnClass += "opacity-50";
                } else {
                   btnClass += "hover:bg-slate-700 hover:border-slate-400 bg-slate-900/50";
                }

                return (
                  <button 
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    <div className="flex items-center justify-between">
                       <span>{["A", "B", "C", "D"][idx]}. {opt}</span>
                       {isAnswered && idx === question.correctAnswer && <CheckCircle2 className="text-green-500" />}
                       {isAnswered && idx === selectedAnswer && idx !== question.correctAnswer && <XCircle className="text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-slate-700"
              >
                 <p className="text-cyan-400 font-bold mb-1">遥测数据 (解析):</p>
                 <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
                 <button 
                   onClick={loadQuestion}
                   className="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold w-full"
                 >
                   下一题
                 </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
