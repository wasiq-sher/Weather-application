import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, ShieldCheck, MapPin, Thermometer, Droplets, Wind, CloudRain, Activity } from 'lucide-react';

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.sender === 'assistant';

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format response text with markdown bolding (**text**) and lists
  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // Parse **bold** parts in each line
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={lIdx} className="ml-4 list-disc my-1 text-slate-200">
            {formattedParts}
          </li>
        );
      }

      return (
        <p key={lIdx} className={line.trim() === '' ? 'h-2' : 'my-1'}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div
      className={`flex gap-3 sm:gap-4 my-3.5 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.4)] border border-cyan-400/30">
          <Sparkles className="w-4 h-4 text-cyan-200" />
        </div>
      )}

      {/* Message Card Container */}
      <div className={`max-w-2xl flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed backdrop-blur-xl relative group transition ${
            isAssistant
              ? 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-xs shadow-xl'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-[0_0_20px_rgba(59,130,246,0.3)]'
          }`}
        >
          {/* Header info */}
          <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-75 border-b border-slate-800/40 pb-1">
            <span className="font-medium text-slate-400">
              {isAssistant ? 'Atmosphere AI' : 'You'}
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              {isAssistant && (
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> Real Telemetry Grounded
                </span>
              )}
              <span>{message.timestamp || 'Just now'}</span>
            </div>
          </div>

          {/* Formatted Message Body */}
          <div className="space-y-1">{renderFormattedText(message.text)}</div>

          {/* Copy Button */}
          {isAssistant && (
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-mono">Copied</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Context Telemetry Summary Badge (if available) */}
          {isAssistant && message.contextSummary && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/60 font-mono">
              <span className="text-slate-500 font-sans font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Grounded Context:
              </span>
              {message.contextSummary.city && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">
                  {message.contextSummary.city}
                </span>
              )}
              {message.contextSummary.temp && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 flex items-center gap-1">
                  <Thermometer className="w-3 h-3" /> {message.contextSummary.temp}
                </span>
              )}
              {message.contextSummary.condition && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {message.contextSummary.condition}
                </span>
              )}
              {message.contextSummary.precipitationChance && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 flex items-center gap-1">
                  <CloudRain className="w-3 h-3" /> Rain {message.contextSummary.precipitationChance}
                </span>
              )}
              {message.contextSummary.aqi && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> AQI {message.contextSummary.aqi}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
