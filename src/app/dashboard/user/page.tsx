'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { getBookingsByUser, getUserSavedEvents, EventData } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [savedEvents, setSavedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch user bookings
        const userBookings = await getBookingsByUser(user.id);
        setBookings(userBookings || []);

        // Fetch saved events
        const saved = await getUserSavedEvents(user.id);
        setSavedEvents(saved || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.eventDate) > new Date());
  const totalSpent = bookings.reduce((sum, b) => sum + (b.financials?.total || 0), 0);
  const loyaltyPoints = Math.floor(totalSpent / 100);

  const quickStats: QuickStat[] = [
    {
      label: 'Active Bookings',
      value: upcomingBookings.length,
      icon: <ConfirmationNumberIcon />,
      color: 'bg-blue-500',
      trend: '+2 this month',
    },
    {
      label: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      icon: <AccountBalanceWalletIcon />,
      color: 'bg-green-500',
    },
    {
      label: 'Saved Events',
      value: savedEvents.length,
      icon: <FavoriteIcon />,
      color: 'bg-red-500',
    },
    {
      label: 'Loyalty Points',
      value: loyaltyPoints,
      icon: <StarIcon />,
      color: 'bg-yellow-500',
      trend: 'Redeem rewards',
    },
  ];

  const quickActions = [
    { icon: 'search', label: 'Browse Events', href: '/dashboard/user/events', color: 'blue' },
    { icon: 'confirmation_number', label: 'My Tickets', href: '/dashboard/user/bookings', color: 'purple' },
    { icon: 'favorite', label: 'Saved Events', href: '/dashboard/user/saved-events', color: 'red' },
    { icon: 'person', label: 'Profile', href: '/dashboard/user/profile', color: 'green' },
  ];

  const recommendedEvents: EventData[] = [
    // Mock recommended events - replace with AI-powered recommendations
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hi {user?.firstName || 'there'}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              {upcomingBookings.length > 0 
                ? `You have ${upcomingBookings.length} upcoming event${upcomingBookings.length > 1 ? 's' : ''} this week!`
                : 'Discover amazing events happening around you'
              }
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/dashboard/user/notifications')}>
            <div className="relative">
              <NotificationsIcon />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUpIcon fontSize="small" />
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} href={action.href}>
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <span className={`material-icons-outlined text-4xl text-${action.color}-600 mb-3`}>
                  {action.icon}
                </span>
                <p className="font-semibold text-gray-900">{action.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/dashboard/user/bookings">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <Card className="p-12 text-center">
              <span className="material-icons-outlined text-6xl text-gray-300 mb-4">event_busy</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
              <p className="text-gray-600 mb-4">Start exploring events and book your tickets</p>
              <Button onClick={() => router.push('/dashboard/user/events')}>
                Browse Events
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <div className="text-center">
                        <p className="text-3xl font-bold">15</p>
                        <p className="text-xs uppercase">MAR</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{booking.eventTitle}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <AccessTimeIcon fontSize="small" />
                          6:00 PM - 11:00 PM
                        </p>
                        <p className="flex items-center gap-2">
                          <LocationOnIcon fontSize="small" />
                          Grand Convention Center, Mumbai
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={() => router.push(`/ticket/${booking.id}`)}>
                          View Ticket
                        </Button>
                        <Button size="sm" variant="outline">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Confirmed
                      </span>
                      <p className="text-sm text-gray-500 mt-2">5 days left</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <Card className="p-4">
            <div className="space-y-4">
              {[
                { icon: 'check_circle', text: 'Booking confirmed for Tech Summit 2026', time: '2 hours ago', color: 'green' },
                { icon: 'notifications', text: 'Check-in reminder: Concert starts in 24hrs', time: '5 hours ago', color: 'blue' },
                { icon: 'local_offer', text: 'New promo: 20% off on Music events', time: '1 day ago', color: 'orange' },
                { icon: 'favorite', text: 'Saved 3 new events to your wishlist', time: '2 days ago', color: 'red' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className={`material-icons-outlined text-${activity.color}-600 mt-1`}>
                    {activity.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Events */}
      {recommendedEvents.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
            <Button variant="outline" size="sm">See More</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Event cards here */}
          </div>
        </div>
      )}

      {/* Persistent Chat Widget */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110">
        <span className="material-icons-outlined">chat</span>
      </button>
    </div>
  );
}
