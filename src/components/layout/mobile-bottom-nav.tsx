'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Ticket, LayoutDashboard, User, MoreHorizontal } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Determine role from pathname
  const role = pathname.startsWith('/dashboard/admin') 
    ? 'admin' 
    : pathname.startsWith('/dashboard/organizer') 
    ? 'organizer' 
    : 'user';

  // Role-specific navigation items
  const navItems: Record<string, NavItem[]> = {
    user: [
      { icon: <User size={20} />, label: 'Profile', href: '/dashboard/user/profile' },
      { icon: <Ticket size={20} />, label: 'Tickets', href: '/dashboard/user/bookings' },
      { icon: <Home size={20} />, label: 'Home', href: '/dashboard/user' },
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard/user' },
      { icon: <MoreHorizontal size={20} />, label: 'More', href: '/dashboard/user/profile' },
    ],
    organizer: [
      { icon: <Home size={20} />, label: 'Home', href: '/dashboard/organizer' },
      { icon: <Ticket size={20} />, label: 'Events', href: '/dashboard/organizer/events' },
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard/organizer' },
      { icon: <LayoutDashboard size={20} />, label: 'Analytics', href: '/dashboard/organizer/analytics' },
      { icon: <MoreHorizontal size={20} />, label: 'More', href: '/dashboard/organizer/profile' },
    ],
    admin: [
      { icon: <Home size={20} />, label: 'Home', href: '/dashboard/admin' },
      { icon: <User size={20} />, label: 'Users', href: '/dashboard/admin/users' },
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard/admin' },
      { icon: <LayoutDashboard size={20} />, label: 'Analytics', href: '/dashboard/admin/analytics' },
      { icon: <MoreHorizontal size={20} />, label: 'More', href: '/dashboard/admin/settings' },
    ],
  };

  const items = navItems[role] || navItems.user;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)] border-t border-[var(--border-primary)] lg:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {items.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-[var(--primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
