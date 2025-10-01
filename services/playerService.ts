import { PlayerData } from '../types';
import { AVATAR_LIST } from '../components/Avatars';

const PLAYER_KEY = 'colorMasterPlayer';

const generateUniqueId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

const createDefaultPlayerData = (): PlayerData => {
    const randomAvatar = AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)];
    return {
        id: generateUniqueId(),
        name: 'Pemain',
        avatarId: randomAvatar.id,
    };
};

/**
 * Loads player data from localStorage. If it doesn't exist, creates default data.
 * @returns {PlayerData} The player's data.
 */
export const getPlayerData = (): PlayerData => {
    try {
        const savedData = localStorage.getItem(PLAYER_KEY);
        if (savedData) {
            // Check if old data structure with 'class' exists and remove it
            const parsedData = JSON.parse(savedData);
            if ('class' in parsedData) {
                delete parsedData.class;
                savePlayerData(parsedData);
                return parsedData;
            }
            return parsedData;
        } else {
            const defaultData = createDefaultPlayerData();
            savePlayerData(defaultData);
            return defaultData;
        }
    } catch (error) {
        console.error("Failed to load player data from localStorage:", error);
        return createDefaultPlayerData();
    }
};

/**
 * Saves player data to localStorage.
 * @param {PlayerData} data The player data to save.
 */
export const savePlayerData = (data: PlayerData): void => {
    try {
        localStorage.setItem(PLAYER_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save player data to localStorage:", error);
    }
};