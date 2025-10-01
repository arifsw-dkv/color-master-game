import { SettingsData } from '../types';

const SETTINGS_KEY = 'colorMasterSettings';

const getDefaultSettings = (): SettingsData => ({
    musicVolume: 0.5,
    effectsVolume: 0.8,
    voiceVolume: 1.0,
    graphics: 'Sedang',
    effects: 'Sedang',
    fps: '60',
});

/**
 * Loads settings from localStorage. If they don't exist, returns default settings.
 * @returns {SettingsData} The game settings.
 */
export const getSettings = (): SettingsData => {
    try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
            // Merge saved settings with defaults to ensure all keys are present
            return { ...getDefaultSettings(), ...JSON.parse(savedSettings) };
        } else {
            const defaultSettings = getDefaultSettings();
            saveSettings(defaultSettings);
            return defaultSettings;
        }
    } catch (error) {
        console.error("Failed to load settings from localStorage:", error);
        return getDefaultSettings();
    }
};

/**
 * Saves settings to localStorage.
 * @param {SettingsData} data The settings to save.
 */
export const saveSettings = (data: SettingsData): void => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save settings to localStorage:", error);
    }
};