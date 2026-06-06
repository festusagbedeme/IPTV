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
      const urlObj = new URL(activePortal.url);
      hostname = urlObj.hostname;
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

  // Add customized stalker portal & MAC coordinate
  const handleAddPortal = (name: string, url: string, mac: string) => {
    const freshPortal: PortalDetails = {
      name,
      url,
      mac,
      isActive: true
    };
    // Make previous portals inactive
    const updated = portals.map((p) => ({
      ...p,
      isActive: false
    }));
    setPortals([...updated, freshPortal]);
    setSelectedItem(null);
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

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans" id="stalker-player-app-root">
      
      {/* 1. Android-styled TV sidebar nav controls */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portalName={activePortal.name}
        macAddress={activePortal.mac}
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
              items={STREAM_ITEMS}
              categories={CATEGORIES}
              menuType={activeTab}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              panelBrandingName={panelSettings.brandingName}
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
