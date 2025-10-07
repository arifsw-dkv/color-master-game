import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty } from '../types';
import { COLORS } from '../constants';
import * as soundService from '../services/soundService';
import { getSettings } from '../services/settingsService';
import { getContrastingTextColor } from '../services/colorUtils';

interface FlipCardGameProps {
  onGoToMainMenu: () => void;
}

enum GameState {
  DifficultySelection,
  Instructions,
  Playing,
  Win,
  Lose,
}

interface Card {
  id: number;
  type: 'color' | 'hex';
  content: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const DIFFICULTY_SETTINGS = {
  [Difficulty.Easy]: { pairs: 4, time: 45, grid: 'grid-cols-4', cardSize: 'w-24 h-24 md:w-32 md:h-32' },
  [Difficulty.Medium]: { pairs: 6, time: 75, grid: 'grid-cols-4', cardSize: 'w-24 h-24' },
  [Difficulty.Hard]: { pairs: 8, time: 90, grid: 'grid-cols-4', cardSize: 'w-20 h-20 md:w-24 md:h-24' },
};

const FlipCardGame: React.FC<FlipCardGameProps> = ({ onGoToMainMenu }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.DifficultySelection);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [unmatchedPair, setUnmatchedPair] = useState<number[]>([]); // For shake animation
  const [justMatchedPairId, setJustMatchedPairId] = useState<string | null>(null); // For pulse animation

  // Load settings to apply visual effects conditionally
  const settings = getSettings();
  const allowEffects = settings.effects !== 'Rendah';

  const generateCards = useCallback((level: Difficulty) => {
    const { pairs } = DIFFICULTY_SETTINGS[level];
    const selectedColors = shuffleArray(COLORS).slice(0, pairs);

    const gameCards: Card[] = [];
    selectedColors.forEach((color, index) => {
      gameCards.push({ id: index * 2, type: 'color', content: color.name, pairId: color.hex, isFlipped: false, isMatched: false });
      gameCards.push({ id: index * 2 + 1, type: 'hex', content: color.hex, pairId: color.hex, isFlipped: false, isMatched: false });
    });

    setCards(shuffleArray(gameCards));
  }, []);

  const startGame = (level: Difficulty) => {
    soundService.playClickSound();
    setDifficulty(level);
    generateCards(level);
    setTimeLeft(DIFFICULTY_SETTINGS[level].time);
    setFlippedCards([]);
    setUnmatchedPair([]);
    setJustMatchedPairId(null);
    setGameState(GameState.Playing);
  };
  
