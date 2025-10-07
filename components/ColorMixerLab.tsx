import React, { useState, useMemo } from 'react';
import * as soundService from '../services/soundService';

interface ColorMixerLabProps {
  onGoToMainMenu: () => void;
}

// --- Helper Functions ---
const toHex = (c: number): string => c.toString(16).padStart(2, '0');
const rgbToHex = (r: number, g: number, b: number): string => `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
const generateRandomColor = (): { r: number; g: number; b: number } => ({
  r: Math.floor(Math.random() * 256),
  g: Math.floor(Math.random() * 256),
  b: Math.floor(Math.random() * 256),
});

// --- Main Component ---
const ColorMixerLab: React.FC<ColorMixerLabProps> = ({ onGoToMainMenu }) => {
  const [mode, setMode] = useState<'selection' | 'challenge' | 'explore'>('selection');

  const renderModeSelection = () => (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg animate-fade-in max-w-lg">
      <h1 className="text-5xl font-bold mb-4 text-yellow-400">Lab Pencampuran</h1>
      <p className="text-lg text-gray-300 mb-8">Pilih mode untuk memulai.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => { soundService.playClickSound(); setMode('challenge'); }} className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-yellow-400 transition-all duration-300">
          Mode Tantangan
        </button>
        <button onClick={() => { soundService.playClickSound(); setMode('explore'); }} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-500 transition-all duration-300">
          Mode Eksplorasi
        </button>
      </div>
       <div className="text-center mt-8">
        <button onClick={onGoToMainMenu} className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200">
          Kembali ke Menu Utama
        </button>
      </div>
    </div>
  );

  return (
    <>
      {mode === 'selection' && renderModeSelection()}
      {mode === 'explore' && <ExploreMode onGoToSelection={() => setMode('selection')} onGoToMainMenu={onGoToMainMenu} />}
      {mode === 'challenge' && <ChallengeMode onGoToSelection={() => setMode('selection')} onGoToMainMenu={onGoToMainMenu} />}
    </>
  );
};

// --- Explore Mode Component ---
const ExploreMode = ({ onGoToSelection, onGoToMainMenu }: { onGoToSelection: () => void; onGoToMainMenu: () => void; }) => {
  const [r, setR] = useState(Math.floor(Math.random() * 256));
  const [g, setG] = useState(Math.floor(Math.random() * 256));
  const [b, setB] = useState(Math.floor(Math.random() * 256));
  const hexColor = useMemo(() => rgbToHex(r, g, b), [r, g, b]);

  const handleSliderChange = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(value);
    soundService.playMixerTone(value, 255);
  };

  return (
    <div className="w-full max-w-lg bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg animate-fade-in">
      <h1 className="text-4xl font-bold mb-4 text-center text-yellow-400">Mode Eksplorasi</h1>
      <p className="text-center text-gray-300 mb-8">Geser slider untuk mencampur warna secara bebas.</p>
      <div className="w-full h-40 rounded-lg shadow-inner mb-8 transition-colors duration-200 border-4 border-gray-700" style={{ backgroundColor: hexColor }}></div>
      <div className="space-y-6 mb-8">
        <ColorSlider label="R" value={r} colorClass="red" onChange={(val) => handleSliderChange(val, setR)} />
        <ColorSlider label="G" value={g} colorClass="green" onChange={(val) => handleSliderChange(val, setG)} />
        <ColorSlider label="B" value={b} colorClass="blue" onChange={(val) => handleSliderChange(val, setB)} />
      </div>
      <div className="text-center bg-gray-900/70 p-4 rounded-lg">
        <p className="text-2xl font-mono tracking-widest">{hexColor}</p>
      </div>
      <div className="text-center mt-8">
        <button onClick={onGoToSelection} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-500 transition-all duration-300">
          Pilih Mode Lain
        </button>
      </div>
       <div className="text-center mt-4">
        <button onClick={onGoToMainMenu} className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200">
          Kembali ke Menu Utama
        </button>
      </div>
    </div>
  );
};

// --- Challenge Mode Component ---
const TOTAL_CHALLENGE_ROUNDS = 5;

const ChallengeMode = ({ onGoToSelection, onGoToMainMenu }: { onGoToSelection: () => void; onGoToMainMenu: () => void; }) => {
    const [gameState, setGameState] = useState<'playing' | 'roundEnd' | 'gameOver'>('playing');
    const [currentRound, setCurrentRound] = useState(1);
    const [totalScore, setTotalScore] = useState(0);
    const [roundScore, setRoundScore] = useState(0);
    const [targetColor, setTargetColor] = useState(generateRandomColor());
    const [playerColor, setPlayerColor] = useState({ r: 128, g: 128, b: 128 });

    const playerHex = useMemo(() => rgbToHex(playerColor.r, playerColor.g, playerColor.b), [playerColor]);
    const targetHex = useMemo(() => rgbToHex(targetColor.r, targetColor.g, targetColor.b), [targetColor]);

    const accuracy = useMemo(() => {
        const diffR = targetColor.r - playerColor.r;
        const diffG = targetColor.g - playerColor.g;
        const diffB = targetColor.b - playerColor.b;
        const distance = Math.sqrt(diffR * diffR + diffG * diffG + diffB * diffB);
        const maxDistance = Math.sqrt(3 * 255 * 255);
        const percentage = 100 - (distance / maxDistance) * 100;
        return Math.max(0, percentage);
    }, [targetColor, playerColor]);

    const handleLockIn = () => {
        soundService.playClickSound();
        const score = Math.round(accuracy);
        setRoundScore(score);
        setTotalScore(prev => prev + score);
        setGameState('roundEnd');
    };

    const handleNextRound = () => {
        soundService.playClickSound();
        if (currentRound >= TOTAL_CHALLENGE_ROUNDS) {
            setGameState('gameOver');
        } else {
            setCurrentRound(prev => prev + 1);
            setTargetColor(generateRandomColor());
            setGameState('playing');
        }
    };
    
    const handlePlayAgain = () => {
        soundService.playClickSound();
        setGameState('playing');
        setCurrentRound(1);
        setTotalScore(0);
        setRoundScore(0);
        setTargetColor(generateRandomColor());
        setPlayerColor({r: 128, g: 128, b: 128});
    }

    if (gameState === 'gameOver') {
        return (
            <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
                <h1 className="text-4xl font-bold mb-4 text-yellow-400">Tantangan Selesai!</h1>
                <p className="text-xl text-gray-300 mb-2">Total Skor Kamu:</p>
                <p className="text-7xl font-bold text-cyan-400 mb-8">{totalScore}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handlePlayAgain} className="bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-yellow-400 transition-all">Main Lagi</button>
                    <button onClick={onGoToMainMenu} className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-500 transition-all">Menu Utama</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-yellow-400">Mode Tantangan</h1>
                 <div className="bg-gray-900/50 px-4 py-2 rounded-lg text-lg">Ronde: <span className="font-bold text-cyan-400">{currentRound}</span> / {TOTAL_CHALLENGE_ROUNDS}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Target Color */}
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">Target</h2>
                    <div className="w-full h-32 rounded-lg border-4 border-gray-700" style={{backgroundColor: targetHex}}></div>
                    <div className="bg-gray-900/50 mt-2 p-2 rounded-lg text-sm">
                        <p className="font-mono">{targetHex}</p>
                        <p className="font-sans text-xs text-gray-400">R:{targetColor.r} G:{targetColor.g} B:{targetColor.b}</p>
                    </div>
                </div>
                 {/* Player Color */}
                 <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">Milikmu</h2>
                    <div className="w-full h-32 rounded-lg border-4 border-cyan-500/50" style={{backgroundColor: playerHex}}></div>
                     <div className="bg-gray-900/50 mt-2 p-2 rounded-lg text-sm">
                        <p className="font-mono">{playerHex}</p>
                        <p className="font-sans text-xs text-gray-400">R:{playerColor.r} G:{playerColor.g} B:{playerColor.b}</p>
                    </div>
                </div>
            </div>

            {gameState === 'playing' ? (
                <>
                    <div className="space-y-4 mb-6">
                        <ColorSlider label="R" value={playerColor.r} colorClass="red" onChange={(r) => setPlayerColor(p => ({...p, r}))} />
                        <ColorSlider label="G" value={playerColor.g} colorClass="green" onChange={(g) => setPlayerColor(p => ({...p, g}))} />
                        <ColorSlider label="B" value={playerColor.b} colorClass="blue" onChange={(b) => setPlayerColor(p => ({...p, b}))} />
                    </div>
                    <div className="text-center mb-4">
                        <p className="text-2xl font-bold">Akurasi: <span className="text-cyan-400">{accuracy.toFixed(1)}%</span></p>
                    </div>
                    <button onClick={handleLockIn} className="w-full bg-cyan-500 text-gray-900 font-bold py-3 rounded-lg text-xl hover:bg-cyan-400 transition-all">
                        Kunci Jawaban
                    </button>
                </>
            ) : ( // roundEnd state
                 <div className="text-center p-4 bg-gray-900/50 rounded-lg animate-fade-in">
                    <h2 className="text-2xl font-bold text-cyan-400">Ronde Selesai!</h2>
                    <p className="text-lg">Akurasi Kamu: {accuracy.toFixed(1)}%</p>
                    <p className="text-4xl font-bold text-yellow-400 my-2">+ {roundScore} <span className="text-xl">Poin</span></p>
                     <button onClick={handleNextRound} className="w-full mt-4 bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg text-xl hover:bg-yellow-400 transition-all">
                        {currentRound >= TOTAL_CHALLENGE_ROUNDS ? 'Lihat Skor Akhir' : 'Ronde Berikutnya'}
                    </button>
                 </div>
            )}
            <div className="text-center mt-8">
                <button onClick={onGoToMainMenu} className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200">
                    Kembali ke Menu Utama
                </button>
            </div>
        </div>
    );
}

// --- Reusable Slider Component ---
interface ColorSliderProps {
  label: 'R' | 'G' | 'B';
  value: number;
  colorClass: 'red' | 'green' | 'blue';
  onChange: (value: number) => void;
}

const ColorSlider: React.FC<ColorSliderProps> = ({ label, value, colorClass, onChange }) => {
  const colors = {
    red: 'text-red-500 range-thumb-red-500',
    green: 'text-green-500 range-thumb-green-500',
    blue: 'text-blue-500 range-thumb-blue-500',
  };

  return (
    <div className="flex items-center gap-4">
      <label htmlFor={`${label}-slider`} className={`w-16 font-bold ${colors[colorClass]}`}>{label}: {value}</label>
      <input
        id={`${label}-slider`}
        type="range"
        min="0"
        max="255"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${colors[colorClass]}`}
      />
    </div>
  );
};


export default ColorMixerLab;