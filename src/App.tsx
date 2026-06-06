import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_PORTALS, STREAM_ITEMS, CATEGORIES, MOCK_IPTV_PROVIDERS_TEMPLATES } from './data';
import { PortalDetails, StreamItem, IPTVMenuType, EPGItem } from './types';
import Sidebar from './components/Sidebar';
import ItemGrid from './components/ItemGrid';
import PortalSettings from './components/PortalSettings';
import StreamPlayer from './components/StreamPlayer';
import { Tv, Sparkles, HelpCircle, HardDrive, ShieldAlert, CheckCircle2, ChevronRight, Cpu } from 'lucide-react';

export default function App() {
  const [portals, setPortals] = useState<PortalDetails[]>(DEFAULT_PORTALS);
  const [activeTab, setActiveTab] = useState<IPTVMenuType>('live');
  const [selectedItem, setSelectedItem] = useState<StreamItem | null>(null);
  
  // Custom networks and stream efficiency parameters
  const [bufferProfile, setBufferProfile] = useState<number>(2.0); // Balanced 2s by default
  const [compressStream, setCompressStream] = useState<boolean>(true); // Save ISP money enabled by default

  // Custom parsed streams by Portal ID
  const [portalCustomStreams, setPortalCustomStreams] = useState<Record<string, StreamItem[]>>({});

  // EPG Cache by channel name
  const [epgCache, setEpgCache] = useState<Record<string, EPGItem[]>>({});
  const [isLoadingEpg, setIsLoadingEpg] = useState<boolean>(false);
  const [epgSource, setEpgSource] = useState<string>('Static preloaded schedules');

  // Currently active portal
  const activePortal = useMemo(() => {
    return portals.find((p) => p.isActive) || portals[0];
  }, [portals]);

  // Adjust IPTVMenus and styling colors based on current middleware panel settings
  const panelSettings = useMemo(() => {
    let hostname = 'default';
    try {
      const urlToParse = activePortal.url || activePortal.xtreamHost || activePortal.m3uUrl || '';
      if (urlToParse) {
        const urlObj = new URL(urlToParse);
        hostname = urlObj.hostname;
      }
    } catch {
      // keep default
    }

    const template = MOCK_IPTV_PROVIDERS_TEMPLATES[hostname] || MOCK_IPTV_PROVIDERS_TEMPLATES['default'];
    return template;
  }, [activePortal]);

  // Handle active portal switching, triggers stream reset
  const handleSelectPortal = (index: number) => {
    const updated = portals.map((p, idx) => ({
      ...p,
      isActive: idx === index
    }));
    setPortals(updated);
    // Reset selected stream to let user select anew with the matched provider
    setSelectedItem(null);
  };

  // Add customized stalker, xtream, or m3u portal
  const handleAddPortal = (portalData: Omit<PortalDetails, 'id' | 'isActive'>, customItems?: StreamItem[]) => {
    const newId = `portal-${Date.now()}`;
    const freshPortal: PortalDetails = {
      ...portalData,
      id: newId,
      isActive: true
    };
    
    // Make previous portals inactive
    const updated = portals.map((p) => ({
      ...p,
      isActive: false
    }));
    
    setPortals([...updated, freshPortal]);
    setSelectedItem(null);

    // Save custom parsed stream items if any exist
    if (customItems && customItems.length > 0) {
      setPortalCustomStreams(prev => ({
        ...prev,
        [newId]: customItems
      }));
      // Set active tab to let them browse immediately
      setActiveTab(customItems[0].type);
    }
  };

  // Dynamic EPG Fetch via the express server backend with search grounding
  const fetchChannelEpg = async (channelName: string) => {
    // If cache already has items, load instantly for high reactivity
    if (epgCache[channelName]) {
      return;
    }

    setIsLoadingEpg(true);
    try {
      const response = await fetch('/api/epg/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.epg) {
          setEpgCache((prev) => ({
            ...prev,
            [channelName]: data.epg,
          }));
          setEpgSource(data.source || 'Gemini Search Grounding Engine');
        }
      }
    } catch (error) {
      console.error('Failure reaching backend EPG service:', error);
    } finally {
      setIsLoadingEpg(false);
    }
  };

  // Handle media selection (Auto starts prefetching and queries EPG if Live TV selected)
  const handleSelectItem = (item: StreamItem) => {
    setSelectedItem(item);
    if (item.type === 'live') {
      fetchChannelEpg(item.name);
    }
  };

  // Trigger manual refresh/update search guide via AI
  const handleManualEpgRefresh = () => {
    if (selectedItem && selectedItem.type === 'live') {
      // Clear key to force server lookups
      const freshCache = { ...epgCache };
      delete freshCache[selectedItem.name];
      setEpgCache(freshCache);
      fetchChannelEpg(selectedItem.name);
    }
  };

  // Current EPG guide sequence depending on selected channel
  const activeEpgGuide = useMemo(() => {
    if (!selectedItem || selectedItem.type !== 'live') return [];
    return epgCache[selectedItem.name] || [];
  }, [selectedItem, epgCache]);

  // Dynamic displayed items based on connection type & customized uploaded playlists
  const displayedStreamItems = useMemo(() => {
    const customList = activePortal ? portalCustomStreams[activePortal.id] : null;
    if (customList && customList.length > 0) {
      return customList;
    }

    if (activePortal?.type === 'xtream') {
      return [
        {
          id: 'xtream-sports-1',
          name: '[XTREAM Live] Sky Sports Premier League Ultra HD',
          url: 'https://edge.redbull-tv.top.comcast.net/stb/redbull/master.m3u8',
          logoUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=120&auto=format&fit=crop&q=60',
          categoryId: 'live-sports',
          type: 'live',
          description: 'Elite English football coverage streamed from high-performance Gold Xtream transcode nodes.'
        },
        {
          id: 'xtream-news-hbo',
          name: '[XTREAM Live] HBO News Special',
          url: 'https://dwstream72-lh.akamaihd.net/i/dwtv_eng@311240/index_1_av-p.m3u8',
          logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=60',
          categoryId: 'live-news',
          type: 'live',
          description: 'Broadcasting live international coverage, global forums, and high-fidelity discussions.'
        },
        {
          id: 'xtream-movies-1',
          name: '[XTREAM VOD] Tears of Steel Remastered',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop&q=60',
          categoryId: 'movies-action',
          type: 'movies',
          year: '2024',
          rating: '⭐ 9.2',
          genre: 'Action, Sci-Fi',
          director: 'Ian Hubert',
          actors: ['Derek de Lint', 'Rogier Schippers'],
          duration: '12 min',
          description: 'Action & VFX showcase with high-bitrate multi-channel Dolby audio feed synced directly over Xtream API client.'
        }
      ];
    }

    if (activePortal?.type === 'm3u_url') {
      return [
        {
          id: 'm3u-web-news',
          name: '[M3U Link Live] France 24 International Stream',
          url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
          logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=60',
          categoryId: 'live-news',
          type: 'live',
          description: 'Parsed from remote M3U URL stream list.'
        },
        {
          id: 'm3u-web-bunny',
          name: '[M3U Link VOD] Big Buck Bunny UHD Feed',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=60',
          categoryId: 'movies-action',
          type: 'movies',
          year: '2022',
          rating: '⭐ 8.5',
          genre: 'Animation',
          duration: '10 min',
          description: 'Sourced from public playlist links parsed at build time.'
        }
      ];
    }

    return STREAM_ITEMS;
  }, [activePortal, portalCustomStreams]);

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans" id="stalker-player-app-root">
      
      {/* 1. Android-styled TV sidebar nav controls */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePortal={activePortal}
      />

      {/* 2. Main Content Split View (Grid channels list / Details vs Stream Player HUD) */}
      <main className="flex-1 flex overflow-hidden min-w-0" id="main-stalker-body">
        {activeTab === 'settings' ? (
          <PortalSettings
            portals={portals}
            onAddPortal={handleAddPortal}
            onSelectPortal={handleSelectPortal}
            bufferProfile={bufferProfile}
            setBufferProfile={setBufferProfile}
            compressStream={compressStream}
            setCompressStream={setCompressStream}
          />
        ) : (
          <div className="flex-1 flex flex-col md:flex-row min-w-0 overflow-hidden">
            
            {/* Left/Middle Split: Category Channels Browser List */}
            <ItemGrid
              items={displayedStreamItems}
              categories={CATEGORIES}
              menuType={activeTab}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              panelBrandingName={panelSettings?.brandingName || 'IPTV Receiver Panel'}
            />

            {/* Right Split: Dedicated Video Streamer Player & Analytics panel */}
            <StreamPlayer
              item={selectedItem}
              bufferProfile={bufferProfile}
              compressStream={compressStream}
              currentEpg={activeEpgGuide}
              isLoadingEpg={isLoadingEpg}
              onRefreshEpg={handleManualEpgRefresh}
              epgSource={epgSource}
            />

          </div>
        )}
      </main>
    </div>
  );
}
