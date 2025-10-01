import React from 'react';
import { getContrastingTextColor } from '../services/colorUtils';

interface ColorDisplayProps {
  hexColor: string;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ hexColor }) => {
  const textColor = getContrastingTextColor(hexColor);

  return (
    <div
      className="w-full h-48 md:h-64 rounded-lg shadow-2xl flex items-center justify-center transition-all duration-300 mb-8 border-4 border-gray-700"
      style={{ backgroundColor: hexColor }}
    >
      <span
        className="text-2xl md:text-4xl font-mono font-bold"
        style={{ color: textColor, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        {hexColor}
      </span>
    </div>
  );
};

export default ColorDisplay;
