
import { RaceEvent, Driver, Constructor, CircuitInfo, TrackGeo, RaceResult } from '../types';

// API Base URL
const API_BASE = 'https://api.jolpi.ca/ergast/f1';

// --- RICH DATA DICTIONARIES (STATIC) ---
const CIRCUIT_DETAILS: Record<string, CircuitInfo> = {
  "Bahrain International Circuit": { length: "5.412 km", laps: 57, distance: "308.238 km", lapRecord: { time: "1:31.447", driver: "De la Rosa", year: "2005" } },
  "Jeddah Corniche Circuit": { length: "6.174 km", laps: 50, distance: "308.450 km", lapRecord: { time: "1:27.474", driver: "Hamilton", year: "2021" } },
  "Albert Park Grand Prix Circuit": { length: "5.278 km", laps: 58, distance: "306.124 km", lapRecord: { time: "1:19.813", driver: "Leclerc", year: "2024" } },
  "Suzuka Circuit": { length: "5.807 km", laps: 53, distance: "307.471 km", lapRecord: { time: "1:30.983", driver: "Hamilton", year: "2019" } },
  "Shanghai International Circuit": { length: "5.451 km", laps: 56, distance: "305.066 km", lapRecord: { time: "1:32.238", driver: "Schumacher", year: "2004" } },
  "Miami International Autodrome": { length: "5.412 km", laps: 57, distance: "308.326 km", lapRecord: { time: "1:29.708", driver: "Verstappen", year: "2023" } },
  "Autodromo Enzo e Dino Ferrari": { length: "4.909 km", laps: 63, distance: "309.049 km", lapRecord: { time: "1:15.484", driver: "Hamilton", year: "2020" } },
  "Circuit de Monaco": { length: "3.337 km", laps: 78, distance: "260.286 km", lapRecord: { time: "1:12.909", driver: "Hamilton", year: "2021" } },
  "Circuit Gilles Villeneuve": { length: "4.361 km", laps: 70, distance: "305.270 km", lapRecord: { time: "1:13.078", driver: "Bottas", year: "2019" } },
  "Circuit de Barcelona-Catalunya": { length: "4.657 km", laps: 66, distance: "307.236 km", lapRecord: { time: "1:16.330", driver: "Verstappen", year: "2023" } },
  "Red Bull Ring": { length: "4.318 km", laps: 71, distance: "306.452 km", lapRecord: { time: "1:05.619", driver: "Sainz", year: "2020" } },
  "Silverstone Circuit": { length: "5.891 km", laps: 52, distance: "306.198 km", lapRecord: { time: "1:27.097", driver: "Verstappen", year: "2020" } },
  "Hungaroring": { length: "4.381 km", laps: 70, distance: "306.630 km", lapRecord: { time: "1:16.627", driver: "Hamilton", year: "2020" } },
  "Circuit de Spa-Francorchamps": { length: "7.004 km", laps: 44, distance: "308.052 km", lapRecord: { time: "1:46.286", driver: "Bottas", year: "2018" } },
  "Circuit Zandvoort": { length: "4.259 km", laps: 72, distance: "306.587 km", lapRecord: { time: "1:11.097", driver: "Hamilton", year: "2021" } },
  "Autodromo Nazionale di Monza": { length: "5.793 km", laps: 53, distance: "306.720 km", lapRecord: { time: "1:21.046", driver: "Barrichello", year: "2004" } },
  "Baku City Circuit": { length: "6.003 km", laps: 51, distance: "306.049 km", lapRecord: { time: "1:43.009", driver: "Leclerc", year: "2019" } },
  "Marina Bay Street Circuit": { length: "4.940 km", laps: 62, distance: "306.143 km", lapRecord: { time: "1:35.867", driver: "Hamilton", year: "2023" } },
  "Circuit of the Americas": { length: "5.513 km", laps: 56, distance: "308.405 km", lapRecord: { time: "1:36.169", driver: "Leclerc", year: "2019" } },
  "Autódromo Hermanos Rodríguez": { length: "4.304 km", laps: 71, distance: "305.354 km", lapRecord: { time: "1:17.774", driver: "Bottas", year: "2021" } },
  "Autódromo José Carlos Pace": { length: "4.309 km", laps: 71, distance: "305.879 km", lapRecord: { time: "1:10.540", driver: "Bottas", year: "2018" } },
  "Las Vegas Strip Circuit": { length: "6.201 km", laps: 50, distance: "309.958 km", lapRecord: { time: "1:35.490", driver: "Piastri", year: "2023" } },
  "Lusail International Circuit": { length: "5.419 km", laps: 57, distance: "308.611 km", lapRecord: { time: "1:24.319", driver: "Verstappen", year: "2023" } },
  "Yas Marina Circuit": { length: "5.281 km", laps: 58, distance: "306.183 km", lapRecord: { time: "1:26.103", driver: "Verstappen", year: "2021" } },
};

