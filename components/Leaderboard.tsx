import React from 'react';
import { ScoreEntry } from '../types';

interface LeaderboardProps {
  scores: ScoreEntry[];
  currentPlayer: ScoreEntry | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores, currentPlayer }) => {
  return (
    <div className="w-full max-w-sm mx-auto text-left">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Papan Peringkat</h2>
      <div className="bg-gray-900/70 rounded-lg max-h-64 overflow-y-auto p-1">
        <ul className="space-y-2 p-3">
          {scores.length > 0 ? (
            scores.map((entry, index) => {
              const isCurrentPlayer = 
                currentPlayer && 
                entry.name === currentPlayer.name && 
                entry.score === currentPlayer.score;

              return (
                <li
                  key={index}
                  className={`flex justify-between items-center p-2 rounded-md ${
                    isCurrentPlayer ? 'bg-cyan-500/30 ring-2 ring-cyan-400' : 'bg-gray-800'
                  }`}
                >
                  <span className="font-semibold text-gray-300">
                    {index + 1}. {entry.name}
                  </span>
                  <span className="font-bold text-white">{entry.score}</span>
                </li>
              );
            })
          ) : (
            <p className="text-center text-gray-400 p-4">Belum ada skor. Jadilah yang pertama!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
