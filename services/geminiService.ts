
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuizQuestion = async (): Promise<QuizQuestion> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a challenging Formula 1 trivia question in Chinese (Simplified). Return structured JSON. The question should be about F1 history, cars, or drivers.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "The question text in Chinese" },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 options in Chinese"
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
            explanation: { type: Type.STRING, description: "Short explanation in Chinese" }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    // Fallback question in Chinese
    return {
      question: "谁拥有F1历史上最多的分站冠军纪录？",
      options: ["迈克尔·舒马赫", "路易斯·汉密尔顿", "塞巴斯蒂安·维特尔", "阿兰·普罗斯特"],
      correctAnswer: 1,
      explanation: "路易斯·汉密尔顿保持着最多的分站冠军纪录，超过了舒马赫之前的91场纪录。"
    };
  }
};

export const getYeFeiPanicCommentary = async (piastriPoints: number): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `你正在扮演中国著名F1解说员“叶飞”。你打赌如果皮亚斯特里(Oscar Piastri)今年拿不到冠军，你就全网直播洗澡。
      现在皮亚斯特里有 ${piastriPoints} 分。
      请生成一句简短的、幽默的、稍显惊慌的或嘴硬的中文评论。
      风格参考：嘴硬，找借口，或者偷偷研究沐浴露品牌。不超过30个字。`,
      config: {
        maxOutputTokens: 60,
        temperature: 1.0,
      }
    });
    return response.text || "这水温...是不是有点太热了？";
  } catch (error) {
    return "只要心中有P1，哪里都是领奖台...或者澡堂。";
  }
};
