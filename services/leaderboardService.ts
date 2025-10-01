import { ScoreEntry } from '../types';

const LEADERBOARD_KEY = 'colorMasterLeaderboard';
const MAX_SCORES = 10;

/**
 * Loads scores from localStorage, sorts them by score in descending order, and returns them.
 * @returns {ScoreEntry[]} An array of score entries.
 */
export const getScores = (): ScoreEntry[] => {
  try {
    const savedScores = localStorage.getItem(LEADERBOARD_KEY);
    if (savedScores) {
      const scores: ScoreEntry[] = JSON.parse(savedScores);
      // Ensure sorting is always applied when loading
      scores.sort((a, b) => b.score - a.score);
      return scores;
    }
    return [];
  } catch (error) {
    console.error("Failed to load leaderboard from localStorage:", error);
    return [];
  }
};

/**
 * Adds a new score to the leaderboard, sorts the list, trims it to the max size,
 * and saves it back to localStorage.
 * @param {ScoreEntry} newScore The new score entry to add.
 */
export const addScore = (newScore: ScoreEntry): void => {
  try {
    const scores = getScores();
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only the top N scores
    const updatedScores = scores.slice(0, MAX_SCORES);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error("Failed to save score to localStorage:", error);
  }
};
