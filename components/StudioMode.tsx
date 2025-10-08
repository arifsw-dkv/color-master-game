import React, { useState, useCallback, useMemo, useRef } from 'react';
import { ColorInfo } from '../types';
import { getPaletteFromPrompt, getPaletteFromImage } from '../services/geminiService';
import { getContrastingTextColor, calculateContrastRatio } from '../services/colorUtils';
import LoadingSpinner from './LoadingSpinner';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [mimeString, data] = result.split(',');
      const mimeType = mimeString.split(':')[1].split(';')[0];
      resolve({ data, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

// --- Sub-components (defined in the same file for simplicity) ---

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

// --- Palette Generator Component ---
interface PaletteGeneratorProps {
    onPaletteGenerated: (palette: ColorInfo[]) => void;
    onSetLoading: (loading: boolean) => void;
    onSetError: (error: string) => void;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onPaletteGenerated, onSetLoading, onSetError }) => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerateFromPrompt = async () => {
        if (!prompt.trim()) return;
        onSetLoading(true);
        onSetError('');
        try {
            const palette = await getPaletteFromPrompt(prompt);
            onPaletteGenerated(palette);
        } catch (e: any) {
            onSetError(e.message);
        } finally {
            onSetLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleExtractFromImage = async () => {
        if (!imageFile) return;
        onSetLoading(true);
        onSetError('');
        try {
            const { data, mimeType } = await fileToBase64(imageFile);
            const palette = await getPaletteFromImage(data, mimeType);
            onPaletteGenerated(palette);
        } catch (e: any) {
            onSetError(e.message);
        } finally {
            onSetLoading(false);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl shadow-lg h-full">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-heading">Generator Palet</h2>
            <div className="space-y-6">
                {/* From Text */}
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">Hasilkan dari Teks</label>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Contoh: senja di pantai yang tenang, kota cyberpunk futuristik..."
                        className="w-full bg-gray-900 text-white p-2 rounded-md border border-gray-600 focus:border-cyan-500 focus:outline-none"
                    />
                    <button onClick={handleGenerateFromPrompt} className="mt-2 w-full bg-cyan-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors">
                        Buat Palet
                    </button>
                </div>

                {/* Separator */}
                <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400">ATAU</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                {/* From Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ekstrak dari Gambar</label>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                        <UploadIcon />
                        Pilih Gambar
                    </button>
                    {imagePreview && (
                        <div className="mt-4">
                            <img src={imagePreview} alt="Preview" className="max-h-40 w-auto mx-auto rounded-lg shadow-md" />
                            <button onClick={handleExtractFromImage} className="mt-2 w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-400 transition-colors">
                                Ekstrak Warna
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Current Palette Component ---
interface CurrentPaletteProps {
    palette: ColorInfo[];
}

const CurrentPalette: React.FC<CurrentPaletteProps> = ({ palette }) => {
    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    const handleCopy = (text: string, hex: string) => {
        navigator.clipboard.writeText(text);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 1500);
    };

    const exportPalette = (format: 'css' | 'json') => {
        let exportText = '';
        if (format === 'css') {
            exportText = palette.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
        } else {
            exportText = JSON.stringify(palette.map(c => c.hex), null, 2);
        }
        navigator.clipboard.writeText(exportText);
        alert(`Palet disalin ke clipboard sebagai ${format.toUpperCase()}!`);
    }

    if (palette.length === 0) {
        return (
            <div className="glass-panel p-6 rounded-2xl shadow-lg h-full flex items-center justify-center">
                <p className="text-gray-400 text-center">Palet Anda akan muncul di sini setelah dibuat.</p>
            </div>
        );
    }
    
    return (
        <div className="glass-panel p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-heading">Palet Saat Ini</h2>
            <div className="space-y-2 mb-6">
                {palette.map(color => (
                    <div key={color.hex} className="flex items-center gap-4 p-2 bg-black/20 rounded-lg">
                        <div className="w-12 h-12 rounded-md border-2 border-gray-600" style={{ backgroundColor: color.hex }}></div>
                        <div className="flex-grow">
                            <p className="font-semibold text-white">{color.name}</p>
                            <p className="font-mono text-sm text-gray-400">{color.hex}</p>
                        </div>
                        <button onClick={() => handleCopy(color.hex, color.hex)} className="p-2 text-gray-400 hover:text-white rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                            {copiedHex === color.hex ? 'OK!' : <CopyIcon />}
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-4">
                <button onClick={() => exportPalette('css')} className="flex-1 bg-gray-700 hover:bg-gray-600 font-semibold py-2 px-4 rounded-md">Salin CSS</button>
                <button onClick={() => exportPalette('json')} className="flex-1 bg-gray-700 hover:bg-gray-600 font-semibold py-2 px-4 rounded-md">Salin JSON</button>
            </div>
        </div>
    );
};


// --- Accessibility Checker Component ---
interface AccessibilityCheckerProps {
    palette: ColorInfo[];
}

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({ palette }) => {
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [bgColor, setBgColor] = useState('#1F2937');

    const { ratio, normal, large } = useMemo(() => {
        const contrastRatio = calculateContrastRatio(textColor, bgColor);
        return {
            ratio: contrastRatio.toFixed(2),
            normal: { aa: contrastRatio >= 4.5, aaa: contrastRatio >= 7 },
            large: { aa: contrastRatio >= 3, aaa: contrastRatio >= 4.5 },
        };
    }, [textColor, bgColor]);

    const Rating: React.FC<{ label: string; passed: boolean }> = ({ label, passed }) => (
        <div className={`px-2 py-1 rounded ${passed ? 'bg-green-500/80' : 'bg-red-500/80'} text-white text-xs font-bold`}>
            {label} {passed ? '✔' : '❌'}
        </div>
    );

    const handleColorSelect = (color: string, type: 'text' | 'bg') => {
        if (type === 'text') setTextColor(color);
        else setBgColor(color);
    };

    return (
        <div className="glass-panel p-6 rounded-2xl shadow-lg mt-8">
             <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-heading">Pemeriksa Kontras</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Inputs */}
                <div>
                     <div className="flex gap-4 mb-4">
                        <div>
                            <label htmlFor="textColor" className="block text-sm font-medium text-gray-300 mb-1">Warna Teks</label>
                            <input id="textColor" type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-16 h-10 p-1 bg-gray-700 border-gray-600 rounded cursor-pointer"/>
                        </div>
                        <div>
                            <label htmlFor="bgColor" className="block text-sm font-medium text-gray-300 mb-1">Latar</label>
                            <input id="bgColor" type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-16 h-10 p-1 bg-gray-700 border-gray-600 rounded cursor-pointer"/>
                        </div>
                    </div>
                    {palette.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-400 mb-2">Pilih dari palet:</p>
                            <div className="flex flex-wrap gap-2">
                                {palette.map(c => (
                                    <button key={c.hex} style={{backgroundColor: c.hex}} onClick={() => handleColorSelect(c.hex, 'text')} onContextMenu={(e) => { e.preventDefault(); handleColorSelect(c.hex, 'bg')}} className="w-8 h-8 rounded-full border-2 border-gray-500 cursor-pointer" title={`Klik kiri untuk Teks, Klik kanan untuk Latar`}></button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Results */}
                <div className="space-y-3">
                    <div className="p-4 rounded-lg text-center" style={{ backgroundColor: bgColor, color: textColor }}>
                        <p className="font-bold text-xl">Rasio Kontras</p>
                        <p className="text-3xl font-mono">{ratio}</p>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg">
                        <h4 className="font-semibold text-gray-300 mb-2">Peringkat WCAG AA</h4>
                        <div className="flex gap-2">
                           <Rating label="Teks Normal" passed={normal.aa} />
                           <Rating label="Teks Besar" passed={large.aa} />
                        </div>
                    </div>
                     <div className="bg-black/20 p-3 rounded-lg">
                        <h4 className="font-semibold text-gray-300 mb-2">Peringkat WCAG AAA</h4>
                         <div className="flex gap-2">
                           <Rating label="Teks Normal" passed={normal.aaa} />
                           <Rating label="Teks Besar" passed={large.aaa} />
                        </div>
                    </div>
                </div>
             </div>
        </div>
    )
};


// --- Main Studio Mode Component ---
interface StudioModeProps {
  onGoToMainMenu: () => void;
}

const StudioMode: React.FC<StudioModeProps> = ({ onGoToMainMenu }) => {
    const [palette, setPalette] = useState<ColorInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePaletteGenerated = (newPalette: ColorInfo[]) => {
        setPalette(newPalette);
        setError(null);
    };

    return (
        <div className="w-full max-w-7xl animate-fade-in relative">
             <h1 className="text-5xl font-bold mb-6 text-center text-cyan-400 font-heading">Color Studio</h1>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-300">Gemini sedang berpikir...</p>
                </div>
            )}
            {error && (
                <div className="bg-red-500/30 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-center">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <PaletteGenerator
                    onPaletteGenerated={handlePaletteGenerated}
                    onSetLoading={setIsLoading}
                    onSetError={setError}
                />
                {/* Right Column */}
                <div className="flex flex-col gap-8">
                     <CurrentPalette palette={palette} />
                     <AccessibilityChecker palette={palette} />
                </div>
            </div>
             <div className="text-center mt-8">
                <button onClick={onGoToMainMenu} className="bg-gray-600/50 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-600/80 transition-all duration-300 border border-gray-500">
                  Kembali ke Menu Utama
                </button>
            </div>
        </div>
    );
};

export default StudioMode;