  // Timer logic
  useEffect(() => {
    if (gameState !== GameState.Playing || timeLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft]);

  // Game over (time up) logic
  useEffect(() => {
    if (gameState === GameState.Playing && timeLeft === 0) {
      soundService.playIncorrectSound();
      setGameState(GameState.Lose);
    }
  }, [timeLeft, gameState]);


  // Match checking logic with animations
  useEffect(() => {
    if (flippedCards.length < 2) return;

    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.pairId === secondCard.pairId) {
      // Correct match
      soundService.playCorrectSound();
      if (allowEffects) {
        setJustMatchedPairId(firstCard.pairId);
        setTimeout(() => setJustMatchedPairId(null), 400); // Animation duration
      }
      setCards(prev =>
        prev.map(card =>
          card.pairId === firstCard.pairId
            ? { ...card, isMatched: true, isFlipped: true }
            : card
        )
      );
      setFlippedCards([]);
    } else {
      // Incorrect match
      if (allowEffects) {
        setUnmatchedPair([firstIndex, secondIndex]);
      }
      const timeoutId = setTimeout(() => {
        setCards(prev =>
          prev.map((card, i) =>
            i === firstIndex || i === secondIndex
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedCards([]);
        setUnmatchedPair([]); // Reset shake animation state
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [flippedCards, cards, allowEffects]);
  
  // Win condition logic
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
        soundService.playCorrectSound();
        setGameState(GameState.Win);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length >= 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }
    soundService.playFlipSound();
    setCards(prev => prev.map((card, i) => i === index ? { ...card, isFlipped: true } : card));
    setFlippedCards(prev => [...prev, index]);
  };
  
  const handlePlayAgain = () => {
    soundService.playClickSound();
    setGameState(GameState.DifficultySelection);
  }

  const renderCard = (card: Card, index: number) => {
    const cardSettings = DIFFICULTY_SETTINGS[difficulty];
    const isShaking = unmatchedPair.includes(index);
    const isPulsing = justMatchedPairId === card.pairId;

    // Conditionally apply transition classes based on user's effects settings
    const transitionClass = allowEffects ? 'duration-500 ease-in-out' : 'duration-0';

    const matchedStyle = card.isMatched 
      ? 'opacity-60 ring-2 ring-teal-400'
      : 'bg-gray-900';
      
    const cardContentColor = card.type === 'color' 
      ? getContrastingTextColor(card.pairId) 
      : '#FFFFFF';
    
    // Add a shadow to the container for better depth perception.
    // The group class allows for hover effects on child elements.
    return (
      <div 
        key={card.id} 
        className={`${cardSettings.cardSize} perspective-1000 cursor-pointer group shadow-lg rounded-lg`}
        onClick={() => handleCardClick(index)}
      >
        <div className={`relative w-full h-full transition-transform ${transitionClass} transform-style-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''} ${isShaking ? 'animate-shake' : ''} ${isPulsing ? 'animate-pulse-once' : ''}`}>
          {/* Card Back - improved visuals with gradient and border */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-4xl font-bold text-red-400 group-hover:from-gray-600 group-hover:to-gray-700 border-2 border-gray-600">
            ?
          </div>
          {/* Card Front - improved visuals with border */}
          <div 
            className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg flex items-center justify-center p-2 text-center font-bold text-lg md:text-xl ${matchedStyle} border-2 ${card.type === 'color' ? 'border-gray-800' : 'border-gray-600'}`}
            style={card.type === 'color' ? { backgroundColor: card.pairId } : {}}
          >
            <span style={{ color: cardContentColor, textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                {card.content}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderDifficultySelection = () => (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg animate-fade-in">
      <h1 className="text-5xl font-bold mb-2 text-red-400">Kartu Warna</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
        Uji ingatanmu! Cocokkan nama warna dengan kode HEX-nya.
      </p>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Pilih Tingkat Kesulitan</h2>
        <div className="flex justify-center gap-2 md:gap-4">
          {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map(level => (
            <button 
              key={level} 
              onClick={() => { setDifficulty(Difficulty[level]); setGameState(GameState.Instructions); soundService.playClickSound(); }}
              className={`font-bold py-2 px-4 md:px-6 rounded-lg transition-all duration-200 border-2 border-gray-600 bg-gray-700 hover:bg-gray-600`}
            >{level}</button>
          ))}
        </div>
      </div>
      <button onClick={onGoToMainMenu} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-500 transition-all duration-300">Kembali</button>
    </div>
  );
  
  const renderInstructions = () => (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg animate-fade-in max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-red-400">Cara Bermain</h1>
        <p className="text-lg text-gray-300 mb-6">
            Buka dua kartu untuk menemukan pasangan antara <strong>Nama Warna</strong> dan <strong>Kode HEX</strong> yang cocok. Selesaikan seluruh papan sebelum waktu habis!
        </p>
        <p className="text-2xl font-semibold mb-2">Tingkat: <span className="text-yellow-400">{difficulty}</span></p>
        <p className="text-2xl font-semibold mb-6">Waktu: <span className="text-yellow-400">{DIFFICULTY_SETTINGS[difficulty].time} detik</span></p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => startGame(difficulty)} className="bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-red-400 transition-all duration-300">Mulai!</button>
            <button onClick={() => setGameState(GameState.DifficultySelection)} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-500 transition-all duration-300">Pilih Level Lain</button>
        </div>
    </div>
  );

  const renderGameboard = () => {
     const settings = DIFFICULTY_SETTINGS[difficulty];
     return (
        <div className="w-full max-w-xl text-center animate-fade-in">
             <div className="flex justify-between items-center w-full text-lg font-semibold text-gray-300 mb-6 px-2">
                <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    Tingkat: <span className="text-red-400 font-bold">{difficulty}</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    Waktu: <span className={`font-bold ${timeLeft < 10 ? 'text-yellow-400 animate-pulse' : 'text-red-400'}`}>{timeLeft}s</span>
                </div>
            </div>
            
            <div className={`grid ${settings.grid} gap-2 md:gap-4 justify-center`}>
                {cards.map((card, index) => renderCard(card, index))}
            </div>
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }

                @keyframes shake {
                  10%, 90% { transform: translate3d(-1px, 0, 0) rotateY(180deg); }
                  20%, 80% { transform: translate3d(2px, 0, 0) rotateY(180deg); }
                  30%, 50%, 70% { transform: translate3d(-4px, 0, 0) rotateY(180deg); }
                  40%, 60% { transform: translate3d(4px, 0, 0) rotateY(180deg); }
                }
                .animate-shake {
                  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
                  transform: translate3d(0, 0, 0);
                }

                @keyframes pulse-once {
                  0% { transform: scale3d(1, 1, 1) rotateY(180deg); }
                  50% { transform: scale3d(1.05, 1.05, 1.05) rotateY(180deg); }
                  100% { transform: scale3d(1, 1, 1) rotateY(180deg); }
                }
                .animate-pulse-once {
                    animation: pulse-once 0.4s ease-in-out;
                }
            `}</style>
             <div className="text-center mt-8">
                <button onClick={onGoToMainMenu} className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200">
                    Kembali ke Menu Utama
                </button>
            </div>
        </div>
     )
  };
  
  const renderEndScreen = (isWin: boolean) => (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
        <h1 className={`text-4xl font-bold mb-4 ${isWin ? 'text-green-400' : 'text-yellow-400'}`}>{isWin ? 'Kamu Berhasil!' : 'Waktu Habis!'}</h1>
        <p className="text-xl text-gray-300 mb-8">{isWin ? `Kamu menyelesaikan level ${difficulty}!` : 'Jangan menyerah, coba lagi!'}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handlePlayAgain} className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-400 transition-all">Main Lagi</button>
          <button onClick={onGoToMainMenu} className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-500 transition-all">Menu Utama</button>
        </div>
      </div>
  );


  switch (gameState) {
    case GameState.DifficultySelection:
      return renderDifficultySelection();
    case GameState.Instructions:
        return renderInstructions();
    case GameState.Playing:
      return renderGameboard();
    case GameState.Win:
        return renderEndScreen(true);
    case GameState.Lose:
        return renderEndScreen(false);
    default:
      return null;
  }
};

export default FlipCardGame;