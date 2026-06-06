import { IPTVCategory, StreamItem, PortalDetails } from './types';

export const EMBEDDED_PORTAL: PortalDetails = {
  name: "Apex Embedded IPTV",
  url: "http://mag.apex-iptv.com/c/",
  mac: "00:1A:79:BC:22:DF",
  isActive: true,
  isEmbedded: true
};

export const DEFAULT_PORTALS: PortalDetails[] = [
  EMBEDDED_PORTAL,
  {
    name: "My Custom IPTV Portal",
    url: "http://customstalker.xyz:8080/c/",
    mac: "00:1A:79:AA:BB:CC",
    isActive: false
  }
];

export const CATEGORIES: IPTVCategory[] = [
  // Live TV Categories
  { id: 'live-news', title: 'News & Current Affairs', type: 'live' },
  { id: 'live-sports', title: 'Sports Channels', type: 'live' },
  { id: 'live-entertainment', title: 'Entertainment & Shows', type: 'live' },
  { id: 'live-science', title: 'Science & Documentary', type: 'live' },

  // Movie Categories
  { id: 'movies-action', title: 'Action & Adventure', type: 'movies' },
  { id: 'movies-scifi', title: 'Sci-Fi & Thriller', type: 'movies' },
  { id: 'movies-classics', title: 'Classic Cinema', type: 'movies' },
  { id: 'movies-doc', title: 'Premium Documentaries', type: 'movies' },

  // Series Categories
  { id: 'series-drama', title: 'Drama & Crime Series', type: 'series' },
  { id: 'series-animation', title: 'Animated Series', type: 'series' },

  // Radio Categories
  { id: 'radio-music', title: 'Music & Hits', type: 'radio' },
  { id: 'radio-talk', title: 'News & Conversation Radio', type: 'radio' }
];

