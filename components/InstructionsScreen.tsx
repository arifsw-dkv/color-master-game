import React from 'react';

interface InstructionsScreenProps {
  onGoToMainMenu: () => void;
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onGoToMainMenu }) => {
  const instructions = [
    {
      title: 'Tebak Warna',
      color: 'text-cyan-400',
      description: 'Tebak nama warna yang benar berdasarkan kode HEX yang ditampilkan. Selesaikan 10 ronde, dapatkan +10 poin untuk setiap jawaban benar, dan catatkan skormu di papan peringkat! Tingkat kesulitan mempengaruhi jumlah pilihan jawaban dan kedalaman fakta warna yang kamu terima.',
    },
    {
      title: 'Kartu Warna',
      color: 'text-red-400',
      description: 'Uji ingatanmu! Buka dua kartu untuk menemukan pasangan antara nama warna dan kode HEX yang cocok. Selesaikan papan sebelum waktu habis. Tingkat kesulitan menentukan jumlah kartu dan batas waktu.',
    },
    {
      title: 'Roda Warna',
      color: 'text-purple-400',
      description: 'Uji pengetahuanmu tentang teori warna! Klik warna yang benar pada roda warna berdasarkan pertanyaan (misalnya, temukan warna komplementer). Dapatkan +10 poin untuk jawaban yang benar dan selesaikan semua 10 ronde.',
    },
    {
      title: 'Lab Pencampuran',
      color: 'text-yellow-400',
      description: 'Bebaskan kreativitasmu! Geser slider Merah, Hijau, dan Biru untuk mencampur dan menemukan warna baru. Lihat kode HEX dan RGB secara real-time. Ini adalah mode eksplorasi tanpa skor.',
    },
  ];

  return (
    <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-lg animate-fade-in text-left">
      <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">Cara Bermain</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {instructions.map((item, index) => (
          <div key={index} className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <h2 className={`text-2xl font-bold ${item.color} mb-2`}>{item.title}</h2>
            <p className="text-gray-300 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onGoToMainMenu}
          className="bg-cyan-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default InstructionsScreen;
