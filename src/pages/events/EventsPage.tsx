import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, Heart, ChevronLeft, ChevronRight,
  SlidersHorizontal, X, Globe, Star, Users,
  Share2, Bookmark, BookmarkCheck, Navigation, CalendarPlus,
  Grid3X3, List, Map, TrendingUp, Flame, ChevronDown, ChevronUp,
  Ticket, Filter, Eye, Sparkles, ArrowUpDown, LayoutGrid, RotateCcw,
} from 'lucide-react';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  time: string;
  endTime: string;
  location: string;
  venue: string;
  coordinates: { lat: number; lng: number };
  price: number;
  originalPrice?: number;
  image: string;
  organizer: { name: string; avatar: string; verified: boolean };
  attendees: number;
  maxCapacity: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  soldOut?: boolean;
  free?: boolean;
  trending?: boolean;
  online?: boolean;
}

type ViewMode = 'grid' | 'list' | 'map';
type SortOption = 'relevance' | 'date' | 'price-asc' | 'price-desc' | 'rating' | 'popular';

interface FilterState {
  categories: string[];
  dateRange: string;
  priceRange: [number, number];
  distance: number;
  eventType: 'all' | 'offline' | 'online';
  sortBy: SortOption;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ALL_CATEGORIES = [
  'Music', 'Nightlife', 'Concert', 'Art', 'Food & Drink',
  'Technology', 'Sports', 'Workshop', 'Comedy', 'Theater'
] as const;

const DATE_OPTIONS = ['Any Date', 'Today', 'Tomorrow', 'This Weekend', 'This Month'] as const;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Date: Soonest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const SEARCH_SUGGESTIONS = [
  'Summer Music Festival', 'Free concerts near me', 'Art exhibitions today',
  'Food festivals this weekend', 'Tech workshops online', 'Comedy shows NYC',
  'Rooftop parties Brooklyn', 'Jazz night Manhattan', 'Indie rock concerts',
  'Digital art expo', 'Wine tasting events', 'Yoga retreats'
];

// =============================================================================
// MOCK DATA — Enriched
// =============================================================================

const MOCK_EVENTS: EventData[] = [
  {
    id: '1',
    title: 'Summer Music Festival 2026',
    description: 'The ultimate outdoor music experience featuring 50+ artists across 4 stages. Food trucks, art installations, and immersive light shows all weekend long.',
    category: 'Music',
    tags: ['Festival', 'Outdoor', 'Live Music', 'Multi-Day'],
    date: 'Aug 15-17, 2026',
    time: '2:00 PM',
    endTime: '11:00 PM',
    location: 'Central Park, NY',
    venue: 'Great Lawn Stage',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    price: 89,
    originalPrice: 129,
    image: 'https://images.unsplash.com/photo-1459749411177-287ce3288789?q=80&w=2069',
    organizer: { name: 'SoundWave Productions', avatar: 'https://i.pravatar.cc/40?img=11', verified: true },
    attendees: 12450,
    maxCapacity: 15000,
    rating: 4.8,
    reviewCount: 2340,
    featured: true,
    trending: true,
  },
  {
    id: '2',
    title: 'Neon Nights Rooftop Party',
    description: 'An exclusive rooftop experience with top DJs, neon body paint, and panoramic views of the NYC skyline. Premium drinks included.',
    category: 'Nightlife',
    tags: ['Party', 'Rooftop', 'DJ', 'Premium'],
    date: 'Aug 24, 2026',
    time: '10:00 PM',
    endTime: '4:00 AM',
    location: 'Brooklyn, NY',
    venue: 'Sky Lounge 360',
    coordinates: { lat: 40.6782, lng: -73.9442 },
    price: 45,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2019',
    organizer: { name: 'NiteLife Events', avatar: 'https://i.pravatar.cc/40?img=22', verified: true },
    attendees: 380,
    maxCapacity: 500,
    rating: 4.5,
    reviewCount: 189,
    trending: true,
  },
  {
    id: '3',
    title: 'Indie Rock Fest 2026',
    description: 'Discover the next wave of indie rock talent. Three stages, craft beer garden, vinyl market, and intimate acoustic sessions.',
    category: 'Concert',
    tags: ['Indie', 'Rock', 'Live', 'Craft Beer'],
    date: 'Sep 15, 2026',
    time: '4:00 PM',
    endTime: '11:30 PM',
    location: 'Queens Park, NY',
    venue: 'Forest Hills Stadium',
    coordinates: { lat: 40.7200, lng: -73.8448 },
    price: 65,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070',
    organizer: { name: 'Underground Sounds', avatar: 'https://i.pravatar.cc/40?img=33', verified: false },
    attendees: 2100,
    maxCapacity: 5000,
    rating: 4.6,
    reviewCount: 567,
  },
  {
    id: '4',
    title: 'Digital Art Expo',
    description: 'Explore cutting-edge digital art, NFT galleries, VR installations, and interactive projections by world-renowned digital artists.',
    category: 'Art',
    tags: ['Digital', 'NFT', 'VR', 'Interactive'],
    date: 'Sep 02, 2026',
    time: '10:00 AM',
    endTime: '8:00 PM',
    location: 'Manhattan Center',
    venue: 'The Shed',
    coordinates: { lat: 40.7536, lng: -74.0018 },
    price: 20,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070',
    organizer: { name: 'ArtTech Collective', avatar: 'https://i.pravatar.cc/40?img=44', verified: true },
    attendees: 3000,
    maxCapacity: 3000,
    rating: 4.3,
    reviewCount: 421,
    soldOut: true,
  },
  {
    id: '5',
    title: 'Taste of the City',
    description: 'NYC\'s biggest food festival returns! Over 100 vendors, celebrity chef demos, mixology classes, and a dessert village.',
    category: 'Food & Drink',
    tags: ['Food', 'Festival', 'Outdoor', 'Family'],
    date: 'Sep 22, 2026',
    time: '11:00 AM',
    endTime: '9:00 PM',
    location: 'Downtown Plaza',
    venue: 'Hudson Yards',
    coordinates: { lat: 40.7527, lng: -74.0012 },
    price: 0,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974',
    organizer: { name: 'NYC Foodie Club', avatar: 'https://i.pravatar.cc/40?img=55', verified: true },
    attendees: 8900,
    maxCapacity: 20000,
    rating: 4.7,
    reviewCount: 1823,
    free: true,
    trending: true,
  },
  {
    id: '6',
    title: 'AI & Future Tech Summit',
    description: 'Join 2000+ tech leaders exploring AI, blockchain, quantum computing. Keynotes, hands-on labs, networking, and startup pitch competition.',
    category: 'Technology',
    tags: ['AI', 'Tech', 'Conference', 'Networking'],
    date: 'Oct 05-06, 2026',
    time: '9:00 AM',
    endTime: '6:00 PM',
    location: 'Midtown, NY',
    venue: 'Javits Center',
    coordinates: { lat: 40.7575, lng: -74.0021 },
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070',
    organizer: { name: 'TechForward Inc.', avatar: 'https://i.pravatar.cc/40?img=66', verified: true },
    attendees: 1850,
    maxCapacity: 2500,
    rating: 4.9,
    reviewCount: 734,
    featured: true,
    online: true,
  },
  {
    id: '7',
    title: 'Stand-Up Comedy Night',
    description: 'An evening of non-stop laughter with NYC\'s hottest comedians. Two-drink minimum included in ticket price.',
    category: 'Comedy',
    tags: ['Comedy', 'Stand-Up', 'Nightlife', 'Drinks'],
    date: 'Aug 30, 2026',
    time: '8:00 PM',
    endTime: '10:30 PM',
    location: 'Greenwich Village, NY',
    venue: 'The Comedy Cellar',
    coordinates: { lat: 40.7303, lng: -74.0005 },
    price: 35,
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2071',
    organizer: { name: 'LOL Productions', avatar: 'https://i.pravatar.cc/40?img=77', verified: false },
    attendees: 115,
    maxCapacity: 150,
    rating: 4.4,
    reviewCount: 298,
  },
  {
    id: '8',
    title: 'Sunrise Yoga & Wellness',
    description: 'Start your day with oceanside yoga, guided meditation, healthy brunch, and sound healing sessions. All levels welcome.',
    category: 'Workshop',
    tags: ['Yoga', 'Wellness', 'Outdoor', 'Meditation'],
    date: 'Sep 10, 2026',
    time: '6:00 AM',
    endTime: '11:00 AM',
    location: 'Coney Island, NY',
    venue: 'Boardwalk Beach',
    coordinates: { lat: 40.5749, lng: -73.9859 },
    price: 0,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099',
    organizer: { name: 'ZenFlow Studio', avatar: 'https://i.pravatar.cc/40?img=88', verified: true },
    attendees: 220,
    maxCapacity: 300,
    rating: 4.9,
    reviewCount: 156,
    free: true,
  },
  {
    id: '9',
    title: 'Broadway Under the Stars',
    description: 'Open-air performances of Broadway\'s greatest hits inside Central Park. Bring a blanket and enjoy Tony Award-winning performances.',
    category: 'Theater',
    tags: ['Broadway', 'Outdoor', 'Performance', 'Family'],
    date: 'Sep 18, 2026',
    time: '7:00 PM',
    endTime: '10:00 PM',
    location: 'Central Park, NY',
    venue: 'Delacorte Theater',
    coordinates: { lat: 40.7806, lng: -73.9691 },
    price: 55,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2071',
    organizer: { name: 'NYC Theater Guild', avatar: 'https://i.pravatar.cc/40?img=14', verified: true },
    attendees: 1450,
    maxCapacity: 1800,
    rating: 4.7,
    reviewCount: 892,
    featured: true,
  },
  {
    id: '10',
    title: 'Electronic Music Marathon',
    description: '12-hour electronic music marathon featuring international DJs. Laser shows, silent disco zone, and chill-out area.',
    category: 'Music',
    tags: ['Electronic', 'DJ', 'Dance', 'Marathon'],
    date: 'Oct 12, 2026',
    time: '12:00 PM',
    endTime: '12:00 AM',
    location: 'Williamsburg, NY',
    venue: 'Avant Gardner',
    coordinates: { lat: 40.7081, lng: -73.9234 },
    price: 75,
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=2067',
    organizer: { name: 'BeatDrop Collective', avatar: 'https://i.pravatar.cc/40?img=19', verified: true },
    attendees: 3200,
    maxCapacity: 5000,
    rating: 4.5,
    reviewCount: 612,
    trending: true,
  },
];

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

const expandVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const chipVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
};

