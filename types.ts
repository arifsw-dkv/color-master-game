export interface ColorInfo {
  name: string;
  hex: string;
}

export interface QuizItem {
  color: ColorInfo;
  options: string[];
}

export enum GameMode {
  Login,
  MainMenu,
  GuessTheColor,
  ColorWheel,
  ColorMixer,
  FlipCard,
  Instructions,
  Studio,
  LearningPath,
  Chatbot,
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface ScoreEntry {
  name: string;
  score: number;
}

export interface PlayerData {
  id: string;
  name: string;
  avatarId: string;
}

export interface SettingsData {
  musicVolume: number; // 0-1
  effectsVolume: number; // 0-1
  voiceVolume: number; // 0-1
  graphics: 'Rendah' | 'Sedang' | 'Tinggi';
  effects: 'Rendah' | 'Sedang' | 'Tinggi';
  fps: '30' | '60' | 'Tidak Terbatas';
}

export interface CampaignLevel {
  id: number;
  title: string;
  description: string;
  game: GameMode;
  config: {
    difficulty?: Difficulty;
    rounds?: number;
    // Add other game-specific configs here as needed
  };
}