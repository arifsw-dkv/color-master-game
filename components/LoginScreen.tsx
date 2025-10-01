import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

// Simple SVG icon components
const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.136,44,30.025,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-1.5 C14.22,9,14,9.22,14,9.5V12h2.5l-0.5,3H14v6.8C18.56,20.87,22,16.84,22,12z"></path>
  </svg>
);

const GuestIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-lg animate-fade-in w-full max-w-md">
      <h1 className="text-5xl font-bold mb-2 text-cyan-400 animate-pulse-glow">ColorMaster DKV</h1>
      <p className="text-xl font-light text-gray-300 mb-10">
        Selamat Datang!
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <GoogleIcon />
          Masuk dengan Google
        </button>

        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center bg-[#1877F2] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#166fe5] transition-all duration-300 transform hover:-translate-y-1"
        >
          <FacebookIcon />
          Masuk dengan Facebook
        </button>

        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <GuestIcon />
          Lanjutkan sebagai Tamu
        </button>
      </div>
      <style>{`
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.3), 0 0 10px rgba(0, 255, 255, 0.2);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
