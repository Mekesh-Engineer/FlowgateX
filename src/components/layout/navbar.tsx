'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/providers/theme-provider';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, setSidebarOpen } from '@/store/slices/ui.slice';
import { RootState } from '@/store';
import { cn } from '@/lib/utils';

// ===========================
// CONFIGURATION & HELPERS
// ===========================

const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
    <span className={cn("material-icons-outlined select-none", className)} style={{ fontSize: 'inherit' }}>
        {name}
    </span>
);

const Badge = ({ count }: { count: number }) => {
    if (!count || count <= 0) return null;
    return (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[9px] font-black text-white bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-full shadow-lg ring-2 ring-[var(--bg-primary)] animate-pulse pointer-events-none">
            {count > 99 ? '99+' : count}
        </span>
    );
};

// ===========================
// ROLE-BASED NAVIGATION CONFIG
// ===========================
// Updated paths to match src/app/(dashboard) structure
const NAVIGATION_CONFIG: Record<string, any> = {
    // Viewer / User
    user: {
        label: 'Personal Workspace',
        primaryLinks: [
            { label: 'Home', to: '/user', icon: 'home', description: 'Your personal dashboard' },
            { label: 'Discover', to: '/events', icon: 'explore', description: 'Browse all events' },
            { label: 'Bookings', to: '/user/bookings', icon: 'confirmation_number', description: 'Your tickets & bookings' },
            { label: 'Saved', to: '/user/saved-events', icon: 'favorite', description: 'Saved events' }
        ],
        quickActions: [
            { label: 'Book Tickets', icon: 'add_shopping_cart', to: '/events' },
            { label: 'My Bookings', icon: 'qr_code_2', to: '/user/bookings' }
        ]
    },
    // Organizer
    organizer: {
        label: 'Organizer Console',
        primaryLinks: [
            { label: 'Dashboard', to: '/organizer', icon: 'dashboard', description: 'Overview & metrics' },
            { label: 'Analytics', to: '/organizer/analytics', icon: 'insights', description: 'Revenue & performance' },
            { label: 'Events', to: '/organizer/events', icon: 'event_note', description: 'Manage your events' },
            { label: 'IoT', to: '/organizer/iot', icon: 'sensors', description: 'Device management' }
        ],
        quickActions: [
            { label: 'Create Event', icon: 'add_circle', to: '/organizer/events/create' },
            { label: 'View Revenue', icon: 'payments', to: '/organizer/revenue' }
        ]
    },
    // Admin
    admin: {
        label: 'Admin Console',
        primaryLinks: [
            { label: 'Overview', to: '/admin', icon: 'admin_panel_settings', description: 'System overview' },
            { label: 'Analytics', to: '/admin/analytics', icon: 'query_stats', description: 'Platform analytics' },
            { label: 'Users', to: '/admin/users', icon: 'manage_accounts', description: 'User management' },
            { label: 'Content', to: '/admin/content', icon: 'fact_check', description: 'Content moderation' }
        ],
        quickActions: [
            { label: 'System Logs', icon: 'dns', to: '/admin/logs' },
            { label: 'Support', icon: 'support_agent', to: '/admin/support' }
        ]
    },
    // Guest (Fallback)
    guest: {
        label: 'Guest',
        primaryLinks: [
            { label: 'Home', to: '/', icon: 'home', description: 'Welcome page' },
            { label: 'Events', to: '/events', icon: 'explore', description: 'Browse events' },
            { label: 'About', to: '/about', icon: 'info', description: 'Learn more' },
            { label: 'Help', to: '/help', icon: 'help', description: 'Support center' }
        ],
        quickActions: [
            { label: 'Sign Up', icon: 'person_add', to: '/register' },
            { label: 'Sign In', icon: 'login', to: '/login' }
        ]
    }
};

// Mock notifications for demo
const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'New booking confirmed', message: 'Your ticket for Tech Summit 2024 is ready', time: '2m ago', icon: 'confirmation_number', unread: true, type: 'success' },
    { id: 2, title: 'Event reminder', message: 'Music Festival starts in 2 hours', time: '1h ago', icon: 'notifications_active', unread: true, type: 'info' },
    { id: 3, title: 'Payment received', message: '$250 payment successful', time: '3h ago', icon: 'payment', unread: false, type: 'success' },
];

// ===========================
// MAIN NAVBAR COMPONENT
// ===========================

