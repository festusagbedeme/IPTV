import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, Zap, Database, Volume2, ShieldAlert, Cpu, Sparkles, RefreshCw, Layers, Tv } from 'lucide-react';
import { StreamItem, BufferStats, EPGItem, Episode } from '../types';

interface StreamPlayerProps {
  item: StreamItem | null;
  bufferProfile: number; // in seconds
  compressStream: boolean;
  currentEpg: EPGItem[];
  isLoadingEpg: boolean;
  onRefreshEpg: () => void;
  epgSource: string;
}

export default function StreamPlayer({
  item,
  bufferProfile,
  compressStream,
  currentEpg,
  isLoadingEpg,
  onRefreshEpg,
  epgSource,
}: StreamPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0); // in seconds for VOD
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [stats, setStats] = useState<BufferStats>({
    bufferedMs: 0,
    totalStatsFetched: 0,
    downloadSpeedSec: 1.8,
    compressedBytesSaved: 0,
    originalBytes: 0,
    savingsRatio: 0,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<any>(null);
  const bufferIntervalRef = useRef<any>(null);

  // Detect item changes to restart playback simulation with appropriate buffers
  useEffect(() => {
    if (!item) {
      setIsPlaying(false);
      setSelectedEpisode(null);
      return;
    }

    // Default first episode if it is a TV series
    if (item.type === 'series' && item.episodes && item.episodes.length > 0) {
      setSelectedEpisode(item.episodes[0]);
    } else {
      setSelectedEpisode(null);
    }

    triggerNewStreamBuffering();
  }, [item]);

  // Handle active episode changes for series
  useEffect(() => {
    if (selectedEpisode) {
      triggerNewStreamBuffering();
    }
  }, [selectedEpisode]);

  const triggerNewStreamBuffering = () => {
    setIsPlaying(false);
    setIsBuffering(true);
    setBufferProgress(0);
    setPlaybackTime(0);

    // Speed up or slow down buffer filling based on chosen profile latency
    const totalBufferSteps = 20;
    const stepDuration = (bufferProfile * 1000) / totalBufferSteps;

    if (bufferIntervalRef.current) clearInterval(bufferIntervalRef.current);

    bufferIntervalRef.current = setInterval(() => {
      setBufferProgress((prev) => {
        if (prev >= 100) {
          clearInterval(bufferIntervalRef.current);
          setIsBuffering(false);
          setIsPlaying(true);
          return 100;
        }
        return prev + 5;
      });
    }, Math.max(stepDuration, 30)); // ensure responsive ticks
  };

  // Live simulation of stream metrics, costs optimizations, and original vs compressed sizes
  useEffect(() => {
    if (!isPlaying || isBuffering) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      // Advance VOD time
      setPlaybackTime((prev) => prev + 1);

      // ISP savings calculation simulator:
      setStats((prev) => {
        // High efficiency transcoder savings: 35% - 50% if compression enabled, 0% normal
        const ratio = compressStream ? 42.5 + Math.random() * 4 : 0;
        const originalSpeed = compressStream ? 2.4 : 1.9; // MB/s typical HD H.264 vs AV1
        const activeSpeed = compressStream ? originalSpeed * (1 - ratio / 100) : originalSpeed;

        const consumedOriginal = prev.originalBytes + originalSpeed;
        const consumedActual = prev.compressedBytesSaved + (compressStream ? (originalSpeed - activeSpeed) : 0);

        return {
          bufferedMs: bufferProfile * 1000,
          totalStatsFetched: prev.totalStatsFetched + 1,
          downloadSpeedSec: Number(activeSpeed.toFixed(2)),
          compressedBytesSaved: Number(consumedActual.toFixed(2)),
          originalBytes: Number(consumedOriginal.toFixed(2)),
          savingsRatio: Number(ratio.toFixed(1)),
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isBuffering, compressStream, bufferProfile]);

  if (!item) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-400 border-l border-slate-900" id="empty-stream-message">
        <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800/60 inline-flex mb-4">
          <Tv className="w-12 h-12 text-slate-600 animate-pulse" />
        </div>
        <h3 className="text-white font-bold text-base">Media Receiver Idle</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed font-mono">
          Select any Live TV channel, VOD Movie, series episode or FM Radio station on the left to activate high-performance streaming.
        </p>
      </div>
    );
  }

  // Choose display title (Channel default vs Series/Episode custom)
  const currentMediaTitle = selectedEpisode 
    ? `${item.name} - S${selectedEpisode.season}E${selectedEpisode.episodeNumber}: ${selectedEpisode.name}`
    : item.name;

  const currentMediaUrl = selectedEpisode ? selectedEpisode.url : item.url;

  return (
    <div className="flex-[1.2] min-w-0 bg-slate-950 border-l border-slate-905 flex flex-col overflow-y-auto" id="active-receiver-player">
      
      {/* Player Header Panel */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-900 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-teal-400 font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>Receiver active: {item.type}</span>
          </div>
          <h3 className="text-white text-sm font-bold truncate max-w-[280px] mt-0.5" title={currentMediaTitle}>
            {currentMediaTitle}
          </h3>
        </div>

        {/* Dynamic Resolution / Compression Status Badge */}
        <div className="flex items-center gap-2">
          {compressStream && (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg font-mono font-bold border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              AV1 compressed
            </span>
          )}
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-lg font-mono font-bold uppercase">
            1080p HD
          </span>
        </div>
      </div>

      {/* Embedded/Simulated Media Screen Frame */}
      <div className="p-4 bg-slate-950 flex flex-col items-center">
        <div className="w-full aspect-video bg-black rounded-2xl border border-slate-850 overflow-hidden relative group shadow-2xl flex flex-col justify-between p-4" id="simulated-hardware-screen">
          
          {/* Buffering HUD Mask overlay */}
          {isBuffering && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center space-y-3 z-10">
              <RefreshCw className="w-10 h-10 text-teal-500 animate-spin" />
              <div className="text-center space-y-1">
                <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider font-mono">
                  Prefetching Stalker Stream...
                </span>
                <p className="text-[10px] text-slate-500 font-mono">
                  Locking buffer: {bufferProgress}% ({bufferProfile}s profile config)
                </p>
              </div>

              {/* Progress track */}
              <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full transition-all duration-150"
                  style={{ width: `${bufferProgress}%` }}
                />
              </div>

              {compressStream && (
                <div className="bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-900/30 text-[9px] font-mono text-indigo-400 uppercase tracking-wider animate-pulse">
                  Pre-compressing data stream payloads
                </div>
              )}
            </div>
          )}

          {/* Player Media Backdrop Screen (Shows image or visualizer) */}
          <div className="absolute inset-0 z-0">
            {item.type === 'radio' ? (
              // Audio Radio visualizer animation
              <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <Volume2 className="w-12 h-12 text-teal-500 animate-pulse" />
                <div className="space-y-1">
                  <div className="text-normal text-slate-100 font-bold font-mono">Low Latency Audio Stream</div>
                  <p className="text-[10px] text-slate-400 font-mono max-w-sm">Saving mobile data cost by routing lightweight clean audio tracks</p>
                </div>
                
                {/* Simulated wave representation */}
                {isPlaying && (
                  <div className="flex gap-1 items-end h-8 pt-2">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 3, 5, 3].map((val, i) => (
                      <span 
                        key={i} 
                        className="w-1.5 bg-teal-500 rounded-full animate-bounce"
                        style={{ 
                          height: `${val * 12}%`,
                          animationDelay: `${i * 0.08}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // VOD/TV poster backgrounds
              <div className="w-full h-full relative bg-slate-950">
                {item.logoUrl ? (
                  <img 
                    src={item.logoUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover opacity-35 filter blur-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-slate-950 to-slate-900" />
                )}
                {/* Big centered visual lock indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 animate-pulse">
                    <Tv className="w-10 h-10" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Overlay Screen HUD panels (Top status bar) */}
          <div className="relative z-5 flex justify-between items-start w-full">
            <span className="text-[10px] bg-black/60 backdrop-blur-md border border-slate-800/80 text-teal-400 px-2 py-1 rounded-lg font-mono font-semibold">
              HD Feed H.265
            </span>
            <span className="text-[10px] bg-black/60 backdrop-blur-md border border-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg font-mono font-semibold">
              Buffer Mode: {bufferProfile}s
            </span>
          </div>

          {/* Screen Lower HUD controls overlays (Only visible on play or hover) */}
          <div className="relative z-5 w-full space-y-2 mt-auto">
            {/* Horizontal Timeline display for VOD only */}
            {(item.type === 'movies' || item.type === 'series') && isPlaying && (
              <div className="space-y-1 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-slate-850">
                <div className="w-full h-1 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden">
                  <div 
                    className="bg-teal-500 h-full" 
                    style={{ width: `${Math.min((playbackTime / 480) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                  <span>{Math.floor(playbackTime / 60)}:{(playbackTime % 60).toString().padStart(2, '0')}</span>
                  <span>08:00 (Standard Sample)</span>
                </div>
              </div>
            )}

            {/* Simulated Remote control overlay */}
            <div className="flex justify-between items-center bg-black/75 p-2 rounded-xl backdrop-blur-md border border-slate-800">
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)} 
                  className="p-1 px-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow outline-none"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Stream'}</span>
                </button>
                <button
                  onClick={() => triggerNewStreamBuffering()}
                  className="p-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors flex items-center gap-1 outline-none"
                  title="Force re-buffer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-verify</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">
                  Stalker stream lock
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Saving ISP Simulation Panel & Compressed Stats */}
      <div className="px-4 pb-4 space-y-3">
        <div className="bg-gradient-to-r from-teal-950/20 via-slate-900 to-indigo-950/20 border border-slate-900 rounded-2xl p-4.5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold font-mono text-teal-400 uppercase tracking-wide flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              ISP Billing Cost Data Optimizer
            </h4>
            <div className="text-[10px] font-mono text-slate-400">
              Target Mode: <span className="font-semibold text-slate-200">{compressStream ? 'H.265 / AV1 Compression' : 'No Compression Selected'}</span>
            </div>
          </div>

          {/* Stats metrics row */}
          <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 leading-tight">
              <span className="text-[9px] text-slate-500 uppercase block">Orig Stream Size</span>
              <span className="text-slate-100 font-bold mt-1 text-sm block">
                {stats.originalBytes.toFixed(2)} MB
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 leading-tight">
              <span className="text-[9px] text-slate-500 uppercase block">ISP Network Cost Saved</span>
              <span className="text-emerald-400 font-bold mt-1 text-sm block">
                {stats.compressedBytesSaved.toFixed(2)} MB
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 leading-tight">
              <span className="text-[9px] text-slate-500 uppercase block">Saving Ratio</span>
              <span className="text-teal-400 font-bold mt-1 text-sm block">
                {stats.savingsRatio}% Cost Saved
              </span>
            </div>
          </div>

          {/* Progress graph bars comparators */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Optimized Network Pipe Rate</span>
              <span>Downspeed: {stats.downloadSpeedSec} MB / s</span>
            </div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900 flex">
              <div 
                className="bg-indigo-500 h-full" 
                style={{ width: `${100 - stats.savingsRatio}%` }} 
                title="Active compressed download stream"
              />
              <div 
                className="bg-emerald-500 h-full opacity-60" 
                style={{ width: `${stats.savingsRatio}%` }} 
                title="Tariff cost eliminated"
              />
            </div>
          </div>

          <div className="text-[10px] flex items-center gap-1.5 text-slate-400 bg-slate-950/55 p-2 rounded-xl border border-slate-900 font-mono">
            <Cpu className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <p className="leading-tight">
              {compressStream 
                ? "Receiver utilizes localized H.265 macroblocks to downsample bitrate blocks without affecting the perceived perceptual audio-video fidelity." 
                : "Standard stream uses raw uncompressed chunk downloads. Consider enabling AV1 Stream Data compression under Portal settings to optimize bandwidth costs."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Series Episodes Selection panel (Only visible when selecting series content) */}
      {item.type === 'series' && item.episodes && (
        <div className="px-4 pb-4 space-y-2" id="series-episodes-panel">
          <div className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider pl-1.5">
            Series Episodes Picker ({item.episodes.length} episodes)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.episodes.map((ep) => {
              const isActiveEp = selectedEpisode?.id === ep.id;
              return (
                <button
                  key={ep.id}
                  id={`episode-btn-${ep.id}`}
                  onClick={() => setSelectedEpisode(ep)}
                  className={`p-3 rounded-xl text-left border text-xs transition-colors outline-none flex items-center justify-between ${
                    isActiveEp
                      ? 'bg-teal-500/10 border-teal-500/40 text-teal-400 font-medium'
                      : 'bg-slate-900 border-slate-850 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="truncate max-w-[80%]">
                    <span className="font-bold text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono mr-1.5">
                      S{ep.season}E{ep.episodeNumber}
                    </span>
                    <span className="truncate">{ep.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{ep.duration}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Live TV EPG (Electronic Program Guide) */}
      {item.type === 'live' && (
        <div className="p-4 border-t border-slate-900 space-y-4 bg-slate-900/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                AI-Driven EPG Scheduler
              </h4>
              <p className="text-[10px] text-slate-500 italic max-w-sm mt-0.5" title={epgSource}>
                Powered by: {epgSource}
              </p>
            </div>

            <button
              id="ai-update-epg-btn"
              onClick={onRefreshEpg}
              disabled={isLoadingEpg}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 shadow-md disabled:opacity-40 select-none outline-none transition-colors border border-indigo-500/30 font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEpg ? 'animate-spin' : ''}`} />
              <span>{isLoadingEpg ? 'AI Searching EPG...' : 'Search EPG updates'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {isLoadingEpg ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800/40 p-3 rounded-xl space-y-2 animate-pulse">
                    <div className="h-3 w-1/3 bg-slate-800 rounded"></div>
                    <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
                  </div>
                ))}
              </div>
            ) : currentEpg.length === 0 ? (
              <div className="bg-slate-900/20 border border-slate-900/40 p-5 rounded-2xl text-center space-y-1">
                <p className="text-xs text-slate-400 font-medium">No Program program guides registered.</p>
                <p className="text-[10px] text-slate-500 font-mono">Click standard update search button above to query live EPG schedules via Gemini Search Grounding.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentEpg.map((epg) => (
                  <div 
                    key={epg.id}
                    className={`border rounded-xl p-3.5 transition-colors duration-250 ${
                      epg.isLive 
                        ? 'bg-indigo-500/5 border-indigo-500/30 shadow-sm shadow-indigo-500/5' 
                        : 'bg-slate-900/30 border-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-bold text-xs text-slate-200">{epg.title}</h5>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">{epg.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0 space-y-1">
                        <span className="text-[10px] bg-slate-950 border border-slate-900 text-slate-400 font-mono px-1.5 py-0.5 rounded font-semibold">
                          {epg.startTime} - {epg.endTime}
                        </span>
                        {epg.isLive && (
                          <div className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono">
                            On Air Now
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
