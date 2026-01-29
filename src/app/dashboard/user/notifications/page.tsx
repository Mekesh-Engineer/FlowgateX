'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type NotificationCategory = 'all' | 'bookings' | 'reminders' | 'promotions' | 'system';

interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      category: 'bookings',
      title: 'Booking Confirmed',
      message: 'Your booking for Tech Summit 2026 has been confirmed.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      category: 'reminders',
      title: 'Event Reminder',
      message: 'Music Festival 2026 starts in 24 hours!',
      timestamp: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      category: 'promotions',
      title: 'Special Offer',
      message: '20% off on all music events this weekend.',
      timestamp: '1 day ago',
      read: true,
    },
  ]);

  const categories = [
    { key: 'all' as NotificationCategory, label: 'All' },
    { key: 'bookings' as NotificationCategory, label: 'Booking Updates' },
    { key: 'reminders' as NotificationCategory, label: 'Event Reminders' },
    { key: 'promotions' as NotificationCategory, label: 'Promotions' },
    { key: 'system' as NotificationCategory, label: 'System' },
  ];

  const filteredNotifications = notifications.filter(notif => {
    const matchesCategory = activeCategory === 'all' || notif.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'You\'re all caught up!'
              }
            </p>
          </div>
          <Button variant="outline">
            <span className="material-icons-outlined mr-2">settings</span>
            Settings
          </Button>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              Mark All Read
            </Button>
          </div>
        </Card>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => {
            const catCount = cat.key === 'all' 
              ? notifications.length 
              : notifications.filter(n => n.category === cat.key).length;
            
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                  activeCategory === cat.key
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                )}
              >
                <span>{cat.label}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  activeCategory === cat.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                )}>
                  {catCount}
                </span>
              </button>
            );
          })}
        </div>

        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <span className="material-icons-outlined text-6xl text-gray-300 mb-4">
              notifications_off
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You don&apos;t have any notifications</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notif => (
              <Card 
                key={notif.id} 
                className={cn(
                  "p-4 transition-all hover:shadow-md",
                  !notif.read && "border-l-4 border-l-blue-600 bg-blue-50/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={cn("font-semibold text-gray-900", !notif.read && "font-bold")}>
                      {notif.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notif.timestamp}</p>
                  </div>
                  {!notif.read && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(notif.id)}>
                      Mark as Read
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
