import React, { useState, useEffect } from 'react';
import { CampaignLevel, GameMode } from '../types';
import { getProgress } from '../services/progressService';
import { CAMPAIGN_LEVELS } from '../data/campaignData';

interface LearningPathScreenProps {
  onStartLevel: (level: CampaignLevel) => void;
  onGoToMainMenu: () => void;
}

const LevelIcon = ({ game }: { game: GameMode }) => {
  let iconPath = <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />; // Default clock icon
  switch (game) {
    case GameMode.GuessTheColor:
      iconPath = <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />;
      break;
    case GameMode.ColorWheel:
      iconPath = <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />;
      break;
    case GameMode.ColorMixer:
      iconPath = <path d="M12 6V4m0 2a2 2 0 100 4v1m0-5a2 2 0 110 4v-1m0-9v.01M12 18v-2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2m0-6a2 2 0 100 4m0-4a2 2 0 110 4M6 12H4m2 0a2 2 0 104 0H6m14 0h-2m2 0a2 2 0 104 0h-4M7.757 16.243l-1.414 1.414M17.657 6.343l-1.414 1.414m0 9.9l1.414 1.414M7.757 7.757l-1.414-1.414" />;
      break;
    case GameMode.FlipCard:
      iconPath = <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm14 0l-7 7-7-7" />;
      break;
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {iconPath}
    </svg>
  );
};

const LearningPathScreen: React.FC<LearningPathScreenProps> = ({ onStartLevel, onGoToMainMenu }) => {
  const [highestLevelCompleted, setHighestLevelCompleted] = useState(0);

  useEffect(() => {
    setHighestLevelCompleted(getProgress().highestLevelCompleted);
  }, []);

  return (
    <div className="w-full max-w-2xl glass-panel p-8 md:p-10 rounded-2xl shadow-lg animate-fade-in text-center">
      <h1 className="text-4xl font-bold mb-4 text-yellow-400 font-heading">Kampanye Belajar</h1>
      <p className="text-lg text-gray-300 mb-8">
        Selesaikan setiap level untuk membuka level berikutnya dan menjadi seorang Color Master!
      </p>
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 -mr-4">
        {CAMPAIGN_LEVELS.map((level, index) => {
          const isUnlocked = level.id <= highestLevelCompleted + 1;
          const isCompleted = level.id <= highestLevelCompleted;
          const isCurrent = level.id === highestLevelCompleted + 1;

          let statusClasses = '';
          if (isCompleted) {
            statusClasses = 'border-green-500 bg-green-500/10';
          } else if (isCurrent) {
            statusClasses = 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500';
          } else { // Locked
            statusClasses = 'border-gray-700 bg-black/20 opacity-60';
          }

          return (
            <button
              key={level.id}
              disabled={!isUnlocked}
              onClick={() => onStartLevel(level)}
              className={`w-full text-left p-4 rounded-lg border-2 flex items-center gap-4 transition-all duration-300 ${isUnlocked ? 'hover:bg-gray-700/50' : 'cursor-not-allowed'} ${statusClasses}`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : isUnlocked ? (
                    <LevelIcon game={level.game} />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-white">{level.id}. {level.title}</h3>
                <p className="text-sm text-gray-400">{level.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onGoToMainMenu}
          className="bg-gray-600/50 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-600/80 transition-all duration-300 border border-gray-500"
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default LearningPathScreen;