import React, { useState, useEffect, useMemo } from 'react';
import { ColorInfo } from '../types';
import * as colorTheory from '../services/colorTheoryService';
import * as soundService from '../services/soundService';
import Scoreboard from './Scoreboard';

const TOTAL_WHEEL_ROUNDS = 10;

interface ColorWheelGameProps {
  onGoToMainMenu: () => void;
}

const ColorWheelGame: React.FC<ColorWheelGameProps> = ({ onGoToMainMenu }) => {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState<colorTheory.ColorTheoryQuestion | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<ColorInfo | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const wheelColors = colorTheory.COLOR_WHEEL_COLORS;

  const generateQuestion = () => {
    setIsCorrect(null);
    setSelectedAnswer(null);
    setQuestion(colorTheory.generateQuestion());
  };

  useEffect(() => {
    generateQuestion();
  }, [round]);

  const handleColorClick = (color: ColorInfo) => {
    if (isCorrect !== null || !question) return; // Don't allow clicking after an answer is given

    soundService.playWheelSelectSound();
    setSelectedAnswer(color);

    const correct = question.correctAnswerHex.includes(color.hex);
    setIsCorrect(correct);

    if (correct) {
      soundService.playCorrectSound();
      setScore(s => s + 10);
    } else {
      soundService.playIncorrectSound();
    }
  };

  const handleNext = () => {
    soundService.playClickSound();
    if (round >= TOTAL_WHEEL_ROUNDS) {
      setIsGameOver(true);
    } else {
      setRound(r => r + 1);
    }
  };
  
  const handlePlayAgain = () => {
    soundService.playClickSound();
    setScore(0);
    setRound(1);
    setIsGameOver(false);
    generateQuestion();
  }

  const radius = 150;
  const center = 160;

  const getSlicePath = (index: number) => {
    const angle = 360 / wheelColors.length;
    const startAngle = (index * angle) - 90;
    const endAngle = ((index + 1) * angle) - 90;
    const start = {
      x: center + radius * Math.cos(startAngle * Math.PI / 180),
      y: center + radius * Math.sin(startAngle * Math.PI / 180)
    };
    const end = {
      x: center + radius * Math.cos(endAngle * Math.PI / 180),
      y: center + radius * Math.sin(endAngle * Math.PI / 180)
    };
    const largeArcFlag = angle > 180 ? 1 : 0;
    return `M ${center},${center} L ${start.x},${start.y} A ${radius},${radius} 0 ${largeArcFlag},1 ${end.x},${end.y} Z`;
  };
  
  if (isGameOver) {
    return (
       <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-purple-400">Permainan Selesai!</h1>
        <p className="text-xl text-gray-300 mb-2">Skor Akhir Kamu:</p>
        <p className="text-7xl font-bold text-yellow-400 mb-8">{score}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handlePlayAgain} className="bg-purple-500 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-purple-400 transition-all">Main Lagi</button>
          <button onClick={onGoToMainMenu} className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-500 transition-all">Menu Utama</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl text-center animate-fade-in">
      <h1 className="text-4xl font-bold mb-2 text-purple-400">Roda Warna</h1>
      <Scoreboard score={score} round={round} totalRounds={TOTAL_WHEEL_ROUNDS} />
      
      {question && (
        <p className="text-xl text-gray-200 mb-6 h-12">
          {question.questionText} <span className="font-bold" style={{color: question.baseColor.hex}}>{question.baseColor.name}</span>?
        </p>
      )}

      <div className="relative w-[320px] h-[320px] mx-auto mb-6">
        <svg viewBox="0 0 320 320">
          {wheelColors.map((color, i) => {
            const isCorrectAnswer = isCorrect !== null && question && question.correctAnswerHex.includes(color.hex);
            const isWrongAnswer = isCorrect === false && selectedAnswer?.hex === color.hex;
            
            return (
              <path
                key={color.hex}
                d={getSlicePath(i)}
                fill={color.hex}
                stroke="#1f2937"
                strokeWidth="3"
                onClick={() => handleColorClick(color)}
                className={`transition-all duration-300 ${isCorrect !== null ? '' : 'cursor-pointer hover:opacity-80'}`}
                style={{
                  transformOrigin: 'center center',
                  transform: isCorrectAnswer ? 'scale(1.05)' : 'scale(1)',
                  opacity: (isCorrect !== null && !isCorrectAnswer) ? 0.3 : 1,
                  filter: isWrongAnswer ? 'grayscale(80%)' : 'none'
                }}
              />
            );
          })}
        </svg>
      </div>

      <div className="h-24">
        {isCorrect !== null && (
          <div className="animate-fade-in">
              <h2 className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Benar!' : 'Kurang Tepat!'}
              </h2>
              <button onClick={handleNext} className="bg-purple-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-purple-400 transition-all">
                {round >= TOTAL_WHEEL_ROUNDS ? 'Lihat Skor' : 'Lanjut'}
              </button>
          </div>
        )}
      </div>

      <div className="text-center mt-4">
        <button onClick={onGoToMainMenu} className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200">
          Kembali ke Menu Utama
        </button>
      </div>
    </div>
  );
};

export default ColorWheelGame;