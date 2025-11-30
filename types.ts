
export interface Driver {
  id: string;
  code: string;
  name: string;
  firstName?: string; // Added for fuller profile
  lastName?: string;  // Added for fuller profile
  team: string;
  teamColor: string;
  points: number;
  position: number;
  wins: number;
  podiums: number;
  headshotUrl?: string; // New: Driver image
  countryCode?: string; // New: For flag
  number: number;
}

export interface Constructor {
  id: string;
  name: string;
  points: number;
  position: number;
  wins: number;
  color: string;
  logo?: string;
  fullTeamName?: string;
}

export interface TrackGeo {
  path: string; // SVG Path data
  rotation: number; // To orient it correctly in 3D
}

export interface CircuitInfo {
  length: string;    // e.g. "5.412 km"
  laps: number;      // e.g. 57
  distance: string;  // e.g. "308.238 km"
  lapRecord: {
    time: string;
    driver: string;
    year: string;
  };
}

export interface SessionTimes {
  fp1?: string;
  fp2?: string;
  fp3?: string;
  qualifying?: string;
  sprint?: string;
  race: string;
}

export interface RaceResultDriver {
  name: string;
  team: string;
  time: string; // Gap or Time
  teamColor: string;
}

export interface RaceResult {
  p1: RaceResultDriver;
  p2: RaceResultDriver;
  p3: RaceResultDriver;
  fastestLap: {
    driver: string;
    time: string;
  };
}

export interface RaceEvent {
  id: string;
  round: number;
  name: string;
  location: string;
  country: string;
  date: string; // YYYY-MM-DD
  time: string; // UTC time
  bjTime?: string; // Beijing Time HH:mm
  sessions?: SessionTimes; // New: Detailed schedule
  month?: string; 
  day?: string;   
  flag: string; 
  circuitName: string;
  isSprint: boolean;
  winner?: string; 
  status: 'UPCOMING' | 'COMPLETED' | 'LIVE';
  trackGeo?: TrackGeo; 
  circuitInfo?: CircuitInfo; // New: Static rich data
  results?: RaceResult; // New: Detailed results for completed races
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export enum Tab {
  HOME = 'HOME',
  STANDINGS = 'STANDINGS',
  SCHEDULE = 'SCHEDULE',
  NEW_TEAM = 'NEW_TEAM',
  SHOWER_BET = 'SHOWER_BET',
  GAME1 = 'GAME1',
  GAME2 = 'GAME2'
}