export function Navbar() {
    const pathname = usePathname();
    const useRouterHook = useRouter();
    const dispatch = useDispatch();

    // Redux State
    const isSidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

    // Context Hooks
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    // Local State
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);

    const navRef = useRef<HTMLElement>(null);

    // Determine Role
    const currentRole = user?.role || 'guest';
    const roleConfig = NAVIGATION_CONFIG[currentRole] || NAVIGATION_CONFIG.guest;

    // Derived Data
    const unreadCount = useMemo(() => MOCK_NOTIFICATIONS.filter(n => n.unread).length, []);

    // User Initials Helper (Adapted for AuthProvider User type)
    const userInitials = useMemo(() => {
        if (!user || !user.email) return 'G';
        return user.email.substring(0, 2).toUpperCase();
    }, [user]);

    const userName = useMemo(() => {
        if (!user) return 'Guest';
        return user.email.split('@')[0];
    }, [user]);

    // ===========================
    // EFFECTS & HANDLERS
    // ===========================

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
                setShowQuickActions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setIsScrolled(scrolled);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    // Helper to toggle dropdowns
    const toggleDropdown = (name: string) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
            setShowQuickActions(false);
        }
    };

    const handleLogout = async () => {
        setActiveDropdown(null);
        await logout();
        useRouterHook.push('/login');
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('main-search')?.focus();
            }
            // Ctrl/Cmd + B for sidebar toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'b' && user) {
                e.preventDefault();
                dispatch(toggleSidebar());
            }
            // Escape to close dropdowns
            if (e.key === 'Escape') {
                setActiveDropdown(null);
                setShowQuickActions(false);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [user, dispatch]);

    return (
        <header
            ref={navRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? 'bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-lg border-b border-[var(--border-primary)]'
                    : 'bg-[var(--bg-primary)] border-b border-[var(--border-primary)]'
            )}
            style={{ height: '64px' }}
        >
            <div className="w-full h-16 px-4 sm:px-6 flex items-center justify-between gap-4">

                {/* ===========================
                    LEFT: SIDEBAR TOGGLE + BRAND
                   =========================== */}
                <div className="flex items-center gap-3 lg:gap-4">
                    {/* Sidebar Toggle */}
                    {user && (
                        <button
                            onClick={() => dispatch(toggleSidebar())}
                            className="flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 border border-transparent hover:border-[var(--border-primary)]"
                            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                        >
                            <Icon name={isSidebarOpen ? "menu_open" : "menu"} className="text-2xl" />
                        </button>
                    )}

                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-light)] to-[var(--brand-primary-dark)]" />
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <Icon name="auto_awesome" className="text-white text-2xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col">
                            <span className="text-xl font-bold tracking-wide text-[var(--text-primary)] leading-none group-hover:text-[var(--brand-primary)] transition-colors font-heading">
                                FlowGate<span className="text-[var(--brand-primary)]">X</span>
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] text-[var(--text-muted)] font-medium tracking-widest uppercase">
                                    {roleConfig?.label}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* ===========================
                    CENTER: NAVIGATION
                   =========================== */}
                <div className="hidden xl:flex items-center justify-center flex-1 max-w-3xl mx-auto">
                    <nav className="flex items-center gap-1 p-1.5 bg-[var(--bg-secondary)]/80 rounded-2xl border border-[var(--border-primary)]/80 backdrop-blur-md shadow-lg relative overflow-hidden">
                        {roleConfig?.primaryLinks?.map((link: any) => {
                            const isActive = pathname.startsWith(link.to) || (link.to === '/' && pathname === '/');
                            return (
                                <div key={link.to} className="relative group/item">
                                    <Link
                                        href={link.to}
                                        className={cn(
                                            "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden",
                                            isActive
                                                ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white shadow-lg shadow-[var(--brand-primary)]/30'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                                        )}
                                    >
                                        <Icon
                                            name={link.icon}
                                            className={cn(
                                                "text-lg relative z-10 transition-transform duration-300 group-hover/item:scale-110",
                                                isActive ? "text-white" : "text-[var(--text-muted)]"
                                            )}
                                        />
                                        <span className="relative z-10">{link.label}</span>
                                        {link.badge && (
                                            <span className="relative z-10 ml-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black">
                                                {link.badge}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* ===========================
                    RIGHT: GLOBAL ACTIONS
                   =========================== */}
                <div className="flex items-center gap-2">

                    {/* Search Bar */}
                    <div className="relative hidden lg:block group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon name="search" className="text-[var(--text-muted)] group-focus-within:text-[var(--brand-primary)] transition-all duration-300" />
                        </div>
                        <input
                            id="main-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-48 xl:w-64 pl-10 pr-20 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all placeholder:text-[var(--text-muted)]/60"
                            autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1 pointer-events-none">
                            <kbd className="hidden xl:inline-flex items-center px-2 py-1 border border-[var(--border-primary)] rounded-md text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)]">
                                ⌘K
                            </kbd>
                        </div>
                    </div>

                    {/* Quick Actions Button */}
                    {user && roleConfig?.quickActions && (
                        <div className="relative">
                            <button
                                onClick={() => setShowQuickActions(!showQuickActions)}
                                className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200"
                            >
                                <Icon name="bolt" className="text-xl" />
                            </button>

                            {/* Quick Actions Dropdown */}
                            {showQuickActions && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="p-4 border-b border-[var(--border-primary)] bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon name="bolt" className="text-[var(--brand-primary)]" />
                                            <h3 className="font-bold text-[var(--text-primary)] font-heading">Quick Actions</h3>
                                        </div>
                                    </div>
                                    <div className="p-3 space-y-2">
                                        {roleConfig.quickActions.map((action: any, idx: number) => (
                                            <Link
                                                key={idx}
                                                href={action.to}
                                                onClick={() => setShowQuickActions(false)}
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center">
                                                    <Icon name={action.icon} className="text-[var(--brand-primary)]" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)]">
                                                        {action.label}
                                                    </p>
                                                </div>
                                                <Icon name="arrow_forward" className="text-sm text-[var(--text-muted)] opacity-0 group-hover:opacity-100" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('notifications')}
                            className={cn(
                                "relative p-2.5 rounded-xl transition-all duration-200 border overflow-hidden group",
                                activeDropdown === 'notifications'
                                    ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border-[var(--border-primary)]'
                            )}
                        >
                            <Icon name="notifications" className="text-xl relative z-10" />
                            <Badge count={unreadCount} />
                        </button>

                        {/* Notifications Dropdown */}
                        {activeDropdown === 'notifications' && (
                            <div className="absolute top-full right-0 mt-3 w-96 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                                    <div className="flex items-center gap-2">
                                        <Icon name="notifications" className="text-[var(--brand-primary)]" />
                                        <span className="font-bold text-[var(--text-primary)] font-heading">NOTIFICATIONS</span>
                                    </div>
                                    <button className="text-[10px] text-[var(--brand-primary)] hover:underline font-bold uppercase">
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {MOCK_NOTIFICATIONS.map((notif) => (
                                        <div key={notif.id} className={cn("p-4 border-b border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer", notif.unread && 'bg-[var(--brand-primary)]/5')}>
                                            <p className="text-sm font-semibold text-[var(--text-primary)]">{notif.title}</p>
                                            <p className="text-xs text-[var(--text-muted)] line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-[var(--text-muted)] mt-1">{notif.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative ml-1">
                        <button
                            onClick={() => toggleDropdown('profile')}
                            className={cn(
                                "flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full border transition-all duration-200 group",
                                activeDropdown === 'profile'
                                    ? 'border-[var(--brand-primary)] bg-[var(--bg-card)] shadow-lg'
                                    : 'border-transparent hover:bg-[var(--bg-hover)] hover:border-[var(--border-primary)]'
                            )}
                        >
                            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] p-[2px]">
                                <div className="w-full h-full rounded-full bg-[var(--bg-card)] flex items-center justify-center overflow-hidden">
                                    <span className="text-xs font-black text-[var(--brand-primary)]">{userInitials}</span>
                                </div>
                            </div>
                            <div className="hidden xl:block text-left">
                                <p className="text-xs font-semibold text-[var(--text-primary)] leading-none group-hover:text-[var(--brand-primary)] transition-colors">
                                    {userName}
                                </p>
                            </div>
                            <Icon name="expand_more" className={cn("text-[var(--text-muted)] text-lg transition-transform", activeDropdown === 'profile' && 'rotate-180')} />
                        </button>

                        {/* Profile Menu */}
                        {activeDropdown === 'profile' && (
                            <div className="absolute top-full right-0 mt-3 w-72 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                {user ? (
                                    <>
                                        <div className="p-5 border-b border-[var(--border-primary)] bg-gradient-to-br from-[var(--bg-secondary)] to-transparent">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-black text-lg">
                                                    {userInitials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-[var(--text-primary)] truncate">{userName}</h4>
                                                    <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2 space-y-1">
                                            <Link href="/dashboard/user/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
                                                <Icon name="badge" className="text-lg" />
                                                <span>My Profile</span>
                                            </Link>
                                            <button onClick={toggleTheme} className="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
                                                <div className="flex items-center gap-3">
                                                    <Icon name={isDark ? "dark_mode" : "light_mode"} className="text-lg" />
                                                    <span>Theme</span>
                                                </div>
                                                <span className="text-xs font-bold text-[var(--brand-primary)] uppercase">{isDark ? 'Dark' : 'Light'}</span>
                                            </button>
                                        </div>

                                        <div className="p-2 border-t border-[var(--border-primary)]">
                                            <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all">
                                                <Icon name="logout" className="text-lg" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 flex flex-col gap-2">
                                        <Link href="/login" className="w-full py-2 bg-[var(--brand-primary)] text-white text-center rounded-lg font-bold">Sign In</Link>
                                        <Link href="/register" className="w-full py-2 border border-[var(--border-primary)] text-center rounded-lg font-bold">Register</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}