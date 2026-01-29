'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';

// ==========================================
// ICON IMPORTS (Standardized @mui/icons-material)
// ==========================================
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CelebrationIcon from '@mui/icons-material/Celebration';
import RouteIcon from '@mui/icons-material/Route';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExploreIcon from '@mui/icons-material/Explore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import StarsIcon from '@mui/icons-material/Stars';
import GroupsIcon from '@mui/icons-material/Groups';
import CategoryIcon from '@mui/icons-material/Category';
import SendIcon from '@mui/icons-material/Send';
import LockIcon from '@mui/icons-material/Lock';
import ComputerIcon from '@mui/icons-material/Computer';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PaletteIcon from '@mui/icons-material/Palette';
import SchoolIcon from '@mui/icons-material/School';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

// ==========================================
// 1. HERO SECTION & COMPONENTS
// ==========================================

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'venues'>('events');

  return (
    <section className="relative h-[90vh] w-full lg:h-screen">
      {/* Background Image with Transparent Black Blur Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/1578317/pexels-photo-1578317.jpeg"
          alt="Event crowd background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Transparent Black Overlay - Adjusted for readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)] opacity-20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-[var(--brand-primary-dark)] opacity-20 blur-[120px] rounded-full animate-pulse" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }} 
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-48 text-center">
        <div className="mb-4 animate-slideUp">
          <span className="badge badge-primary px-4 py-2 text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2 border border-white/10 backdrop-blur-md">
            <AutoAwesomeIcon fontSize="small" />
            Next-Gen Event Platform
          </span>
        </div>
        <h1 className="animate-slideUp font-heading text-2xl font-semibold tracking-wide md:text-3xl text-balance text-gray-200 drop-shadow-md">
          Experience Events Like Never Before
        </h1>
        <h2 className="animate-slideUp-delay-1 mb-6 font-heading text-5xl font-bold uppercase tracking-wider md:text-7xl lg:text-8xl text-balance drop-shadow-2xl">
          <span className="text-white">Flow</span>
          <span className="text-gradient bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--brand-primary-dark)] bg-clip-text text-transparent">Gate</span>
          <span className="text-white">X</span>
        </h2>
        <p className="animate-slideUp-delay-2 font-primary text-lg font-light tracking-wide text-gray-300 md:text-xl max-w-2xl drop-shadow-lg">
          Discover, book, and manage events with IoT-powered smart access, real-time analytics, and seamless experiences
        </p>
        
        {/* CTA Buttons */}
        <div className="animate-slideUp-delay-3 mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/events" className="btn-primary flex items-center gap-2 px-8 py-3 group shadow-lg shadow-[var(--primary)]/30">
            <ExploreIcon className="text-xl group-hover:rotate-12 transition-transform" />
            Explore Events
          </Link>
          <Link href="/register" className="btn-outline flex items-center gap-2 px-8 py-3 group border-white text-white hover:bg-white hover:text-black hover:border-white">
            <PersonAddIcon className="text-xl group-hover:scale-110 transition-transform" />
            Get Started
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="animate-slideUp-delay-3 mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400">
          <div className="flex items-center gap-2">
            <VerifiedIcon className="text-[var(--success)]" fontSize="small" />
            <span className="text-sm">Trusted by 10K+ Organizers</span>
          </div>
          <div className="flex items-center gap-2">
            <StarIcon className="text-[var(--warning)]" fontSize="small" />
            <span className="text-sm">4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <SecurityIcon className="text-[var(--primary)]" fontSize="small" />
            <span className="text-sm">Secure Payments</span>
          </div>
        </div>
      </div>

      {/* Search Card - Plain White Background */}
      <div className="absolute bottom-0 left-1/2 w-full max-w-5xl -translate-x-1/2 translate-y-1/2 px-4 z-20">
        <div className="card p-6 shadow-2xl md:p-8 border border-gray-200 animate-slideUp bg-white rounded-2xl">
          
          {/* Tabs */}
          <div className="mb-6 flex gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('events')}
              className={clsx(
                'flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-all duration-300',
                activeTab === 'events'
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              )}
            >
              <CelebrationIcon fontSize="small" />
              Find Events
            </button>
            <button
              onClick={() => setActiveTab('venues')}
              className={clsx(
                'flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-all duration-300',
                activeTab === 'venues'
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              )}
            >
              <LocationOnIcon fontSize="small" />
              Find Venues
            </button>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Location */}
            <div className="relative group">
              <label className="label text-xs font-semibold text-gray-600 mb-1 block">Location</label>
              <div className="relative">
                <input
                  type="text"
                  className="input pl-10 w-full bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[var(--primary)] focus:bg-white transition-colors"
                  placeholder="Search city or venue..."
                />
                <LocationOnIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
              </div>
            </div>

            {/* Category */}
            <div className="relative">
              <label className="label text-xs font-semibold text-gray-600 mb-1 block">Category</label>
              <div className="relative">
                <select className="input appearance-none cursor-pointer pr-10 w-full bg-gray-50 border-gray-200 text-gray-800 focus:border-[var(--primary)] focus:bg-white transition-colors">
                  <option>All Categories</option>
                  <option>Concerts & Music</option>
                  <option>Conferences & Tech</option>
                  <option>Sports & Fitness</option>
                  <option>Workshops & Classes</option>
                  <option>Food & Drinks</option>
                  <option>Arts & Culture</option>
                </select>
                <ExpandMoreIcon className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Date */}
            <div className="relative">
              <label className="label text-xs font-semibold text-gray-600 mb-1 block">Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="input pl-10 w-full bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[var(--primary)] focus:bg-white transition-colors"
                  placeholder="Select date range"
                />
                <CalendarTodayIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-shadow">
                <SearchIcon />
                Search
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Popular: </span>
            {['This Weekend', 'Free Events', 'Online', 'Near Me'].map((filter) => (
              <button
                key={filter}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 2. FEATURED EVENTS SECTION & COMPONENTS
// ==========================================

interface EventCardProps {
  title: string;
  category: string;
  date: string;
  location: string;
  price: string;
  attendees: number;
  featured?: boolean;
  image?: string;
  categoryIcon?: React.ElementType;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  category,
  date,
  location,
  price,
  attendees,
  featured = false,
  image,
  categoryIcon: CategoryIconComp = ConfirmationNumberIcon,
}) => {
  return (
    <div className={clsx(
      "card card-hover flex flex-col bg-[var(--bg-card)] cursor-pointer group overflow-hidden transition-all duration-300 hover:-translate-y-2",
      featured && "ring-2 ring-[var(--primary)] shadow-lg shadow-[var(--primary)]/10"
    )}>
      {/* Image Area */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
             <CategoryIconComp className="text-6xl text-[var(--text-muted)] opacity-50" />
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-primary flex items-center gap-1">
             <CategoryIconComp style={{ fontSize: 14 }} />
            {category}
          </span>
        </div>
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="badge badge-warning flex items-center gap-1">
              <StarIcon className="text-xs" fontSize="small" />
              Featured
            </span>
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button className="btn-primary w-full py-2 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            View Details
          </button>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-3 space-y-2 flex-grow">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <CalendarTodayIcon className="text-[var(--primary)]" fontSize="small" />
            {date}
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <LocationOnIcon className="text-[var(--accent)]" fontSize="small" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
             <GroupsIcon className="text-[var(--success)]" fontSize="small" />
            {attendees.toLocaleString()} attending
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-[var(--border-primary)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Starting from</p>
            <p className="font-heading text-xl font-bold text-[var(--primary)]">{price}</p>
          </div>
          <button className="btn-outline py-2 px-4 text-sm group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-[var(--primary)] transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated with Unsplash Images
const featuredEvents = [
  { 
    title: 'Tech Summit 2026', 
    category: 'Conference', 
    date: 'Feb 15, 2026', 
    location: 'San Francisco, CA', 
    price: '$299', 
    attendees: 2500, 
    featured: true,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    categoryIcon: ComputerIcon
  },
  { 
    title: 'Electronic Music Festival', 
    category: 'Concert', 
    date: 'Mar 20, 2026', 
    location: 'Miami, FL', 
    price: '$149', 
    attendees: 15000,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
    categoryIcon: MusicNoteIcon
  },
  { 
    title: 'Startup Pitch Competition', 
    category: 'Workshop', 
    date: 'Feb 28, 2026', 
    location: 'New York, NY', 
    price: '$49', 
    attendees: 500,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
    categoryIcon: LightbulbIcon
  },
  { 
    title: 'Gaming Championship Finals', 
    category: 'Sports', 
    date: 'Apr 5, 2026', 
    location: 'Los Angeles, CA', 
    price: '$79', 
    attendees: 8000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    categoryIcon: SportsEsportsIcon
  },
  { 
    title: 'AI & Machine Learning Expo', 
    category: 'Conference', 
    date: 'Mar 10, 2026', 
    location: 'Seattle, WA', 
    price: '$199', 
    attendees: 3000,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    categoryIcon: PsychologyIcon
  },
  { 
    title: 'Comedy Night Live', 
    category: 'Entertainment', 
    date: 'Feb 22, 2026', 
    location: 'Chicago, IL', 
    price: '$35', 
    attendees: 800,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca',
    categoryIcon: TheaterComedyIcon
  },
];

const FeaturedEventsSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-40 pb-16 md:px-12">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge badge-primary mb-3 inline-flex items-center gap-1">
            <LocalFireDepartmentIcon fontSize="small" />
            Trending Now
          </span>
          <h2 className="font-heading text-4xl font-bold text-[var(--text-primary)]">
            Featured Events
          </h2>
          <p className="mt-2 text-[var(--text-muted)] max-w-xl">
            Discover the most popular events happening near you. Book your spot before they sell out!
          </p>
        </div>
        <Link href="/events" className="btn btn-outline flex items-center gap-2 group">
          <span>View All Events</span>
          <ArrowForwardIcon className="text-lg group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-10 text-center">
        <button className="btn-outline px-8 py-3 inline-flex items-center gap-2">
          <RefreshIcon />
          Load More Events
        </button>
      </div>
    </section>
  );
};


// ==========================================
// 3. PLAN PERFECT TRIP SECTION (HOW IT WORKS)
// ==========================================

const tripSteps = [
  {
    icon: SearchIcon,
    title: 'Discover Events',
    description: 'Browse thousands of events by category, location, or date. Find exactly what you\'re looking for.',
    gradient: 'from-blue-500 to-cyan-400',
    shadow: 'shadow-blue-500/20'
  },
  {
    icon: ConfirmationNumberIcon,
    title: 'Book Tickets',
    description: 'Secure your spot with our fast, secure checkout. Multiple payment options available.',
    gradient: 'from-purple-500 to-pink-400',
    shadow: 'shadow-purple-500/20'
  },
  {
    icon: QrCode2Icon,
    title: 'Get QR Pass',
    description: 'Receive your digital ticket with a unique QR code for instant, contactless entry.',
    gradient: 'from-emerald-500 to-green-400',
    shadow: 'shadow-emerald-500/20'
  },
  {
    icon: CelebrationIcon,
    title: 'Enjoy the Event',
    description: 'Skip the lines with smart IoT-powered access. Have an amazing experience!',
    gradient: 'from-orange-500 to-red-400',
    shadow: 'shadow-orange-500/20'
  }
];

const CurvedConnector = () => (
  <div className="absolute top-1/2 left-0 hidden w-full -translate-y-1/2 px-12 lg:block pointer-events-none -z-10 opacity-30">
    <svg
      width="100%"
      height="100"
      viewBox="0 0 1200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 50 C 300 20, 300 80, 600 50 S 900 20, 1200 50"
        stroke="url(#gradient-line)"
        strokeWidth="2"
        strokeDasharray="12 12"
        className="animate-dash"
      />
      <defs>
        <linearGradient id="gradient-line" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--text-muted)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--text-muted)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const PlanPerfectTripSection = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-12">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-20 h-96 w-96 rounded-full bg-[var(--primary)] opacity-5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-20 h-96 w-96 rounded-full bg-purple-600 opacity-5 blur-3xl" />

      {/* Section Header */}
      <div className="flex justify-center mb-20">
        <div className="text-center max-w-3xl relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50 backdrop-blur-md mb-6 shadow-sm">
                <RouteIcon className="text-[var(--primary)] text-sm" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">How It Works</span>
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 drop-shadow-sm">
                Plan Your Perfect <span className="text-gradient">Event Experience</span>
            </h2>
            
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                From discovery to entry, FlowGateX makes attending events seamless, secure, and enjoyable through our 4-step process.
            </p>
        </div>
      </div>

      {/* Steps Container */}
      <div className="relative">
        <CurvedConnector />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tripSteps.map((step, index) => (
            <div key={index} className="group relative flex flex-col items-center text-center">
              <div className={clsx(
                  "relative z-10 flex h-full w-full flex-col items-center rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-8 shadow-xl transition-all duration-300",
                  "hover:-translate-y-2 hover:shadow-2xl hover:border-[var(--primary)]/30"
              )}>
                <div className="absolute -top-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] font-mono text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md z-20 group-hover:scale-110 group-hover:border-[var(--primary)] transition-all duration-300">
                  0{index + 1}
                </div>

                <div className={clsx(
                  "mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110",
                  step.gradient,
                  step.shadow
                )}>
                  <step.icon className="text-white text-4xl" />
                </div>

                <h3 className="mb-3 font-heading text-xl font-bold text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 4. FEATURES SECTION & COMPONENTS
// ==========================================

const FEATURES = [
  { 
    icon: QrCodeScannerIcon, 
    title: 'Smart QR Access', 
    description: 'Contactless check-in with IoT-powered QR codes for seamless entry management',
    color: 'from-red-500 to-orange-500'
  },
  { 
    icon: AnalyticsIcon, 
    title: 'Real-time Analytics', 
    description: 'Track attendance, engagement, and revenue with live dashboards and insights',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    icon: DevicesIcon, 
    title: 'IoT Integration', 
    description: 'Connect smart devices for crowd monitoring, access control, and automation',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    icon: SecurityIcon, 
    title: 'Secure Payments', 
    description: 'End-to-end encrypted transactions with Razorpay & Stripe integration',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    icon: PeopleIcon, 
    title: 'Crowd Monitoring', 
    description: 'Live occupancy tracking with heatmaps and capacity alerts for safety',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    icon: SmartToyIcon, 
    title: 'AI Assistant', 
    description: 'Intelligent chatbot for instant support and personalized recommendations',
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    icon: EventSeatIcon, 
    title: 'Seat Selection', 
    description: 'Interactive seat maps for precise seat selection and booking',
    color: 'from-teal-500 to-cyan-500'
  },
  { 
    icon: NotificationsActiveIcon, 
    title: 'Smart Alerts', 
    description: 'Real-time notifications for event updates, reminders, and changes',
    color: 'from-pink-500 to-rose-500'
  },
];

const STATS = [
  { value: '50K+', label: 'Events Hosted', icon: CelebrationIcon },
  { value: '2M+', label: 'Tickets Sold', icon: ConfirmationNumberIcon },
  { value: '10K+', label: 'Organizers', icon: GroupsIcon },
  { value: '99.9%', label: 'Uptime', icon: VerifiedIcon },
];

const FeaturesSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <div className="text-center mb-16">
        <span className="badge badge-primary mb-4 inline-flex items-center gap-1">
          <StarsIcon fontSize="small" />
          Why Choose Us
        </span>
        <h2 className="font-heading text-4xl font-bold text-[var(--text-primary)] mb-4">
          Powerful Features for Modern Events
        </h2>
        <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
          Everything you need to create, manage, and scale successful events with cutting-edge technology
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
        {FEATURES.map((feature, index) => (
          <div 
            key={index} 
            className="card p-6 bg-[var(--bg-card)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group border border-[var(--border-primary)]"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg`}>
              <feature.icon className="text-2xl text-white" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary)] transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-8 md:p-12 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-tertiary)] border border-[var(--border-primary)] relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--primary)] opacity-5 blur-3xl rounded-full" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[var(--accent)] opacity-5 blur-3xl rounded-full" />
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--primary)]/20 group-hover:scale-110 transition-all">
                <stat.icon className="text-xl text-[var(--primary)]" />
              </div>
              <p className="font-heading text-3xl md:text-4xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. CATEGORIES SECTION
// ==========================================

const categories = [
  { name: 'Concerts & Music', icon: MusicNoteIcon, count: '2,500+', color: 'from-pink-500 to-rose-500' },
  { name: 'Tech Conferences', icon: ComputerIcon, count: '1,200+', color: 'from-blue-500 to-cyan-500' },
  { name: 'Sports & Fitness', icon: SportsSoccerIcon, count: '3,100+', color: 'from-green-500 to-emerald-500' },
  { name: 'Food & Drinks', icon: RestaurantIcon, count: '1,800+', color: 'from-orange-500 to-amber-500' },
  { name: 'Arts & Culture', icon: PaletteIcon, count: '950+', color: 'from-purple-500 to-violet-500' },
  { name: 'Workshops', icon: SchoolIcon, count: '2,000+', color: 'from-teal-500 to-cyan-500' },
];

const TravelSections = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <div className="text-center mb-12">
        <span className="badge badge-primary mb-4 inline-flex items-center gap-1">
          <CategoryIcon fontSize="small" />
          Browse Categories
        </span>
        <h2 className="font-heading text-4xl font-bold text-[var(--text-primary)] mb-4">
          Find Events by Category
        </h2>
        <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
          Explore events across various categories and find your next unforgettable experience
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/events?category=${category.name}`}
            className="group relative overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
              <category.icon className="text-2xl text-white" />
            </div>
            <h3 className="font-heading text-sm font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--primary)] transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">{category.count} events</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ==========================================
// 6. REVIEW SECTION & COMPONENTS
// ==========================================

export interface ReviewData {
  id: number;
  title: string;
  description: string;
  rating: number;
  reviewerName: string;
  reviewerContext: string;
  imageSrc: string;
  avatar: string;
}

const ReviewCard = ({ data }: { data: ReviewData }) => {
  return (
    <div className="group relative w-full min-w-[360px] max-w-[400px] flex-shrink-0 pt-3 pl-3 md:min-w-[400px]">
      {/* Decorative Background Layer (Stacked Effect) */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border-primary)] transform translate-x-2 translate-y-2 transition-transform duration-300 ease-out group-hover:translate-x-4 group-hover:translate-y-4 group-hover:rotate-1" />

      {/* Main Card Content */}
      <div className="relative h-full flex flex-col justify-between rounded-[2rem] bg-[var(--bg-card)] p-6 shadow-xl shadow-black/5 border border-[var(--border-primary)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Subtle top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--brand-primary-dark)] opacity-80" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header: Quote & Rating */}
          <div className="flex justify-between items-start mb-4">
            <FormatQuoteIcon className="text-5xl text-[var(--primary)]/10 transform -translate-x-2 -translate-y-2" />
            <div className="flex gap-0.5 bg-[var(--bg-tertiary)]/50 px-2 py-1 rounded-full border border-[var(--border-primary)]">
              {[...Array(5)].map((_, i) => (
                i < data.rating ? (
                  <StarIcon key={i} className="text-yellow-400 text-[16px] drop-shadow-sm" />
                ) : (
                  <StarBorderIcon key={i} className="text-[var(--text-muted)] text-[16px]" />
                )
              ))}
            </div>
          </div>
          
          {/* Review Text */}
          <div className="mb-6 flex-grow">
            <h3 className="mb-2 font-heading text-lg font-bold leading-tight text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
              &ldquo;{data.title}&rdquo;
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3">
              {data.description}
            </p>
          </div>

          {/* Footer: User & Image */}
          <div className="mt-auto space-y-5">
            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)]/50">
              <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-sm">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[var(--bg-card)]">
                  <Image 
                    src={data.avatar} 
                    alt={data.reviewerName} 
                    fill 
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm text-[var(--text-primary)] truncate">{data.reviewerName}</p>
                  <VerifiedIcon className="text-[var(--success)] text-[14px]" />
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate">{data.reviewerContext}</p>
              </div>
            </div>

            {/* Event Snapshot */}
            <div className="relative h-36 w-full overflow-hidden rounded-2xl group-hover:shadow-md transition-all border border-[var(--border-primary)]/50">
              <Image
                src={data.imageSrc}
                alt={`Experience at ${data.reviewerContext}`}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                sizes="(max-width: 400px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <span className="text-[10px] font-medium text-white/90 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                  Verified Visit
                </span>
                <span className="material-icons-outlined text-white/80 text-sm">photo_camera</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Data with Unsplash Images
const REVIEWS: ReviewData[] = [
  {
    id: 1,
    title: 'Seamless entry with QR codes!',
    description: 'The IoT-powered access control made entering the venue a breeze. No more waiting in long queues. Highly recommended for all event organizers looking to modernize!',
    rating: 5,
    reviewerName: 'Sarah Chen',
    reviewerContext: 'Tech Summit 2025',
    imageSrc: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    title: 'Best event management platform',
    description: 'As an organizer, FlowGateX gave me real-time insights into crowd flow and ticket sales. The analytics dashboard is incredibly powerful and easy to use.',
    rating: 5,
    reviewerName: 'Michael Rodriguez',
    reviewerContext: 'Summer Music Fest',
    imageSrc: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 3,
    title: 'Revolutionary crowd monitoring',
    description: 'The heatmaps and capacity alerts helped us manage safety protocols effectively. FlowGateX is a game-changer for large-scale arena events.',
    rating: 4,
    reviewerName: 'Emily Watson',
    reviewerContext: 'Arena Plus Manager',
    imageSrc: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 4,
    title: 'Smooth payment integration',
    description: 'Setting up Razorpay and Stripe was incredibly easy. Our attendees loved the multiple payment options available at checkout. Zero transaction failures.',
    rating: 5,
    reviewerName: 'David Kim',
    reviewerContext: 'Global FinTech Conf',
    imageSrc: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  },
];

const ReviewSection = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 md:px-12 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-[var(--primary)] opacity-5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-[var(--accent)] opacity-5 blur-[100px]" />

      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] mb-4 w-fit">
            <StarIcon className="text-[var(--warning)] text-sm" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Testimonials</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
            Trusted by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Best</span>
          </h2>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed">
            Discover why thousands of event organizers and attendees trust FlowGateX for their most important moments.
          </p>
        </div>
        
        <Link
          href="/reviews"
          className="btn-outline px-6 py-3 flex items-center gap-2 group whitespace-nowrap backdrop-blur-sm"
        >
          <span>See All Reviews</span>
          <ArrowForwardIcon className="text-lg group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Snap scrolling for better mobile experience */}
      <div className="no-scrollbar flex gap-8 overflow-x-auto pb-12 pt-4 -mx-6 px-6 snap-x snap-mandatory">
        {REVIEWS.map((review) => (
          <div key={review.id} className="snap-center">
            <ReviewCard data={review} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ==========================================
// 7. NEWSLETTER SECTION
// ==========================================

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-tertiary)] to-[var(--bg-card)] px-6 py-12 shadow-2xl sm:px-12 sm:py-20 border border-[var(--border-primary)]">
        {/* Background Decorative Elements */}
        <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-[var(--primary)] opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[var(--accent)] opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[var(--brand-primary-dark)] opacity-5 blur-[100px]"></div>

        {/* Floating Icons */}
        <div className="absolute top-10 left-10 opacity-20 animate-bounce">
          <CelebrationIcon className="text-4xl text-[var(--primary)]" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <ConfirmationNumberIcon className="text-4xl text-[var(--accent)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <span className="badge badge-primary mb-4 inline-flex items-center gap-1">
            <MailOutlineIcon fontSize="small" />
            Stay Updated
          </span>
          
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Subscribe to <span className="text-gradient bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">FlowGateX</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mb-8">
            Get exclusive updates on upcoming events, early bird discounts, and insider tips delivered straight to your inbox.
          </p>
          
          <div className="w-full max-w-lg">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-grow">
                <MailOutlineIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="input py-3 pl-12 w-full bg-[var(--bg-primary)] border-[var(--border-primary)] focus:border-[var(--primary)] transition-colors"
                />
              </div>
              <button className="btn-primary whitespace-nowrap px-8 py-3 shadow-lg hover:shadow-[var(--primary)]/25 transition-shadow flex items-center gap-2">
                <span>Subscribe</span>
                <SendIcon fontSize="small" />
              </button>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4">
              <LockIcon fontSize="inherit" className="align-middle mr-1" />
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 9. MAIN PAGE COMPONENT
// ==========================================

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--primary)] selection:text-white">
      <HeroSection />
      
      {/* Container for content sections with background effect */}
      <div className="relative z-0 space-y-8">
        {/* Subtle Gradient Background Effect */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--primary)]/5 via-[var(--bg-primary)] to-[var(--bg-primary)]" />
        
        <FeaturedEventsSection />
        <PlanPerfectTripSection />
        <FeaturesSection />
        <TravelSections />
        <ReviewSection />
        <NewsletterSection />
      </div>
    </main>
  );
}