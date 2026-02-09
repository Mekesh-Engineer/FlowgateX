import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, User, LogIn, Ticket, Bell, Sun, Moon, 
  Search, ChevronDown, LogOut, Calendar,
  Music, Trophy, Cpu, Palette, MapPin, Star, Zap,
  ArrowRight, Clock, Users, Heart, TrendingUp,
  Gamepad2, Award,
  Home, Info, Mail, HelpCircle, Shield, FileText,
  Sparkles, Command
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserRole } from '@/lib/constants';
import { logout } from '@/features/auth/services/authService';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface NavLink {
  label: string;
  path: string;
  icon?: React.ElementType;
}

interface MegaMenuCategory {
  title: string;
  icon: React.ElementType;
  color: string;
  links: NavLink[];
}

interface Notification {
  id: string;
  type: 'event' | 'ticket' | 'system' | 'promo';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const NAVIGATION_LINKS: NavLink[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Events', path: '/events', icon: Calendar },
  { label: 'About', path: '/about', icon: Info },
  { label: 'Contact', path: '/contact', icon: Mail },
];

const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    title: 'Event Categories',
    icon: Calendar,
    color: '#00A3DB',
    links: [
      { label: 'Music & Concerts', path: '/events?category=music', icon: Music },
      { label: 'Sports & E-Sports', path: '/events?category=sports', icon: Trophy },
      { label: 'Technology', path: '/events?category=tech', icon: Cpu },
      { label: 'Arts & Theater', path: '/events?category=arts', icon: Palette },
      { label: 'Gaming', path: '/events?category=gaming', icon: Gamepad2 },
      { label: 'Workshops', path: '/events?category=workshops', icon: Award },
    ]
  },
  {
    title: 'Discover',
    icon: Star,
    color: '#A3D639',
    links: [
      { label: 'Trending Now', path: '/events?sort=trending', icon: TrendingUp },
      { label: 'Near You', path: '/events?nearby=true', icon: MapPin },
      { label: 'This Weekend', path: '/events?date=weekend', icon: Clock },
      { label: 'Free Events', path: '/events?price=free', icon: Heart },
      { label: 'Featured', path: '/events?featured=true', icon: Sparkles },
      { label: 'New Releases', path: '/events?sort=newest', icon: Zap },
    ]
  },
  {
    title: 'Resources',
    icon: HelpCircle,
    color: '#f59e0b',
    links: [
      { label: 'Help Center', path: '/help', icon: HelpCircle },
      { label: 'Organizer Guide', path: '/organizer-guide', icon: FileText },
      { label: 'Safety & Trust', path: '/safety', icon: Shield },
      { label: 'Community', path: '/community', icon: Users },
      { label: 'Blog', path: '/blog', icon: FileText },
      { label: 'Careers', path: '/careers', icon: Award },
    ]
  }
];

const FEATURED_EVENTS = [
  {
    id: 'f1',
    title: 'Neon Nights Festival',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400',
    date: 'Mar 15, 2026',
    category: 'Music'
  },
  {
    id: 'f2',
    title: 'Tech Summit 2026',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400',
    date: 'Apr 22, 2026',
    category: 'Technology'
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'ticket',
    title: 'Ticket Confirmed',
    message: 'Your ticket for Neon Nights Festival has been confirmed!',
    time: '5 min ago',
    read: false,
    actionUrl: '/tickets/1'
  },
  {
    id: '2',
    type: 'event',
    title: 'Event Reminder',
    message: 'Tech Summit 2026 starts in 3 days. Don\'t forget!',
    time: '1 hour ago',
    read: false,
    actionUrl: '/events/2'
  },
  {
    id: '3',
    type: 'promo',
    title: 'Special Offer',
    message: '20% off on all music events this weekend!',
    time: '2 hours ago',
    read: true,
    actionUrl: '/events?category=music'
  },
  {
    id: '4',
    type: 'system',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    time: '1 day ago',
    read: true
  }
];

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: { 
      duration: 0.15 
    }
  }
};

const megaMenuVariants = {
  hidden: { 
    opacity: 0, 
    y: -10,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.25,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.2 
    }
  }
};

