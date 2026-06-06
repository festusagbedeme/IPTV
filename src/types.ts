export interface PortalDetails {
  name: string;
  url: string;
  mac: string;
  isActive: boolean;
  isEmbedded?: boolean;
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
