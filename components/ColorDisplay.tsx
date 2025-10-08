import React from 'react';
import { getContrastingTextColor } from '../services/colorUtils';

interface ColorDisplayProps {
  hexColor: string;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ hexColor }) => {
  const textColor = getContrastingTextColor(hexColor);

  return (
    <div
      className="w-full h-48 md:h-64 rounded-xl shadow-2xl flex items-center justify-center transition-all duration-300 mb-8 p-1 bg-gradient-to-br from-cyan-500 to-purple-500"
    >
        <div className="w-full h-full rounded-lg flex items-center justify-center" style={{ backgroundColor: hexColor, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'}}>
             <span
                className="text-2xl md:text-4xl font-mono font-bold"
                style={{ color: textColor, textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}
            >
                {hexColor}
            </span>
        </div>
    </div>
  );
};

export default ColorDisplay;