// =============================================================================
// HELPER HOOKS
// =============================================================================

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/** Star rating display */
const StarRating: React.FC<{ rating: number; count: number }> = ({ rating, count }) => (
  <div className="flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5 with ${count} reviews`}>
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-[var(--border-primary)]'}
        />
      ))}
    </div>
    <span className="text-xs font-semibold text-[var(--text-primary)]">{rating}</span>
    <span className="text-xs text-[var(--text-muted)]">({count.toLocaleString()})</span>
  </div>
);

/** Attendee progress bar */
const CapacityBar: React.FC<{ current: number; max: number }> = ({ current, max }) => {
  const percent = Math.min((current / max) * 100, 100);
  const urgency = percent >= 90;
  return (
    <div className="space-y-1" aria-label={`${current.toLocaleString()} of ${max.toLocaleString()} spots filled`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-muted)] flex items-center gap-1">
          <Users size={12} />
          {current.toLocaleString()} attending
        </span>
        {urgency && (
          <span className="text-[var(--color-error)] font-semibold flex items-center gap-1 animate-pulse">
            <Flame size={12} />
            Almost full!
          </span>
        )}
      </div>
      <div className="w-full h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${urgency ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]'}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

/** Badge for event status */
const EventBadge: React.FC<{ type: 'featured' | 'trending' | 'soldOut' | 'free' | 'online' | 'discount'; text?: string }> = ({ type, text }) => {
  const styles: Record<string, string> = {
    featured: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    trending: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
    soldOut: 'bg-[var(--color-error)] text-white',
    free: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
    online: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
    discount: 'bg-gradient-to-r from-[var(--color-primary)] to-cyan-400 text-white',
  };
  const icons: Record<string, React.ReactNode> = {
    featured: <Sparkles size={10} />,
    trending: <TrendingUp size={10} />,
    soldOut: <X size={10} />,
    free: <Ticket size={10} />,
    online: <Globe size={10} />,
    discount: <Ticket size={10} />,
  };
  const labels: Record<string, string> = {
    featured: 'Featured',
    trending: 'Trending',
    soldOut: 'Sold Out',
    free: 'Free Entry',
    online: 'Online',
    discount: text || 'Sale',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[type]}`}>
      {icons[type]}
      {labels[type]}
    </span>
  );
};

/** Quick action buttons for expanded card */
const QuickActions: React.FC<{
  saved: boolean;
  onSave: () => void;
  onShare: () => void;
  onCalendar: () => void;
  onDirections: () => void;
}> = ({ saved, onSave, onShare, onCalendar, onDirections }) => (
  <div className="flex items-center gap-2 flex-wrap" role="toolbar" aria-label="Quick actions">
    <button
      onClick={onSave}
      aria-label={saved ? 'Remove from saved' : 'Save event'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
        saved
          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
      }`}
    >
      {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {saved ? 'Saved' : 'Save'}
    </button>
    <button
      onClick={onShare}
      aria-label="Share event"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200"
    >
      <Share2 size={14} /> Share
    </button>
    <button
      onClick={onCalendar}
      aria-label="Add to calendar"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200"
    >
      <CalendarPlus size={14} /> Calendar
    </button>
    <button
      onClick={onDirections}
      aria-label="Get directions"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200"
    >
      <Navigation size={14} /> Directions
    </button>
  </div>
);

// =============================================================================
// EVENT CARD COMPONENT
// =============================================================================

const EventCard: React.FC<{
  event: EventData;
  index: number;
  viewMode: ViewMode;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}> = ({ event, index, viewMode, isExpanded, onToggleExpand, isSaved, onToggleSave }) => {
  const discountPercent = event.originalPrice
    ? Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100)
    : 0;

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: `/events/${event.id}` });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`);
    }
  }, [event]);

  const handleCalendar = useCallback(() => {
    const calUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=20260815/20260816&location=${encodeURIComponent(event.location)}`;
    window.open(calUrl, '_blank');
  }, [event]);

  const handleDirections = useCallback(() => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.coordinates.lat},${event.coordinates.lng}`, '_blank');
  }, [event]);

  // ── LIST VIEW ──
  if (viewMode === 'list') {
    return (
      <motion.article
        custom={index}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        layout
        className="group flex flex-col sm:flex-row bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-primary)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-lg"
        role="article"
        aria-label={`Event: ${event.title}`}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleExpand(); } }}
      >
        {/* Image */}
        <div className="relative w-full sm:w-56 md:w-72 flex-shrink-0 aspect-video sm:aspect-auto overflow-hidden">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${event.soldOut ? 'grayscale' : ''}`}
            style={{ backgroundImage: `url('${event.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--bg-card)]/30" />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {event.featured && <EventBadge type="featured" />}
            {event.trending && <EventBadge type="trending" />}
            {event.soldOut && <EventBadge type="soldOut" />}
            {event.free && <EventBadge type="free" />}
            {event.online && <EventBadge type="online" />}
            {discountPercent > 0 && <EventBadge type="discount" text={`${discountPercent}% Off`} />}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            aria-label={isSaved ? 'Remove from saved' : 'Save event'}
            className="absolute top-3 right-3 p-2 bg-black/40 rounded-full text-white hover:bg-[var(--color-primary)] transition-colors"
          >
            <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">{event.category}</span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors mt-0.5">
                  {event.title}
                </h3>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-[var(--text-muted)]">{event.free ? 'Entry' : 'From'}</p>
                <div className="flex items-center gap-1.5">
                  {event.originalPrice && (
                    <span className="text-sm text-[var(--text-muted)] line-through">${event.originalPrice}</span>
                  )}
                  <p className={`text-lg font-bold ${event.free ? 'text-[var(--color-success)]' : 'text-[var(--text-primary)]'}`}>
                    {event.free ? 'Free' : `$${event.price}`}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3">{event.description}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[var(--color-primary)]" />{event.date} • {event.time}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[var(--color-primary)]" />{event.venue}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-primary)]">
            <div className="flex items-center gap-4">
              <StarRating rating={event.rating} count={event.reviewCount} />
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Users size={12} /> {event.attendees.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleExpand}
                aria-expanded={isExpanded}
                aria-label="Show more details"
                className="p-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <Link
                to={`/events/${event.id}`}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                  event.soldOut
                    ? 'bg-[var(--bg-surface)] text-[var(--text-disabled)] cursor-not-allowed pointer-events-none border border-[var(--border-primary)]'
                    : 'bg-gradient-to-r from-[var(--color-primary)] to-cyan-500 hover:from-[var(--color-primary-focus)] hover:to-cyan-600 text-white shadow-md hover:shadow-lg'
                }`}
                aria-label={event.soldOut ? 'Sold out' : `Book ${event.title}`}
              >
                {event.soldOut ? 'Sold Out' : event.free ? 'Register' : 'Book Now'}
              </Link>
            </div>
          </div>

          {/* Expandable Detail */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                variants={expandVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-[var(--border-primary)] space-y-4">
                  <CapacityBar current={event.attendees} max={event.maxCapacity} />
                  <div className="flex items-center gap-3">
                    <img src={event.organizer.avatar} alt={event.organizer.name} className="w-8 h-8 rounded-full border border-[var(--border-primary)]" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                        {event.organizer.name}
                        {event.organizer.verified && <span className="text-[var(--color-primary)]" title="Verified organizer">✓</span>}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">Organizer</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-primary)]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <QuickActions
                    saved={isSaved}
                    onSave={onToggleSave}
                    onShare={handleShare}
                    onCalendar={handleCalendar}
                    onDirections={handleDirections}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>
    );
  }

  // ── GRID VIEW (default) ──
  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      layout
      className="group flex flex-col bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-primary)] hover:border-[var(--color-primary)] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg"
      role="article"
      aria-label={`Event: ${event.title}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleExpand(); } }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${event.soldOut ? 'grayscale' : ''}`}
          style={{ backgroundImage: `url('${event.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {event.featured && <EventBadge type="featured" />}
          {event.trending && <EventBadge type="trending" />}
          {event.free && <EventBadge type="free" />}
          {event.online && <EventBadge type="online" />}
          {discountPercent > 0 && <EventBadge type="discount" text={`${discountPercent}% Off`} />}
        </div>

        {/* Sold-out overlay */}
        {event.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="bg-[var(--color-error)] text-white text-sm font-bold px-5 py-2 rounded-lg uppercase tracking-widest border border-white/20 rotate-[-8deg] shadow-xl">
              Sold Out
            </span>
          </div>
        )}

        {/* Save */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
          aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          className="absolute top-3 right-3 p-2 bg-black/40 rounded-full text-white hover:bg-[var(--color-primary)] transition-colors"
        >
          <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
        </button>

        {/* Bottom-left: category + rating overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/30 px-2 py-0.5 rounded">
            {event.category}
          </span>
          <div className="flex items-center gap-1 text-white/90 bg-black/30 px-2 py-0.5 rounded">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-semibold">{event.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-3 flex-grow">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
            <Calendar size={14} className="text-[var(--color-primary)] flex-shrink-0" />
            <span className="truncate">{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
            <MapPin size={14} className="text-[var(--color-primary)] flex-shrink-0" />
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Users size={13} className="flex-shrink-0" />
            <span>{event.attendees.toLocaleString()} attending</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span>{event.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-medium">{event.free ? 'Entry' : 'Starting at'}</p>
            <div className="flex items-center gap-1.5">
              {event.originalPrice && (
                <span className="text-xs text-[var(--text-muted)] line-through">${event.originalPrice}</span>
              )}
              <p className={`text-lg font-bold ${event.free ? 'text-[var(--color-success)]' : 'text-[var(--text-primary)]'}`}>
                {event.free ? 'Free' : `$${event.price}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleExpand}
              aria-expanded={isExpanded}
              aria-label="Show more details"
              className="p-2 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <Eye size={15} />
            </button>
            <Link
              to={`/events/${event.id}`}
              aria-label={event.soldOut ? 'Sold out' : `Book ${event.title}`}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                event.soldOut
                  ? 'bg-[var(--bg-surface)] text-[var(--text-disabled)] cursor-not-allowed pointer-events-none border border-[var(--border-primary)]'
                  : 'bg-gradient-to-r from-[var(--color-primary)] to-cyan-500 hover:from-[var(--color-primary-focus)] hover:to-cyan-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {event.soldOut ? 'Sold Out' : event.free ? 'Register' : 'Book Now'}
            </Link>
          </div>
        </div>

        {/* ── Expandable Section ── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={expandVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-[var(--border-primary)] space-y-3">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{event.description}</p>
                <CapacityBar current={event.attendees} max={event.maxCapacity} />

                <div className="flex items-center gap-3">
                  <img src={event.organizer.avatar} alt={event.organizer.name} className="w-7 h-7 rounded-full border border-[var(--border-primary)]" />
                  <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                    {event.organizer.name}
                    {event.organizer.verified && <span className="text-[var(--color-primary)]" title="Verified">✓</span>}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-primary)]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <QuickActions
                  saved={isSaved}
                  onSave={onToggleSave}
                  onShare={handleShare}
                  onCalendar={handleCalendar}
                  onDirections={handleDirections}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

// =============================================================================
// SEARCH AUTOCOMPLETE COMPONENT
// =============================================================================

const SearchAutocomplete: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}> = ({ value, onChange, onSearch }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setShowSuggestions(false));

  const filtered = useMemo(
    () => SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(value.toLowerCase())).slice(0, 6),
    [value]
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-[var(--color-primary)] transition-all shadow-sm">
        <Search size={18} className="ml-4 text-[var(--text-muted)] flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => { if (e.key === 'Enter') { onSearch(); setShowSuggestions(false); } if (e.key === 'Escape') setShowSuggestions(false); }}
          placeholder="Search events, artists, venues..."
          className="flex-1 bg-transparent px-3 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          aria-label="Search events"
          aria-autocomplete="list"
          aria-expanded={showSuggestions && filtered.length > 0}
          role="combobox"
        />
        {value && (
          <button onClick={() => onChange('')} aria-label="Clear search" className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X size={16} />
          </button>
        )}
        <button
          onClick={() => { onSearch(); setShowSuggestions(false); }}
          aria-label="Search"
          className="px-5 py-3 bg-gradient-to-r from-[var(--color-primary)] to-cyan-500 text-white text-sm font-semibold hover:from-[var(--color-primary-focus)] hover:to-cyan-600 transition-all"
        >
          Search
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showSuggestions && value.length > 0 && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-lg overflow-hidden"
            role="listbox"
          >
            {filtered.map((s, _i) => (
              <li
                key={s}
                role="option"
                tabIndex={0}
                aria-selected={false}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--color-primary)] cursor-pointer transition-colors"
                onClick={() => { onChange(s); setShowSuggestions(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { onChange(s); setShowSuggestions(false); } }}
              >
                <Search size={14} className="text-[var(--text-muted)]" />
                <span dangerouslySetInnerHTML={{
                  __html: s.replace(new RegExp(`(${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<strong class="text-[var(--color-primary)]">$1</strong>')
                }} />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// FILTER CHIPS BAR
// =============================================================================

const FilterChipsBar: React.FC<{
  filters: FilterState;
  onToggleCategory: (cat: string) => void;
  onSetDate: (d: string) => void;
  onClearAll: () => void;
}> = ({ filters, onToggleCategory, onSetDate, onClearAll }) => {
  const activeCount = filters.categories.length + (filters.dateRange !== 'Any Date' ? 1 : 0) + (filters.eventType !== 'all' ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Active filters">
      {/* Category chips */}
      {ALL_CATEGORIES.map((cat) => {
        const active = filters.categories.includes(cat);
        return (
          <motion.button
            key={cat}
            layout
            onClick={() => onToggleCategory(cat)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
              active
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            {cat}
          </motion.button>
        );
      })}

      {/* Separator */}
      <div className="w-px h-5 bg-[var(--border-primary)] mx-1 hidden sm:block" />

      {/* Date chips */}
      {DATE_OPTIONS.slice(1).map((date) => {
        const active = filters.dateRange === date;
        return (
          <motion.button
            key={date}
            layout
            onClick={() => onSetDate(active ? 'Any Date' : date)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
              active
                ? 'bg-gradient-to-r from-[var(--color-secondary)] to-green-500 text-white border-transparent shadow-sm'
                : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]'
            }`}
          >
            {date}
          </motion.button>
        );
      })}

      {/* Clear all */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.button
            variants={chipVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClearAll}
            aria-label="Clear all filters"
            className="ml-2 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--color-error)] bg-[var(--status-error-light)] border border-transparent hover:border-[var(--color-error)] transition-all flex items-center gap-1"
          >
            <RotateCcw size={12} /> Clear ({activeCount})
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// MAP VIEW PLACEHOLDER
// =============================================================================

const MapViewPlaceholder: React.FC<{ events: EventData[] }> = ({ events }) => (
  <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-surface)]">
    {/* Map background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-card)]">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />
    </div>

    {/* Event pins */}
    {events.slice(0, 8).map((event, i) => (
      <motion.div
        key={event.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
        className="absolute group/pin cursor-pointer"
        style={{
          left: `${15 + (i * 10) % 70}%`,
          top: `${15 + ((i * 17 + 5) % 60)}%`,
        }}
      >
        <div className={`relative w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden ${event.soldOut ? 'grayscale' : ''}`}>
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${event.image}')` }} />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--color-primary)] rounded-full shadow-md" />

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-3 shadow-xl opacity-0 group-hover/pin:opacity-100 pointer-events-none transition-opacity z-10">
          <p className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{event.title}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{event.venue}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-bold text-[var(--color-primary)]">
              {event.free ? 'Free' : `$${event.price}`}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-0.5">
              <Star size={9} className="fill-amber-400 text-amber-400" /> {event.rating}
            </span>
          </div>
        </div>
      </motion.div>
    ))}

    {/* Center message */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center bg-[var(--bg-card)]/90 border border-[var(--border-primary)] rounded-2xl px-8 py-6 shadow-lg">
        <Map size={32} className="mx-auto mb-2 text-[var(--color-primary)]" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Interactive Map View</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">Hover over pins to preview events</p>
      </div>
    </div>
  </div>
);

