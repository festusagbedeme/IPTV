import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Play, Star, Sparkles, Radio, HelpCircle, Film, Tv, Clock } from 'lucide-react';
import { StreamItem, IPTVCategory, IPTVMenuType } from '../types';

interface ItemGridProps {
  items: StreamItem[];
  categories: IPTVCategory[];
  menuType: IPTVMenuType;
  selectedItem: StreamItem | null;
  onSelectItem: (item: StreamItem) => void;
  panelBrandingName: string;
}

export default function ItemGrid({
  items,
  categories,
  menuType,
  selectedItem,
  onSelectItem,
  panelBrandingName
}: ItemGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter categories matching the current parent tab
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => cat.type === menuType);
  }, [categories, menuType]);

  // Combined item filter logic (Active Category + Search Input)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Must match parent tab type
      if (item.type !== menuType) return false;

      // Category match
      const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;

      // Search match
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.genre && item.genre.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [items, menuType, activeCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-w-0" id="item-grid-viewport">
      {/* Search Header and Panel Branding line */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="space-y-1">
          <div className="text-white text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CONNECTED TO:</span>
            <span className="text-teal-400 font-bold uppercase tracking-wide">{panelBrandingName}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono italic">
            Receiving custom categorization channels adjusted dynamically from the provider middleware settings.
          </p>
        </div>

        {/* High-Contrast Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4.5 h-4.5" />
          <input
            id="stream-search-input"
            type="text"
            placeholder={`Search ${menuType === 'live' ? 'live TV' : menuType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-slate-950">
        
        {/* Sub Category Selector Sidebar */}
        <div className="w-56 bg-slate-900/50 border-r border-slate-900 p-3 overflow-y-auto space-y-1" id="sub-categories">
          <div className="px-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            Provider Categories
          </div>
          <button
            onClick={() => setActiveCategory('all')}
            className={`w-full text-left font-medium text-xs px-3.5 py-2.5 rounded-xl transition-colors duration-150 outline-none flex items-center justify-between ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-teal-500/10 to-transparent text-teal-400 border-l-2 border-teal-500'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <span>All Channels & Media</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
              {items.filter(i => i.type === menuType).length}
            </span>
          </button>
          
          {filteredCategories.map((cat) => {
            const count = items.filter(i => i.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left font-medium text-xs px-3.5 py-2.5 rounded-xl transition-colors duration-150 outline-none flex items-center justify-between ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-teal-500/10 to-transparent text-teal-400 border-l-2 border-teal-500'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className="truncate pr-1">{cat.title}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stream Cards Grid */}
        <div className="flex-1 p-5 overflow-y-auto min-h-0" id="media-cards-grid">
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
              <Search className="w-10 h-10 text-slate-700 animate-bounce" />
              <div className="text-slate-300 font-medium text-sm">No channels or items found</div>
              <p className="text-slate-500 text-xs font-mono">Try searching with other generic queries or clean category filters</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              menuType === 'movies' || menuType === 'series'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
            }`}>
              {filteredItems.map((item) => {
                const isStreaming = selectedItem?.id === item.id;
                
                {/* 1. MOVIES and SERIES: Movie Poster Layout Style */}
                if (menuType === 'movies' || menuType === 'series') {
                  return (
                    <div
                      key={item.id}
                      id={`vod-card-${item.id}`}
                      onClick={() => onSelectItem(item)}
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border transition-all duration-300 hover:-translate-y-1 ${
                        isStreaming
                          ? 'border-teal-500 ring-2 ring-teal-500/10 shadow-lg shadow-teal-500/10'
                          : 'border-slate-800/60 hover:border-slate-700 shadow-sm'
                      }`}
                    >
                      {/* aspect ratio 2/3 for film posters */}
                      <div className="aspect-[2/3] relative w-full overflow-hidden bg-slate-950">
                        {item.logoUrl ? (
                          <img
                            src={item.logoUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/40 to-slate-950 p-4 text-center">
                            <Film className="w-8 h-8 text-indigo-500 opacity-60 mb-2" />
                            <span className="text-[10px] text-slate-500 break-all">{item.name}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-95 flex flex-col justify-end p-3">
                          {/* Rating and Year Badge line */}
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono mb-1">
                            {item.rating && (
                              <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                {item.rating}
                              </span>
                            )}
                            {item.year && (
                              <span className="bg-slate-850 px-1 py-0.5 rounded text-slate-400 font-semibold text-[9px]">
                                {item.year}
                              </span>
                            )}
                          </div>
                          <h4 className="text-white font-bold text-xs leading-tight group-hover:text-teal-400 transition-colors line-clamp-2">
                            {item.name}
                          </h4>
                          {item.genre && (
                            <p className="text-[9px] text-slate-400 font-mono mt-0.5">{item.genre}</p>
                          )}
                        </div>

                        {/* Visual play hover state */}
                        <div className="absolute inset-0 bg-teal-500/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="p-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                {/* 2. CHANNELS and RADIO: Landscape HUD Layout Style */}
                return (
                  <div
                    key={item.id}
                    id={`live-card-${item.id}`}
                    onClick={() => onSelectItem(item)}
                    className={`group rounded-2xl p-3 bg-slate-900 border cursor-pointer hover:bg-slate-800/40 hover:border-slate-700 transition-all duration-350 flex gap-3 ${
                      isStreaming
                        ? 'border-teal-500 bg-teal-500/5 ring-1 ring-teal-500/20'
                        : 'border-slate-850/70'
                    }`}
                  >
                    <div className="w-20 h-14 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                      {item.logoUrl ? (
                        <img
                          src={item.logoUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <Radio className="w-5 h-5 text-teal-500/60" />
                      )}
                      
                      {/* Live Ticker Indicator Badge on stream thumbnail */}
                      {item.type === 'live' && (
                        <div className="absolute top-1 left-1.5 bg-red-600 text-white font-bold text-[8px] px-1 py-0.2 rounded font-mono uppercase tracking-wide flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
                          <span>Live</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-bold text-xs truncate leading-tight group-hover:text-teal-400 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                          {item.description || 'Broadcasting rich premium media feeds 24/7.'}
                        </p>
                      </div>
                      
                      {/* Card meta data under text */}
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-1.5">
                        <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900 truncate">
                          {categories.find(c => c.id === item.categoryId)?.title || 'VOD Pack'}
                        </span>
                        {isStreaming ? (
                          <span className="text-teal-400 font-semibold animate-pulse uppercase flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                            ACTIVE
                          </span>
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-slate-400 font-semibold">
                            TUNE IN <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
