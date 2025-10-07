import { getSettings } from './settingsService';

// Modul ini menggunakan pola singleton untuk mengelola satu elemen Audio untuk musik menu.
let audio: HTMLAudioElement | null = null;
let hasLoadingError = false; // Mencegah pesan error berulang

// Path ke file musik Anda.
// PENTING: Anda HARUS menambahkan file musik bernama 'menu-music.mp3' ke folder root proyek Anda,
// folder yang sama tempat index.html berada.
const MUSIC_FILE_PATH = 'menu-music.mp3';

/**
 * Menginisialisasi dan mengkonfigurasi elemen audio.
 * Ini dipanggil secara internal oleh playMenuMusic pada interaksi pertama.
 * @returns {HTMLAudioElement | null} Elemen audio yang sudah diinisialisasi.
 */
function initializeAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined' || audio) {
    return audio;
  }

  try {
    const audioElement = new Audio(MUSIC_FILE_PATH);
    audioElement.loop = true;
    
    // Tambahkan event listener untuk menangkap error pemuatan file secara spesifik.
    // Ini adalah cara paling andal untuk mendeteksi file yang hilang.
    audioElement.addEventListener('error', () => {
      if (!hasLoadingError) {
        console.error("========================================");
        console.error("!!! KESALAHAN MEMUAT MUSIK !!!");
        console.error(`Tidak dapat menemukan atau memuat file: '${MUSIC_FILE_PATH}'`);
        console.error("Pastikan Anda telah menambahkan 'menu-music.mp3' ke folder root proyek Anda.");
        console.error("========================================");
        hasLoadingError = true;
      }
    });

    audio = audioElement;
    return audio;
  } catch (e) {
    console.error("Gagal membuat elemen Audio:", e);
    return null;
  }
}

/**
 * Mengatur volume musik.
 * @param {number} level - Nilai antara 0.0 dan 1.0.
 */
export function setMusicVolume(level: number) {
  // Volume akan diterapkan saat audio diputar atau jika sudah ada.
  if (audio) {
    audio.volume = Math.max(0, Math.min(1, level));
  }
}

/**
 * Memainkan musik menu. Menginisialisasi audio pada panggilan pertama.
 * Fungsi ini HARUS dipanggil sebagai hasil dari interaksi pengguna (misalnya, klik).
 */
export async function playMenuMusic() {
  // Inisialisasi pada interaksi pertama, memastikan konteks audio diizinkan oleh browser.
  const audioElement = initializeAudio();
  
  // Jangan coba putar jika ada error pemuatan atau elemen tidak ada.
  if (!audioElement || hasLoadingError) return;

  const settings = getSettings();
  setMusicVolume(settings.musicVolume);
  
  if (audioElement.paused) {
    try {
      // play() mengembalikan promise yang bisa gagal jika interaksi tidak valid.
      await audioElement.play();
    } catch (error) {
       // Error ini biasanya terjadi karena kebijakan autoplay, bukan karena file tidak ditemukan.
       // Error file tidak ditemukan ditangani oleh event listener 'error'.
       if (!hasLoadingError) { // Hanya tampilkan jika belum ada error pemuatan.
         console.warn("Pemutaran musik diblokir oleh browser. Pastikan ini dipanggil dari event klik.", error);
       }
    }
  }
}

/**
 * Menghentikan musik dan mengembalikan waktunya ke awal.
 */
export function stopMusic() {
  if (audio && !audio.paused) {
    audio.pause();
    audio.currentTime = 0; // Kembali ke awal
  }
}
