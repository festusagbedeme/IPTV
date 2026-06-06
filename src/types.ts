export type PortalType = 'stalker' | 'xtream' | 'm3u_url' | 'm3u_file';

export interface PortalDetails {
  id: string;
  name: string;
  type: PortalType;
  isActive: boolean;
  isEmbedded?: boolean;
  
  // Stalker fields
  url?: string;
  mac?: string;
  
  // Xtream Codes fields
  xtreamHost?: string;
  xtreamUsername?: string;
  xtreamPassword?: string;
  
  // M3U fields
  m3uUrl?: string;
  m3uFileName?: string;
}

export type IPTVMenuType = 'live' | 'movies' | 'series' | 'radio' | 'settings';

export interface IPTVCategory {
  id: string;
  title: string;
  type: IPTVMenuType;
  icon?: string;
}

export interface StreamItem {
  id: string;
  name: string;
  url: string;
  logoUrl?: string;
  categoryId: string;
  type: IPTVMenuType;
  description?: string;
  year?: string;
  rating?: string;
  genre?: string;
  director?: string;
  actors?: string[];
  duration?: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  name: string;
  season: number;
  episodeNumber: number;
  url: string;
  duration: string;
}

export interface EPGItem {
  id: string;
  channelId: string;
  title: string;
  startTime: string; // e.g. "20:00"
  endTime: string; // e.g. "21:30"
  description: string;
  date: string; // e.g. "2026-06-06"
  isLive?: boolean;
}

export interface BufferStats {
  bufferedMs: number;
  totalStatsFetched: number;
  downloadSpeedSec: number; // MB/s
  compressedBytesSaved: number; // active data optimization
  originalBytes: number;
  savingsRatio: number; // percentage
}
