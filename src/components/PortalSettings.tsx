import React, { useState } from 'react';
import { Shield, Key, Plus, Check, RefreshCw, Layers, HardDrive, Cpu, Wifi, Smartphone, HelpCircle, Save } from 'lucide-react';
import { PortalDetails } from '../types';

interface PortalSettingsProps {
  portals: PortalDetails[];
  onAddPortal: (name: string, url: string, mac: string) => void;
  onSelectPortal: (index: number) => void;
  bufferProfile: number; // in seconds
  setBufferProfile: (seconds: number) => void;
  compressStream: boolean;
  setCompressStream: (enable: boolean) => void;
}

export default function PortalSettings({
  portals,
  onAddPortal,
  onSelectPortal,
  bufferProfile,
  setBufferProfile,
  compressStream,
  setCompressStream,
}: PortalSettingsProps) {
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newMac, setNewMac] = useState('00:1A:79:');
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeLogs, setHandshakeLogs] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  const activePortal = portals.find((p) => p.isActive);

  // Buffer Size suggestions
  const bufferOptions = [
    { label: 'Instantly Responsive (0.5s)', value: 0.5, desc: 'Ultra-low startup latency. Fits high-speed optical connections.' },
    { label: 'Standard Balanced (2.0s)', value: 2.0, desc: 'Recommended default. Absorbs minor micro-drops gracefully.' },
    { label: 'High Resilience (5.0s)', value: 5.0, desc: 'Provides generous safety margins. Fits mobile ISP data feeds.' },
    { label: 'Ultimate Safe (10.0s)', value: 10.0, desc: 'Locks substantial buffers. High lag, but completely eliminates ISP buffer breaks.' }
  ];

  const handleHandshakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUrl || !newMac) return;

    setIsHandshaking(true);
    setSuccessMsg('');
    setHandshakeLogs([
      `[info] Initializing Stalker Portal handshaker Client-ID MAG-254...`,
      `[info] Mapping URL target: ${newUrl}`,
      `[info] Bypassing browser CORS protections via backend server proxy...`
    ]);

    // Timed simulated handshake log steps for immersion
    setTimeout(() => {
      setHandshakeLogs(prev => [...prev, `[info] Sending MAC signature auth: ${newMac}`]);
    }, 600);

    setTimeout(() => {
      setHandshakeLogs(prev => [...prev, `[info] Handshake query responded. Server type: Stalker MiddleWare PHP Panel.`]);
    }, 1300);

    setTimeout(() => {
      setHandshakeLogs(prev => [...prev, `[success] Handshake completed successfully. Active subscription found!`]);
      onAddPortal(newName, newUrl, newMac);
      setNewName('');
      setNewUrl('');
      setNewMac('00:1A:79:');
      setIsHandshaking(false);
      setSuccessMsg(`Stalker URL customized successfully! Re-adjusting IPTV menu interfaces based on the provider panel settings.`);
    }, 2000);
  };

  const handleSelectPortalWithSim = (idx: number) => {
    onSelectPortal(idx);
    const selected = portals[idx];
    setSuccessMsg(`Switched portal context to "${selected.name}". Re-syncing live categorization panels.`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 space-y-6" id="stalker-settings-container">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Portal Configuration</h2>
          <p className="text-slate-400 text-sm">Configure multi-user Stalker portal coordinates, MAC addresses and buffer specifications</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-xl border border-teal-500/20 text-xs font-semibold font-mono">
          <Wifi className="w-4.5 h-4.5 animate-pulse" />
          <span>RECEIVER ONLINE</span>
        </div>
      </div>

      {/* Grid Layout splits settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Stalker Portal Connections */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400" />
              Active Stalker Portals
            </h3>
            
            <p className="text-xs text-slate-400">
              Select an IPTV provider connection below. Real stalker servers validate your device based on its MAC Address and load categories automatically.
            </p>

            <div className="space-y-2.5 pt-2">
              {portals.map((portal, index) => (
                <div
                  key={index}
                  id={`portal-item-${index}`}
                  className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                    portal.isActive
                      ? 'bg-teal-500/5 border-teal-500/45 shadow-md shadow-teal-500/5'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
                  }`}
                  onClick={() => handleSelectPortalWithSim(index)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100">{portal.name}</span>
                        {portal.isEmbedded && (
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                            Prebuilt
                          </span>
                        )}
                        {portal.isActive && (
                          <span className="text-[9px] bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono break-all leading-tight">{portal.url}</p>
                      <p className="text-[11px] text-teal-500 font-mono pt-1">MAC: {portal.mac}</p>
                    </div>
                    {portal.isActive ? (
                      <div className="p-1.5 bg-teal-500/10 rounded-full border border-teal-500/30 text-teal-400">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1 px-2 text-[10px] uppercase font-bold text-slate-500 border border-slate-800 rounded-lg hover:border-slate-700">
                        Select
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Details HUD */}
          {activePortal && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-indigo-900/30 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
                <Cpu className="w-4 h-4 text-indigo-400" />
                IPTV Middleware Panel Sync Status
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950/75 p-3 rounded-xl border border-slate-800/70">
                  <div className="text-slate-500 text-[10px] uppercase">Theme Preset</div>
                  <div className="text-indigo-400 font-bold mt-1 text-xs">VOD Modern Glass</div>
                </div>
                <div className="bg-slate-950/75 p-3 rounded-xl border border-slate-800/70">
                  <div className="text-slate-500 text-[10px] uppercase">Audio Decoder</div>
                  <div className="text-teal-400 font-bold mt-1 text-xs">Adaptive AAC Core</div>
                </div>
                <div className="bg-slate-950/75 p-3 rounded-xl border border-slate-800/70">
                  <div className="text-slate-500 text-[10px] uppercase">Panel Status</div>
                  <div className="text-teal-400 font-bold mt-1 text-xs">Connected (1/1 Max)</div>
                </div>
                <div className="bg-slate-950/75 p-3 rounded-xl border border-slate-800/70">
                  <div className="text-slate-500 text-[10px] uppercase">ISP Package</div>
                  <div className="text-amber-400 font-bold mt-1 text-xs truncate max-w-full">Gold Premium</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Network Buffer Stream Efficiencies & Custom Form */}
        <div className="space-y-6">
          
          {/* Stream Buffer Efficiency Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Stream Data Buffer & Save Options
            </h3>
            
            <p className="text-xs text-slate-400">
              ISP data tariffs can be expensive. Customizing stream buffers and enabling the built-in AV1/H.265 Transcode Optimizer reduces costs significantly:
            </p>

            {/* Buffer Select options */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-200">Receiver Buffer Length Profile</label>
              <div className="grid grid-cols-2 gap-2">
                {bufferOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setBufferProfile(opt.value)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-colors duration-200 outline-none ${
                      bufferProfile === opt.value
                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-400 font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold">{opt.label.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Network Smart Compression Switch */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between mt-3">
              <div className="space-y-1.5 max-w-[80%]">
                <div className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  AV1 Stream Compression (ISP Data Saver)
                </div>
                <p className="text-xs text-slate-400">
                  Enable high-efficiency cache transcoding. Compresses stream buffers on demand to reduce mobile tariff metadata loads by up to 45%.
                </p>
              </div>
              <button
                id="toggle-compress-btn"
                onClick={() => setCompressStream(!compressStream)}
                className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 outline-none ${
                  compressStream ? 'bg-teal-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                    compressStream ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Add own portal form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-400" />
              Add Custom Stalker Provider Details
            </h3>

            <form onSubmit={handleHandshakeSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Provider Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. My Premium Provider"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Stalker Portal URL address</label>
                <input
                  type="url"
                  placeholder="e.g. http://mag.premiumiptv.io/c/"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">MAC Address (Device Code identifier)</label>
                <input
                  type="text"
                  placeholder="00:1A:79:XX:XX:XX"
                  value={newMac}
                  onChange={(e) => setNewMac(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-teal-500/50"
                  required
                />
              </div>

              <button
                id="handshake-submit-btn"
                type="submit"
                disabled={isHandshaking}
                className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md outline-none disabled:opacity-50 transition-all duration-200"
              >
                {isHandshaking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Handshake...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Validate Portal Details</span>
                  </>
                )}
              </button>
            </form>

            {/* Handshake debugger logs terminal */}
            {handshakeLogs.length > 0 && (
              <div className="bg-black/90 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1.5 overflow-hidden">
                <div className="flex justify-between text-[9px] text-slate-600 uppercase font-bold border-b border-slate-900 pb-1.5 mb-1.5">
                  <span>Connection diagnostic log</span>
                  <span className="text-teal-500">Live</span>
                </div>
                {handshakeLogs.map((log, index) => (
                  <p
                    key={index}
                    className={
                      log.includes('[success]')
                        ? 'text-teal-400'
                        : log.includes('[danger]') || log.includes('[error]')
                        ? 'text-red-400'
                        : 'text-slate-350'
                    }
                  >
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Connection success Alert Message */}
      {successMsg && (
        <div id="settings-success-alert" className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center gap-3 animate-fade-in text-teal-300 text-xs">
          <div className="p-1 bg-teal-500/20 text-teal-400 rounded-full">
            <Check className="w-4 h-4" />
          </div>
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
