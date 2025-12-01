
export enum GameStatus {
  IDLE = 'IDLE',
  LEVEL_SELECT = 'LEVEL_SELECT',
  INSTRUCTION = 'INSTRUCTION',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  VICTORY_SEASON = 'VICTORY_SEASON'
}

export enum EntityType {
  PLAYER = 'PLAYER',
  ENEMY = 'ENEMY',    // 慢车 (Slow Car)
  COIN = 'COIN',      // 奖杯 (Trophy - 5 per level)
  PUDDLE = 'PUDDLE',  // 洗澡水积水 (Slippery/Blind)
  REPAIR = 'REPAIR'   // 维修扳手 (Heal)
}

export enum Team {
  RBR = 'RBR', // Red Bull
  FER = 'FER', // Ferrari
  MER = 'MER', // Mercedes
  MCL = 'MCL', // McLaren
  AST = 'AST', // Aston Martin
  ALP = 'ALP', // Alpine
  WIL = 'WIL', // Williams
  VCARB = 'VCARB', // RB
  SAU = 'SAU', // Sauber
  HAAS = 'HAAS' // Haas
}

export const TEAM_COLORS: Record<Team, { body: string; accent: string }> = {
  [Team.RBR]: { body: '#061D42', accent: '#F7CE18' },
  [Team.FER]: { body: '#DC0000', accent: '#FFF200' },
  [Team.MER]: { body: '#C0C0C0', accent: '#00A19B' },
  [Team.MCL]: { body: '#FF8000', accent: '#47C7FC' },
  [Team.AST]: { body: '#006F62', accent: '#CEDC00' },
  [Team.ALP]: { body: '#0090FF', accent: '#FD4BC7' },
  [Team.WIL]: { body: '#005AFF', accent: '#000000' },
  [Team.VCARB]: { body: '#1634BD', accent: '#FFFFFF' },
  [Team.SAU]: { body: '#52E252', accent: '#000000' },
  [Team.HAAS]: { body: '#FFFFFF', accent: '#B6BABD' },
};

export interface Entity {
  id: string;
  type: EntityType;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage width
  height: number; // Percentage height
  speedOffset: number;
  team?: Team; // For enemies
  collected?: boolean; // For trophies animation
}

export interface Segment {
  type: 'STRAIGHT' | 'CURVE_LEFT' | 'CURVE_RIGHT';
  intensity: number; // 0 to 1
  length: number; // Distance units
}

export interface LevelConfig {
  id: number;
  name: string;
  location: string;
  flag: string; // Emoji
  description: string;
  distance: number; // Increased for 1.5-2 min gameplay
  baseSpeed: number;
  spawnRate: number; 
  theme: {
    road: string;
    grass: string;
    sky: string;
    accent: string;
  };
}

