import React, { useState, useRef } from 'react';
import { 
  Shield, Key, Plus, Check, RefreshCw, Cpu, Wifi, Smartphone, 
  HelpCircle, Save, FileText, Link2, UploadCloud, FolderOpen, AlertCircle 
} from 'lucide-react';
import { PortalDetails, PortalType } from '../types';

interface PortalSettingsProps {
  portals: PortalDetails[];
  onAddPortal: (portal: Omit<PortalDetails, 'id' | 'isActive'>, customItems?: any[]) => void;
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
  // Navigation tabs for form type
  const [formType, setFormType] = useState<PortalType>('stalker');

  // Input states
  const [newName, setNewName] = useState('');
  
  // Stalker specific
  const [newUrl, setNewUrl] = useState('');
  const [newMac, setNewMac] = useState('00:1A:79:');
  
  // Xtream specific
  const [xtreamHost, setXtreamHost] = useState('');
  const [xtreamUsername, setXtreamUsername] = useState('');
  const [xtreamPassword, setXtreamPassword] = useState('');
  
  // M3U URL specific
  const [m3uUrl, setM3uUrl] = useState('');
  
  // M3U file specific
  const [selectedFileName, setSelectedFileName] = useState('');
  const [parsedChannels, setParsedChannels] = useState<any[]>([]);

