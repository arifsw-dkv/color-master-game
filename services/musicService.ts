import { getSettings } from './settingsService';

let audioCtx: AudioContext | null = null;
let isInitialized = false;
let mainGain: GainNode | null = null;
let isPlaying = false;
let sequenceInterval: number | null = null;

// A simple synthwave-inspired musical sequence (notes and timings)
const bassline = [
  { note: 'C2', duration: 0.25 }, { note: 'G2', duration: 0.25 },
  { note: 'A#2', duration: 0.25 }, { note: 'F2', duration: 0.25 },
];

const melody = [
  { note: 'C4', duration: 0.125 }, { note: 'E4', duration: 0.125 }, 
  { note: 'G4', duration: 0.125 }, { note: 'C5', duration: 0.125 },
  { note: 'G4', duration: 0.125 }, { note: 'E4', duration: 0.125 },
];

let currentBassNote = 0;
let currentMelodyNote = 0;

const noteToFreq = (note: string): number => {
  const notes: { [key: string]: number } = {
    'C2': 65.41, 'G2': 98.00, 'A#2': 116.54, 'F2': 87.31,
    'C4': 261.63, 'E4': 329.63, 'G4': 392.00, 'C5': 523.25,
  };
  return notes[note] || 440;
};

// Initialize AudioContext
export function init() {
  if (isInitialized || typeof window === 'undefined') return;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    mainGain = audioCtx.createGain();
    mainGain.connect(audioCtx.destination);
    isInitialized = true;
  } catch (e) {
    console.error("Web Audio API is not supported for music playback.");
  }
}

function playSynthNote(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sawtooth',
  gain: number = 0.2
) {
  if (!audioCtx || !mainGain) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(mainGain);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(type === 'sawtooth' ? 800 : 2000, audioCtx.currentTime);
  
  const attackTime = 0.01;
  const decayTime = duration * 0.5;
  const sustainLevel = 0.1;

  gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(gain, audioCtx.currentTime + attackTime);
  gainNode.gain.setTargetAtTime(gain * sustainLevel, audioCtx.currentTime + attackTime, decayTime);
  gainNode.gain.setTargetAtTime(0.001, audioCtx.currentTime + duration - 0.05, 0.02);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}

const scheduleNotes = () => {
    if (!audioCtx || !isPlaying) return;
    
    // Schedule bass
    const bassNoteInfo = bassline[currentBassNote % bassline.length];
    playSynthNote(noteToFreq(bassNoteInfo.note), bassNoteInfo.duration * 2, 'sawtooth', 0.15);
    currentBassNote++;

    // Schedule two melody notes per bass note
    const melodyNoteInfo1 = melody[currentMelodyNote % melody.length];
    playSynthNote(noteToFreq(melodyNoteInfo1.note), melodyNoteInfo1.duration * 2, 'triangle', 0.1);
    currentMelodyNote++;

    setTimeout(() => {
        if(!isPlaying) return;
        const melodyNoteInfo2 = melody[currentMelodyNote % melody.length];
        playSynthNote(noteToFreq(melodyNoteInfo2.note), melodyNoteInfo2.duration * 2, 'triangle', 0.1);
        currentMelodyNote++;
    }, bassNoteInfo.duration * 1000 / 2)
};

export function setMusicVolume(level: number) { // level 0-1
  if (!mainGain || !audioCtx) return;
  const masterVolume = 0.5 * level;
  mainGain.gain.setTargetAtTime(masterVolume, audioCtx.currentTime, 0.1);
}

export function playMenuMusic() {
  if (!audioCtx || !mainGain || isPlaying) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const settings = getSettings();
  setMusicVolume(settings.musicVolume);

  isPlaying = true;

  scheduleNotes(); // play first notes immediately
  sequenceInterval = window.setInterval(scheduleNotes, bassline[0].duration * 1000);
}

export function stopMusic() {
  if (!audioCtx || !mainGain || !isPlaying) return;

  mainGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5); // Fade out
  
  if (sequenceInterval) {
    clearInterval(sequenceInterval);
    sequenceInterval = null;
  }
  isPlaying = false;
  currentBassNote = 0;
  currentMelodyNote = 0;
}