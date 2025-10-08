import React from 'react';
import { GameMode } from '../types';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const IconCampaign = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V3l2-2 2 2v18l-2 2-2-2zM5 21V7l2-2 2 2v14l-2 2-2-2zM17 21V11l2-2 2 2v10l-2 2-2-2z" /></svg>
);
const IconChatbot = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const IconGuess = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
);
const IconFlip = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm14 0l-7 7-7-7" /></svg>
);
const IconWheel = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
const IconMixer = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4v1m0-5a2 2 0 110 4v-1m0-9v.01M12 18v-2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2m0-6a2 2 0 100 4m0-4a2 2 0 110 4M6 12H4m2 0a2 2 0 104 0H6m14 0h-2m2 0a2 2 0 104 0h-4M7.757 16.243l-1.414 1.414M17.657 6.343l-1.414 1.414m0 9.9l1.414 1.414M7.757 7.757l-1.414-1.414" /></svg>
);
const IconStudio = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);
const IconInstructions = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const GameModeButton = ({ onClick, color, icon, title, description }: { onClick: () => void; color: string; icon: React.ReactNode; title: string; description: string }) => {
  const colorClasses = {
    cyan: { text: 'text-cyan-400', shadow: 'hover:shadow-cyan-500/30' },
    red: { text: 'text-red-400', shadow: 'hover:shadow-red-500/30' },
    purple: { text: 'text-purple-400', shadow: 'hover:shadow-purple-500/30' },
    yellow: { text: 'text-yellow-400', shadow: 'hover:shadow-yellow-500/30' },
    indigo: { text: 'text-indigo-400', shadow: 'hover:shadow-indigo-500/30' },
    green: { text: 'text-green-400', shadow: 'hover:shadow-green-500/30' },
    orange: { text: 'text-orange-400', shadow: 'hover:shadow-orange-500/30' },
  }[color] || { text: 'text-cyan-400', shadow: 'hover:shadow-cyan-500/30' };

  return (
    <button
      onClick={onClick}
      className={`glass-panel p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 group flex flex-col items-center text-center shadow-lg ${colorClasses.shadow}`}
    >
      <div className={colorClasses.text}>{icon}</div>
      <h2 className={`text-2xl font-bold ${colorClasses.text} mb-2 font-heading`}>{title}</h2>
      <p className="text-gray-400 group-hover:text-gray-200 transition-colors">{description}</p>
    </button>
  );
};

const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="text-center glass-panel p-8 md:p-10 rounded-3xl animate-fade-in max-w-5xl w-full">
      <h1 className="text-6xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 font-heading animate-pulse-glow">ColorMaster DKV</h1>
      <p className="text-xl font-light text-gray-300 mb-10 max-w-lg mx-auto">
        Platform Edukasi Interaktif untuk Desain Komunikasi Visual
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GameModeButton onClick={() => onSelectMode(GameMode.LearningPath)} color="yellow" icon={<IconCampaign />} title="Kampanye Belajar" description="Ikuti kurikulum terstruktur dari dasar." />
        <GameModeButton onClick={() => onSelectMode(GameMode.Chatbot)} color="green" icon={<IconChatbot />} title="Tanya Ahli" description="Tanya apapun tentang DKV pada AI." />
        <GameModeButton onClick={() => onSelectMode(GameMode.Studio)} color="indigo" icon={<IconStudio />} title="Color Studio" description="Alat pro untuk palet & aksesibilitas." />
        <GameModeButton onClick={() => onSelectMode(GameMode.GuessTheColor)} color="cyan" icon={<IconGuess />} title="Tebak Warna" description="Uji tebak warna dari kode HEX." />
        <GameModeButton onClick={() => onSelectMode(GameMode.FlipCard)} color="red" icon={<IconFlip />} title="Kartu Warna" description="Cocokkan nama warna & kode HEX." />
        <GameModeButton onClick={() => onSelectMode(GameMode.ColorWheel)} color="purple" icon={<IconWheel />} title="Roda Warna" description="Pelajari hubungan antar warna." />
        <GameModeButton onClick={() => onSelectMode(GameMode.ColorMixer)} color="orange" icon={<IconMixer />} title="Lab Pencampuran" description="Eksplorasi pencampuran RGB." />
        <GameModeButton onClick={() => onSelectMode(GameMode.Instructions)} color="cyan" icon={<IconInstructions />} title="Instruksi" description="Pelajari cara bermain & alat." />
      </div>

      <style>{`
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 8px rgba(0, 255, 255, 0.4), 0 0 16px rgba(167, 139, 250, 0.3);
          }
          50% {
            text-shadow: 0 0 16px rgba(0, 255, 255, 0.7), 0 0 32px rgba(167, 139, 250, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default MainMenu;