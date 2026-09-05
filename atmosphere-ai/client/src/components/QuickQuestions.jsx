import React from 'react';
import { Shirt, CloudRain, Activity, Footprints, Umbrella, Sparkles, Loader2 } from 'lucide-react';

export const CONTEXTUAL_QUICK_ACTIONS = [
  {
    id: 'wear',
    text: 'What should I wear today?',
    icon: Shirt,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300 hover:border-amber-400',
  },
  {
    id: 'commute',
    text: 'Will it rain during my commute?',
    icon: CloudRain,
    color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:border-cyan-400',
  },
  {
    id: 'exercise',
    text: 'Good time for outdoor exercise?',
    icon: Activity,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300 hover:border-emerald-400',
  },
  {
    id: 'walk',
    text: 'Is tonight good for a walk?',
    icon: Footprints,
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300 hover:border-purple-400',
  },
  {
    id: 'umbrella',
    text: 'Should I carry an umbrella?',
    icon: Umbrella,
    color: 'from-sky-500/20 to-blue-600/20 border-sky-500/30 text-sky-300 hover:border-sky-400',
  },
];

export default function QuickQuestions({ onSelectQuestion, disabled = false, loadingQuestion = null }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Contextual AI Quick Actions</span>
        </div>
        {loadingQuestion && (
          <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Analyzing telemetry...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {CONTEXTUAL_QUICK_ACTIONS.map((q) => {
          const Icon = q.icon;
          const isThisLoading = loadingQuestion === q.text;

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q.text)}
              disabled={disabled}
              className={`flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r border text-left text-xs sm:text-sm font-medium transition duration-200 backdrop-blur-md active:scale-[0.98] ${
                q.color
              } ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] cursor-pointer'
              } ${isThisLoading ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]' : ''}`}
            >
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 shrink-0">
                {isThisLoading ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span className="line-clamp-2 flex-1">{q.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