  // Simulation feedback states
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeLogs, setHandshakeLogs] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const activePortal = portals.find((p) => p.isActive);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Buffer Latency options
  const bufferOptions = [
    { label: 'Instant (0.5s)', value: 0.5, desc: 'Highest responsiveness.' },
    { label: 'Balanced (2.0s)', value: 2.0, desc: 'Recommended default.' },
    { label: 'Resilient (5.0s)', value: 5.0, desc: 'Good for volatile mobile ISPs.' },
    { label: 'High Buffer (10.0s)', value: 10.0, desc: 'Eliminates macro-drops entirely.' }
  ];

  // Client-side M3U Parser logic (Parses #EXTINF name and stream URL)
  const parseM3UContent = (text: string): any[] => {
    const lines = text.split('\n');
    const items: any[] = [];
    let currentName = '';
    let currentLogoUrl = '';
    let currentGroup = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        // Find channel display name
        const commaIdx = line.indexOf(',');
        if (commaIdx !== -1) {
          currentName = line.substring(commaIdx + 1).trim();
        } else {
          currentName = 'M3U Stream ' + (items.length + 1);
        }

        // Try extracting tvg-logo
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        currentLogoUrl = logoMatch ? logoMatch[1] : '';

        // Try extracting group-title (category name)
        const groupMatch = line.match(/group-title="([^"]+)"/);
        currentGroup = groupMatch ? groupMatch[1] : '';
      } else if (line.startsWith('http://') || line.startsWith('https://')) {
        const streamUrl = line;
        
        // Push parsed custom stream item
        items.push({
          id: `m3u-${Date.now()}-${items.length}`,
          name: currentName || 'Custom Stream Channel',
          url: streamUrl,
          logoUrl: currentLogoUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=60',
          categoryId: currentGroup.toLowerCase().includes('movie') ? 'movies-action' : 'live-news',
          type: currentGroup.toLowerCase().includes('movie') ? 'movies' : 'live',
          description: `Custom parsed M3U stream from downloaded playlist. Categorized: ${currentGroup || 'All Media'}`
        });

        // Reset buffer trackers
        currentName = '';
        currentLogoUrl = '';
        currentGroup = '';
      }
    }
    return items;
  };

  // Handle local File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseM3UContent(content);
      setParsedChannels(parsed);
      setHandshakeLogs([
        `[info] File received: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        `[success] Successfully parsed ${parsed.length} dynamic IPTV streams from custom M3U playlist file!`
      ]);
    };
    reader.readAsText(file);
  };

  const handleHandshakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      setErrorMsg('Please specify a receiver nickname.');
      return;
    }

    setIsHandshaking(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Specific logins validation logs
    switch (formType) {
      case 'stalker':
        if (!newUrl || !newMac) {
          setErrorMsg('Portal URL and MAC address are required.');
          setIsHandshaking(false);
          return;
        }
        setHandshakeLogs([
          `[info] Querying IPTV Stalker middleware control panel...`,
          `[info] Sending MAC signature handshake protocol v5.3: ${newMac}`,
          `[success] Connected successfully! Stalker portal settings synchronized.`
        ]);
        break;

      case 'xtream':
        if (!xtreamHost || !xtreamUsername || !xtreamPassword) {
          setErrorMsg('Server host, Username and Password are required.');
          setIsHandshaking(false);
          return;
        }
        setHandshakeLogs([
          `[info] Logging into Xtream Codes API server: ${xtreamHost}...`,
          `[info] Authenticating credentials for subscriber username: "${xtreamUsername}"`,
          `[info] Bypassing stream authentication filters through local proxy...`,
          `[success] Welcome back subscriber! Subscription verified (Expires in: 340 Days).`
        ]);
        break;

      case 'm3u_url':
        if (!m3uUrl) {
          setErrorMsg('Remote M3U playlist URL link is required.');
          setIsHandshaking(false);
          return;
        }
        setHandshakeLogs([
          `[info] Fetching remote manifest from M3U: ${m3uUrl}`,
          `[info] Downloading stream headers and parsing #EXTM3U entries...`,
          `[success] Download complete! Synced custom channels to Live and VOD categories.`
        ]);
        break;

      case 'm3u_file':
        if (parsedChannels.length === 0) {
          setErrorMsg('Please upload a valid .m3u file first.');
          setIsHandshaking(false);
          return;
        }
        setHandshakeLogs([
          `[info] Reading local .m3u playlist content buffers...`,
          `[success] Synced ${parsedChannels.length} stream feeds directly to the IPTV dashboard.`
        ]);
        break;
    }

    // Trigger simulation finish
    setTimeout(() => {
      const basePortal = {
        name: newName,
        type: formType,
        // stalker
        url: formType === 'stalker' ? newUrl : undefined,
        mac: formType === 'stalker' ? newMac : undefined,
        // xtream
        xtreamHost: formType === 'xtream' ? xtreamHost : undefined,
        xtreamUsername: formType === 'xtream' ? xtreamUsername : undefined,
        xtreamPassword: formType === 'xtream' ? xtreamPassword : undefined,
        // m3u
        m3uUrl: formType === 'm3u_url' ? m3uUrl : undefined,
        m3uFileName: formType === 'm3u_file' ? selectedFileName : undefined,
      };

      // Add portal
      onAddPortal(basePortal, formType === 'm3u_file' || formType === 'm3u_url' ? parsedChannels : undefined);

      // Clean form state
      setNewName('');
      setNewUrl('');
      setNewMac('00:1A:79:');
      setXtreamHost('');
      setXtreamUsername('');
      setXtreamPassword('');
      setM3uUrl('');
      setSelectedFileName('');
      setParsedChannels([]);
      setIsHandshaking(false);
      setSuccessMsg(`Successfully authenticated and connected "${basePortal.name}" IPTV credentials. Adjusting stream configs accordingly!`);
    }, 1800);
  };

  const handleSelectPortalWithSim = (idx: number) => {
    onSelectPortal(idx);
    const selected = portals[idx];
    setSuccessMsg(`Switched portal context to "${selected.name}". Re-syncing live media panels.`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 space-y-6" id="stalker-settings-container">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">IPTV Configuration</h2>
          <p className="text-slate-400 text-sm">Add Stalker MAC portals, Xtream Codes credentials, parse remote M3U feeds or upload playlist files</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-xl border border-teal-500/20 text-xs font-semibold font-mono">
          <Wifi className="w-4.5 h-4.5 animate-pulse" />
          <span>NETWORK DRIVER READY</span>
        </div>
      </div>

      {/* Grid Layout splits settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Registered Channels / Networks */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400" />
              Active Connections & Playlists
            </h3>
            
            <p className="text-xs text-slate-400">
              Select any verified connection context. The media categories adjust in real-time according to the selected provider panel guidelines.
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
                      
                      {/* Subtitle depending on model types */}
                      {portal.type === 'stalker' && (
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-400 font-mono break-all line-clamp-1">{portal.url}</p>
                          <p className="text-[11px] text-teal-500 font-mono">MAC: {portal.mac}</p>
                        </div>
                      )}
                      
                      {portal.type === 'xtream' && (
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-400 font-mono break-all line-clamp-1">{portal.xtreamHost}</p>
                          <p className="text-[11px] text-indigo-450 font-mono">Xtream Login: {portal.xtreamUsername}</p>
                        </div>
                      )}

                      {portal.type === 'm3u_url' && (
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-400 font-mono break-all line-clamp-1">{portal.m3uUrl}</p>
                          <p className="text-[11px] text-purple-400 font-mono">Remote M3U Link</p>
                        </div>
                      )}

                      {portal.type === 'm3u_file' && (
                        <div className="text-xs space-y-0.5">
                          <p className="text-teal-400 font-mono break-all line-clamp-1">File: {portal.m3uFileName || 'M3U Playlist File'}</p>
                          <p className="text-[11px] text-slate-550 font-mono">Local Offline List</p>
                        </div>
                      )}

                    </div>

                    {portal.isActive ? (
                      <div className="p-1.5 bg-teal-500/10 rounded-full border border-teal-500/30 text-teal-400">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1 px-2 text-[10px] uppercase font-bold text-slate-505 border border-slate-800 rounded-lg hover:border-slate-700">
                        Select
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Synced Details HUD */}
          {activePortal && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-indigo-900/30 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
                <Cpu className="w-4 h-4 text-indigo-400" />
                IPTV Engine Status Sync
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950/75 p-3 rounded-xl border border-slate-800/70">
                  <div className="text-slate-500 text-[10px] uppercase">Active Type</div>
                  <div className="text-indigo-400 font-bold mt-1 text-xs uppercase">{activePortal.type} API</div>
                </div>
                <div className="bg-slate-950/75 p-3 rounded-xl border border-slate-800/70">
                  <div className="text-slate-500 text-[10px] uppercase">Codec Streamer</div>
                  <div className="text-teal-400 font-bold mt-1 text-xs">{compressStream ? 'H.265 Transcode' : 'Raw Stream'}</div>
                </div>
                <div className="bg-slate-950/75 p-3 rounded-xl border border-slate-800/70">
                  <div className="text-slate-500 text-[10px] uppercase">Sync Status</div>
                  <div className="text-teal-400 font-bold mt-1 text-xs">Connected Ready</div>
                </div>
                <div className="bg-slate-950/75 p-3 rounded-xl border border-slate-800/70">
                  <div className="text-slate-500 text-[10px] uppercase">ISP Package</div>
                  <div className="text-amber-400 font-bold mt-1 text-xs truncate max-w-full">Unlimited Data saver</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Form Tabs & Buffer controls */}
        <div className="space-y-6">
          
          {/* Buffers configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Stream Data Buffer & Efficiency Options
            </h3>
            
            <p className="text-xs text-slate-400">
              Customize buffering sizes to optimize resource usage. Larger profile buffers use more memory but prevent freezing on unstable ISP networks.
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-200">Receiver Buffer Profile</label>
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
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-slate-550 line-clamp-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Setup Credentials form container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-white">Add IPTV Connection Source</h3>
              <p className="text-xs text-slate-405">Configure custom Stalker, Xtream Server, or parse M3U files instantly</p>
            </div>

            {/* HIGH-FIDELITY CONVERTER LOGIN TYPE TABS */}
            <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-1 mt-1">
              {(['stalker', 'xtream', 'm3u_url', 'm3u_file'] as PortalType[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setFormType(tab);
                    setSuccessMsg('');
                    setErrorMsg('');
                    setHandshakeLogs([]);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors outline-none ${
                    formType === tab
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            <form onSubmit={handleHandshakeSubmit} className="space-y-4">
              
              {/* Nickname (For all) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Receiver Name / Provider Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Fast IPTV"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500/50"
                  required
                />
              </div>

              {/* Form elements for STALKER */}
              {formType === 'stalker' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Stalker Portal URL address</label>
                    <input
                      type="url"
                      placeholder="http://stk.provider.com/c/"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500/50"
                      required={formType === 'stalker'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">MAC Address (Device identifier)</label>
                    <input
                      type="text"
                      placeholder="00:1A:79:XX:XX:XX"
                      value={newMac}
                      onChange={(e) => setNewMac(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-teal-500/50"
                      required={formType === 'stalker'}
                    />
                  </div>
                </div>
              )}

              {/* Form elements for XTREAM */}
              {formType === 'xtream' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Xtream Server Host Address</label>
                    <input
                      type="url"
                      placeholder="http://serverdns.net:8080"
                      value={xtreamHost}
                      onChange={(e) => setXtreamHost(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500/50"
                      required={formType === 'xtream'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
                      <input
                        type="text"
                        placeholder="my_iptv_user"
                        value={xtreamUsername}
                        onChange={(e) => setXtreamUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500/50"
                        required={formType === 'xtream'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                      <input
                        type="password"
                        placeholder="xyz_secret"
                        value={xtreamPassword}
                        onChange={(e) => setXtreamPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500/50"
                        required={formType === 'xtream'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form elements for M3U URL */}
              {formType === 'm3u_url' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">M3U Playlist URL Link</label>
                  <input
                    type="url"
                    placeholder="http://iptvprovider.org/playlists/dynamic.m3u"
                    value={m3uUrl}
                    onChange={(e) => setM3uUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500/50"
                    required={formType === 'm3u_url'}
                  />
                  <p className="text-[10px] text-slate-500 mt-1 pl-1 font-mono">
                    Must return plain-text stream configurations containing #EXTM3U tags.
                  </p>
                </div>
              )}

              {/* Form elements for M3U FILE Drag-and-Upload */}
              {formType === 'm3u_file' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-405">M3U Playlist File</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 hover:bg-slate-950/40 rounded-xl p-5 text-center cursor-pointer transition-colors duration-200 stroke-teal-500 flex flex-col items-center justify-center space-y-2"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-teal-400 animate-pulse" />
                    <div className="text-xs text-slate-300 font-medium">
                      {selectedFileName ? (
                        <span className="text-teal-400 font-bold">{selectedFileName}</span>
                      ) : (
                        <span>Drag & Drop or Click to Select .m3u Playlist</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block">Maximum size: 8 MB. Loads streams offline in your device cache.</span>
                  </div>
                  
                  <input
                    type="file"
                    accept=".m3u"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />

                  {parsedChannels.length > 0 && (
                    <div className="bg-teal-500/5 border border-teal-500/20 p-2.5 rounded-xl flex items-center justify-between text-xs text-teal-300">
                      <span>Parsed Dynamic Channels:</span>
                      <span className="font-mono font-bold bg-teal-500/20 px-2 py-0.5 rounded text-white">{parsedChannels.length}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Submit trigger button */}
              <button
                id="handshake-submit-btn"
                type="submit"
                disabled={isHandshaking}
                className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 hover:text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md outline-none disabled:opacity-50 transition-all duration-200 border-none"
              >
                {isHandshaking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Securely...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Connect & Activate This Source</span>
                  </>
                )}
              </button>
            </form>

            {/* Error notifications */}
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Connection logs debugging */}
            {handshakeLogs.length > 0 && (
              <div className="bg-black/90 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 overflow-hidden">
                <div className="flex justify-between text-[9px] text-slate-600 uppercase font-bold border-b border-slate-900 pb-1 mb-1">
                  <span>Diagnostic connection handshakes</span>
                  <span className="text-teal-400 animate-pulse">Running</span>
                </div>
                {handshakeLogs.map((log, index) => (
                  <p key={index} className={log.includes('[success]') ? 'text-teal-400 font-semibold' : 'text-slate-300'}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Connected output alert banner */}
      {successMsg && (
        <div id="settings-success-alert" className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center gap-3 animate-fade-in text-teal-350 text-xs">
          <div className="p-1 bg-teal-500/20 text-teal-400 rounded-full">
            <Check className="w-4 h-4" />
          </div>
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
