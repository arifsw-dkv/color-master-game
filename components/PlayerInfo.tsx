import React from 'react';
import { PlayerData } from '../types';
import { getAvatarById } from './Avatars';

interface PlayerInfoProps {
  playerData: PlayerData | null;
  onOpenSettings: () => void;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerData, onOpenSettings }) => {
  if (!playerData) {
    return null;
  }

  const AvatarComponent = getAvatarById(playerData.avatarId);

  return (
    <div 
      className="absolute top-4 left-4 z-10 flex items-center gap-3 p-2 bg-gray-900/50 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors duration-200 shadow-md"
      onClick={onOpenSettings}
      role="button"
      aria-label="Buka Info Pemain dan Pengaturan"
    >
      <div className="w-12 h-12 rounded-full bg-cyan-900 overflow-hidden ring-2 ring-cyan-500">
        <AvatarComponent />
      </div>
      <div>
        <p className="font-bold text-white text-sm leading-tight">{playerData.name}</p>
        <p className="text-xs text-gray-400 leading-tight">ID: {playerData.id}</p>
      </div>
    </div>
  );
};

export default PlayerInfo;