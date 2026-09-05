import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Shirt, 
  CloudRain, 
  Activity, 
  Footprints, 
  Umbrella,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { askWeatherAssistant } from '../services/assistantApi.js';

export default function AssistantCard() {
  const { activeLocation, unit } = useApp();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const quickQuestions = [
    { id: 'wear', text: 'What should I wear today?', icon: Shirt },
    { id: 'commute', text: 'Will it rain during my commute?', icon: CloudRain },
    { id: 'exercise', text: 'Good time for outdoor exercise?', icon: Activity },
    { id: 'walk', text: 'Is tonight good for a walk?', icon: Footprints },
    { id: 'umbrella', text: 'Should I carry an umbrella?', icon: Umbrella },
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || query;
    if (!text.trim() || isLoading) return;

    const cleanQuestion = text.trim();
    setActiveQuestion(cleanQuestion);

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: cleanQuestion },
    ]);
    setQuery('');
    setIsLoading(true);

    try {
      // Call centralized assistant request function
      const result = await askWeatherAssistant({
        question: cleanQuestion,
        location: activeLocation || { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
        units: unit || 'F',
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.answer || 'Evaluated live atmospheric telemetry for your location.',
          contextSummary: result.contextSummary,
        },
      ]);
    } catch (err) {
      console.error('[AssistantCard] Query Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Unable to evaluate station telemetry (${err.message}). Please verify connection.`,
        },
      ]);
    } finally {
      setIsLoading(false);
      setActiveQuestion(null);
    }
  };

  return (
    <div className="rounded-[32px] bg-slate-900/60 border border-cyan-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between h-full relative overflow-visible">
      {/* Floating badge */}
      <div className="absolute -top-3 left-6 bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-cyan-200" />
        <span>Grounded AI Insight</span>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                Atmosphere AI Assistant
              </h3>
              <p className="text-[10px] text-cyan-300/80 font-mono">
                Station: {activeLocation?.name || 'San Francisco'}
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
        </div>

        {/* Quick Actions Title */}
        <div className="my-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Contextual AI Quick Actions</span>
          </span>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-1 gap-1.5 mb-4">
          {quickQuestions.map((q) => {
            const Icon = q.icon;
            const isThisLoading = isLoading && activeQuestion === q.text;

            return (
              <button
                key={q.id}
                onClick={() => handleSend(q.text)}
                disabled={isLoading}
                className={`w-full text-left px-3.5 py-2 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition flex items-center gap-2.5 backdrop-blur-md cursor-pointer disabled:opacity-50 ${
                  isThisLoading ? 'border-cyan-400 text-cyan-200 bg-cyan-500/10' : ''
                }`}
              >
                {isThisLoading ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
                <span className="truncate flex-1 font-medium">{q.text}</span>
              </button>
            );
          })}
        </div>

        {/* Typing Indicator & Loading Animation */}
        {isLoading && (
          <div className="p-3 my-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2 font-mono animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
            <span>Atmosphere AI is typing...</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        )}

        {/* Interactive Chat Stream */}
        {messages.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-2 mb-3 pr-1 text-xs custom-scrollbar">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white ml-4 shadow-md'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-200 mr-2 backdrop-blur-sm'
                }`}
              >
                <div className="font-sans leading-relaxed">{m.content}</div>
                {m.contextSummary && (
                  <div className="mt-2 text-[10px] text-cyan-300 font-mono border-t border-slate-800/80 pt-1 flex items-center gap-2">
                    <span>Grounded: {m.contextSummary.city}</span>
                    <span>• {m.contextSummary.temp}</span>
                    <span>• {m.contextSummary.condition}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Row */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative pt-2"
      >
        <input
          id="assistant-card-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          placeholder="Ask Atmosphere AI a weather query..."
          className="w-full pl-4 pr-11 py-2.5 text-xs rounded-full bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition shadow-inner backdrop-blur-md disabled:opacity-50"
        />
        <button
          id="btn-send-assistant-card"
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute right-1.5 top-3.5 w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center transition shadow-[0_0_10px_rgba(56,189,248,0.5)] disabled:opacity-40 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </form>
    </div>
  );
}