const mobileMenuVariants = {
  hidden: { 
    opacity: 0,
    x: '100%'
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0,
    x: '100%',
    transition: { 
      duration: 0.2 
    }
  }
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] w-full max-w-2xl px-4"
          >
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-4 p-4 border-b border-[var(--border-primary)]">
                <Search className="text-[var(--text-muted)]" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events, artists, venues..."
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-lg outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded border border-[var(--border-primary)]">
                  ESC
                </kbd>
              </div>

              {/* Quick Links */}
              <div className="p-4">
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  Quick Links
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Trending Events', icon: TrendingUp, path: '/events?sort=trending' },
                    { label: 'Near You', icon: MapPin, path: '/events?nearby=true' },
                    { label: 'This Weekend', icon: Clock, path: '/events?date=weekend' },
                    { label: 'Music Events', icon: Music, path: '/events?category=music' },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200"
                    >
                      <item.icon size={16} className="text-[#00A3DB]" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              <div className="p-4 border-t border-[var(--border-primary)]">
                <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  Recent Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Concerts', 'Tech events', 'San Francisco', 'Free events'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-full transition-colors duration-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface NotificationsDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ 
  notifications, 
  onClose,
  onMarkAllRead 
}) => {
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ticket': return Ticket;
      case 'event': return Calendar;
      case 'promo': return Star;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'ticket': return 'text-[#10b981] bg-[#10b981]/10';
      case 'event': return 'text-[#00A3DB] bg-[#00A3DB]/10';
      case 'promo': return 'text-[#f59e0b] bg-[#f59e0b]/10';
      default: return 'text-[var(--text-muted)] bg-[var(--bg-hover)]';
    }
  };

  return (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold text-white bg-[#ef4444] rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-sm text-[#00A3DB] hover:text-[#007AA3] font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <button
                key={notification.id}
                onClick={() => {
                  if (notification.actionUrl) {
                    navigate(notification.actionUrl);
                    onClose();
                  }
                }}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--border-primary)] last:border-b-0 ${
                  !notification.read ? 'bg-[#00A3DB]/5' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--text-primary)] text-sm truncate">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-[#00A3DB] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-[var(--text-disabled)] mt-1">
                    {notification.time}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <Bell className="mx-auto text-[var(--text-disabled)] mb-3" size={32} />
            <p className="text-[var(--text-muted)]">No notifications yet</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border-primary)]">
        <Link
          to="/notifications"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-[#00A3DB] hover:text-[#007AA3] transition-colors"
        >
          View all notifications
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};



interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] transition-all duration-200 group"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon size={18} className="text-[#A3D639]" />
        ) : (
          <Sun size={18} className="text-[#f59e0b]" />
        )}
      </motion.div>
    </button>
  );
};

