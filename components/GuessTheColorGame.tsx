import React, { useState, useCallback, useEffect, useRef } from 'react';
import { QuizItem, ColorInfo, Difficulty, ScoreEntry } from '../types';
import { COLORS, TOTAL_ROUNDS } from '../constants';
import { getColorFacts } from '../services/geminiService';
import * as soundService from '../services/soundService';
import { getScores, addScore } from '../services/leaderboardService';
import ColorDisplay from './ColorDisplay';
import LoadingSpinner from './LoadingSpinner';
import Scoreboard from './Scoreboard';
import Leaderboard from './Leaderboard';
import FeedbackModal from './FeedbackModal';

// Internal game state for this component
enum GameState {
  DifficultySelection,
  Playing,
  Feedback,
  GameOver,
}

// Utility to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface GuessTheColorGameProps {
  onGoToMainMenu: () => void;
}

const GuessTheColorGame: React.FC<GuessTheColorGameProps> = ({ onGoToMainMenu }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.DifficultySelection);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [quizItem, setQuizItem] = useState<QuizItem | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usedColors, setUsedColors] = useState<ColorInfo[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const currentPlayerScoreRef = useRef<ScoreEntry | null>(null);

  const generateQuizItem = useCallback(() => {
    setUsedColors(prevUsedColors => {
      const availableColors = COLORS.filter(c1 => !prevUsedColors.some(c2 => c2.hex === c1.hex));

      if (availableColors.length === 0) {
        console.error("No unique colors available to create a new question.");
        setGameState(GameState.GameOver);
        return prevUsedColors;
      }

      const correctColor = shuffleArray(availableColors)[0];
      
      let numOptions;
      switch (difficulty) {
        case Difficulty.Easy: numOptions = 2; break;
        case Difficulty.Hard: numOptions = 6; break;
        case Difficulty.Medium: default: numOptions = 4; break;
      }

      const otherOptions = shuffleArray(COLORS.filter(c => c.hex !== correctColor.hex)).slice(0, numOptions - 1);
      const options = shuffleArray([...otherOptions.map(c => c.name), correctColor.name]);

      setQuizItem({ color: correctColor, options });
      return [...prevUsedColors, correctColor];
    });
  }, [difficulty]);
  
  const startGame = (difficultyLevel: Difficulty) => {
    setScore(0);
    setCurrentRound(1);
    setUsedColors([]);
    setDifficulty(difficultyLevel);
    setGameState(GameState.Playing);
    setSelectedDifficulty(null);
    setIsScoreSubmitted(false);
    setPlayerName('');
    currentPlayerScoreRef.current = null;
  };

  const handleStartGame = (difficultyLevel: Difficulty) => {
    soundService.playClickSound();
    startGame(difficultyLevel);
  };

  const handlePlayAgain = () => {
    soundService.playClickSound();
    startGame(difficulty); // Reuse the last selected difficulty
  };
  
  useEffect(() => {
    if (gameState === GameState.Playing && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      generateQuizItem();
    }
  }, [gameState, currentRound, generateQuizItem]);

  const handleAnswer = async (selectedOption: string) => {
    if (!quizItem) return;

    setSelectedAnswer(selectedOption);

    const correct = selectedOption === quizItem.color.name;
    setIsCorrect(correct);
    if (correct) {
      soundService.playCorrectSound();
      setScore(s => s + 10);
    } else {
      soundService.playIncorrectSound();
    }

    setGameState(GameState.Feedback);
    setIsLoading(true);
    const facts = await getColorFacts(quizItem.color.name, difficulty);
    setFeedbackText(facts);
    setIsLoading(false);
  };
  
  const loadLeaderboard = () => {
    const scores = getScores();
    setLeaderboard(scores);
  };

  const handleSaveScore = () => {
    soundService.playClickSound();
    const finalName = playerName.trim() || 'Pemain Anonim';
    const newScore: ScoreEntry = { name: finalName, score };
    
    addScore(newScore);
    currentPlayerScoreRef.current = newScore;
    loadLeaderboard();
    setIsScoreSubmitted(true);
  };

  const nextRound = () => {
    soundService.playClickSound();
    if (currentRound >= TOTAL_ROUNDS) {
      setGameState(GameState.GameOver);
      loadLeaderboard();
    } else {
      setCurrentRound(r => r + 1);
      setQuizItem(null);
      setIsCorrect(null);
      setFeedbackText('');
      setSelectedAnswer(null);
      setGameState(GameState.Playing);
    }
  };
  
  const renderContent = () => {
    switch (gameState) {
      case GameState.DifficultySelection:
        return (
          <div className="text-center glass-panel p-10 rounded-2xl shadow-lg animate-fade-in">
            <h1 className="text-5xl font-bold mb-2 text-cyan-400 font-heading">Tebak Warna</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
              Pilih tingkat kesulitan untuk memulai permainan.
            </p>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-200 mb-4 font-heading">Pilih Tingkat Kesulitan</h2>
              <div className="flex justify-center gap-2 md:gap-4">
                {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map(level => (
                  <button key={level} onClick={() => { soundService.playClickSound(); setSelectedDifficulty(Difficulty[level]) }}
                    className={`font-bold py-2 px-4 md:px-6 rounded-lg transition-all duration-200 border-2 ${selectedDifficulty === Difficulty[level] ? 'bg-cyan-400 text-gray-900 border-cyan-400 scale-110' : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700/80 hover:border-gray-500'}`}
                  >{level}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => handleStartGame(selectedDifficulty!)} disabled={!selectedDifficulty}
                className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
              >Mulai Bermain</button>
              <button onClick={onGoToMainMenu} className="bg-gray-600/50 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-600/80 transition-all duration-300 border border-gray-500">Kembali</button>
            </div>
          </div>
        );

      case GameState.Playing:
        if (!quizItem) return <div className="text-center"><LoadingSpinner /> <p>Membuat soal...</p></div>;
        return (
          <div className="w-full max-w-2xl animate-fade-in">
            <Scoreboard score={score} round={currentRound} totalRounds={TOTAL_ROUNDS} />
            <ColorDisplay hexColor={quizItem.color.hex} />
            <div className={`grid ${quizItem.options.length > 4 ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
              {quizItem.options.map(option => (
                <button key={option} onClick={() => handleAnswer(option)} className="glass-panel text-lg p-4 rounded-lg font-semibold hover:bg-cyan-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transform hover:scale-105">{option}</button>
              ))}
            </div>
            <div className="text-center mt-8">
              <button onClick={onGoToMainMenu} className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200">
                Kembali ke Menu Utama
              </button>
            </div>
          </div>
        );

      case GameState.Feedback:
        if (!quizItem || selectedAnswer === null) return null; // Guard against missing data
        return (
          <FeedbackModal
            isOpen={true}
            isCorrect={isCorrect}
            correctColor={quizItem.color}
            selectedOptionName={selectedAnswer}
            feedbackText={feedbackText}
            isLoading={isLoading}
            onNextRound={nextRound}
            isLastRound={currentRound >= TOTAL_ROUNDS}
          />
        );
        
      case GameState.GameOver:
        return (
          <div className="text-center glass-panel p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400 font-heading">Permainan Selesai!</h1>
            {!isScoreSubmitted ? (
               <>
                <p className="text-xl text-gray-300 mb-2">Skor Akhir Kamu:</p>
                <p className="text-6xl md:text-7xl font-bold text-yellow-400 mb-6">{score}</p>
                 <div className="space-y-4">
                  <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Masukkan nama kamu" className="w-full bg-gray-900 text-white p-3 rounded-lg border-2 border-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
                  <button onClick={handleSaveScore} className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-all duration-300">Simpan Skor & Lihat Peringkat</button>
                </div>
               </>
            ) : (
              <div className='w-full'>
                <p className="text-xl text-gray-300 mb-2 font-heading">Skor Akhir:</p>
                <p className="text-5xl font-bold text-yellow-400 mb-6">{score}</p>
                <Leaderboard scores={leaderboard} currentPlayer={currentPlayerScoreRef.current} />
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handlePlayAgain} className="w-full sm:w-auto bg-cyan-500 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50">Main Lagi</button>
                    <button onClick={onGoToMainMenu} className="w-full sm:w-auto bg-gray-600/50 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-600/80 transition-all duration-300 border border-gray-500">Menu Utama</button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default GuessTheColorGame;