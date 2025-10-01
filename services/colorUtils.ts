/**
 * Calculates a contrasting text color (black or white) for a given hex background color.
 * @param hex The hex color string (e.g., '#RRGGBB').
 * @returns {string} The hex code for the contrasting text color ('#000000' or '#FFFFFF').
 */
export const getContrastingTextColor = (hex: string): string => {
  if (!hex || hex.length < 7) return '#FFFFFF';
  try {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    // YIQ formula to determine brightness
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  } catch (e) {
    // Return white as a fallback for invalid hex codes
    return '#FFFFFF';
  }
};
