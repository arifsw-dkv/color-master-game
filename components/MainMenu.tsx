import React from 'react';
import { GameMode } from '../types';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg animate-fade-in max-w-4xl">
      <h1 className="text-5xl font-bold mb-2 text-cyan-400 animate-pulse-glow">ColorMaster DKV</h1>
      <p className="text-xl font-light text-gray-300 mb-10 max-w-lg mx-auto">
        Platform Edukasi Interaktif untuk Desain Komunikasi Visual
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Color Studio */}
        <button
          onClick={() => onSelectMode(GameMode.Studio)}
          className="md:col-span-2 bg-gradient-to-br from-cyan-500 to-purple-600 p-6 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-1 group shadow-lg hover:shadow-cyan-500/50"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Color Studio</h2>
          <p className="text-gray-200 text-lg">Alat profesional untuk palet, ekstraksi, & aksesibilitas.</p>
        </button>

        {/* Guess The Color */}
        <button
          onClick={() => onSelectMode(GameMode.GuessTheColor)}
          className="bg-gray-700 p-6 rounded-lg hover:bg-cyan-800 transition-all duration-300 transform hover:-translate-y-1 group"
        >
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Tebak Warna</h2>
          <p className="text-gray-400 group-hover:text-gray-200">Uji kecepatanmu menebak warna dari kode HEX.</p>
        </button>

        {/* Flip Card Game */}
        <button
          onClick={() => onSelectMode(GameMode.FlipCard)}
          className="bg-gray-700 p-6 rounded-lg hover:bg-red-800 transition-all duration-300 transform hover:-translate-y-1 group"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-2">Kartu Warna</h2>
          <p className="text-gray-400 group-hover:text-gray-200">Cocokkan nama warna dengan kode HEX-nya.</p>
        </button>

        {/* Color Wheel */}
        <button
          onClick={() => onSelectMode(GameMode.ColorWheel)}
          className="bg-gray-700 p-6 rounded-lg hover:bg-purple-800 transition-all duration-300 transform hover:-translate-y-1 group"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-2">Roda Warna</h2>
          <p className="text-gray-400 group-hover:text-gray-200">Pelajari hubungan antar warna dengan kuis interaktif.</p>
        </button>

        {/* Color Mixer */}
        <button
          onClick={() => onSelectMode(GameMode.ColorMixer)}
          className="bg-gray-700 p-6 rounded-lg hover:bg-yellow-800 transition-all duration-300 transform hover:-translate-y-1 group"
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Lab Pencampuran</h2>
          <p className="text-gray-400 group-hover:text-gray-200">Eksplorasi pencampuran warna RGB secara bebas.</p>
        </button>
      </div>
      
      <button
        onClick={() => onSelectMode(GameMode.Instructions)}
        className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200"
      >
        Lihat Instruksi
      </button>
      <style>{`
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.3), 0 0 10px rgba(0, 255, 255, 0.2);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default MainMenu;
