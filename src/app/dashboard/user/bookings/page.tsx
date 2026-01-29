'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { getBookingsByUser, cancelBooking } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShareIcon from '@mui/icons-material/Share';
import CancelIcon from '@mui/icons-material/Cancel';
import QrCode2Icon from '@mui/icons-material/QrCode2';

type BookingTab = 'upcoming' | 'past' | 'cancelled' | 'expired';

// Local interface for UI display
interface BookingData {
  id: string;
  eventTitle: string;
  eventDate: string;
  status: string;
  paymentStatus: string;
  financials: {
    total: number;
  };
  items: {
    tickets: Record<string, number>;
  };
  venue?: string;
  orderId?: string;
  eventId?: string;
  userId?: string;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const userBookings = await getBookingsByUser(user.id);
        // Map service data to UI data structure
        const mappedBookings: BookingData[] = userBookings.map((booking: any) => ({
          id: booking.id || '',
          eventTitle: booking.eventTitle || 'Unknown Event',
          eventDate: booking.eventDate || new Date().toISOString(),
          status: booking.status || 'pending',
          paymentStatus: booking.paymentStatus || 'pending',
          financials: booking.financials || { total: 0 },
          items: booking.items || { tickets: {} },
          venue: booking.venue,
          orderId: booking.orderId,
          eventId: booking.eventId,
          userId: booking.userId,
        }));
        setBookings(mappedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const filterBookings = (tab: BookingTab) => {
    const now = new Date();
    return bookings.filter(booking => {
      const eventDate = new Date(booking.eventDate);
      
      switch (tab) {
        case 'upcoming':
          return booking.status === 'confirmed' && eventDate >= now;
        case 'past':
          return booking.status === 'confirmed' && eventDate < now;
        case 'cancelled':
          return booking.status === 'cancelled';
        case 'expired':
          return booking.status === 'expired';
        default:
          return true;
      }
    }).filter(booking => 
      searchQuery === '' || 
      booking.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Refunds are subject to the cancellation policy.')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const handleBulkDownload = () => {
    if (selectedBookings.size === 0) {
      alert('Please select bookings to download');
      return;
    }
    alert(`Downloading ${selectedBookings.size} ticket(s) as ZIP`);
  };

  const toggleBookingSelection = (bookingId: string) => {
    const newSelection = new Set(selectedBookings);
    if (newSelection.has(bookingId)) {
      newSelection.delete(bookingId);
    } else {
      newSelection.add(bookingId);
    }
    setSelectedBookings(newSelection);
  };

  const tabs: { key: BookingTab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: filterBookings('upcoming').length },
    { key: 'past', label: 'Past', count: filterBookings('past').length },
    { key: 'cancelled', label: 'Cancelled', count: filterBookings('cancelled').length },
    { key: 'expired', label: 'Expired', count: filterBookings('expired').length },
  ];

  const filteredBookings = filterBookings(activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your event tickets and bookings</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by event name or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <FilterListIcon className="mr-2" />
              Filters
            </Button>
            {selectedBookings.size > 0 && (
              <Button variant="outline" onClick={handleBulkDownload}>
                <DownloadIcon className="mr-2" />
                Download ({selectedBookings.size})
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Statuses</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">Apply Filters</Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "pb-3 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              )}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="p-12 text-center">
          <span className="material-icons-outlined text-6xl text-gray-300 mb-4">
            event_busy
          </span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {activeTab} bookings found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Start exploring events and book your tickets'}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push('/dashboard/user/events')}>
              Browse Events
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedBookings.has(booking.id)}
                    onChange={() => toggleBookingSelection(booking.id)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  {/* Event Image */}
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <ConfirmationNumberIcon style={{ fontSize: 40 }} />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{booking.eventTitle}</h3>
                        <p className="text-sm text-gray-500">Order ID: {booking.orderId || booking.id.substring(0, 12)}</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        booking.status === 'confirmed' && "bg-green-100 text-green-800",
                        booking.status === 'pending' && "bg-yellow-100 text-yellow-800",
                        booking.status === 'cancelled' && "bg-red-100 text-red-800"
                      )}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarTodayIcon fontSize="small" />
                        <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-sm">location_on</span>
                        <span>{booking.venue || 'Venue TBA'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-sm">confirmation_number</span>
                        <span>{Object.values(booking.items.tickets).reduce((a, b) => a + b, 0)} ticket(s)</span>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
                        {Object.entries(booking.items.tickets).map(([tier, qty]) => (
                          <div key={tier}>
                            <span className="text-gray-600">{tier}:</span>
                            <span className="font-semibold text-gray-900 ml-1">{qty}</span>
                          </div>
                        ))}
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold text-gray-900 ml-1">₹{booking.financials.total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'confirmed' && (
                          <>
                            <Button size="sm" onClick={() => router.push(`/ticket/${booking.id}`)}>
                              <QrCode2Icon className="mr-2" fontSize="small" />
                              View Ticket
                            </Button>
                            <Button size="sm" variant="outline">
                              <DownloadIcon className="mr-2" fontSize="small" />
                              Download PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              <CalendarTodayIcon className="mr-2" fontSize="small" />
                              Add to Calendar
                            </Button>
                            <Button size="sm" variant="outline">
                              <ShareIcon className="mr-2" fontSize="small" />
                              Transfer
                            </Button>
                            {new Date(booking.eventDate) > new Date() && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <CancelIcon className="mr-2" fontSize="small" />
                                Request Refund
                              </Button>
                            )}
                          </>
                        )}
                        {booking.status === 'cancelled' && (
                          <span className="text-sm text-gray-600">
                            Refund Status: Processing (3-5 business days)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