// Distance ~10000 units approx 90-100 seconds at avg speed
export const LEVELS: LevelConfig[] = [
  { id: 1, name: "澳大利亚", location: "墨尔本阿尔伯特公园", flag: "🇦🇺", description: "揭幕战！全澳洲的希望！小心黑天鹅。", distance: 10000, baseSpeed: 0.8, spawnRate: 50, theme: { road: "#333", grass: "#4CAF50", sky: "from-sky-300 to-blue-500", accent: "#FFD700" } },
  { id: 2, name: "中国", location: "上海国际赛车场", flag: "🇨🇳", description: "飞哥的主场！上赛场的“上”字弯道等你挑战。", distance: 11000, baseSpeed: 0.85, spawnRate: 48, theme: { road: "#3e3e3e", grass: "#C8102E", sky: "from-red-900 to-yellow-700", accent: "#FF0000" } },
  { id: 3, name: "日本", location: "铃鹿赛道", flag: "🇯🇵", description: "S弯的考验，在这里失误就是上墙。", distance: 12000, baseSpeed: 0.9, spawnRate: 45, theme: { road: "#2c2c2c", grass: "#8BC34A", sky: "from-blue-200 to-white", accent: "#FFCDD2" } },
  { id: 4, name: "巴林", location: "萨基尔", flag: "🇧🇭", description: "沙漠夜赛，小心风沙迷眼。", distance: 12500, baseSpeed: 0.9, spawnRate: 45, theme: { road: "#1a1a1a", grass: "#D2B48C", sky: "from-black to-blue-900", accent: "#FFA500" } },
  { id: 5, name: "沙特", location: "吉达", flag: "🇸🇦", description: "极速街道赛，这简直是贴地飞行！", distance: 13000, baseSpeed: 1.0, spawnRate: 40, theme: { road: "#222", grass: "#006C35", sky: "from-purple-900 to-black", accent: "#00FF00" } },
  { id: 6, name: "迈阿密", location: "迈阿密花园", flag: "🇺🇸", description: "这虚假的码头水面...小心别开进去！", distance: 12500, baseSpeed: 0.95, spawnRate: 42, theme: { road: "#444", grass: "#00A3E0", sky: "from-cyan-400 to-pink-400", accent: "#FF69B4" } },
  { id: 7, name: "艾米利亚", location: "伊莫拉", flag: "🇮🇹", description: "法拉利后花园，全场红魔！", distance: 13000, baseSpeed: 0.95, spawnRate: 40, theme: { road: "#333", grass: "#388E3C", sky: "from-blue-400 to-blue-600", accent: "#CF2027" } },
  { id: 8, name: "摩纳哥", location: "蒙特卡洛", flag: "🇲🇨", description: "在这个澡盆一样的赛道，别掉进海里！", distance: 14000, baseSpeed: 1.0, spawnRate: 35, theme: { road: "#2d3748", grass: "#CBD5E0", sky: "from-blue-800 to-slate-400", accent: "#FFFFFF" } },
  { id: 9, name: "西班牙", location: "加泰罗尼亚", flag: "🇪🇸", description: "测试赛车性能的终极标尺。", distance: 13000, baseSpeed: 0.95, spawnRate: 40, theme: { road: "#333", grass: "#F1BF00", sky: "from-orange-200 to-sky-400", accent: "#AA151B" } },
  { id: 10, name: "加拿大", location: "蒙特利尔", flag: "🇨🇦", description: "土拨鼠出没！冠军墙在等你。", distance: 13500, baseSpeed: 1.0, spawnRate: 38, theme: { road: "#333", grass: "#2E7D32", sky: "from-blue-300 to-blue-500", accent: "#FF0000" } },
  { id: 11, name: "奥地利", location: "红牛环", flag: "🇦🇹", description: "这里全是橙色烟雾！", distance: 12500, baseSpeed: 1.05, spawnRate: 38, theme: { road: "#333", grass: "#4CAF50", sky: "from-blue-400 to-white", accent: "#ED2939" } },
  { id: 12, name: "英国", location: "银石", flag: "🇬🇧", description: "经典的雨战！洗澡水漫灌赛道！", distance: 15000, baseSpeed: 1.1, spawnRate: 32, theme: { road: "#1a202c", grass: "#1B5E20", sky: "from-gray-700 to-gray-900", accent: "#012169" } },
  { id: 13, name: "比利时", location: "斯帕", flag: "🇧🇪", description: "红河弯，油门到底不要怂！", distance: 16000, baseSpeed: 1.2, spawnRate: 30, theme: { road: "#222", grass: "#1B5E20", sky: "from-gray-500 to-green-800", accent: "#FFD700" } },
  { id: 14, name: "匈牙利", location: "亨格罗林", flag: "🇭🇺", description: "没有直道的卡丁车赛道。", distance: 13000, baseSpeed: 0.9, spawnRate: 45, theme: { road: "#333", grass: "#E8F5E9", sky: "from-blue-200 to-yellow-100", accent: "#43A047" } },
  { id: 15, name: "荷兰", location: "赞德沃特", flag: "🇳🇱", description: "维斯塔潘的主场，顶住压力！", distance: 13500, baseSpeed: 1.0, spawnRate: 38, theme: { road: "#333", grass: "#FF9800", sky: "from-orange-100 to-blue-300", accent: "#FF6D00" } },
  { id: 16, name: "意大利", location: "蒙扎", flag: "🇮🇹", description: "极速圣殿！没有刹车！", distance: 15000, baseSpeed: 1.3, spawnRate: 28, theme: { road: "#222", grass: "#1B5E20", sky: "from-blue-500 to-blue-700", accent: "#CF2027" } },
  { id: 17, name: "阿塞拜疆", location: "巴库", flag: "🇦🇿", description: "最窄的城堡弯，小心不要堵车。", distance: 14000, baseSpeed: 1.1, spawnRate: 35, theme: { road: "#333", grass: "#F5F5F5", sky: "from-blue-400 to-cyan-300", accent: "#0092BC" } },
  { id: 18, name: "新加坡", location: "滨海湾", flag: "🇸🇬", description: "湿热的街道赛，体能的极限。", distance: 15000, baseSpeed: 0.95, spawnRate: 40, theme: { road: "#1a1a1a", grass: "#000", sky: "from-indigo-900 to-black", accent: "#EF3340" } },
  { id: 19, name: "美国", location: "奥斯汀", flag: "🇺🇸", description: "第一弯那个大上坡！", distance: 13500, baseSpeed: 1.05, spawnRate: 38, theme: { road: "#333", grass: "#D84315", sky: "from-blue-500 to-red-500", accent: "#BF0A30" } },
  { id: 20, name: "墨西哥", location: "罗德里格斯", flag: "🇲🇽", description: "高原反应？引擎在燃烧！", distance: 13500, baseSpeed: 1.0, spawnRate: 38, theme: { road: "#333", grass: "#2E7D32", sky: "from-green-200 to-red-200", accent: "#006847" } },
  { id: 21, name: "巴西", location: "英特拉格斯", flag: "🇧🇷", description: "经典的塞纳S弯，雨神会降临吗？", distance: 14000, baseSpeed: 1.1, spawnRate: 35, theme: { road: "#333", grass: "#4CAF50", sky: "from-green-600 to-yellow-400", accent: "#FEDD00" } },
  { id: 22, name: "拉斯维加斯", location: "拉斯维加斯大道", flag: "🇺🇸", description: "在赌城狂飙，别看大球！", distance: 15000, baseSpeed: 1.25, spawnRate: 30, theme: { road: "#111", grass: "#000", sky: "from-purple-900 to-fuchsia-900", accent: "#C0C0C0" } },
  { id: 23, name: "卡塔尔", location: "卢塞尔", flag: "🇶🇦", description: "这里只有速度和路肩。", distance: 14000, baseSpeed: 1.15, spawnRate: 35, theme: { road: "#222", grass: "#8D1B3D", sky: "from-black to-purple-800", accent: "#8D1B3D" } },
  { id: 24, name: "阿布扎比", location: "亚斯码头", flag: "🇦🇪", description: "赛季收官！冠军就在眼前！", distance: 18000, baseSpeed: 1.3, spawnRate: 25, theme: { road: "#000", grass: "#00732F", sky: "from-indigo-900 via-purple-900 to-orange-500", accent: "#FF0000" } }
];

export interface GameState {
  status: GameStatus;
  currentLevelId: number;
  score: number;
  distance: number;
  lives: number;
  maxLives: number;
  speedMultiplier: number;
  commentary: string;
  isBlinded: boolean;
  playerX: number; // 0-100 percentage
  trophiesCollected: number; // 0 to 5
  currentCurvature: number; // -1 (Left) to 1 (Right)
}
