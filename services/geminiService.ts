import { GoogleGenAI } from "@google/genai";
import { Difficulty } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getColorFacts(colorName: string, difficulty: Difficulty): Promise<string> {
  try {
    let prompt = '';
    const baseInstruction = `Sebagai seorang ahli Desain Komunikasi Visual, jelaskan warna "${colorName}" kepada mahasiswa. Format jawaban dalam Bahasa Indonesia, singkat, jelas, dan gunakan poin-poin. Jangan tambahkan judul atau pembukaan yang tidak perlu.`;

    switch (difficulty) {
      case Difficulty.Easy:
        prompt = `${baseInstruction}
        Berikan penjelasan yang sangat sederhana:
        1.  **Fakta Menarik:** Satu fakta unik yang mudah diingat.
        2.  **Perasaan:** Emosi utama yang ditimbulkan warna ini.`;
        break;
      case Difficulty.Hard:
        prompt = `${baseInstruction}
        Berikan penjelasan teknis dan mendalam:
        1.  **Konteks Sejarah/Seni:** Kaitkan warna ini dengan gerakan seni atau periode sejarah tertentu.
        2.  **Psikologi Kompleks:** Jelaskan makna ganda atau nuansa psikologis dari warna ini.
        3.  **Aplikasi Desain Tingkat Lanjut:** Berikan contoh penggunaan spesifik dalam branding atau UX yang menunjukkan pemahaman mendalam (misalnya, penggunaan dalam "dark mode" atau sebagai warna aksen untuk "call-to-action").`;
        break;
      case Difficulty.Medium:
      default:
        prompt = `${baseInstruction}
        Berikan penjelasan yang mencakup:
        1.  **Fakta Menarik:** Satu fakta unik atau sejarah tentang warna ini.
        2.  **Makna Psikologis:** Bagaimana warna ini mempengaruhi emosi dan persepsi.
        3.  **Penggunaan dalam Desain:** Contoh konkret bagaimana warna ini digunakan secara efektif dalam branding, UI/UX, atau media cetak.`;
        break;
    }
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching color facts from Gemini API:", error);
    return "Maaf, terjadi kesalahan saat mengambil informasi tambahan tentang warna ini. Silakan coba lagi.";
  }
}
