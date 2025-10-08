import React from 'react';

interface ScoreboardProps {
  score: number;
  round: number;
  totalRounds: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, round, totalRounds }) => {
  return (
    <div className="flex justify-between items-center w-full text-lg font-semibold text-gray-300 mb-6 px-2 font-heading">
      <div className="glass-panel px-4 py-2 rounded-lg">
        Skor: <span className="text-cyan-400 font-bold">{score}</span>
      </div>
      <div className="glass-panel px-4 py-2 rounded-lg">
        Ronde: <span className="text-cyan-400 font-bold">{round}</span> / {totalRounds}
      </div>
    </div>
  );
};

export default Scoreboard;