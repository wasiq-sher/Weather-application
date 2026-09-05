import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, Radio, Zap } from 'lucide-react';

/**
 * RadarTimeline Component
 * Interactive timeline scrub bar with frame playback, past radar scans,
 * current radar time (Live), and forecast radar projections.
 */
export default function RadarTimeline({
  frames = [],
  currentIndex = 5,
  onSelectFrame,
  isPlaying = false,
  onTogglePlay,
  playbackSpeed = 1,
  onChangeSpeed,
  className = '',
}) {
  const currentFrame = frames[currentIndex] || frames[5] || {
    timeString: 'Live Now',
    relativeLabel: 'Live',
    type: 'live',
  };

  const handleStepBack = () => {
    if (currentIndex > 0) {
      onSelectFrame(currentIndex - 1);
    } else {
      onSelectFrame(frames.length - 1);
    }
  };

  const handleStepForward = () => {
    if (currentIndex < frames.length - 1) {
      onSelectFrame(currentIndex + 1);
    } else {
      onSelectFrame(0);
    }
  };

  return (
    <div
      id="radar-timeline-control"
      className={`rounded-2xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-2xl p-4 shadow-2xl ${className}`}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Playback Controls & Frame Status */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="radar-playback-toggle"
            onClick={onTogglePlay}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white transition shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.4)]'
                : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_16px_rgba(37,99,235,0.4)]'
            }`}
            title={isPlaying ? 'Pause radar loop' : 'Play radar loop'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handleStepBack}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Previous frame"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={handleStepForward}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Next frame"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="border-l border-slate-800 pl-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {currentFrame.timeString}
              </span>
              {currentFrame.type === 'live' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CURRENT RADAR TIME
                </span>
              )}
              {currentFrame.type === 'forecast' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Zap className="w-3 h-3" />
                  FORECAST RADAR TIME
                </span>
              )}
              {currentFrame.type === 'past' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                  <Clock className="w-3 h-3" />
                  PAST SCAN
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Frame {currentIndex + 1} of {frames.length || 10} • {currentFrame.relativeLabel}
            </p>
          </div>
        </div>

        {/* Timeline Frame Bar & Scrubber */}
        <div className="flex-1 min-w-[200px] flex flex-col justify-center">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5 px-0.5">
            <span className="text-slate-500">Past (-50m)</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" />
              Live Radar
            </span>
            <span className="text-cyan-400 font-bold">Forecast (+60m)</span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {frames.map((frame, idx) => {
              const isCurrent = idx === currentIndex;
              const isPast = frame.type === 'past';
              const isLive = frame.type === 'live';
              const isForecast = frame.type === 'forecast';

              let barColor = 'bg-slate-800 hover:bg-slate-700';
              if (isCurrent) {
                barColor = isLive
                  ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                  : isForecast
                  ? 'bg-cyan-400 shadow-[0_0_12px_#38bdf8]'
                  : 'bg-blue-400 shadow-[0_0_12px_#60a5fa]';
              } else if (idx < currentIndex) {
                barColor = isLive ? 'bg-emerald-600/50' : isForecast ? 'bg-cyan-600/40' : 'bg-blue-600/40';
              }

              return (
                <button
                  key={frame.id || idx}
                  onClick={() => onSelectFrame(idx)}
                  className={`h-3.5 rounded-md transition-all relative group flex items-center justify-center ${barColor}`}
                  title={`${frame.timeString} (${frame.relativeLabel}) - ${frame.type.toUpperCase()}`}
                >
                  {isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                  {/* Tooltip on hover */}
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all text-[9px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap pointer-events-none z-30">
                    {frame.relativeLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback Speed Multiplier */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0 self-start md:self-center">
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => onChangeSpeed(spd)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                playbackSpeed === spd
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
