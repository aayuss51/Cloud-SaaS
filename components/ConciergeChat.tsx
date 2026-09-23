
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minus, MessageCircle } from 'lucide-react';
import { getConciergeResponse } from '../services/geminiService';
import { getFacilities, getRooms } from '../services/mockDb';
import { Facility, RoomType } from '../types';

const CONCIERGE_AVATAR = "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg?w=200";

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const ConciergeChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessage = { role: 'ai' as const, text: 'Namaste! I am Mero Support. How can I assist you with your booking today?' };
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{facilities: Facility[], rooms: RoomType[]} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, r] = await Promise.all([getFacilities(), getRooms()]);
        setData({ facilities: f, rooms: r });
      } catch (e) {
        console.error("Chat failed to load hotel data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    
    if (!data) {
        setMessages(prev => [...prev, { role: 'ai', text: "Connection error. Please contact the front desk." }]);
        return;
    }

    setIsLoading(true);
    const response = await getConciergeResponse(userMsg, data.facilities, data.rooms);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine && i > 0) return <div key={i} className="h-2" />;

      let content = trimmedLine;
      let isBullet = false;

      // Detect and handle list items (bullet points)
      if (content.startsWith('* ') || content.startsWith('- ')) {
        content = content.substring(2);
        isBullet = true;
      }

      // Robust Bold Text Parsing (**text**) and Literal Asterisk Cleanup
      // This ensures "no *" appears in the final UI except as formatted bolding.
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const renderedContent = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Render bold text without the asterisks
          return <strong key={j} className="font-black text-emerald-900">{part.slice(2, -2)}</strong>;
        }
        // For standard text, remove any remaining literal asterisks (*)
        return part.replace(/\*/g, '');
      });

      if (isBullet) {
        return (
          <div key={i} className="flex gap-3 items-start my-1.5 pl-2 group">
            <span className="text-emerald-500 font-black text-lg leading-none mt-1 group-hover:scale-125 transition-transform">•</span>
            <span className="flex-1">{renderedContent}</span>
          </div>
        );
      }

      return <div key={i} className="mb-1 leading-relaxed">{renderedContent}</div>;
    });
  };

  return (
    <>
      <style>{`
        @keyframes liquid-motion {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-liquid {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes pulse-glow-emerald {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.5); }
        }
        .liquid-emerald-glass {
          background: linear-gradient(-45deg, 
            rgba(255, 255, 255, 0.2), 
            rgba(209, 250, 229, 0.4), 
            rgba(255, 255, 255, 0.2)
          );
          background-size: 400% 400%;
          animation: liquid-motion 10s ease infinite;
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
        }
        .btn-liquid-wa {
          background: linear-gradient(135deg, rgba(37, 211, 102, 0.8), rgba(18, 140, 126, 0.6));
          box-shadow: 0 10px 30px -5px rgba(37, 211, 102, 0.4), inset 0 0 15px rgba(255,255,255,0.3);
        }
        .btn-liquid-ai {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.6));
          box-shadow: 0 10px 30px -5px rgba(16, 185, 129, 0.4), inset 0 0 15px rgba(255,255,255,0.3);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
        
        .floating-action-container {
          bottom: calc(1.5rem + env(safe-area-inset-bottom));
          right: calc(1.5rem + env(safe-area-inset-right));
          will-change: transform;
          transform: translateZ(0);
        }
      `}</style>

      {/* Floating Action Buttons Container */}
      {!isOpen && (
        <div className="fixed floating-action-container flex flex-col gap-4 sm:gap-5 z-[2147483647] items-end pointer-events-none">
          {/* WhatsApp Button - Liquid Glassy */}
          <a
            href="https://api.whatsapp.com/send/?phone=9764453517&text=Hello+How+can+I+help+you%3F&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 animate-[float-liquid_4s_ease-in-out_infinite] pointer-events-auto btn-liquid-wa backdrop-blur-xl group overflow-hidden"
            title="Chat on WhatsApp"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <WhatsAppIcon size={28} className="text-white drop-shadow-md relative z-10" />
          </a>

          {/* AI Concierge Toggle Button - Liquid Emerald Glassy */}
          <button 
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 border-white/50 shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 animate-[float-liquid_5s_ease-in-out_infinite,pulse-glow-emerald_3s_ease-in-out_infinite] pointer-events-auto btn-liquid-ai backdrop-blur-xl group overflow-hidden"
            title="Chat with Mero Support"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <MessageCircle size={28} className="text-white relative z-10" />
            <div className="absolute top-1 right-1 w-4 h-4 bg-green-300 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
          </button>
        </div>
      )}

      {/* Full Chat Window Interface - Liquid Emerald Glass Optimized */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[420px] sm:h-[680px] liquid-emerald-glass sm:rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(16,185,129,0.05)] z-[2147483647] flex flex-col overflow-hidden transition-all duration-500 border border-white/60">
          
          {/* Internal Animated Mesh Overlay (Emerald Tinted) */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 10% 20%, #10b981 0%, transparent 40%), radial-gradient(circle at 90% 80%, #34d399 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 60%)', filter: 'blur(80px)' }}></div>

          {/* Custom Emerald Header */}
          <div className="bg-white/20 backdrop-blur-3xl p-6 flex justify-between items-center border-b border-emerald-500/10 pt-12 sm:pt-7 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[22px] bg-white/60 flex items-center justify-center overflow-hidden border border-white shadow-xl">
                 <img src={CONCIERGE_AVATAR} alt="Mero Support" className="w-full h-full object-cover transform transition-transform hover:scale-110 duration-500" />
              </div>
              <div>
                  <h3 className="font-black text-lg text-emerald-950 tracking-tight leading-none mb-1">Mero Support</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                    <span className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.25em]">your true booking partner</span>
                  </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-emerald-500/10 rounded-2xl transition-all text-emerald-900/60 active:scale-90"><Minus size={24} /></button>
              <button onClick={() => { setIsOpen(false); setMessages([initialMessage]); }} className="p-3 hover:bg-rose-500/10 rounded-2xl transition-all text-emerald-900/60 hover:text-rose-600 active:scale-90"><X size={24} /></button>
            </div>
          </div>

          {/* Messaging Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7 relative z-10 pb-24 sm:pb-6 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <div className={`max-w-[85%] rounded-[32px] p-6 text-sm leading-relaxed shadow-2xl backdrop-blur-2xl border ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600/85 text-white rounded-br-none border-emerald-300/30 shadow-emerald-500/20' 
                    : 'bg-white/60 text-emerald-950 rounded-bl-none border-white shadow-emerald-900/5 font-medium'
                }`}>
                  {renderFormattedText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start animate-fade-in">
                 <div className="bg-white/50 backdrop-blur-2xl rounded-[28px] rounded-bl-none p-6 shadow-xl flex gap-2.5 items-center border border-white">
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Emerald Frosted Glass */}
          <div className="p-7 bg-white/10 border-t border-emerald-500/5 backdrop-blur-3xl pb-14 sm:pb-8 relative z-10">
             <div className="relative flex items-center gap-3 group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about Mero-Booking..."
                  className="flex-1 bg-white/40 border border-white rounded-[28px] pl-7 pr-16 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(0,0,0,0.02)] text-emerald-950 placeholder-emerald-800/40 backdrop-blur-3xl transition-all"
                />
                <button 
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()} 
                  className="absolute right-2.5 w-13 h-13 rounded-full bg-emerald-600 text-white flex items-center justify-center disabled:opacity-40 shadow-2xl shadow-emerald-600/30 transition-all hover:scale-110 active:scale-90 border border-emerald-400/30 group-hover:bg-emerald-500"
                >
                  <Send size={22} className="ml-1" />
                </button>
             </div>
             <div className="flex items-center justify-center gap-2 mt-5 opacity-40">
                <div className="h-px w-8 bg-emerald-900/30"></div>
                <p className="text-[9px] text-emerald-900 font-black uppercase tracking-[0.3em]">Emerald Liquid UI</p>
                <div className="h-px w-8 bg-emerald-900/30"></div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};
