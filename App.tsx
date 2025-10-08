import React, { useState, useEffect } from 'react';
import { GameMode, PlayerData } from './types';
import * as soundService from './services/soundService';
import * as musicService from './services/musicService';
import * as playerService from './services/playerService';
import MainMenu from './components/MainMenu';
import GuessTheColorGame from './components/GuessTheColorGame';
import ColorWheelGame from './components/ColorWheelGame';
import ColorMixerLab from './components/ColorMixerLab';
import FlipCardGame from './components/FlipCardGame';
import PlayerInfo from './components/PlayerInfo';
import SettingsModal from './components/SettingsModal';
import LoginScreen from './components/LoginScreen';
import InstructionsScreen from './components/InstructionsScreen';
import StudioMode from './components/StudioMode';


const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Login);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  
  useEffect(() => {
    // Cleanup function to stop music when the entire app unmounts
    return () => {
      musicService.stopMusic();
    }
  }, []);

  useEffect(() => {
    const handlePlayerDataUpdate = () => {
      setPlayerData(playerService.getPlayerData());
    };
    
    // Load initial data
    handlePlayerDataUpdate();
    
    // Listen for changes triggered by other components (e.g., SettingsModal)
    window.addEventListener('playerDataChanged', handlePlayerDataUpdate);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('playerDataChanged', handlePlayerDataUpdate);
    };
  }, []);


  const handleSelectMode = (mode: GameMode) => {
    // Initialize sound effects on first user interaction
    soundService.init(); 
    soundService.playClickSound();

    // Music service initializes itself lazily.
    // Directly control music based on the new mode, ensuring it's tied to a user gesture.
    if (mode === GameMode.MainMenu) {
      musicService.playMenuMusic();
    } else {
      musicService.stopMusic();
    }
    
    setGameMode(mode);
  };
  
  const handleGoToMainMenu = () => {
    handleSelectMode(GameMode.MainMenu);
  }

  const renderContent = () => {
    switch (gameMode) {
      case GameMode.Login:
        return <LoginScreen onLogin={() => handleSelectMode(GameMode.MainMenu)} />;
      case GameMode.GuessTheColor:
        return <GuessTheColorGame onGoToMainMenu={handleGoToMainMenu} />;
      case GameMode.ColorWheel:
        return <ColorWheelGame onGoToMainMenu={handleGoToMainMenu} />;
      case GameMode.ColorMixer:
        return <ColorMixerLab onGoToMainMenu={handleGoToMainMenu} />;
      case GameMode.FlipCard:
        return <FlipCardGame onGoToMainMenu={handleGoToMainMenu} />;
      case GameMode.Instructions:
        return <InstructionsScreen onGoToMainMenu={handleGoToMainMenu} />;
      case GameMode.Studio:
        return <StudioMode onGoToMainMenu={handleGoToMainMenu} />;
      case GameMode.MainMenu:
      default:
        return <MainMenu onSelectMode={handleSelectMode} />;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
       <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
       `}</style>
        {gameMode !== GameMode.Login && <PlayerInfo playerData={playerData} onOpenSettings={() => setIsSettingsOpen(true)} />}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        {renderContent()}
    </div>
  );
};

export default App;