const normalizeFamilyName = (name?: string): string => {
  if (!name) return '';
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/gi, '')
    .toLowerCase();
};

const driverHeadshots: Record<string, string> = {
  verstappen: new URL('../drivers/Max_Verstappen_Red_Bull_Racing.webp', import.meta.url).href,
  norris: new URL('../drivers/Lando_Norris_McLaren.webp', import.meta.url).href,
  leclerc: new URL('../drivers/Charles_Leclerc_Ferrari.webp', import.meta.url).href,
  piastri: new URL('../drivers/Oscar_Piastri_McLaren.webp', import.meta.url).href,
  hamilton: new URL('../drivers/Lewis_Hamilton_Ferrari.webp', import.meta.url).href,
  sainz: new URL('../drivers/Carlos_Sainz_Williams.webp', import.meta.url).href,
  russell: new URL('../drivers/George_Russell_Mercedes.webp', import.meta.url).href,
  alonso: new URL('../drivers/Fernando_Alonso_Aston_Martin.webp', import.meta.url).href,
  stroll: new URL('../drivers/Lance_Stroll_Aston_Martin.webp', import.meta.url).href,
  tsunoda: new URL('../drivers/yuki_tsunoda_Red_Bull.webp', import.meta.url).href,
  albon: new URL('../drivers/Alexander_Albon_Williams.webp', import.meta.url).href,
  hulkenberg: new URL('../drivers/Nico_Hulkenberg_Kick_Sauber.webp', import.meta.url).href,
  gasly: new URL('../drivers/Pierre_Gasly_Alpine.webp', import.meta.url).href,
  ocon: new URL('../drivers/Esteban_Ocon_Haas.webp', import.meta.url).href,
  colapinto: new URL('../drivers/Franco_Colapinto_Alpine.webp', import.meta.url).href,
  bortoleto: new URL('../drivers/Gabriel_Bortoleto_Kick_Sauber.webp', import.meta.url).href,
  doohan: new URL('../drivers/Jack_Doohan_Alpine.webp', import.meta.url).href,
  antonelli: new URL('../drivers/Kimi_Antonelli_Mercedes.webp', import.meta.url).href,
  bearman: new URL('../drivers/Oliver_Bearman_Haas.webp', import.meta.url).href,
  lawson: new URL('../drivers/Liam_Lawson_Racing_Bulls.webp', import.meta.url).href
};

const getLocalHeadshot = (familyName: string): string | undefined => {
  const normalized = normalizeFamilyName(familyName);
  if (!normalized) return undefined;
  return driverHeadshots[normalized];
};

const DEFAULT_DRIVER_HEADSHOT = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

