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

// Helper to format Gemini's text response into basic HTML
const formatFeedbackText = (text: string): string => {
  const lines = text.trim().split('\n').filter(line => line.trim());
  if (lines.length === 0) return '';

  const processedLines = lines.map(line =>
    line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  );
  
  const isList = processedLines.some(line => /^\s*(\d+\.|\*|-)\s/.test(line));

  if (isList) {
    let listItems = processedLines.map(line => {
      const content = line.replace(/^\s*(\d+\.|\*|-)\s/, '');
      return `<li>${content}</li>`;
    });
    const isOrdered = /^\s*\d+\./.test(processedLines[0]);
    const listTag = isOrdered ? 'ol' : 'ul';
    const listClasses = isOrdered ? 'list-decimal' : 'list-disc';
    
    return `<${listTag} class="${listClasses} list-inside space-y-2">${listItems.join('')}</${listTag}>`;
  } else {
    return processedLines.map(line => `<p>${line}</p>`).join('');
  }
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
      setGameState(GameState.Playing);
    }
  };
  
  const renderContent = () => {
    switch (gameState) {
      case GameState.DifficultySelection:
        return (
          <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg animate-fade-in">
            <h1 className="text-5xl font-bold mb-2 text-cyan-400">Tebak Warna</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
              Pilih tingkat kesulitan untuk memulai permainan.
            </p>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Pilih Tingkat Kesulitan</h2>
              <div className="flex justify-center gap-2 md:gap-4">
                {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map(level => (
                  <button key={level} onClick={() => { soundService.playClickSound(); setSelectedDifficulty(Difficulty[level]) }}
                    className={`font-bold py-2 px-4 md:px-6 rounded-lg transition-all duration-200 border-2 ${selectedDifficulty === Difficulty[level] ? 'bg-cyan-500 text-gray-900 border-cyan-500' : 'border-gray-600 bg-gray-700 hover:bg-gray-600'}`}
                  >{level}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => handleStartGame(selectedDifficulty!)} disabled={!selectedDifficulty}
                className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
              >Mulai Bermain</button>
              <button onClick={onGoToMainMenu} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-500 transition-all duration-300">Kembali</button>
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
                <button key={option} onClick={() => handleAnswer(option)} className="bg-gray-800 text-lg p-4 rounded-lg font-semibold hover:bg-cyan-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400">{option}</button>
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
        return (
           <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
              <h2 className={`text-3xl font-bold text-center mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? 'Jawaban Benar!' : 'Kurang Tepat'}</h2>
              <p className="text-center text-lg text-gray-300 mb-6">Warna <span className="font-mono font-bold">{quizItem?.color.hex}</span> adalah <span className="font-bold text-cyan-400">{quizItem?.color.name}</span>.</p>
              <div className="bg-gray-900/70 p-4 rounded-lg min-h-[150px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full"><LoadingSpinner /><span className="ml-3 text-gray-400">Memuat info dari Gemini...</span></div>
                ) : (
                  <div className="prose prose-invert text-gray-300 max-w-none" dangerouslySetInnerHTML={{ __html: formatFeedbackText(feedbackText) }} />
                )}
              </div>
              <button onClick={nextRound} disabled={isLoading} className="mt-6 w-full bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-cyan-400 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isLoading ? 'Memuat...' : (currentRound >= TOTAL_ROUNDS ? 'Lihat Skor' : 'Lanjut')}
              </button>
              <div className="text-center mt-4">
                <button onClick={onGoToMainMenu} className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200 text-sm">
                  Kembali ke Menu Utama
                </button>
              </div>
            </div>
        );
        
      case GameState.GameOver:
        return (
          <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">Permainan Selesai!</h1>
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
                <p className="text-xl text-gray-300 mb-2">Skor Akhir:</p>
                <p className="text-5xl font-bold text-yellow-400 mb-6">{score}</p>
                <Leaderboard scores={leaderboard} currentPlayer={currentPlayerScoreRef.current} />
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handlePlayAgain} className="w-full sm:w-auto bg-cyan-500 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50">Main Lagi</button>
                    <button onClick={onGoToMainMenu} className="w-full sm:w-auto bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-500 transition-all duration-300">Menu Utama</button>
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