export const STREAM_ITEMS: StreamItem[] = [
  // LIVE NEWS
  {
    id: 'news-nasa',
    name: 'NASA UHD Live Feed',
    url: 'https://nasatv-lh.akamaihd.net/i/NASA-HDMI-UHD_1@513795/index_1_av-p.m3u8',
    logoUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=120&auto=format&fit=crop&q=60',
    categoryId: 'live-news',
    type: 'live',
    description: 'Direct television stream from NASA, showcasing live space missions, Earth views from space, and educational space programming.'
  },
  {
    id: 'news-france24',
    name: 'France 24 English HD',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=60',
    categoryId: 'live-news',
    type: 'live',
    description: 'France 24 provides international news channels broadcasting 24/7. Get globally balanced reports and features.'
  },
  {
    id: 'news-dw',
    name: 'Deutsche Welle (DW) English',
    url: 'https://dwstream72-lh.akamaihd.net/i/dwtv_eng@311240/index_1_av-p.m3u8',
    logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=60',
    categoryId: 'live-news',
    type: 'live',
    description: 'Germany\'s international broadcaster, providing news, in-depth reports, and discussions on world events.'
  },

  // LIVE SPORTS
  {
    id: 'sports-redbull',
    name: 'Red Bull Extreme Sports',
    url: 'https://edge.redbull-tv.top.comcast.net/stb/redbull/master.m3u8',
    logoUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=120&auto=format&fit=crop&q=60',
    categoryId: 'live-sports',
    type: 'live',
    description: 'High-adrenaline action sports, motorsports, bike racing, snow adventure, and skateboarding reports globally.'
  },
  {
    id: 'sports-outdoor',
    name: 'Outdoor Adventure TV',
    url: 'https://cshls-outdoor.akamaized.net/hls/live/2002597/outdoor/master.m3u8',
    logoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=120&auto=format&fit=crop&q=60',
    categoryId: 'live-sports',
    type: 'live',
    description: 'Hiking, camping, exploring, survival guides, and oceanic expeditions captured in high definition.'
  },

  // LIVE ENTERTAINMENT
  {
    id: 'entertainment-kitchen',
    name: 'Gourmet Kitchen TV',
    url: 'https://d10r8aofq6m78s.cloudfront.net/live/gourmetkitchen.m3u8',
    logoUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=120&auto=format&fit=crop&q=60',
    categoryId: 'live-entertainment',
    type: 'live',
    description: 'Culinary shows, baking tutorials, international cooking competitions, and healthy eating series.'
  },
  {
    id: 'entertainment-fashion',
    name: 'Fashion One Live',
    url: 'https://fashionone-lh.akamaihd.net/i/fashionone_1@106821/index_1_av-p.m3u8',
    logoUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&auto=format&fit=crop&q=60',
    categoryId: 'live-entertainment',
    type: 'live',
    description: 'Global runway shows, beauty trends, model spotlights, and direct interviews with top designers.'
  },

  // LIVE SCIENCE & DOCUMENTARIES
  {
    id: 'science-nature',
    name: 'WildEarth Safari Live',
    url: 'https://wildearth-hls.live-now.com/master.m3u8',
    logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=60',
    categoryId: 'live-science',
    type: 'live',
    description: 'Step into the wild. Live safaris from Africa, tracking lions, elephants, leopards, and visual wilderness in real-time.'
  },

  // MOVIES - ACTION
  {
    id: 'movie-tears',
    name: 'Tears of Steel (VFX Action-SciFi)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    logoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop&q=60',
    categoryId: 'movies-action',
    type: 'movies',
    year: '2023',
    rating: '⭐ 7.9',
    genre: 'Action, Sci-Fi',
    director: 'Ian Hubert',
    actors: ['Derek de Lint', 'Rogier Schippers', 'Denise Rebergen'],
    duration: '12 min',
    description: 'A sci-fi action epic set in futuristic Amsterdam where a team of young soldiers attempts to rescue the city from giant rogue robotic spider-drones.'
  },
  {
    id: 'movie-bigbuck',
    name: 'Big Buck Bunny (Animation Comedy)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=60',
    categoryId: 'movies-action',
    type: 'movies',
    year: '2021',
    rating: '⭐ 8.1',
    genre: 'Animation, Comedy',
    director: 'Sacha Goedegebure',
    actors: ['Bunny', 'Frank the Squirrel'],
    duration: '10 min',
    description: 'A giant rabbit takes hilarious revenge on three forest rodents who crashed his morning peace and squashed his favorite butterflies.'
  },

  // MOVIES - SCIFI
  {
    id: 'movie-sintel',
    name: 'Sintel - Forest Flight',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60',
    categoryId: 'movies-scifi',
    type: 'movies',
    year: '2022',
    rating: '⭐ 8.4',
    genre: 'Fantasy, Sci-Fi',
    director: 'Colin Levy',
    actors: ['Halina Reijn', 'Thom Hoffman'],
    duration: '15 min',
    description: 'Sintel, a lonely female warrior, searches globally for her beloved baby dragon, battling visual storms and beast guardians.'
  },

  // MOVIES - CLASSICS
  {
    id: 'movie-subway',
    name: 'The Subway Journey',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Subway.mp4',
    logoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&auto=format&fit=crop&q=60',
    categoryId: 'movies-classics',
    type: 'movies',
    year: '2019',
    rating: '⭐ 7.2',
    genre: 'Atmospheric, Cinephile',
    director: 'Jean-Luc Godard Reimagined',
    actors: ['Passengers'],
    duration: '8 min',
    description: 'A poetic black-and-white observation of daily subway travelers, capturing subtle human connections, shadows, and reflections.'
  },

  // SERIES - DRAMA
  {
    id: 'series-cyber',
    name: 'Cybernetic Chronicles',
    url: '', // Container series
    logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=60',
    categoryId: 'series-drama',
    type: 'series',
    year: '2025',
    rating: '⭐ 9.0',
    genre: 'Cyberpunk, Drama',
    director: 'Alex Garland',
    actors: ['Kianu Reeves', 'Scarlett Johansson'],
    description: 'A dystopian series tracing three rogue code specialists who uncover a central server tracking visual telemetry of all human actions.',
    episodes: [
      {
        id: 'cyber-s1e1',
        name: 'Episode 1: The Port 3000 Node',
        season: 1,
        episodeNumber: 1,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '11 min'
      },
      {
        id: 'cyber-s1e2',
        name: 'Episode 2: Protocol Handshake',
        season: 1,
        episodeNumber: 2,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '15 min'
      }
    ]
  },
  {
    id: 'series-nature',
    name: 'Wild Oceans HD',
    url: '', // Container series
    logoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=60',
    categoryId: 'series-animation',
    type: 'series',
    year: '2024',
    rating: '⭐ 8.7',
    genre: 'Nature, Marine Life',
    director: 'David Attenborough Inspired',
    actors: ['Oceanic Life', 'Vibrant Reefs'],
    description: 'Deep dive exploration of coral reefs, majestic whale behaviors, and mysterious creatures that survive in absolute pitch darkness.',
    episodes: [
      {
        id: 'ocean-s1e1',
        name: 'Episode 1: Shallow Currents',
        season: 1,
        episodeNumber: 1,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        duration: '12 min'
      }
    ]
  },

  // RADIO
  {
    id: 'radio-ambient',
    name: 'Acoustic Ambient Zen Stream',
    url: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
    logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=60',
    categoryId: 'radio-music',
    type: 'radio',
    description: 'Deep peaceful electronic, lofi, and instrumental sounds curated for active stress-relief, focus, and relaxed browsing.'
  },
  {
    id: 'radio-world',
    name: 'Global Talk & World FM',
    url: 'https://bbcmedia.ic.llnwd.net/stream/bbcmedia_worldservice_bin_eu_a',
    logoUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=120&auto=format&fit=crop&q=60',
    categoryId: 'radio-talk',
    type: 'radio',
    description: 'International conversations, cultural shows, live economic panels, and language studies broadcast around the clock.'
  }
];

export const MOCK_IPTV_PROVIDERS_TEMPLATES: Record<string, { welcome: string; themeColor: string; brandingName: string; audioType: string }> = {
  "mag.apex-iptv.com": {
    welcome: "Connected to APEX Extreme Servers [Node: US-EAST-4]",
    themeColor: "from-blue-600 via-sky-600 to-indigo-700",
    brandingName: "Apex Cloud IPTV Control Panel",
    audioType: "Standard AAC Codec"
  },
  "mag.premiumiptv.io": {
    welcome: "Authenticated securely via PREMIUM-INTERNET.IO Portal, welcome subscriber!",
    themeColor: "from-amber-500 via-orange-600 to-red-700",
    brandingName: "Premium Master Panel v7.1",
    audioType: "Dolby Surround Simulated PCM"
  },
  "default": {
    welcome: "IPTV Server connected successfully. Panel settings fetched securely.",
    themeColor: "from-emerald-600 via-teal-600 to-cyan-700",
    brandingName: "Stalker Multi-Portal Hub",
    audioType: "Custom Adaptive Codec compression"
  }
};
