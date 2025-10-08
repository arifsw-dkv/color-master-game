import { getSettings } from './settingsService';

let audioCtx: AudioContext | null = null;
let isInitialized = false;
let isPlaying = false;
let musicNodes: { oscillator: OscillatorNode; gain: GainNode } | null = null;
let noteScheduler: number | null = null;
let currentNoteIndex = 0;

// A simple, calm C-minor arpeggio for background music.
const melody = [
  { freq: 261.63, duration: 400 }, // C4
  { freq: 311.13, duration: 400 }, // Eb4
  { freq: 392.00, duration: 400 }, // G4
  { freq: 466.16, duration: 300 }, // Bb4
  { freq: 392.00, duration: 500 }, // G4
];

/**
 * Initializes the Web Audio API context. Must be called from a user gesture.
 */
function initializeAudio() {
  if (isInitialized || typeof window === 'undefined') return;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    isInitialized = true;
  } catch (e) {
    console.error("Web Audio API is not supported in this browser.");
  }
}

/**
 * The main music loop. Plays one note and schedules the next one.
 * Reads the volume from settings for each note to allow real-time changes.
 */
function playNextNote() {
    if (!audioCtx || !musicNodes || !isPlaying) return;

    const settings = getSettings();
    const masterVolume = settings.musicVolume;
    const note = melody[currentNoteIndex];

    if (masterVolume > 0) {
        const now = audioCtx.currentTime;

        // Set frequency for the current note.
        musicNodes.oscillator.frequency.setValueAtTime(note.freq, now);

        // Create a small volume envelope for the note to avoid clicks.
        const gain = musicNodes.gain.gain;
        gain.cancelScheduledValues(now);
        gain.setValueAtTime(0.0001, now);
        gain.exponentialRampToValueAtTime(0.12 * masterVolume, now + 0.05); // Fade in
        gain.exponentialRampToValueAtTime(0.0001, now + (note.duration / 1000) - 0.05); // Fade out
    }
    
    // Schedule the next note.
    noteScheduler = window.setTimeout(playNextNote, note.duration);
    currentNoteIndex = (currentNoteIndex + 1) % melody.length;
}

/**
 * Adjusts the music volume.
 * The actual volume is applied on a per-note basis within the playNextNote loop,
 * which reads directly from the saved settings. This function is kept for API
 * consistency but is not required to actively change the volume.
 * @param {number} level - The new volume level (0.0 to 1.0).
 */
export function setMusicVolume(level: number) {
  // Volume is read from settings for each note, so no direct action is needed here.
  // If music is playing and the new level is 0, the loop will just play silence, which is fine.
}

/**
 * Starts playing the procedural menu music.
 * Should be called as a result of a user interaction (e.g., a click).
 */
export function playMenuMusic() {
  // Lazily initialize the AudioContext on first play request.
  initializeAudio();
  if (!audioCtx || isPlaying) return;

  const settings = getSettings();
  if (settings.musicVolume === 0) return;

  isPlaying = true;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.type = 'triangle'; // Triangle wave is a bit softer than sine, good for ambience.

  musicNodes = { oscillator, gain: gainNode };
  
  oscillator.start();
  playNextNote();
}

/**
 * Stops the music and cleans up audio nodes.
 */
export function stopMusic() {
  if (!isPlaying || !musicNodes || !audioCtx) return;
  
  isPlaying = false;
  
  if (noteScheduler) {
    clearTimeout(noteScheduler);
    noteScheduler = null;
  }
  
  // Fade out the sound smoothly before stopping the oscillator.
  const now = audioCtx.currentTime;
  const gain = musicNodes.gain.gain;
  gain.cancelScheduledValues(now);
  gain.setValueAtTime(gain.value, now); // Start from current volume
  gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

  musicNodes.oscillator.stop(now + 0.3);
  musicNodes = null;
  currentNoteIndex = 0;
}
