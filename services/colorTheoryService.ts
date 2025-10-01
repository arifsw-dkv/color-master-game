import { ColorInfo } from '../types';

export const COLOR_WHEEL_COLORS: ColorInfo[] = [
  { name: 'Merah', hex: '#FF0000' },
  { name: 'Merah-Oranye', hex: '#FF4500' },
  { name: 'Oranye', hex: '#FFA500' },
  { name: 'Kuning-Oranye', hex: '#FFD700' },
  { name: 'Kuning', hex: '#FFFF00' },
  { name: 'Kuning-Hijau', hex: '#ADFF2F' },
  { name: 'Hijau', hex: '#008000' },
  { name: 'Biru-Hijau', hex: '#008080' },
  { name: 'Biru', hex: '#0000FF' },
  { name: 'Biru-Ungu', hex: '#8A2BE2' },
  { name: 'Ungu', hex: '#800080' },
  { name: 'Merah-Ungu', hex: '#C71585' },
];

const WHEEL_SIZE = COLOR_WHEEL_COLORS.length;

const getIndex = (color: ColorInfo) => COLOR_WHEEL_COLORS.findIndex(c => c.hex === color.hex);

export const getComplementary = (color: ColorInfo): ColorInfo => {
  const index = getIndex(color);
  const complementaryIndex = (index + WHEEL_SIZE / 2) % WHEEL_SIZE;
  return COLOR_WHEEL_COLORS[complementaryIndex];
};

export const getAnalogous = (color: ColorInfo): [ColorInfo, ColorInfo] => {
  const index = getIndex(color);
  const prevIndex = (index - 1 + WHEEL_SIZE) % WHEEL_SIZE;
  const nextIndex = (index + 1) % WHEEL_SIZE;
  return [COLOR_WHEEL_COLORS[prevIndex], COLOR_WHEEL_COLORS[nextIndex]];
};

export const getTriadic = (color: ColorInfo): [ColorInfo, ColorInfo] => {
  const index = getIndex(color);
  const firstTriadIndex = (index + WHEEL_SIZE / 3) % WHEEL_SIZE;
  const secondTriadIndex = (index + 2 * WHEEL_SIZE / 3) % WHEEL_SIZE;
  return [COLOR_WHEEL_COLORS[firstTriadIndex], COLOR_WHEEL_COLORS[secondTriadIndex]];
};

export const getSplitComplementary = (color: ColorInfo): [ColorInfo, ColorInfo] => {
    const complementary = getComplementary(color);
    return getAnalogous(complementary);
};

export interface ColorTheoryQuestion {
    baseColor: ColorInfo;
    questionText: string;
    correctAnswerHex: string[];
    type: 'complementary' | 'analogous' | 'triadic' | 'split-complementary';
}

const questionTypes = [
    { type: 'complementary', text: 'Pilih warna komplementer dari' },
    { type: 'analogous', text: 'Pilih salah satu warna analog dari' },
    { type: 'triadic', text: 'Pilih salah satu warna triadik dari' },
    { type: 'split-complementary', text: 'Pilih salah satu warna komplementer-terpisah dari' },
] as const;

export const generateQuestion = (): ColorTheoryQuestion => {
    const randomBaseColor = COLOR_WHEEL_COLORS[Math.floor(Math.random() * WHEEL_SIZE)];
    const randomQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let correctAnswers: ColorInfo[] = [];

    switch(randomQuestionType.type) {
        case 'complementary':
            correctAnswers = [getComplementary(randomBaseColor)];
            break;
        case 'analogous':
            correctAnswers = getAnalogous(randomBaseColor);
            break;
        case 'triadic':
            correctAnswers = getTriadic(randomBaseColor);
            break;
        case 'split-complementary':
            correctAnswers = getSplitComplementary(randomBaseColor);
            break;
    }
    
    return {
        baseColor: randomBaseColor,
        questionText: randomQuestionType.text,
        correctAnswerHex: correctAnswers.map(c => c.hex),
        type: randomQuestionType.type
    };
}
