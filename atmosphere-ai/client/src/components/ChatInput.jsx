import React, { useState } from 'react';
import { Send, Sparkles, CornerDownLeft } from 'lucide-react';

export default function ChatInput({ onSendMessage, isLoading = false, disabled = false, placeholder }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <div className="relative flex-1 flex items-center">
        <div className="absolute left-4 text-slate-500 pointer-events-none">
          <Sparkles className={`w-4 h-4 ${isLoading ? 'text-cyan-400 animate-spin' : ''}`} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled || isLoading}
          placeholder={placeholder || 'Ask Atmosphere AI about clothing, rainfall, workouts, or evening forecasts...'}
          className="w-full pl-11 pr-12 py-3.5 rounded-full bg-slate-950/90 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition shadow-inner backdrop-blur-xl disabled:opacity-50"
        />
        <div className="absolute right-4 hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-500 pointer-events-none">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-0.5">
            <CornerDownLeft className="w-2.5 h-2.5" />
          </kbd>
        </div>
      </div>

      <button
        type="submit"
        disabled={!input.trim() || isLoading || disabled}
        className="px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition flex items-center gap-2 shrink-0 disabled:opacity-40 disabled:pointer-events-none active:scale-95 cursor-pointer"
      >
        <span>Send</span>
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