// =============================================================================
// MAIN NAVBAR COMPONENT
// =============================================================================

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'auto';
    }
    return 'auto';
  });
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // Refs
  const navRef = useRef<HTMLElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Computed values
  const unreadCount = notifications.filter(n => !n.read).length;

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  // Handle scroll behavior - Always visible, floating style when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled (trigger floating state)
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  }, [location.pathname]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'; // Simple toggle for mobile, desktop has full menu
    setTheme(newTheme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.add('light');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/');
    setAccountDropdownOpen(false);
  }, [navigate]);

  const toggleAccountDropdown = useCallback(() => {
    setAccountDropdownOpen((prev) => !prev);
    setIsNotificationsOpen(false);
  }, []);

  const getRoleDisplayName = useCallback(() => {
    switch (user?.role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return 'Admin';
      case UserRole.ORGANIZER:
        return 'Organizer';
      default:
        return 'Attendee';
    }
  }, [user]);

  const getRoleBadgeClass = useCallback(() => {
    switch (user?.role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return 'is-admin';
      case UserRole.ORGANIZER:
        return 'is-organizer';
      default:
        return 'is-user';
    }
  }, [user]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`fixed z-[100] transition-all duration-300 ${
          isScrolled
            ? 'top-4 left-4 right-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-lg'
            : 'top-0 left-0 right-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={`mx-auto px-4 sm:px-6 ${isScrolled ? 'max-w-7xl' : 'max-w-7xl lg:px-8'}`}>
          <div className={`flex items-center justify-between ${isScrolled ? 'h-16' : 'h-16 lg:h-20'}`}>
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              aria-label="FlowGateX Home"
            >
              <div className="relative">
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-[#00A3DB] to-[#A3D639] rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                  style={{ filter: 'blur(8px)' }}
                />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A3DB] via-[#0091c4] to-[#A3D639] flex items-center justify-center shadow-lg shadow-[#00A3DB]/25 group-hover:shadow-[#00A3DB]/40 transition-all duration-300 group-hover:scale-105">
                  <span 
                    className="material-symbols-outlined text-[20px] text-white font-semibold"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}
                  >
                    stream
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#00A3DB] to-[#A3D639] bg-clip-text text-transparent">
                FlowGateX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl group ${
                    location.pathname === link.path
                      ? 'text-[#00A3DB] bg-[#00A3DB]/10'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[#00A3DB] to-[#A3D639] rounded-full"
                    />
                  )}
                </Link>
              ))}
              
              {/* Mega Menu Trigger */}
              <div ref={megaMenuRef} className="relative">
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  onMouseEnter={() => setIsMegaMenuOpen(true)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl ${
                    isMegaMenuOpen
                      ? 'text-[#00A3DB] bg-[#00A3DB]/10'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  }`}
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                >
                  Explore
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-xl transition-all duration-200"
                aria-label="Search"
              >
                <Search size={16} />
                <span className="text-sm">Search</span>
                <kbd className="hidden xl:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-[var(--bg-card)] border border-[var(--border-primary)] rounded">
                  <Command size={10} />K
                </kbd>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle isDark={theme === 'dark'} onToggle={handleThemeToggle} />

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div ref={notificationsRef} className="relative">
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(!isNotificationsOpen);
                        setAccountDropdownOpen(false);
                      }}
                      className="relative p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] transition-all duration-200"
                      aria-label="Notifications"
                      aria-expanded={isNotificationsOpen}
                    >
                      <Bell size={18} className="text-[var(--text-secondary)]" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-[#ef4444] rounded-full">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <NotificationsDropdown
                          notifications={notifications}
                          onClose={() => setIsNotificationsOpen(false)}
                          onMarkAllRead={handleMarkAllNotificationsRead}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Profile */}
                  <li className="dash-header-item-right">
                    <div className="flex items-center">
                      {/* Desktop: Show name and role */}
                      <div className="dash-user-info desktop-only">
                        <span className="dash-user-name">
                          {user?.displayName || 'Guest User'}
                        </span>
                        <span className={`dash-role-badge ${getRoleBadgeClass()}`}>
                          {getRoleDisplayName()}
                        </span>
                      </div>

                      {/* Account Dropdown */}
                      <div ref={accountRef} className="inline-flex relative text-start">
                        <button
                          id="hs-dnad"
                          type="button"
                          onClick={toggleAccountDropdown}
                          className="dash-account-trigger"
                          aria-haspopup="menu"
                          aria-expanded={accountDropdownOpen}
                          aria-label="User menu"
                        >
                          <img
                            className="shrink-0 size-8 rounded-full border-2 border-[var(--border-primary)]"
                            src={user?.photoURL || 'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80'}
                            alt={user?.displayName || 'User Avatar'}
                          />
                        </button>

                        {/* Account Dropdown Panel */}
                        <div
                          className={`dash-dropdown-panel is-right is-wide ${accountDropdownOpen ? 'is-open' : ''}`}
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="hs-dnad"
                        >
                          <div className="dash-account-info">
                            <span className="dash-account-name">
                              {user?.displayName || 'Guest User'}
                            </span>
                            <p className="dash-account-email">
                              {user?.email || 'No email'}
                            </p>
                            <span className={`dash-role-badge mt-1.5 ${getRoleBadgeClass()}`}>
                              {getRoleDisplayName()}
                            </span>
                          </div>

                          <div className="dash-theme-row">
                            {/* Theme Switch/Toggle */}
                            <div className="flex flex-wrap justify-between items-center gap-2">
                              <span className="dash-theme-label">Theme</span>
                              <div className="dash-theme-group">
                                {/* Light */}
                                <button
                                  type="button"
                                  onClick={() => setTheme('light')}
                                  className={`dash-theme-btn ${theme === 'light' ? 'is-active' : ''}`}
                                >
                                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 3v1" /><path d="M12 20v1" /><path d="M3 12h1" /><path d="M20 12h1" /><path d="m18.364 5.636-.707.707" /><path d="m6.343 17.657-.707.707" /><path d="m5.636 5.636.707.707" /><path d="m17.657 17.657.707.707" /></svg>
                                  <span className="sr-only">Default (Light)</span>
                                </button>
                                {/* Dark */}
                                <button
                                  type="button"
                                  onClick={() => setTheme('dark')}
                                  className={`dash-theme-btn ${theme === 'dark' ? 'is-active-dark' : ''}`}
                                >
                                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                                  <span className="sr-only">Dark</span>
                                </button>
                                {/* Auto */}
                                <button
                                  type="button"
                                  onClick={() => setTheme('auto')}
                                  className={`dash-theme-btn ${theme === 'auto' ? 'is-active' : ''}`}
                                >
                                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                  <span className="sr-only">Auto (System)</span>
                                </button>
                              </div>
                            </div>
                            {/* End Theme Switch/Toggle */}
                          </div>

                          <div className="dash-dropdown-divider">
                            <Link className="dash-account-menu-item" to="/profile" onClick={() => setAccountDropdownOpen(false)}>
                              <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                              Profile
                            </Link>
                            <Link className="dash-account-menu-item" to="/settings" onClick={() => setAccountDropdownOpen(false)}>
                              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                              Settings
                            </Link>
                            <button className="dash-account-menu-item w-full text-left" onClick={handleLogout}>
                              <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                              Log out
                            </button>
                          </div>
                        </div>
                        {/* End Account Dropdown Panel */}
                      </div>
                      {/* End Account Dropdown */}
                    </div>
                  </li>
                </>
              ) : (
                <>
                  {/* Sign In */}
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium rounded-xl hover:bg-[var(--bg-hover)]"
                  >
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </button>

                  {/* Get Started */}
                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#00A3DB] to-[#007AA3] hover:from-[#007AA3] hover:to-[#00A3DB] text-white rounded-xl font-semibold shadow-lg shadow-[#00A3DB]/20 hover:shadow-[#00A3DB]/30 transition-all duration-300"
                  >
                    <Sparkles size={16} />
                    <span>Get Started</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle isDark={theme === 'dark'} onToggle={handleThemeToggle} />
              
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)]"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              variants={megaMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onMouseLeave={() => setIsMegaMenuOpen(false)}
              className={`hidden lg:block absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xl rounded-2xl overflow-hidden`}
            >
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-4 gap-8">
                  {/* Categories */}
                  {MEGA_MENU_CATEGORIES.map((category) => (
                    <div key={category.title}>
                      <div className="flex items-center gap-2 mb-4">
                        <category.icon size={18} style={{ color: category.color }} />
                        <h3 className="font-bold text-[var(--text-primary)]">{category.title}</h3>
                      </div>
                      <ul className="space-y-1">
                        {category.links.map((link) => (
                          <li key={link.path}>
                            <Link
                              to={link.path}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200 group"
                            >
                              {link.icon && (
                                <link.icon 
                                  size={16} 
                                  className="text-[var(--text-muted)] group-hover:text-[#00A3DB] transition-colors" 
                                />
                              )}
                              <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Featured Events */}
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <Star size={18} className="text-[#f59e0b]" />
                      Featured Events
                    </h3>
                    <div className="space-y-3">
                      {FEATURED_EVENTS.map((event) => (
                        <Link
                          key={event.id}
                          to={`/events/${event.id}`}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-all duration-200 group"
                        >
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-16 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[var(--text-primary)] text-sm truncate group-hover:text-[#00A3DB] transition-colors">
                              {event.title}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {event.date} · {event.category}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/events?featured=true"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#00A3DB] hover:text-[#007AA3] transition-colors"
                    >
                      View all featured
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-[95] w-full max-w-sm bg-[var(--bg-card)] border-l border-[var(--border-primary)] shadow-2xl lg:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Ticket className="text-[#00A3DB]" size={24} />
                  <span className="text-xl font-bold bg-gradient-to-r from-[#00A3DB] to-[#A3D639] bg-clip-text text-transparent">
                    FlowGateX
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* User Section (if logged in) */}
              {isAuthenticated && (
                <div className="p-4 border-b border-[var(--border-primary)]">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
                      alt="User avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#00A3DB]/20"
                    />
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">John Doe</p>
                      <p className="text-sm text-[var(--text-muted)]">john@example.com</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="p-4 space-y-1">
                <p className="px-3 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Navigation
                </p>
                {NAVIGATION_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'text-[#00A3DB] bg-[#00A3DB]/10'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    {link.icon && <link.icon size={20} />}
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="p-4 border-t border-[var(--border-primary)]">
                <p className="px-3 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {MEGA_MENU_CATEGORIES[0].links.slice(0, 6).map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200"
                    >
                      {link.icon && <link.icon size={16} className="text-[#00A3DB]" />}
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="p-4 mt-auto border-t border-[var(--border-primary)]">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200"
                    >
                      <User size={20} />
                      <span className="font-medium">My Profile</span>
                    </Link>
                    <Link
                      to="/tickets"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200"
                    >
                      <Ticket size={20} />
                      <span className="font-medium">My Tickets</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-all duration-200"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-all font-medium"
                    >
                      <LogIn size={18} />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/register');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#00A3DB] to-[#A3D639] text-white rounded-xl font-semibold shadow-lg"
                    >
                      <Sparkles size={18} />
                      <span>Get Started</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
}

export default Navbar;