// Driver Headshots (Prefer local assets, fall back to open-source placeholders)
const DRIVER_ASSETS: Record<string, { img: string, country: string }> = {
  "Verstappen": { img: getLocalHeadshot("Verstappen") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Max_Verstappen_2017_Malaysia_2.jpg/440px-Max_Verstappen_2017_Malaysia_2.jpg", country: "🇳🇱" },
  "Norris": { img: getLocalHeadshot("Norris") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Lando_Norris_2024_China.jpg/440px-Lando_Norris_2024_China.jpg", country: "🇬🇧" },
  "Leclerc": { img: getLocalHeadshot("Leclerc") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Charles_Leclerc_2024_China.jpg/440px-Charles_Leclerc_2024_China.jpg", country: "🇲🇨" },
  "Piastri": { img: getLocalHeadshot("Piastri") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Oscar_Piastri_2024_China.jpg/440px-Oscar_Piastri_2024_China.jpg", country: "🇦🇺" },
  "Hamilton": { img: getLocalHeadshot("Hamilton") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg/440px-Lewis_Hamilton_2016_Malaysia_2.jpg", country: "🇬🇧" },
  "Sainz": { img: getLocalHeadshot("Sainz") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Carlos_Sainz_Jr_2024_China.jpg/440px-Carlos_Sainz_Jr_2024_China.jpg", country: "🇪🇸" },
  "Russell": { img: getLocalHeadshot("Russell") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/George_Russell_2024_China.jpg/440px-George_Russell_2024_China.jpg", country: "🇬🇧" },
  "Alonso": { img: getLocalHeadshot("Alonso") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fernando_Alonso_2024_China.jpg/440px-Fernando_Alonso_2024_China.jpg", country: "🇪🇸" },
  "Pérez": { img: getLocalHeadshot("Pérez") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Sergio_Perez_2019_Malaysia.jpg/440px-Sergio_Perez_2019_Malaysia.jpg", country: "🇲🇽" },
  "Stroll": { img: getLocalHeadshot("Stroll") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Lance_Stroll_2017_Malaysia.jpg/440px-Lance_Stroll_2017_Malaysia.jpg", country: "🇨🇦" },
  "Tsunoda": { img: getLocalHeadshot("Tsunoda") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Yuki_Tsunoda_2024_China.jpg/440px-Yuki_Tsunoda_2024_China.jpg", country: "🇯🇵" },
  "Albon": { img: getLocalHeadshot("Albon") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Alexander_Albon_2024_China.jpg/440px-Alexander_Albon_2024_China.jpg", country: "🇹🇭" },
  "Zhou": { img: getLocalHeadshot("Zhou") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Zhou_Guanyu_2024_China.jpg/440px-Zhou_Guanyu_2024_China.jpg", country: "🇨🇳" },
  "Bottas": { img: getLocalHeadshot("Bottas") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Valtteri_Bottas_2019_Malaysia.jpg/440px-Valtteri_Bottas_2019_Malaysia.jpg", country: "🇫🇮" },
  "Hülkenberg": { img: getLocalHeadshot("Hülkenberg") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Nico_Hulkenberg_2016_Malaysia.jpg/440px-Nico_Hulkenberg_2016_Malaysia.jpg", country: "🇩🇪" },
  "Magnussen": { img: getLocalHeadshot("Magnussen") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kevin_Magnussen_2024_China.jpg/440px-Kevin_Magnussen_2024_China.jpg", country: "🇩🇰" },
  "Gasly": { img: getLocalHeadshot("Gasly") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Pierre_Gasly_2024_China.jpg/440px-Pierre_Gasly_2024_China.jpg", country: "🇫🇷" },
  "Ocon": { img: getLocalHeadshot("Ocon") ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Esteban_Ocon_2017_Malaysia.jpg/440px-Esteban_Ocon_2017_Malaysia.jpg", country: "🇫🇷" },
  "Colapinto": { img: getLocalHeadshot("Colapinto") ?? DEFAULT_DRIVER_HEADSHOT, country: "🇦🇷" },
  "Bortoleto": { img: getLocalHeadshot("Bortoleto") ?? DEFAULT_DRIVER_HEADSHOT, country: "🇧🇷" },
  "Doohan": { img: getLocalHeadshot("Doohan") ?? DEFAULT_DRIVER_HEADSHOT, country: "🇦🇺" },
  "Antonelli": { img: getLocalHeadshot("Antonelli") ?? DEFAULT_DRIVER_HEADSHOT, country: "🇮🇹" },
  "Bearman": { img: getLocalHeadshot("Bearman") ?? DEFAULT_DRIVER_HEADSHOT, country: "🇬🇧" },
  "Lawson": { img: getLocalHeadshot("Lawson") ?? DEFAULT_DRIVER_HEADSHOT, country: "🇳🇿" },
  "default": { img: DEFAULT_DRIVER_HEADSHOT, country: "🏁" }
};

const DRIVER_ASSET_LOOKUP: Record<string, { img: string; country: string }> = Object.keys(DRIVER_ASSETS).reduce(
  (acc, key) => {
    acc[normalizeFamilyName(key)] = DRIVER_ASSETS[key];
    return acc;
  },
  {} as Record<string, { img: string; country: string }>
);

const getDriverAsset = (familyName: string): { img: string; country: string } => {
  const normalized = normalizeFamilyName(familyName);
  const baseAsset = DRIVER_ASSET_LOOKUP[normalized] || DRIVER_ASSETS["default"];
  if (normalized && driverHeadshots[normalized]) {
    return { ...baseAsset, img: driverHeadshots[normalized] };
  }
  return baseAsset;
};

// --- TRANSLATION MAPS ---
const DRIVER_TRANSLATIONS: Record<string, string> = {
  "Verstappen": "维斯塔潘", "Pérez": "佩雷兹", "Alonso": "阿隆索", "Sainz": "塞恩斯",
  "Hamilton": "汉密尔顿", "Stroll": "斯特罗尔", "Russell": "拉塞尔", "Bottas": "博塔斯",
  "Gasly": "加斯利", "Hülkenberg": "霍肯伯格", "Ocon": "奥康", "Albon": "阿尔本",
  "Tsunoda": "角田裕毅", "Magnussen": "马格努森", "Zhou": "周冠宇", "Piastri": "皮亚斯特里",
  "Norris": "诺里斯", "Leclerc": "勒克莱尔", "Ricciardo": "里卡多", "Lawson": "劳森",
  "Bearman": "贝尔曼", "Antonelli": "安东内利", "Doohan": "杜汉", "Colapinto": "科拉平托",
  "Hadjar": "哈贾尔", "Bortoleto": "博托莱托"
};

const TEAM_TRANSLATIONS: Record<string, string> = {
  "Red Bull": "红牛", "Ferrari": "法拉利", "Mercedes": "梅赛德斯", "Alpine": "阿尔派",
  "McLaren": "迈凯伦", "Alfa Romeo": "阿尔法·罗密欧", "Aston Martin": "阿斯顿·马丁",
  "Haas": "哈斯", "AlphaTauri": "小红牛", "RB": "红牛二队", "Williams": "威廉姆斯",
  "Sauber": "索博", "Kick Sauber": "索博", "Audi": "奥迪"
};

const COUNTRY_TRANSLATIONS: Record<string, string> = {
  "Australia": "澳大利亚", "China": "中国", "Japan": "日本", "Bahrain": "巴林",
  "Saudi Arabia": "沙特阿拉伯", "USA": "美国", "United States": "美国", "Italy": "意大利",
  "Monaco": "摩纳哥", "Spain": "西班牙", "Canada": "加拿大", "Austria": "奥地利",
  "UK": "英国", "Great Britain": "英国", "Belgium": "比利时", "Hungary": "匈牙利",
  "Netherlands": "荷兰", "Azerbaijan": "阿塞拜疆", "Singapore": "新加坡", "Mexico": "墨西哥",
  "Brazil": "巴西", "Qatar": "卡塔尔", "UAE": "阿联酋", "Abu Dhabi": "阿布扎比"
};

const CIRCUIT_TRANSLATIONS: Record<string, string> = {
  "Albert Park Grand Prix Circuit": "阿尔伯特公园赛道",
  "Shanghai International Circuit": "上海国际赛车场",
  "Suzuka Circuit": "铃鹿赛道",
  "Bahrain International Circuit": "巴林国际赛道",
  "Jeddah Corniche Circuit": "吉达滨海赛道",
  "Miami International Autodrome": "迈阿密国际赛道",
  "Autodromo Enzo e Dino Ferrari": "伊莫拉赛道",
  "Circuit de Monaco": "摩纳哥赛道",
  "Circuit de Barcelona-Catalunya": "加泰罗尼亚赛道",
  "Circuit Gilles Villeneuve": "吉尔·维伦纽夫赛道",
  "Red Bull Ring": "红牛环赛道",
  "Silverstone Circuit": "银石赛道",
  "Circuit de Spa-Francorchamps": "斯帕-弗朗科尔尚赛道",
  "Hungaroring": "亨格罗林赛道",
  "Circuit Zandvoort": "赞德沃特赛道",
  "Autodromo Nazionale di Monza": "蒙扎赛道",
  "Baku City Circuit": "巴库城市赛道",
  "Marina Bay Street Circuit": "滨海湾市街赛道",
  "Circuit of the Americas": "美洲赛道",
  "Autódromo Hermanos Rodríguez": "罗德里格斯兄弟赛道",
  "Autódromo José Carlos Pace": "英特拉格斯赛道",
  "Las Vegas Strip Circuit": "拉斯维加斯大道赛道",
  "Lusail International Circuit": "卢赛尔国际赛道",
  "Yas Marina Circuit": "亚斯码头赛道"
};

// Full Set of 24 Track SVG Paths
const TRACK_PATHS: Record<string, TrackGeo> = {
  "Bahrain International Circuit": { path: "M20 30 L60 30 L80 50 L90 50 L80 70 L60 70 L40 90 L20 70 L20 60 L40 50 L30 40 L20 30", rotation: 0 },
  "Jeddah Corniche Circuit": { path: "M30 10 L70 10 L80 20 L80 80 L70 90 L30 90 L20 80 L20 20 L30 10 M30 20 L30 80 M70 20 L70 80", rotation: 90 },
  "Albert Park Grand Prix Circuit": { path: "M30 20 L70 20 Q90 20 90 40 L90 70 Q90 90 70 90 L30 90 Q10 90 10 70 L10 40 Q10 20 30 20 M30 30 L30 35 M70 80 L70 85", rotation: 0 },
  "Suzuka Circuit": { path: "M20 80 L40 50 L80 50 L80 20 L50 20 L30 40 M40 50 L60 80 L80 80", rotation: 0 },
  "Shanghai International Circuit": { path: "M20 80 L80 80 C95 80 95 60 80 60 L60 50 L60 20 C60 10 50 10 40 20 L20 40 C10 50 10 60 20 70 L20 80", rotation: 0 },
  "Miami International Autodrome": { path: "M20 30 L80 30 L90 50 L80 80 L40 80 L20 60 L20 30", rotation: 0 },
  "Autodromo Enzo e Dino Ferrari": { path: "M20 30 L70 20 L90 40 L80 80 L30 80 L20 60 L20 30", rotation: 0 },
  "Circuit de Monaco": { path: "M30 80 L30 40 L50 20 L70 30 L70 60 L50 70 L50 80 L30 80", rotation: 0 },
  "Circuit Gilles Villeneuve": { path: "M20 30 L80 30 L90 50 L80 80 L20 80 L10 60 L20 30", rotation: 0 },
  "Circuit de Barcelona-Catalunya": { path: "M30 20 L80 20 L90 50 L80 80 L40 80 L20 60 L30 20", rotation: 0 },
  "Red Bull Ring": { path: "M20 60 L40 20 L80 20 L90 60 L60 80 L30 80 L20 60", rotation: 0 },
  "Silverstone Circuit": { path: "M40 10 L70 10 L90 30 L80 70 L60 90 L30 80 L10 50 L20 30 L40 10", rotation: 0 },
  "Hungaroring": { path: "M30 20 L80 20 L90 40 L80 80 L40 80 L20 60 L20 30 L30 20", rotation: 0 },
  "Circuit de Spa-Francorchamps": { path: "M20 80 L10 40 L50 10 L80 20 L90 50 L60 80 L20 80", rotation: 0 },
  "Circuit Zandvoort": { path: "M30 30 L70 20 L90 50 L70 80 L30 80 L20 60 L30 30", rotation: 0 },
  "Autodromo Nazionale di Monza": { path: "M20 80 L20 30 L50 20 L80 30 L80 80 L50 90 L20 80", rotation: 90 },
  "Baku City Circuit": { path: "M20 70 L20 30 L60 30 L60 20 L80 20 L80 50 L60 50 L60 80 L20 80 L20 70", rotation: 0 },
  "Marina Bay Street Circuit": { path: "M20 30 L80 30 L90 60 L70 90 L40 90 L10 60 L20 30", rotation: 0 },
  "Circuit of the Americas": { path: "M20 80 L10 40 L40 20 L80 30 L90 70 L50 90 L20 80", rotation: 0 },
  "Autódromo Hermanos Rodríguez": { path: "M20 80 L20 20 L80 20 L90 50 L80 80 L60 80 L50 60 L40 80 L20 80", rotation: 0 },
  "Autódromo José Carlos Pace": { path: "M40 20 L80 20 L90 50 L70 80 L30 80 L20 50 L40 20", rotation: 0 },
  "Las Vegas Strip Circuit": { path: "M20 80 L20 30 L50 20 L80 30 L80 80 L50 90 L20 80", rotation: 180 },
  "Lusail International Circuit": { path: "M30 20 L70 20 L90 50 L70 90 L30 90 L10 50 L30 20", rotation: 0 },
  "Yas Marina Circuit": { path: "M20 80 L20 30 L40 20 L80 20 L90 50 L80 80 L50 80 L40 60 L20 80", rotation: 0 },
};

// --- HELPER FUNCTIONS ---
const translateDriver = (familyName: string): string => DRIVER_TRANSLATIONS[familyName] || familyName;
const translateTeam = (name: string): string => {
  for (const key in TEAM_TRANSLATIONS) {
    if (name.includes(key)) return TEAM_TRANSLATIONS[key];
  }
  return name;
};
const translateCountry = (name: string): string => COUNTRY_TRANSLATIONS[name] || name;
const translateCircuit = (name: string): string => CIRCUIT_TRANSLATIONS[name] || name;
const getTeamColor = (teamName: string): string => {
  if (teamName.includes('Red Bull')) return '#3671C6';
  if (teamName.includes('Mercedes')) return '#27F4D2';
  if (teamName.includes('Ferrari')) return '#E80020';
  if (teamName.includes('McLaren')) return '#FF8000';
  if (teamName.includes('Aston Martin')) return '#229971';
  if (teamName.includes('Alpine')) return '#FF87BC';
  if (teamName.includes('Williams')) return '#64C4FF';
  if (teamName.includes('Haas')) return '#B6BABD';
  if (teamName.includes('Sauber') || teamName.includes('Alfa') || teamName.includes('Kick')) return '#52E252';
  if (teamName.includes('RB') || teamName.includes('AlphaTauri')) return '#6692FF';
  return '#999999';
};

const formatRaceName = (raceName: string, country: string, locality: string): string => {
    if (locality === "Shanghai") return "中国大奖赛 (上海站)";
    if (country === "USA") {
        if (locality.includes("Miami")) return "迈阿密大奖赛";
        if (locality.includes("Vegas")) return "拉斯维加斯大奖赛";
        return "美国大奖赛";
    }
    if (country === "Italy") {
        if (locality.includes("Imola")) return "伊莫拉大奖赛";
        if (locality.includes("Monza")) return "意大利大奖赛";
    }
    const translatedCountry = translateCountry(country);
    return `${translatedCountry}大奖赛`;
};

// New: Convert UTC to Beijing Time
const formatToBeijingTime = (utcTime?: string): string => {
  if (!utcTime) return "TBA";
  // The API returns "14:00:00Z"
  const today = new Date().toISOString().split('T')[0];
  // Remove Z if present to prevent double timezone interpretation if manually handling
  const cleanTime = utcTime.replace('Z', '');
  const date = new Date(`${today}T${cleanTime}Z`); // Treat as UTC
  return date.toLocaleTimeString('zh-CN', { 
    timeZone: 'Asia/Shanghai', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
};

const FALLBACK_SCHEDULE_2025: RaceEvent[] = [
  { id: "1", round: 1, name: "澳大利亚大奖赛", location: "墨尔本", country: "澳大利亚", date: "2025-03-16", time: "04:00Z", bjTime: "12:00", month: "3月", day: "16", flag: "🇦🇺", circuitName: "阿尔伯特公园赛道", isSprint: false, status: 'COMPLETED', winner: "皮亚斯特里", trackGeo: TRACK_PATHS["Albert Park Grand Prix Circuit"] },
  { id: "2", round: 2, name: "中国大奖赛 (上海站)", location: "上海", country: "中国", date: "2025-03-23", time: "07:00Z", bjTime: "15:00", month: "3月", day: "23", flag: "🇨🇳", circuitName: "上海国际赛车场", isSprint: true, status: 'COMPLETED', winner: "诺里斯", trackGeo: TRACK_PATHS["Shanghai International Circuit"] },
];

const fallbackVerstappenAsset = getDriverAsset('Verstappen');
const fallbackNorrisAsset = getDriverAsset('Norris');
const fallbackPiastriAsset = getDriverAsset('Piastri');

const FALLBACK_DRIVERS_2024: Driver[] = [
  { id: 'verstappen', code: 'VER', name: '维斯塔潘', team: '红牛', teamColor: '#3671C6', points: 400, position: 1, wins: 19, podiums: 21, number: 1, headshotUrl: fallbackVerstappenAsset.img, countryCode: fallbackVerstappenAsset.country },
  { id: 'norris', code: 'NOR', name: '诺里斯', team: '迈凯伦', teamColor: '#FF8000', points: 350, position: 2, wins: 5, podiums: 15, number: 4, headshotUrl: fallbackNorrisAsset.img, countryCode: fallbackNorrisAsset.country },
  { id: 'piastri', code: 'PIA', name: '皮亚斯特里', team: '迈凯伦', teamColor: '#FF8000', points: 280, position: 4, wins: 2, podiums: 8, number: 81, headshotUrl: fallbackPiastriAsset.img, countryCode: fallbackPiastriAsset.country },
];

const FALLBACK_CONSTRUCTORS_2024: Constructor[] = [
  { id: 'mclaren', name: '迈凯伦', points: 650, position: 1, wins: 7, color: '#FF8000' },
  { id: 'ferrari', name: '法拉利', points: 600, position: 2, wins: 5, color: '#E80020' },
  { id: 'redbull', name: '红牛', points: 580, position: 3, wins: 19, color: '#3671C6' },
];

// --- API FETCHERS ---

export const fetchStandings = async (): Promise<{drivers: Driver[], constructors: Constructor[]}> => {
  try {
    let driverRes = await fetch(`${API_BASE}/current/driverStandings.json`);
    let constRes = await fetch(`${API_BASE}/current/constructorStandings.json`);

    let driverData = await driverRes.json();
    let constData = await constRes.json();

    let driversList = driverData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    let constList = constData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];

    if (driversList.length === 0) {
       console.log("Current season empty, falling back to 2024");
       driverRes = await fetch(`${API_BASE}/2024/driverStandings.json`);
       constRes = await fetch(`${API_BASE}/2024/constructorStandings.json`);
       driverData = await driverRes.json();
       constData = await constRes.json();
       driversList = driverData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
       constList = constData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    }

    const drivers: Driver[] = driversList.map((d: any) => {
      const teamName = d.Constructors[0]?.name || "Unknown";
      const familyName = d.Driver.familyName;
      const asset = getDriverAsset(familyName);
      
      return {
        id: d.Driver.driverId,
        code: d.Driver.code || "N/A",
        name: translateDriver(familyName),
        firstName: d.Driver.givenName,
        lastName: familyName,
        team: translateTeam(teamName),
        teamColor: getTeamColor(teamName),
        points: parseInt(d.points),
        position: parseInt(d.position),
        wins: parseInt(d.wins),
        podiums: 0,
        number: parseInt(d.Driver.permanentNumber),
        headshotUrl: asset.img,
        countryCode: asset.country
      };
    });

    const constructors: Constructor[] = constList.map((c: any) => {
      const teamName = c.Constructor.name;
      return {
        id: c.Constructor.constructorId,
        name: translateTeam(teamName),
        points: parseInt(c.points),
        position: parseInt(c.position),
        wins: parseInt(c.wins),
        color: getTeamColor(teamName)
      };
    });

    return { drivers, constructors };

  } catch (e) {
    console.error("Failed to fetch real standings, using fallback.", e);
    return { drivers: FALLBACK_DRIVERS_2024, constructors: FALLBACK_CONSTRUCTORS_2024 };
  }
};

export const fetchSchedule2025 = async (): Promise<RaceEvent[]> => {
  try {
    // 1. Fetch 2025 Schedule
    const scheduleRes = await fetch(`${API_BASE}/2025.json`);
    const scheduleData = await scheduleRes.json();
    const races = scheduleData.MRData.RaceTable.Races;

    if (!races || races.length === 0) return FALLBACK_SCHEDULE_2025;

    // 2. Fetch 2024 Results to mimic "Real Data" for completed races in our Future Simulation
    // Since we can't get actual 2025 results, we map 2024 results to the 2025 circuit IDs.
    const resultsMap = new Map<string, RaceResult>();
    try {
        const resultsRes = await fetch(`${API_BASE}/2024/results.json?limit=1000`);
        const resultsData = await resultsRes.json();
        const allResults = resultsData.MRData.RaceTable.Races;
        
        allResults.forEach((r: any) => {
            const circuitId = r.Circuit.circuitId;
            const results = r.Results;
            if (results && results.length >= 3) {
                // Map API result to our RaceResult type
                const p1 = results[0];
                const p2 = results[1];
                const p3 = results[2];
                // Find fastest lap
                let fl = { driver: "N/A", time: "N/A" };
                const flDriver = results.find((res: any) => res.FastestLap?.rank === "1");
                if (flDriver) {
                    fl = { 
                        driver: translateDriver(flDriver.Driver.familyName), 
                        time: flDriver.FastestLap.Time.time 
                    };
                }

                resultsMap.set(circuitId, {
                    p1: { 
                        name: translateDriver(p1.Driver.familyName), 
                        team: translateTeam(p1.Constructor.name), 
                        time: p1.Time?.time || "Finished", 
                        teamColor: getTeamColor(p1.Constructor.name) 
                    },
                    p2: { 
                        name: translateDriver(p2.Driver.familyName), 
                        team: translateTeam(p2.Constructor.name), 
                        time: p2.Time?.time || p2.status, 
                        teamColor: getTeamColor(p2.Constructor.name) 
                    },
                    p3: { 
                        name: translateDriver(p3.Driver.familyName), 
                        team: translateTeam(p3.Constructor.name), 
                        time: p3.Time?.time || p3.status, 
                        teamColor: getTeamColor(p3.Constructor.name) 
                    },
                    fastestLap: fl
                });
            }
        });
    } catch (err) {
        console.warn("Could not fetch 2024 results for simulation mapping", err);
    }

    const currentSimDate = new Date(); // Use real date

    return races.map((r: any) => {
      const raceDate = new Date(`${r.date}T${r.time || '12:00:00Z'}`);
      const isCompleted = raceDate < currentSimDate;
      const monthStr = raceDate.toLocaleDateString('zh-CN', { month: 'short' });
      const dayStr = raceDate.getDate().toString();
      const circuitEnglish = r.Circuit.circuitName;
      const circuitDetails = CIRCUIT_DETAILS[circuitEnglish];
      const circuitId = r.Circuit.circuitId;
      
      const sessions = {
          fp1: formatToBeijingTime(r.FirstPractice?.time),
          fp2: formatToBeijingTime(r.SecondPractice?.time),
          fp3: formatToBeijingTime(r.ThirdPractice?.time),
          qualifying: formatToBeijingTime(r.Qualifying?.time),
          sprint: formatToBeijingTime(r.Sprint?.time),
          race: formatToBeijingTime(r.time)
      };

      const c = r.Circuit.Location.country;
      let flag = "🏁";
      if (c === "Australia") flag = "🇦🇺";
      else if (c === "China") flag = "🇨🇳";
      else if (c === "USA" || c === "United States") flag = "🇺🇸";
      else if (c === "Italy") flag = "🇮🇹";
      else if (c === "Brazil") flag = "🇧🇷";
      else if (c === "Japan") flag = "🇯🇵";
      else if (c === "Bahrain") flag = "🇧🇭";
      else if (c === "Saudi Arabia") flag = "🇸🇦";
      else if (c === "Monaco") flag = "🇲🇨";
      else if (c === "Spain") flag = "🇪🇸";
      else if (c === "Canada") flag = "🇨🇦";
      else if (c === "Austria") flag = "🇦🇹";
      else if (c === "UK") flag = "🇬🇧";
      else if (c === "Hungary") flag = "🇭🇺";
      else if (c === "Belgium") flag = "🇧🇪";
      else if (c === "Netherlands") flag = "🇳🇱";
      else if (c === "Singapore") flag = "🇸🇬";
      else if (c === "Azerbaijan") flag = "🇦🇿";
      else if (c === "Mexico") flag = "🇲🇽";
      else if (c === "Qatar") flag = "🇶🇦";
      else if (c === "UAE") flag = "🇦🇪";

      const formattedName = formatRaceName(r.raceName, r.Circuit.Location.country, r.Circuit.Location.locality);
      const round = parseInt(r.round);

      // Real results mapping logic
      let realResults: RaceResult | undefined = undefined;
      if (isCompleted) {
         realResults = resultsMap.get(circuitId);
      }

      return {
        id: r.round,
        round: round,
        name: formattedName,
        location: translateCircuit(r.Circuit.Location.locality),
        country: translateCountry(r.Circuit.Location.country),
        date: r.date,
        time: r.time,
        bjTime: sessions.race,
        sessions: sessions,
        month: monthStr,
        day: dayStr,
        flag: flag,
        circuitName: translateCircuit(circuitEnglish),
        isSprint: !!r.Sprint, 
        status: isCompleted ? 'COMPLETED' : 'UPCOMING',
        winner: realResults?.p1.name, // Display winner if available
        trackGeo: TRACK_PATHS[circuitEnglish] || { path: "M10 10 H 90 V 90 H 10 Z", rotation: 0 },
        circuitInfo: circuitDetails,
        results: realResults
      };
    });
  } catch (error) {
    console.error("Schedule fetch error", error);
    return FALLBACK_SCHEDULE_2025;
  }
};