// =============================================================================
// SIDEBAR FILTERS (Desktop)
// =============================================================================

const SidebarFilters: React.FC<{
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}> = ({ filters, setFilters }) => (
  <aside className="hidden lg:block w-[260px] flex-shrink-0 space-y-6" aria-label="Filters sidebar">
    {/* Sort By */}
    <div className="space-y-2.5">
      <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5"><ArrowUpDown size={12} /> Sort By</label>
      <div className="relative">
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as SortOption }))}
          aria-label="Sort events by"
          className="w-full bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg py-2.5 px-3 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none appearance-none cursor-pointer hover:bg-[var(--bg-surface)] transition-colors"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
      </div>
    </div>

    <hr className="border-[var(--border-primary)]" />

    {/* Date */}
    <div className="space-y-2.5">
      <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5"><Calendar size={12} /> Date</label>
      <div className="space-y-1.5">
        {DATE_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group py-0.5">
            <input
              type="radio"
              name="sidebar-date"
              checked={filters.dateRange === opt}
              onChange={() => setFilters((f) => ({ ...f, dateRange: opt }))}
              className="form-radio text-[var(--color-primary)] bg-transparent border-[var(--text-muted)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{opt}</span>
          </label>
        ))}
      </div>
    </div>

    <hr className="border-[var(--border-primary)]" />

    {/* Category */}
    <div className="space-y-2.5">
      <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5"><LayoutGrid size={12} /> Category</label>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {ALL_CATEGORIES.map((cat) => (
          <label key={cat} className="flex items-center gap-3 cursor-pointer group py-0.5">
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => setFilters((f) => ({
                ...f,
                categories: f.categories.includes(cat)
                  ? f.categories.filter((c) => c !== cat)
                  : [...f.categories, cat]
              }))}
              className="form-checkbox rounded text-[var(--color-primary)] bg-transparent border-[var(--text-muted)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{cat}</span>
          </label>
        ))}
      </div>
    </div>

    <hr className="border-[var(--border-primary)]" />

    {/* Price */}
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5"><Ticket size={12} /> Price Range</label>
        <span className="text-[11px] text-[var(--text-primary)] font-mono">${filters.priceRange[0]} – ${filters.priceRange[1]}</span>
      </div>
      <input
        type="range"
        min={0}
        max={500}
        value={filters.priceRange[1]}
        onChange={(e) => setFilters((f) => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
        className="w-full h-1.5 bg-[var(--border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
        aria-label="Maximum price"
      />
      <div className="flex justify-between text-[10px] text-[var(--text-muted)]"><span>Free</span><span>$500+</span></div>
    </div>

    <hr className="border-[var(--border-primary)]" />

    {/* Distance */}
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5"><Navigation size={12} /> Distance</label>
        <span className="text-[11px] text-[var(--text-primary)] font-mono">{filters.distance} km</span>
      </div>
      <input
        type="range"
        min={1}
        max={100}
        value={filters.distance}
        onChange={(e) => setFilters((f) => ({ ...f, distance: Number(e.target.value) }))}
        className="w-full h-1.5 bg-[var(--border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
        aria-label="Maximum distance"
      />
    </div>

    <hr className="border-[var(--border-primary)]" />

    {/* Event Type */}
    <div className="space-y-2.5">
      <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5"><Globe size={12} /> Event Type</label>
      <div className="flex bg-[var(--bg-surface)] rounded-lg p-1 border border-[var(--border-primary)]" role="radiogroup" aria-label="Event type">
        {(['all', 'offline', 'online'] as const).map((t) => (
          <button
            key={t}
            role="radio"
            aria-checked={filters.eventType === t}
            onClick={() => setFilters((f) => ({ ...f, eventType: t }))}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
              filters.eventType === t
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  </aside>
);

// =============================================================================
// MOBILE FILTERS DRAWER
// =============================================================================

const MobileFilterDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resultCount: number;
}> = ({ open, onClose, filters, setFilters, resultCount }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[200]"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-[var(--bg-base)] z-[201] overflow-y-auto p-6 shadow-2xl"
          role="dialog"
          aria-label="Filters"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filters
            </h2>
            <button onClick={onClose} aria-label="Close filters" className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Reuse sidebar content inline for mobile */}
          <div className="space-y-6">
            {/* Sort */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as SortOption }))}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg py-2.5 px-3 text-sm text-[var(--text-primary)] outline-none appearance-none"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <hr className="border-[var(--border-primary)]" />

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Category</label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => {
                  const active = filters.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilters((f) => ({
                        ...f,
                        categories: f.categories.includes(cat)
                          ? f.categories.filter((c) => c !== cat)
                          : [...f.categories, cat]
                      }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-primary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-[var(--border-primary)]" />

            {/* Price */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Price</label>
                <span className="text-[11px] text-[var(--text-primary)] font-mono">${filters.priceRange[0]}–${filters.priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                value={filters.priceRange[1]}
                onChange={(e) => setFilters((f) => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
                className="w-full h-1.5 bg-[var(--border-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
            </div>

            <hr className="border-[var(--border-primary)]" />

            {/* Event Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Event Type</label>
              <div className="flex bg-[var(--bg-surface)] rounded-lg p-1 border border-[var(--border-primary)]">
                {(['all', 'offline', 'online'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilters((f) => ({ ...f, eventType: t }))}
                    className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all capitalize ${
                      filters.eventType === t
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Apply */}
          <div className="mt-8 sticky bottom-0 bg-[var(--bg-base)] pt-4 pb-2 border-t border-[var(--border-primary)]">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-cyan-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              Show {resultCount} Results
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const EventsPage: React.FC = () => {
  // ── State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set(['3']));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    dateRange: 'Any Date',
    priceRange: [0, 500],
    distance: 25,
    eventType: 'all',
    sortBy: 'relevance',
  });

  const ITEMS_PER_PAGE = 6;

  // ── Derived / Filtered Data ──
  const filteredEvents = useMemo(() => {
    let results = [...MOCK_EVENTS];

    // Text search
    if (appliedSearch) {
      const q = appliedSearch.toLowerCase();
      results = results.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.location.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter((e) => filters.categories.includes(e.category));
    }

    // Price filter
    results = results.filter((e) => e.price >= filters.priceRange[0] && e.price <= filters.priceRange[1]);

    // Event type
    if (filters.eventType === 'online') results = results.filter((e) => e.online);
    if (filters.eventType === 'offline') results = results.filter((e) => !e.online);

    // Sort
    switch (filters.sortBy) {
      case 'price-asc': results.sort((a, b) => a.price - b.price); break;
      case 'price-desc': results.sort((a, b) => b.price - a.price); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
      case 'popular': results.sort((a, b) => b.attendees - a.attendees); break;
      default: break;
    }

    return results;
  }, [appliedSearch, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── Handlers ──
  const handleSearch = useCallback(() => {
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  }, [searchQuery]);

  const toggleSave = useCallback((id: string) => {
    setSavedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat]
    }));
    setCurrentPage(1);
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({
      categories: [],
      dateRange: 'Any Date',
      priceRange: [0, 500],
      distance: 25,
      eventType: 'all',
      sortBy: 'relevance',
    });
    setAppliedSearch('');
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // ── Keyboard nav (J/K through cards) ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'g') setViewMode('grid');
      if (e.key === 'l') setViewMode('list');
      if (e.key === 'm') setViewMode('map');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Render ──
  return (
    <div className="bg-[var(--bg-base)] font-sans text-[var(--text-primary)] min-h-screen flex flex-col transition-colors duration-300">
      {/* ═══ HERO SEARCH SECTION ═══ */}
      <section className="relative bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-base)] to-[var(--bg-surface)] border-b border-[var(--border-primary)] pt-10 pb-8 px-4 lg:px-8 overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        <div className="max-w-[1440px] mx-auto w-full relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                  Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Events</span>
                </h1>
                <p className="text-[var(--text-muted)] text-sm mt-1.5">
                  Find concerts, festivals, workshops, and more in your city.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--text-muted)]">View:</span>
                {([
                  { mode: 'grid' as ViewMode, icon: <Grid3X3 size={16} />, label: 'Grid view (G)' },
                  { mode: 'list' as ViewMode, icon: <List size={16} />, label: 'List view (L)' },
                  { mode: 'map' as ViewMode, icon: <Map size={16} />, label: 'Map view (M)' },
                ]).map(({ mode, icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-label={label}
                    aria-pressed={viewMode === mode}
                    className={`p-2 rounded-lg border transition-all ${
                      viewMode === mode
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Search bar */}
            <SearchAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
            />

            {/* Filter chips */}
            <FilterChipsBar
              filters={filters}
              onToggleCategory={toggleCategory}
              onSetDate={(d) => { setFilters((f) => ({ ...f, dateRange: d })); setCurrentPage(1); }}
              onClearAll={handleClearAll}
            />
          </motion.div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-grow w-full flex flex-col" role="main">
        <div className="flex-grow px-4 lg:px-8 py-8 w-full max-w-[1440px] mx-auto flex gap-8">
          {/* ── Sidebar ── */}
          <SidebarFilters filters={filters} setFilters={setFilters} />

          {/* ── Results Area ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter trigger + result count */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  aria-label="Open filters"
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--color-primary)] px-3 py-2 rounded-lg transition-colors"
                >
                  <Filter size={16} /> Filters
                </button>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                {filteredEvents.length === 0 ? (
                  'No events found'
                ) : (
                  <>
                    Showing <span className="text-[var(--text-primary)] font-bold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
                    {appliedSearch && <> for "<span className="text-[var(--color-primary)] font-medium">{appliedSearch}</span>"</>}
                  </>
                )}
              </p>
            </div>

            {/* ── MAP VIEW ── */}
            {viewMode === 'map' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <MapViewPlaceholder events={filteredEvents} />
                <p className="text-center text-xs text-[var(--text-muted)] mt-3">
                  Showing {Math.min(filteredEvents.length, 8)} of {filteredEvents.length} event pins
                </p>
              </motion.div>
            )}

            {/* ── GRID / LIST VIEW ── */}
            {viewMode !== 'map' && (
              <>
                {/* Empty State */}
                {filteredEvents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <Search size={48} className="text-[var(--border-primary)] mb-4" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No events found</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-6 max-w-sm">
                      Try adjusting your filters or search query to find what you&apos;re looking for.
                    </p>
                    <button
                      onClick={handleClearAll}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-cyan-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'flex flex-col gap-5'
                    }
                  >
                    {paginatedEvents.map((event, i) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        index={i}
                        viewMode={viewMode}
                        isExpanded={expandedCard === event.id}
                        onToggleExpand={() => setExpandedCard((prev) => (prev === event.id ? null : event.id))}
                        isSaved={savedEvents.has(event.id)}
                        onToggleSave={() => toggleSave(event.id)}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Pagination */}
                {filteredEvents.length > ITEMS_PER_PAGE && (
                  <nav className="mt-10 flex justify-center" aria-label="Pagination">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="size-10 flex items-center justify-center rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          aria-label={`Page ${p}`}
                          aria-current={currentPage === p ? 'page' : undefined}
                          className={`size-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                            currentPage === p
                              ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--shadow-primary)]'
                              : 'border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="size-10 flex items-center justify-center rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* ═══ MOBILE FILTER DRAWER ═══ */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        resultCount={filteredEvents.length}
      />
    </div>
  );
};

export default EventsPage;