import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, Globe, ShieldCheck, Users, Sparkles,
  ChevronDown, ChevronUp, Share2, Download, Linkedin,
  Twitter, MapPin, Star, Quote, ChevronLeft,
  ChevronRight, Rocket, Target, Eye, Heart, Zap, Award,
  TrendingUp, Clock, Check
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface TeamMember {
  name: string;
  role: string;
  img: string;
  bio: string;
  funFact: string;
  linkedin: string;
  twitter: string;
  gradient: string;
  color: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface StatData {
  label: string;
  end: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const expandCard = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// =============================================================================
// DATA — Stats, Team, Timeline, Testimonials, Gallery
// =============================================================================

const STATS: StatData[] = [
  { label: 'Tickets Sold', end: 1000000, suffix: '+', icon: <Award size={20} />, color: 'from-amber-500 to-orange-500' },
  { label: 'Global Cities', end: 500, suffix: '+', icon: <Globe size={20} />, color: 'from-[var(--color-primary)] to-cyan-400' },
  { label: 'Organizers', end: 10000, suffix: '+', icon: <Users size={20} />, color: 'from-[var(--color-secondary)] to-emerald-400' },
  { label: 'User Trust', end: 49, suffix: '/5', icon: <Star size={20} />, color: 'from-violet-500 to-purple-500' },
];

const PILLARS = [
  {
    icon: <Sparkles size={28} />,
    title: 'Smart Discovery',
    description: 'Our neural discovery engine learns your taste patterns to recommend local gems before they trend. Powered by ML models trained on millions of preferences.',
    features: ['AI Recommendations', 'Taste Profiling', 'Trend Prediction'],
    gradient: 'from-[var(--color-primary)] to-blue-600',
    shadow: 'shadow-[var(--color-primary)]/20',
  },
  {
    icon: <ShieldCheck size={28} />,
    title: 'Immutable Security',
    description: 'Encrypted digital ticketing powered by next-gen blockchain protocols, making scalping a thing of the past. Every ticket is unique and verifiable.',
    features: ['Blockchain Tickets', 'Anti-Scalp Tech', 'Identity Verification'],
    gradient: 'from-[var(--color-secondary)] to-emerald-600',
    shadow: 'shadow-[var(--color-secondary)]/20',
  },
  {
    icon: <Users size={28} />,
    title: 'Hyper Community',
    description: 'Direct-to-fan engagement tools that allow creators to build sustainable ecosystems around their events with real-time analytics and communication.',
    features: ['Fan Engagement', 'Creator Tools', 'Real-time Analytics'],
    gradient: 'from-cyan-400 to-[var(--color-primary)]',
    shadow: 'shadow-cyan-400/20',
  },
];

const TEAM: TeamMember[] = [
  {
    name: 'Alex Rivera',
    role: 'Founder & CEO',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop',
    bio: 'Former Spotify exec with 12+ years in event tech. Built ticketing systems for over 200 major festivals. Passionate about connecting people through live experiences.',
    funFact: 'Has attended 500+ live events in 30 countries.',
    linkedin: '#',
    twitter: '#',
    gradient: 'from-[var(--color-primary)] to-blue-600',
    color: 'text-[var(--color-primary)]',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
    bio: 'Ex-Google engineer, ML specialist. Architected systems handling 10M+ concurrent users. Leads our 40-person engineering team across 3 continents.',
    funFact: 'Holds 4 patents in distributed event processing.',
    linkedin: '#',
    twitter: '#',
    gradient: 'from-[var(--color-secondary)] to-emerald-600',
    color: 'text-[var(--color-secondary)]',
  },
  {
    name: 'Marcus Thorne',
    role: 'Head of Product',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop',
    bio: 'Product leader from Airbnb Experiences. Obsessed with turning complex workflows into delightful user journeys. Launched 20+ products reaching 50M users.',
    funFact: 'Sketches all product concepts by hand before digital.',
    linkedin: '#',
    twitter: '#',
    gradient: 'from-violet-500 to-[var(--color-primary)]',
    color: 'text-[var(--color-primary)]',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Community Director',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop',
    bio: 'Community strategist from Discord. Built communities of 2M+ members. Drives ambassador programs, creator workshops, and our global event partnerships.',
    funFact: 'Fluent in 5 languages and loves salsa dancing.',
    linkedin: '#',
    twitter: '#',
    gradient: 'from-rose-500 to-pink-600',
    color: 'text-[var(--color-secondary)]',
  },
];

const TIMELINE: TimelineEvent[] = [
  { year: '2022', title: 'The Spark', description: 'Founded in a Brooklyn co-working space with a vision to fix event discovery.', icon: <Rocket size={18} />, color: 'from-[var(--color-primary)] to-cyan-400' },
  { year: '2023', title: 'First 100K Users', description: 'Launched MVP, onboarded 100K users and 500 organizers in 6 months.', icon: <TrendingUp size={18} />, color: 'from-[var(--color-secondary)] to-emerald-400' },
  { year: '2024', title: 'Series A & Global', description: '$15M funding. Expanded to 50 countries with blockchain ticketing.', icon: <Globe size={18} />, color: 'from-violet-500 to-purple-500' },
  { year: '2025', title: 'AI Discovery', description: 'Launched AI-powered recommendation engine. 1M+ tickets sold.', icon: <Sparkles size={18} />, color: 'from-amber-500 to-orange-500' },
  { year: '2026', title: 'The Future', description: 'AR/VR event previews, IoT venue analytics, and 500+ cities.', icon: <Eye size={18} />, color: 'from-rose-500 to-pink-500' },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Jamie Patel',
    role: 'Festival Director',
    company: 'SoundWave Fest',
    avatar: 'https://i.pravatar.cc/80?img=11',
    quote: 'FlowGateX transformed how we run festivals. Ticket fraud dropped to zero, and our attendee satisfaction jumped 40%. The analytics dashboard alone is worth it.',
    rating: 5,
  },
  {
    name: 'Mia Tanaka',
    role: 'Event Producer',
    company: 'NiteLife Events',
    avatar: 'https://i.pravatar.cc/80?img=32',
    quote: 'The AI recommendations brought us 35% more first-time attendees. No other platform understands the nightlife community like FlowGateX does.',
    rating: 5,
  },
  {
    name: 'David Okoro',
    role: 'Tech Conference Organizer',
    company: 'TechForward Inc.',
    avatar: 'https://i.pravatar.cc/80?img=53',
    quote: 'Managing a 5,000-person conference used to be a nightmare. With FlowGateX, check-in takes seconds, and real-time analytics help us make decisions on the fly.',
    rating: 5,
  },
  {
    name: 'Ana Morales',
    role: 'Community Manager',
    company: 'ArtCollective NYC',
    avatar: 'https://i.pravatar.cc/80?img=44',
    quote: 'As a small arts nonprofit, the free-tier tools gave us everything we needed. Our gallery openings went from 50 to 300 attendees in three months.',
    rating: 5,
  },
];

const GALLERY_EVENTS = [
  { title: 'Neon Nights NYC', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800', attendees: '15K+' },
  { title: 'ArtTech Expo', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800', attendees: '8K+' },
  { title: 'Summer Fest', img: 'https://images.unsplash.com/photo-1459749411177-287ce3288789?q=80&w=800', attendees: '30K+' },
  { title: 'Jazz Under Stars', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800', attendees: '5K+' },
  { title: 'Food & Wine Gala', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', attendees: '12K+' },
  { title: 'Startup Summit', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800', attendees: '3K+' },
];

const GLOBAL_CITIES = [
  { name: 'New York', x: '23%', y: '35%' },
  { name: 'London', x: '47%', y: '25%' },
  { name: 'Tokyo', x: '82%', y: '35%' },
  { name: 'São Paulo', x: '30%', y: '65%' },
  { name: 'Sydney', x: '85%', y: '72%' },
  { name: 'Dubai', x: '60%', y: '40%' },
  { name: 'Berlin', x: '51%', y: '27%' },
  { name: 'Lagos', x: '49%', y: '52%' },
  { name: 'Singapore', x: '75%', y: '53%' },
  { name: 'Los Angeles', x: '14%', y: '38%' },
];

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/** Animated counter that counts up when visible */
const AnimatedCounter: React.FC<{
  end: number;
  suffix?: string;
  duration?: number;
  format?: boolean;
  decimalTarget?: number;
}> = ({ end, suffix = '', duration = 2200, format = true, decimalTarget }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  const display = () => {
    if (decimalTarget !== undefined) {
      return (count / 10).toFixed(1);
    }
    if (format && count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (format && count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`;
    return count.toLocaleString();
  };

  return <span ref={ref}>{display()}{suffix}</span>;
};

/** Section wrapper with scroll-triggered animation */
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeIn}
      className={className}
      role="region"
    >
      {children}
    </motion.section>
  );
};

/** Testimonial card */
const TestimonialCard: React.FC<{ t: Testimonial }> = ({ t }) => (
  <div className="flex-shrink-0 w-[340px] md:w-[400px] bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--border-primary)]'} />
      ))}
    </div>
    <div className="relative mb-4">
      <Quote size={20} className="absolute -top-1 -left-1 text-[var(--color-primary)] opacity-30" />
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-5 line-clamp-4">{t.quote}</p>
    </div>
    <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-primary)]">
      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-[var(--border-primary)]" loading="lazy" />
      <div>
        <p className="text-sm font-bold text-[var(--text-primary)]">{t.name}</p>
        <p className="text-[11px] text-[var(--text-muted)]">{t.role}, {t.company}</p>
      </div>
    </div>
  </div>
);

// =============================================================================
// ABOUT PAGE COMPONENT
// =============================================================================

export default function AboutPage() {
  // State
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: 'About FlowGateX', url: window.location.href });
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch {
        // fallback: do nothing
      }
    }
  }, []);

  const scrollCarousel = useCallback((dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = dir === 'left' ? -360 : 360;
    carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  // Keyboard navigation for timeline
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') setActiveTimeline((p) => Math.min(p + 1, TIMELINE.length - 1));
      if (e.key === 'ArrowLeft') setActiveTimeline((p) => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      className="bg-[var(--bg-base)] text-[var(--text-primary)] font-sans overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-white transition-colors duration-300"
      role="main"
      aria-label="About FlowGateX"
    >
      {/* Page-specific styles */}
      <style>{`
        .about-glass {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          box-shadow: var(--shadow-card);
        }
        .about-glass:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-lg);
          transition: all 0.4s ease;
        }
        .hero-radial {
          background: radial-gradient(circle at 50% 50%, var(--color-primary) 0%, var(--color-secondary) 30%, transparent 70%);
          filter: blur(100px);
          opacity: 0.12;
        }
        .scroll-snap-x {
          scroll-snap-type: x mandatory;
        }
        .scroll-snap-x > * {
          scroll-snap-align: start;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO SECTION — Animated gradient, bold CTA, scroll indicator
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* BG decorations */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="hero-radial absolute inset-0" />
          <div className="absolute w-[400px] h-[400px] bg-[var(--color-primary)] opacity-[0.08] rounded-full blur-[120px] -top-20 -left-20 animate-pulse" />
          <div className="absolute w-[350px] h-[350px] bg-[var(--color-secondary)] opacity-[0.08] rounded-full blur-[120px] bottom-20 right-0 animate-pulse" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>

        <div className="relative z-10 max-w-5xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Sparkles size={14} /> About FlowGateX
          </motion.span>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl sm:text-6xl md:text-8xl font-black text-[var(--text-primary)] mb-8 tracking-tight leading-[0.95]"
          >
            Connecting <br />
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#3b82f6] to-[var(--color-secondary)] bg-clip-text text-transparent italic pr-2">
              Extraordinary
            </span>{' '}
            <br />
            Experiences
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            We&apos;re building the infrastructure for the next generation of global events. Discovery, security, and community — all in one seamless flow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/events"
              className="group relative px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-cyan-500 text-white font-bold rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[var(--color-primary)]/20 hover:-translate-y-0.5 transition-all"
              aria-label="Explore events"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Events <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <button
              onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-[var(--bg-card)] text-[var(--text-primary)] font-bold rounded-2xl border border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:-translate-y-0.5 transition-all"
              aria-label="Scroll to our mission section"
            >
              Our Story
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-4 bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-2xl border border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center gap-2"
              aria-label={linkCopied ? 'Link copied' : 'Share this page'}
            >
              {linkCopied ? <><Check size={18} /> Copied!</> : <><Share2 size={18} /> Share</>}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[var(--text-primary)]"
          aria-hidden="true"
        >
          <ChevronDown size={30} />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. MISSION SECTION — scroll-animated paragraphs
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection id="mission" className="py-24 md:py-32 px-6 relative" aria-labelledby="mission-heading">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-6">
              <Target size={12} /> Our Purpose
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} id="mission-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-10 tracking-tight">
            Our Mission
          </motion.h2>
          <div className="space-y-8 text-lg md:text-xl text-[var(--text-secondary)] font-light leading-relaxed">
            <motion.p variants={fadeUp} custom={2}>
              FlowGateX was born from a simple observation:{' '}
              <span className="text-[var(--text-primary)] font-semibold">the way we gather is broken.</span>{' '}
              Between legacy systems, fragmented data, and security vulnerabilities, the soul of live experiences was being lost.
            </motion.p>
            <motion.p variants={fadeUp} custom={3}>
              We set out to create a platform that feels like magic. By merging cutting-edge technology with human-centric design, we&apos;ve built a space where discovery is intuitive, management is effortless, and every event becomes an{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] font-semibold">unforgettable landmark</span>.
            </motion.p>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. ANIMATED STATS — counters with icons, gradient accents
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-16 md:py-24 px-6" aria-label="Key statistics">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              custom={idx}
              className="about-glass p-8 md:p-10 rounded-2xl text-center group hover:-translate-y-1 transition-all"
              role="figure"
              aria-label={`${stat.label}: ${stat.end === 49 ? '4.9' : stat.end.toLocaleString()}${stat.suffix}`}
            >
              <div className={`inline-flex items-center justify-center size-12 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-2">
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  decimalTarget={stat.end === 49 ? 49 : undefined}
                />
              </div>
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. CORE PILLARS — hover cards with feature tags
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 px-6 bg-[var(--bg-surface)]/50 relative" aria-labelledby="pillars-heading">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-primary)] to-transparent opacity-30" aria-hidden="true" />

        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 mb-4">
              <Zap size={12} /> Technology
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} id="pillars-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">
              Core Pillars
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[var(--text-secondary)] text-lg">
              The technology driving the next era of events.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                variants={fadeUp}
                custom={idx + 3}
                className="about-glass p-8 md:p-10 rounded-2xl group hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`size-16 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg ${pillar.shadow}`}>
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{pillar.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">{pillar.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pillar.features.map((f) => (
                    <span key={f} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]/20">
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. INTERACTIVE TIMELINE — stepper with keyboard nav
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 px-6" aria-labelledby="timeline-heading">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-4">
              <Clock size={12} /> Our Journey
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} id="timeline-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
              The FlowGateX Story
            </motion.h2>
          </div>

          {/* Timeline stepper */}
          <div className="relative" role="tablist" aria-label="Company timeline">
            {/* Line */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-[var(--border-primary)]" aria-hidden="true">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                initial={{ width: '0%' }}
                animate={{ width: `${(activeTimeline / (TIMELINE.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-0">
              {TIMELINE.map((item, idx) => (
                <button
                  key={item.year}
                  role="tab"
                  aria-selected={activeTimeline === idx}
                  aria-label={`${item.year}: ${item.title}`}
                  onClick={() => setActiveTimeline(idx)}
                  className={`relative flex flex-col items-center text-center md:w-1/5 group transition-all ${activeTimeline === idx ? '' : 'opacity-50 hover:opacity-80'}`}
                >
                  {/* Dot */}
                  <div className={`relative z-10 size-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    activeTimeline === idx
                      ? `bg-gradient-to-br ${item.color} text-white border-transparent shadow-lg`
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-primary)] group-hover:border-[var(--color-primary)]'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`mt-3 text-sm font-bold transition-colors ${activeTimeline === idx ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {item.year}
                  </span>
                </button>
              ))}
            </div>

            {/* Active content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimeline}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="mt-10 about-glass rounded-2xl p-8 md:p-10 text-center max-w-2xl mx-auto"
                role="tabpanel"
                aria-label={`${TIMELINE[activeTimeline].year} details`}
              >
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">{TIMELINE[activeTimeline].title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-lg">{TIMELINE[activeTimeline].description}</p>
              </motion.div>
            </AnimatePresence>

            <p className="text-center text-xs text-[var(--text-muted)] mt-4 hidden md:block">Use ← → arrow keys to navigate</p>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. TEAM SECTION — expandable cards with bios, socials, fun facts
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 px-6 bg-[var(--bg-surface)]/50 relative" aria-labelledby="team-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 mb-4">
                <Heart size={12} /> Our People
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} id="team-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
                The Visionaries
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-[var(--text-secondary)] text-lg">
                A global team of engineers, designers, and event enthusiasts.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={3}>
              <Link
                to="#"
                className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold hover:gap-4 transition-all text-sm"
                aria-label="View open positions"
              >
                View open positions <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, idx) => {
              const isExpanded = expandedMember === member.name;
              return (
                <motion.div
                  key={member.name}
                  variants={fadeUp}
                  custom={idx + 4}
                  className="about-glass rounded-2xl group overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-70" />
                    {/* Bottom overlay info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h4 className="text-xl font-bold text-[var(--text-primary)]">{member.name}</h4>
                      <p className={`${member.color} text-xs font-bold uppercase tracking-widest mt-0.5`}>{member.role}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 space-y-3">
                    {/* Social links */}
                    <div className="flex items-center gap-2">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s LinkedIn profile`}
                        className="size-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        <Linkedin size={14} />
                      </a>
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s Twitter profile`}
                        className="size-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        <Twitter size={14} />
                      </a>
                      <div className="flex-1" />
                      <button
                        onClick={() => setExpandedMember(isExpanded ? null : member.name)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? `Collapse ${member.name}'s bio` : `Expand ${member.name}'s bio`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        {isExpanded ? 'Less' : 'More'}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    {/* Expandable bio */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          variants={expandCard}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 pt-2">
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{member.bio}</p>
                            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
                              <Sparkles size={14} className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-[var(--text-secondary)]"><span className="font-bold text-[var(--text-primary)]">Fun fact:</span> {member.funFact}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. TESTIMONIALS CAROUSEL — horizontal scroll with nav buttons
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 px-6 overflow-hidden" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 mb-4">
                <Star size={12} /> Social Proof
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} id="testimonials-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
                Loved by Organizers
              </motion.h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                aria-label="Previous testimonial"
                className="size-10 rounded-xl border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                aria-label="Next testimonial"
                className="size-10 rounded-xl border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scroll-snap-x pb-4 -mx-6 px-6 scrollbar-thin"
            role="region"
            aria-label="Testimonials carousel"
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.div key={idx} variants={scaleIn} custom={idx}>
                <TestimonialCard t={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. COMMUNITY GALLERY — event showcase
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 px-6 bg-[var(--bg-surface)]/50" aria-labelledby="gallery-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20 mb-4">
              <Heart size={12} /> Community
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} id="gallery-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
              Powered by FlowGateX
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[var(--text-secondary)] text-lg mt-3">
              Real events, real communities, real impact.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {GALLERY_EVENTS.map((event, idx) => (
              <motion.div
                key={event.title}
                variants={scaleIn}
                custom={idx}
                className="relative group rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-bold text-sm">{event.title}</p>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                    <Users size={11} /> {event.attendees} attendees
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. GLOBAL MAP — interactive city pins
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 px-6" aria-labelledby="map-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-4">
              <Globe size={12} /> Global Reach
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} id="map-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
              Events in 500+ Cities
            </motion.h2>
          </div>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="relative w-full aspect-[2/1] about-glass rounded-2xl overflow-hidden"
            role="img"
            aria-label="World map showing FlowGateX presence in 10 major cities"
          >
            {/* Dot grid world map abstraction */}
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }} />

            {/* City pins */}
            {GLOBAL_CITIES.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 300 }}
                className="absolute group/pin"
                style={{ left: city.x, top: city.y }}
              >
                {/* Ping animation */}
                <div className="absolute inset-0 size-4 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-40 animate-ping" />
                </div>
                {/* Dot */}
                <div className="relative size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-cyan-400 shadow-md shadow-[var(--color-primary)]/30 border border-white/30 z-10" />
                {/* Label */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-lg opacity-0 group-hover/pin:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap">
                  <span className="text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1">
                    <MapPin size={10} className="text-[var(--color-primary)]" /> {city.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          10. IMPACT SECTION — empowering creators
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 px-6" aria-labelledby="impact-heading">
        <div className="max-w-7xl mx-auto about-glass rounded-2xl p-10 md:p-16 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-secondary)] opacity-[0.06] blur-[100px] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[var(--color-primary)] opacity-[0.06] blur-[80px] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-12">
            <div className="flex-1">
              <motion.h2 variants={slideFromLeft} id="impact-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 tracking-tight">
                Empowering Creators Everywhere
              </motion.h2>
              <motion.p variants={slideFromLeft} className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
                We&apos;re not just a ticketing platform — we&apos;re a launchpad for community culture. Our tools have helped over 10,000 local organizers turn their passion into sustainable professions.
              </motion.p>

              <motion.div variants={slideFromLeft} className="flex flex-wrap gap-8">
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
                    $<AnimatedCounter end={50} suffix="M+" format={false} />
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-bold mt-1">Local Impact</span>
                </div>
                <div className="w-px h-14 bg-[var(--border-primary)] hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
                    <AnimatedCounter end={100} suffix="%" format={false} />
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-bold mt-1">Carbon Offset</span>
                </div>
                <div className="w-px h-14 bg-[var(--border-primary)] hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
                    <AnimatedCounter end={250} suffix="K+" format={false} />
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-bold mt-1">Community Members</span>
                </div>
              </motion.div>
            </div>

            <motion.div variants={slideFromRight} className="flex-shrink-0">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/20 hover:-translate-y-0.5 transition-all"
                aria-label="Download our impact report"
              >
                <Download size={18} /> Impact Report
              </a>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          11. CTA SECTION — final conversion
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-32 px-6 text-center overflow-hidden" aria-label="Call to action">
        <div className="max-w-4xl mx-auto relative">
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-primary)] opacity-[0.06] blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-5xl md:text-7xl font-black text-[var(--text-primary)] mb-6 tracking-tight"
          >
            Join the Revolution
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            The world is waiting for your next big thing. Build it with FlowGateX.
          </motion.p>

          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="px-10 py-5 bg-gradient-to-r from-[var(--color-primary)] to-cyan-500 hover:from-[var(--color-primary-focus)] hover:to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-[var(--color-primary)]/20 transition-all hover:-translate-y-1"
              aria-label="Discover events on FlowGateX"
            >
              Discover Events
            </Link>
            <Link
              to="/register"
              className="px-10 py-5 bg-[var(--bg-card)] text-[var(--text-primary)] font-bold text-lg rounded-2xl border border-[var(--border-primary)] hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all"
              aria-label="Become an event host"
            >
              Become a Host
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
}