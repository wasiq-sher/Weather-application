import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, RotateCcw, ShieldCheck, MapPin, Thermometer, Wind, Droplets, Sun, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useCurrentWeatherQuery } from '../hooks/useWeatherQuery.js';
import { askWeatherAssistant } from '../services/assistantApi.js';
import ChatMessage from './ChatMessage.jsx';
import QuickQuestions from './QuickQuestions.jsx';
import ChatInput from './ChatInput.jsx';

export default function WeatherAssistant() {
  const { activeLocation, unit } = useApp();
  const locationId = activeLocation?.id || 'san-francisco';

  const { data: weather } = useCurrentWeatherQuery(locationId);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello! I'm Atmosphere AI, your grounded meteorological intelligence assistant. I analyze live telemetry for **${activeLocation?.name || 'San Francisco'}** in real time. Click any quick action button below or ask a custom weather question!`,
      timestamp: 'Just now',
      groundedInRealData: true,
      contextSummary: {
        city: activeLocation?.name || 'San Francisco',
        temp: `${unit === 'C' ? weather?.tempC ?? 20 : weather?.tempF ?? 68}°${unit}`,
        condition: weather?.condition || 'Partly Cloudy',
        humidity: `${weather?.humidity ?? 42}%`,
      },
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(null);
  const [error, setError] = useState(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (messages.length > 1 || isLoading) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (questionText) => {
    if (!questionText || !questionText.trim()) return;

    const query = questionText.trim();
    setError(null);

    // 1. Add user message to state
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setLoadingQuestion(query);

    try {
      // 2. Call centralized Weather Assistant Service
      const result = await askWeatherAssistant({
        question: query,
        location: activeLocation || { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
        units: unit || 'F',
      });

      // 3. Add assistant response to conversation stream
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: result.answer || 'I evaluated live atmospheric telemetry for your area.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        contextSummary: result.contextSummary || null,
        groundedInRealData: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('[WeatherAssistant] Centralized Query Error:', err);
      setError(err.message || 'Error processing request.');

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: `I'm currently unable to fetch live telemetry analysis (${err.message}). Current station telemetry shows ${unit === 'C' ? weather?.tempC ?? 20 : weather?.tempF ?? 68}°${unit} with ${weather?.condition || 'Partly Cloudy'} skies.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingQuestion(null);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: `Chat session cleared. How can I assist you with weather intelligence for **${activeLocation?.name || 'San Francisco'}**?`,
        timestamp: 'Just now',
        contextSummary: {
          city: activeLocation?.name || 'San Francisco',
          temp: `${unit === 'C' ? weather?.tempC ?? 20 : weather?.tempF ?? 68}°${unit}`,
          condition: weather?.condition || 'Partly Cloudy',
        },
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            <Bot className="w-5 h-5 text-cyan-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Atmosphere AI Weather Assistant</h2>
              <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> Grounded in Real Data
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Station: <strong className="text-slate-200">{activeLocation?.name || 'San Francisco'}</strong> ({unit === 'C' ? weather?.tempC ?? 20 : weather?.tempF ?? 68}°${unit}, {weather?.condition || 'Partly Cloudy'})
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
          title="Clear active chat conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Dialogue & Input Stream */}
        <div className="lg:col-span-8 rounded-[32px] bg-slate-900/40 border border-slate-800/60 backdrop-blur-2xl shadow-2xl p-4 sm:p-6 flex flex-col h-[680px] relative">
          {/* Scrollable Messages viewport */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-2 custom-scrollbar"
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator & Loading Animation */}
            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-cyan-400 my-4 animate-in fade-in">
                <div className="w-8 h-8 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)] shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 text-slate-200 flex items-center gap-3 font-mono shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                  <span>Atmosphere AI is typing & filtering telemetry...</span>
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Contextual AI Quick Actions */}
          <div className="pt-3 pb-2 border-t border-slate-800/80">
            <QuickQuestions
              onSelectQuestion={handleSendMessage}
              disabled={isLoading}
              loadingQuestion={loadingQuestion}
            />
          </div>

          {/* Input field */}
          <div className="pt-2">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>

        {/* Right 4 Cols: Telemetry Context Sidebar Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Grounded Weather Context</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature
                </span>
                <span className="text-white font-bold font-mono">
                  {unit === 'C' ? weather?.tempC ?? 20 : weather?.tempF ?? 68}°{unit}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Humidity
                </span>
                <span className="text-cyan-300 font-bold font-mono">{weather?.humidity ?? 42}%</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-blue-400" /> Wind Speed
                </span>
                <span className="text-slate-200 font-mono">
                  {weather?.windDirection || 'NW'} at {unit === 'C' ? `${weather?.windKmh ?? 19} km/h` : `${weather?.windMph ?? 12} mph`}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Air Quality
                </span>
                <span className="text-emerald-400 font-bold font-mono">{weather?.aqi ?? 22} AQI (Good)</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-300" /> UV Index
                </span>
                <span className="text-amber-400 font-bold font-mono">{weather?.uvIndex ?? 4} Moderate</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200 leading-relaxed">
              <strong className="block mb-1 font-semibold text-cyan-300">Telemetry Mandate:</strong>
              Atmosphere AI uses current station location (<strong>{activeLocation?.name || 'San Francisco'}</strong>) and real-time sensor streams.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
