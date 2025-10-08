import React from 'react';
import { ColorInfo } from '../types';
import { COLORS } from '../constants';
import { getContrastingTextColor } from '../services/colorUtils';
import LoadingSpinner from './LoadingSpinner';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean | null;
  correctColor: ColorInfo;
  selectedOptionName: string;
  feedbackText: string;
  isLoading: boolean;
  onNextRound: () => void;
  isLastRound: boolean;
}

// Helper to format Gemini's text response into basic HTML
const formatFeedbackText = (text: string): string => {
  const lines = text.trim().split('\n').filter(line => line.trim());
  if (lines.length === 0) return '';

  const processedLines = lines.map(line =>
    line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  );
  
  const isList = processedLines.some(line => /^\s*(\d+\.|\*|-)\s/.test(line));

  if (isList) {
    let listItems = processedLines.map(line => {
      const content = line.replace(/^\s*(\d+\.|\*|-)\s/, '');
      return `<li>${content}</li>`;
    });
    const isOrdered = /^\s*\d+\./.test(processedLines[0]);
    const listTag = isOrdered ? 'ol' : 'ul';
    const listClasses = isOrdered ? 'list-decimal' : 'list-disc';
    
    return `<${listTag} class="${listClasses} list-inside space-y-2">${listItems.join('')}</${listTag}>`;
  } else {
    return processedLines.map(line => `<p>${line}</p>`).join('');
  }
};


const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  correctColor,
  selectedOptionName,
  feedbackText,
  isLoading,
  onNextRound,
  isLastRound
}) => {
  if (!isOpen) return null;

  const selectedColor = COLORS.find(c => c.name === selectedOptionName);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col animate-fade-in border-2 border-gray-700">
        <h2 className={`text-3xl font-bold text-center mb-6 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? 'Jawaban Benar!' : 'Kurang Tepat'}
        </h2>

        <div className={`flex flex-col sm:flex-row justify-center gap-6 my-4 ${isCorrect ? 'sm:justify-center' : 'sm:justify-around'}`}>
          {/* Correct Answer */}
          <div className="text-center flex-shrink-0">
            <p className="font-semibold text-gray-300 mb-2">Jawaban Benar</p>
            <div 
              style={{ backgroundColor: correctColor.hex }} 
              className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-lg flex items-center justify-center font-mono font-bold border-4 border-green-500 shadow-lg"
            >
              <span 
                style={{ color: getContrastingTextColor(correctColor.hex), textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }} 
                className="text-lg"
              >
                {correctColor.hex}
              </span>
            </div>
            <p className="mt-2 font-bold text-xl text-cyan-400">{correctColor.name}</p>
          </div>

          {/* User's Answer (if wrong) */}
          {!isCorrect && selectedColor && (
            <div className="text-center flex-shrink-0">
              <p className="font-semibold text-gray-300 mb-2">Jawaban Kamu</p>
              <div 
                style={{ backgroundColor: selectedColor.hex }} 
                className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-lg flex items-center justify-center font-mono font-bold border-4 border-red-500 shadow-lg"
              >
                <span 
                  style={{ color: getContrastingTextColor(selectedColor.hex), textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                  className="text-lg"
                >
                  {selectedColor.hex}
                </span>
              </div>
              <p className="mt-2 font-bold text-xl">{selectedColor.name}</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-900/70 p-4 rounded-lg min-h-[150px] w-full mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
              <span className="ml-3 text-gray-400">Memuat info dari Gemini...</span>
            </div>
          ) : (
             <div className="feedback-content text-gray-300 max-w-none" dangerouslySetInnerHTML={{ __html: formatFeedbackText(feedbackText) }} />
          )}
        </div>

        <button 
          onClick={onNextRound} 
          disabled={isLoading} 
          className="mt-8 w-full bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-cyan-400 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Memuat...' : (isLastRound ? 'Lihat Skor' : 'Lanjut')}
        </button>
      </div>
      <style>{`
        .feedback-content strong {
            color: #67e8f9; /* cyan-300 */
        }
        .feedback-content ul, .feedback-content ol {
            padding-left: 1.5rem;
        }
        .feedback-content li {
            margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
