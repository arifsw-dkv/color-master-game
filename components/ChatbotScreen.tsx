import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ChatbotScreenProps {
  onGoToMainMenu: () => void;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

// Helper to format Gemini's text response into basic HTML
const formatResponseText = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
};

const ChatbotScreen: React.FC<ChatbotScreenProps> = ({ onGoToMainMenu }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Halo! Saya Gemini Sensei. Tanyakan apa saja seputar Desain Komunikasi Visual, dan saya akan coba menjawabnya.'}
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await getChatbotResponse(input);
            const modelMessage: Message = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: Message = { role: 'model', text: 'Maaf, terjadi kesalahan. Coba lagi nanti.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <div className="w-full max-w-3xl h-[85vh] flex flex-col glass-panel p-6 rounded-2xl shadow-lg animate-fade-in">
            <div className="flex-shrink-0 flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-green-400 font-heading">Tanya Ahli DKV</h1>
                <button onClick={onGoToMainMenu} className="text-gray-400 hover:text-white font-semibold transition-colors">
                    Kembali
                </button>
            </div>

            {/* Chat History */}
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                             <div className="w-10 h-10 rounded-full bg-green-800 flex-shrink-0 flex items-center justify-center font-bold text-green-300">G</div>
                        )}
                        <div className={`max-w-md p-3 rounded-xl ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700'}`}>
                            <p className="text-base" dangerouslySetInnerHTML={{ __html: formatResponseText(msg.text) }} />
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex gap-3 justify-start">
                        <div className="w-10 h-10 rounded-full bg-green-800 flex-shrink-0 flex items-center justify-center font-bold text-green-300">G</div>
                        <div className="max-w-md p-3 rounded-xl bg-gray-700 flex items-center">
                            <div className="dot-flashing"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex-shrink-0 flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ketik pertanyaanmu di sini..."
                    className="flex-grow bg-gray-900 text-white p-3 rounded-lg border-2 border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-green-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                    {isLoading ? <LoadingSpinner /> : 'Kirim'}
                </button>
            </form>
            <style>{`
                .dot-flashing { position: relative; width: 10px; height: 10px; border-radius: 5px; background-color: #9880ff; color: #9880ff; animation: dotFlashing 1s infinite linear alternate; animation-delay: .5s; }
                .dot-flashing::before, .dot-flashing::after { content: ''; display: inline-block; position: absolute; top: 0; }
                .dot-flashing::before { left: -15px; width: 10px; height: 10px; border-radius: 5px; background-color: #9880ff; color: #9880ff; animation: dotFlashing 1s infinite alternate; animation-delay: 0s; }
                .dot-flashing::after { left: 15px; width: 10px; height: 10px; border-radius: 5px; background-color: #9880ff; color: #9880ff; animation: dotFlashing 1s infinite alternate; animation-delay: 1s; }
                @keyframes dotFlashing { 0% { background-color: #a78bfa; } 50%, 100% { background-color: rgba(167, 139, 250, 0.2); } }
            `}</style>
        </div>
    );
};

export default ChatbotScreen;