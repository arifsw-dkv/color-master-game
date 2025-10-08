import React, { useState, useEffect, useCallback } from 'react';
import { PlayerData, SettingsData } from '../types';
import * as playerService from '../services/playerService';
import * as settingsService from '../services/settingsService';
import { setMusicVolume } from '../services/musicService';
import { AVATAR_LIST, getAvatarById } from './Avatars';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [playerData, setPlayerData] = useState<PlayerData>(playerService.getPlayerData());
  const [settings, setSettings] = useState<SettingsData>(settingsService.getSettings());
  const [tempPlayerName, setTempPlayerName] = useState(playerData.name);

  useEffect(() => {
    if (isOpen) {
      const currentData = playerService.getPlayerData();
      setPlayerData(currentData);
      setTempPlayerName(currentData.name);
      setSettings(settingsService.getSettings());
    }
  }, [isOpen]);

  const handlePlayerSave = () => {
    const updatedData = { ...playerData, name: tempPlayerName };
    playerService.savePlayerData(updatedData);
    setPlayerData(updatedData);
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('playerDataChanged'));
    // Maybe show a small success message
  };

  const handleAvatarSelect = (avatarId: string) => {
    const updatedData = { ...playerData, avatarId };
    playerService.savePlayerData(updatedData);
    setPlayerData(updatedData);
    window.dispatchEvent(new CustomEvent('playerDataChanged'));
  };

  const handleSettingChange = useCallback((key: keyof SettingsData, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    settingsService.saveSettings(newSettings);
    
    if (key === 'musicVolume') {
        setMusicVolume(value);
    }
  }, [settings]);

  if (!isOpen) return null;

  const renderSection = (title: string, children: React.ReactNode) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-cyan-400 mb-3 border-b-2 border-gray-700 pb-2 font-heading">{title}</h3>
      {children}
    </div>
  );

  const renderSlider = (label: string, key: keyof SettingsData, value: number, max = 1, step = 0.01) => (
     <div className="mb-3">
        <label htmlFor={key} className="block text-sm font-medium text-gray-300 mb-1">{label} ({(value * 100).toFixed(0)}%)</label>
        <input
            id={key}
            type="range"
            min="0"
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleSettingChange(key, parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb-cyan-500"
        />
     </div>
  );
  
  const renderSelect = (label: string, key: keyof SettingsData, options: string[], value: string) => (
    <div className="mb-3">
        <label htmlFor={key} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select 
            id={key}
            value={value}
            onChange={(e) => handleSettingChange(key, e.target.value)}
            className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:border-cyan-500 focus:outline-none"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
  );
  
  const CurrentAvatar = getAvatarById(playerData.avatarId);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white font-heading">Pengaturan & Info Pemain</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>

        <div className="overflow-y-auto pr-4 -mr-4">
            {renderSection("Info Pemain", (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-cyan-900 overflow-hidden ring-4 ring-cyan-500">
                           <CurrentAvatar />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="mb-3">
                            <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-1">Ubah Nama</label>
                            <input
                                id="playerName"
                                type="text"
                                value={tempPlayerName}
                                onChange={(e) => setTempPlayerName(e.target.value)}
                                className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                         <button onClick={handlePlayerSave} className="bg-cyan-500 text-gray-900 font-semibold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors">Simpan Nama</button>
                    </div>
                </div>
            ))}
            
            {renderSection("Pilih Avatar", (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {AVATAR_LIST.map(avatar => {
                        const AvatarComponent = avatar.component;
                        return (
                            <button key={avatar.id} onClick={() => handleAvatarSelect(avatar.id)} className={`w-16 h-16 p-1 rounded-full overflow-hidden transition-all duration-200 ${playerData.avatarId === avatar.id ? 'bg-cyan-500 ring-4 ring-cyan-400 scale-110' : 'bg-gray-700 hover:bg-cyan-800'}`}>
                                <AvatarComponent />
                            </button>
                        );
                    })}
                </div>
            ))}

            {renderSection("Audio", (
                <>
                    {renderSlider("Musik", "musicVolume", settings.musicVolume)}
                    {renderSlider("Efek Suara", "effectsVolume", settings.effectsVolume)}
                    {renderSlider("Suara", "voiceVolume", settings.voiceVolume)}
                </>
            ))}

            {renderSection("Grafis", (
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {renderSelect("Grafis", "graphics", ["Rendah", "Sedang", "Tinggi"], settings.graphics)}
                    {renderSelect("Efek Visual", "effects", ["Rendah", "Sedang", "Tinggi"], settings.effects)}
                    {renderSelect("FPS", "fps", ["30", "60", "Tidak Terbatas"], settings.fps)}
                </div>
            ))}
        </div>
        
        <div className="mt-auto pt-6 text-right">
             <button onClick={onClose} className="bg-gray-600/50 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600/80 transition-colors border border-gray-500">Tutup</button>
        </div>
      </div>
      <style>{`
        .range-thumb-cyan-500::-webkit-slider-thumb { background-color: #06b6d4; }
        .range-thumb-cyan-500::-moz-range-thumb { background-color: #06b6d4; }
      `}</style>
    </div>
  );
};

export default SettingsModal;