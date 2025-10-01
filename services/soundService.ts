import { getSettings } from './settingsService';

let audioCtx: AudioContext | null = null;
let isInitialized = false;

// Initialize AudioContext on user gesture
export function init() {
  if (isInitialized || typeof window === 'undefined') return;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    isInitialized = true;
  } catch (e) {
    console.error("Web Audio API is not supported in this browser");
  }
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine'
) {
  if (!audioCtx) return;

  const settings = getSettings();
  const masterVolume = settings.effectsVolume;
  
  if (masterVolume === 0) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.3 * masterVolume, audioCtx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);


  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}

export function playClickSound() {
  playTone(200, 0.1, 'triangle');
}

export function playFlipSound() {
  playTone(500, 0.05, 'triangle');
}

export function playCorrectSound() {
   if (!audioCtx) return;
  playTone(440, 0.1, 'sine');
  setTimeout(() => playTone(660, 0.15, 'sine'), 100);
}

export function playIncorrectSound() {
   if (!audioCtx) return;
  playTone(300, 0.15, 'sawtooth');
  setTimeout(() => playTone(150, 0.2, 'sawtooth'), 150);
}

export function playWheelSelectSound() {
  playTone(350, 0.08, 'triangle');
}

export function playMixerTone(value: number, max: number) {
  if (!audioCtx) return;
  // Map value (0-max) to a frequency range (e.g., 100Hz - 800Hz)
  const frequency = 100 + (value / max) * 700;
  playTone(frequency, 0.05, 'sine');
}