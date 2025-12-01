import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCommentary = async (
  event: 'start' | 'crash' | 'overtake' | 'slip' | 'repair' | 'win' | 'lose',
  currentScore: number,
  levelName: string,
  location: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "五星体育，为您喝彩！(API Key Missing)";

  const prompt = `
    你现在扮演 **F1五星体育解说员“飞哥”**。
    背景：迈凯伦车手皮亚斯特里必须夺冠，否则你（飞哥）就要直播洗澡。
    当前比赛站点：${levelName} (${location})。
    当前分数：${currentScore}。
    
    事件：${event}
    
    任务：用中文写一句解说词（最多20字）。风格必须**激情、毒舌、幽默**，带有典型的体育解说腔调。
    
    - start: 比赛开始，介绍这是哪里，提到如果不赢就要洗澡的赌约。
    - crash: 玩家撞车了。表现出惊恐，担心自己要洗澡了。
    - overtake: 玩家得分或超车。猛吹皮亚斯特里。
    - slip: 玩家踩到了水坑打滑。吐槽这洗澡水怎么漏到赛道上了。
    - repair: 玩家吃了回血道具。松了一口气。
    - win: 本站获胜。疯狂庆祝，表示暂时安全了。
    - lose: 游戏结束。绝望，开始讨论洗澡水的温度，或者找借口。

    只输出解说词文本。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "比赛非常焦灼！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "信号连接中断...";
  }
};