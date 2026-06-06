import React from 'react';
import { Tv, Film, Disc, Radio, Settings, HelpCircle, HardDrive, Shield } from 'lucide-react';
import { IPTVMenuType, PortalDetails } from '../types';

interface SidebarProps {
  activeTab: IPTVMenuType;
  setActiveTab: (tab: IPTVMenuType) => void;
  activePortal: PortalDetails;
}

export default function Sidebar({ activeTab, setActiveTab, activePortal }: SidebarProps) {
  const menuItems = [
    { id: 'live' as IPTVMenuType, label: 'Live TV', icon: Tv, desc: 'Internet TV Channels' },
    { id: 'movies' as IPTVMenuType, label: 'Movies', icon: Film, desc: 'VOD Movies Selection' },
    { id: 'series' as IPTVMenuType, label: 'TV Series', icon: HardDrive, desc: 'Multi-episode Series' },
    { id: 'radio' as IPTVMenuType, label: 'Radio FM', icon: Radio, desc: 'Global Radio Broadcasts' },
    { id: 'settings' as IPTVMenuType, label: 'Portal Details', icon: Settings, desc: 'IPTV / M3U / Xtream' },
  ];

  const renderActiveSubtitle = () => {
    switch (activePortal.type) {
      case 'stalker':
        return `MAC: ${activePortal.mac || 'None'}`;
      case 'xtream':
        return `User: ${activePortal.xtreamUsername || 'None'}`;
      case 'm3u_url':
        return `Remote M3U Parser`;
      case 'm3u_file':
        return activePortal.m3uFileName ? `M3U: ${activePortal.m3uFileName}` : `Local M3U File`;
      default:
        return 'Connected';
    }
  };

  const renderBadgeType = () => {
    const typeLabels: Record<string, string> = {
      stalker: 'STALKER MAG',
      xtream: 'XTREAM CODES',
      m3u_url: 'M3U URL',
      m3u_file: 'M3U FILE'
    };
    return typeLabels[activePortal.type] || 'IPTV';
  };

  return (
    <aside className="w-68 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 h-full" id="iptv-sidebar">
      {/* Branding Header inspired by Android IPTV TV setups */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 rounded-xl shadow-md">
          <div className="p-2 bg-white/20 rounded-lg">
            <Tv className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-wide uppercase">Apex Stalker</h1>
            <span className="text-[10px] text-teal-200 font-mono tracking-wider">v5.3 Pro Receiver</span>
          </div>
        </div>

        {/* Current Active Portal HUD Badge */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400">
            <Shield className="w-3 h-3" />
            <span className="truncate max-w-[130px]">{activePortal.name}</span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span className="text-indigo-400 font-bold tracking-wider">{renderBadgeType()}</span>
            <span className="text-slate-400 truncate max-w-[110px]" title={renderActiveSubtitle()}>{renderActiveSubtitle()}</span>
          </div>
        </div>

        {/* Navigation items mimicking continuous flow menu */}
        <nav className="space-y-1.5 pt-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-left outline-none border ${
                  isSelected
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 font-medium'
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <div className="leading-tight">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-[10px] opacity-60 text-slate-400 font-normal">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Box Control Diagnostics footer */}
      <div className="pt-4 border-t border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>BUFFERS</span>
          <span className="text-teal-500 font-semibold uppercase">Adaptive</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>DATA COMPRESS</span>
          <span className="text-indigo-400 font-semibold uppercase">LZW/H.265</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer pt-1 pl-1">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Receiver Guide</span>
        </div>
      </div>
    </aside>
  );
}
