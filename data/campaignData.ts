import { CampaignLevel, GameMode, Difficulty } from '../types';

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  {
    id: 1,
    title: 'Pengenalan Warna Primer',
    description: 'Mulai dengan dasar! Tebak warna-warna primer yang paling fundamental.',
    game: GameMode.GuessTheColor,
    config: {
      difficulty: Difficulty.Easy,
      rounds: 5,
    },
  },
  {
    id: 2,
    title: 'Pengenalan Warna Sekunder',
    description: 'Lanjutkan perjalananmu dengan menebak warna-warna sekunder.',
    game: GameMode.GuessTheColor,
    config: {
      difficulty: Difficulty.Easy,
      rounds: 5,
    },
  },
    {
    id: 3,
    title: 'Uji Memori: Kode HEX Dasar',
    description: 'Saatnya menghafal! Cocokkan nama warna dengan kode HEX-nya.',
    game: GameMode.FlipCard,
    config: {
        difficulty: Difficulty.Easy,
    },
  },
  {
    id: 4,
    title: 'Teori Warna: Komplementer',
    description: 'Pelajari tentang warna komplementer, yang saling berlawanan di roda warna.',
    game: GameMode.ColorWheel,
    config: {
        rounds: 5,
    },
  },
  {
    id: 5,
    title: 'Praktik Pencampuran RGB',
    description: 'Waktunya praktik! Coba cocokkan warna target menggunakan slider RGB.',
    game: GameMode.ColorMixer,
    config: {
      // Config for mixer might control number of rounds in challenge mode
    },
  },
  {
    id: 6,
    title: 'Tantangan Tebak Warna Lanjutan',
    description: 'Tingkatkan kemampuanmu dengan tantangan menebak warna yang lebih sulit.',
    game: GameMode.GuessTheColor,
    config: {
      difficulty: Difficulty.Medium,
      rounds: 10,
    },
  },
];