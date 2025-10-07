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

/**
 * Converts a hex color string to an RGB object.
 * @param {string} hex - The hex color string (e.g., '#RRGGBB').
 * @returns {{r: number; g: number; b: number} | null} An RGB object or null if invalid.
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Helper to calculate relative luminance
const getLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

/**
 * Calculates the contrast ratio between two hex colors.
 * @param {string} hex1 - The first hex color.
 * @param {string} hex2 - The second hex color.
 * @returns {number} The contrast ratio.
 */
export const calculateContrastRatio = (hex1: string, hex2: string): number => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) {
    return 1;
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};
