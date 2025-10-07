import { getSettings } from './settingsService';

let audio: HTMLAudioElement | null = null;
let isInitialized = false;

// Path ke file musik Anda.
// PENTING: Anda harus menambahkan file musik bernama 'menu-music.mp3' ke folder root proyek Anda.
const MUSIC_FILE_PATH = '/menu-music.mp3';

/**
 * Membuat dan menginisialisasi elemen audio.
 * Ini harus dipanggil setelah interaksi pengguna pertama (misalnya, klik).
 */
export function init() {
  if (isInitialized || typeof window === 'undefined') return;
  try {
    audio = new Audio(MUSIC_FILE_PATH);
    audio.loop = true;
    isInitialized = true;
  } catch (e) {
    console.error("Gagal membuat elemen Audio untuk pemutaran musik:", e);
  }
}

/**
 * Mengatur volume musik.
 * @param {number} level - Nilai antara 0.0 dan 1.0.
 */
export function setMusicVolume(level: number) {
  if (!audio) return;
  audio.volume = Math.max(0, Math.min(1, level));
}

/**
 * Memainkan musik menu. Jika belum diinisialisasi, akan diinisialisasi terlebih dahulu.
 * Musik akan berulang secara otomatis.
 */
export function playMenuMusic() {
  if (!isInitialized) {
    // Ini adalah pengaman. `init()` idealnya dipanggil di App.tsx pada interaksi pertama.
    init();
  }
  if (!audio || !audio.paused) return;

  // Atur volume dari pengaturan sebelum bermain
  const settings = getSettings();
  setMusicVolume(settings.musicVolume);

  audio.play().catch(e => {
    console.error("Pemutaran musik gagal. Ini bisa terjadi jika play() dipanggil tanpa interaksi pengguna.", e);
  });
}

/**
 * Menghentikan musik dan mengembalikannya ke awal.
 */
export function stopMusic() {
  if (!audio || audio.paused) return;
  
  audio.pause();
  audio.currentTime = 0; // Kembali ke awal
}
