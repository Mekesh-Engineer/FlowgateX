'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// MUI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import EventIcon from '@mui/icons-material/Event';

interface EventData {
  id: string;
  eventId: string;
  status: string;
  organizerId: string;
  organizerEmail?: string;
  basicInfo: {
    title: string;
    description: string;
    category: string;
    bannerImage?: string;
    tags?: string[];
  };
  schedule: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  venue: {
    name: string;
    address: string;
    city: string;
    state?: string;
    country?: string;
    capacity: number;
    coordinates?: { lat: number; lng: number };
  };
  tickets: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    sold?: number;
  }>;
  analytics?: {
    views?: number;
    bookmarks?: number;
  };
}

export default function UserEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all events and find the one we need
        const response = await fetch(`/api/events?status=all`);
        const data = await response.json();

        if (data.events && Array.isArray(data.events)) {
          const foundEvent = data.events.find(
            (e: EventData) => e.eventId === eventId || e.id === eventId
          );

          if (foundEvent) {
            setEvent(foundEvent);
          } else {
            setError('Event not found');
          }
        } else {
          setError('Failed to fetch events');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.basicInfo.title,
          text: event?.basicInfo.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to Firebase user profile
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time helper
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Calculate ticket availability
  const getTicketAvailability = () => {
    if (!event?.tickets) return { total: 0, sold: 0, available: 0 };
    const total = event.tickets.reduce((sum, t) => sum + t.quantity, 0);
    const sold = event.tickets.reduce((sum, t) => sum + (t.sold || 0), 0);
    return { total, sold, available: total - sold };
  };

  // Get min price
  const getMinPrice = () => {
    if (!event?.tickets || event.tickets.length === 0) return 0;
    return Math.min(...event.tickets.map((t) => t.price));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <EventIcon sx={{ fontSize: 48, color: '#ef4444' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The event you&apos;re looking for doesn&apos;t exist.'}</p>
          <Button onClick={() => router.back()}>
            <ArrowBackIcon sx={{ fontSize: 20, marginRight: 1 }} />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const availability = getTicketAvailability();
  const minPrice = getMinPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSave}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isSaved ? (
                <FavoriteIcon sx={{ fontSize: 24, color: '#ef4444' }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 24, color: '#6b7280' }} />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShareIcon sx={{ fontSize: 24, color: '#6b7280' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        {event.basicInfo.bannerImage ? (
          <Image
            src={event.basicInfo.bannerImage}
            alt={event.basicInfo.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-blue-600 text-white">
            {event.basicInfo.category}
          </span>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{event.basicInfo.title}</h1>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span className="flex items-center gap-1">
              <CalendarTodayIcon sx={{ fontSize: 16 }} />
              {formatDate(event.schedule.startDate)}
            </span>
            <span className="flex items-center gap-1">
              <LocationOnIcon sx={{ fontSize: 16 }} />
              {event.venue.city}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <CalendarTodayIcon sx={{ fontSize: 28, color: '#3b82f6' }} />
                <p className="text-xs text-gray-500 mt-2">Date</p>
                <p className="font-semibold text-sm">
                  {new Date(event.schedule.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <AccessTimeIcon sx={{ fontSize: 28, color: '#3b82f6' }} />
                <p className="text-xs text-gray-500 mt-2">Time</p>
                <p className="font-semibold text-sm">{formatTime(event.schedule.startTime)}</p>
              </Card>
              <Card className="p-4 text-center">
                <LocationOnIcon sx={{ fontSize: 28, color: '#3b82f6' }} />
                <p className="text-xs text-gray-500 mt-2">Venue</p>
                <p className="font-semibold text-sm truncate">{event.venue.name}</p>
              </Card>
              <Card className="p-4 text-center">
                <PeopleIcon sx={{ fontSize: 28, color: '#3b82f6' }} />
                <p className="text-xs text-gray-500 mt-2">Capacity</p>
                <p className="font-semibold text-sm">{event.venue.capacity.toLocaleString()}</p>
              </Card>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.basicInfo.description}
              </p>
              {event.basicInfo.tags && event.basicInfo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.basicInfo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>

            {/* Schedule */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Schedule</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <CalendarTodayIcon sx={{ fontSize: 24, color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p className="font-semibold">Start</p>
                    <p className="text-gray-600">
                      {formatDate(event.schedule.startDate)} at {formatTime(event.schedule.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <CalendarTodayIcon sx={{ fontSize: 24, color: '#ef4444' }} />
                  </div>
                  <div>
                    <p className="font-semibold">End</p>
                    <p className="text-gray-600">
                      {formatDate(event.schedule.endDate)} at {formatTime(event.schedule.endTime)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Venue */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Venue</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <LocationOnIcon sx={{ fontSize: 24, color: '#22c55e' }} />
                </div>
                <div>
                  <p className="font-semibold">{event.venue.name}</p>
                  <p className="text-gray-600">{event.venue.address}</p>
                  <p className="text-gray-600">
                    {event.venue.city}
                    {event.venue.state && `, ${event.venue.state}`}
                    {event.venue.country && `, ${event.venue.country}`}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{minPrice.toLocaleString()}
                  </p>
                </div>

                {/* Availability */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Tickets Available</span>
                    <span className="font-semibold text-green-600">
                      {availability.available.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${((availability.available / availability.total) * 100).toFixed(0)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {availability.sold.toLocaleString()} tickets sold
                  </p>
                </div>

                {/* Ticket Types */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-sm">Available Tickets</h3>
                  {event.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{ticket.name}</p>
                        <p className="text-xs text-gray-500">
                          {ticket.quantity - (ticket.sold || 0)} left
                        </p>
                      </div>
                      <p className="font-semibold">₹{ticket.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Book Now Button */}
                <Link href={`/booking/${eventId}`}>
                  <Button className="w-full py-3 text-lg" size="lg">
                    <ConfirmationNumberIcon sx={{ fontSize: 20, marginRight: 1 }} />
                    Book Now
                  </Button>
                </Link>

                {/* Organizer Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Organized by</p>
                  <p className="font-medium">
                    {event.organizerEmail?.split('@')[0] || 'Event Organizer'}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
