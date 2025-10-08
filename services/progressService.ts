const PROGRESS_KEY = 'colorMasterProgress';

interface ProgressData {
  highestLevelCompleted: number;
}

const getDefaultProgress = (): ProgressData => ({
  highestLevelCompleted: 0, // 0 means no levels completed, so level 1 is available
});

/**
 * Loads campaign progress from localStorage.
 * @returns {ProgressData} The player's campaign progress.
 */
export const getProgress = (): ProgressData => {
  try {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      return { ...getDefaultProgress(), ...JSON.parse(savedProgress) };
    } else {
      const defaultProgress = getDefaultProgress();
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(defaultProgress));
      return defaultProgress;
    }
  } catch (error) {
    console.error("Failed to load progress from localStorage:", error);
    return getDefaultProgress();
  }
};

/**
 * Saves campaign progress to localStorage. Only updates if the new level is higher.
 * @param {number} levelCompleted The ID of the level that was just completed.
 */
export const saveProgress = (levelCompleted: number): void => {
  try {
    const currentProgress = getProgress();
    if (levelCompleted > currentProgress.highestLevelCompleted) {
      const newProgress: ProgressData = { highestLevelCompleted: levelCompleted };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
    }
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
};