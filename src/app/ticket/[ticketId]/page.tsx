'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getBookingById, BookingData } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';

type TicketStatus = 'valid' | 'used' | 'expired' | 'cancelled';

export default function TicketViewerPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>('valid');
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const bookingData = await getBookingById(ticketId);
        if (bookingData) {
          // Verify user owns this ticket
          if (user && bookingData.userId !== user.id) {
            alert('Unauthorized access');
            router.push('/dashboard/user/bookings');
            return;
          }

          // Check ticket status
          if (bookingData.status === 'cancelled') {
            setTicketStatus('cancelled');
          } else if (bookingData.paymentStatus !== 'paid') {
            router.push(`/payment/${ticketId}`);
            return;
          }

          setBooking(bookingData);
        } else {
          alert('Ticket not found');
          router.push('/dashboard/user/bookings');
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTicket();
    }
  }, [ticketId, user, router]);

  const handleDownload = () => {
    // In production, this would generate and download a PDF
    alert('Ticket PDF will be downloaded');
  };

  const handleAddToWallet = (platform: 'apple' | 'google') => {
    // In production, this would integrate with Apple Wallet / Google Pay
    alert(`Adding to ${platform === 'apple' ? 'Apple Wallet' : 'Google Pay'}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket for ${booking?.eventTitle}`,
        text: `My ticket for ${booking?.eventTitle}`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const bookingRef = ticketId.substring(0, 6).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Full-screen QR Modal */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <div className="relative">
            <button
              onClick={() => setFullscreen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <span className="material-icons-outlined">close</span>
            </button>
            <div className="w-80 h-80 bg-white p-8 rounded-xl">
              <QrCode2Icon style={{ fontSize: 240 }} className="text-gray-900" />
            </div>
            <p className="text-white text-center mt-4 text-sm">Scan this code at the venue entrance</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push('/dashboard/user/bookings')}>
            <span className="material-icons-outlined mr-2">arrow_back</span>
            Back to Bookings
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <ShareIcon fontSize="small" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <DownloadIcon fontSize="small" />
            </Button>
          </div>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Status Banner */}
          <div className={cn(
            "px-6 py-3 text-center font-semibold text-white",
            ticketStatus === 'valid' && "bg-green-600",
            ticketStatus === 'used' && "bg-gray-600",
            ticketStatus === 'expired' && "bg-red-600",
            ticketStatus === 'cancelled' && "bg-red-600"
          )}>
            {ticketStatus === 'valid' && (
              <span className="flex items-center justify-center gap-2">
                <CheckCircleIcon fontSize="small" />
                Valid Ticket - Ready for Entry
              </span>
            )}
            {ticketStatus === 'used' && 'Ticket Already Used'}
            {ticketStatus === 'expired' && (
              <span className="flex items-center justify-center gap-2">
                <WarningIcon fontSize="small" />
                Expired Ticket
              </span>
            )}
            {ticketStatus === 'cancelled' && (
              <span className="flex items-center justify-center gap-2">
                <WarningIcon fontSize="small" />
                Cancelled Booking
              </span>
            )}
          </div>

          {/* QR Code Section */}
          <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
            <div 
              onClick={() => ticketStatus === 'valid' && setFullscreen(true)}
              className={cn(
                "w-64 h-64 mx-auto bg-white border-4 rounded-2xl flex items-center justify-center shadow-lg",
                ticketStatus === 'valid' ? "border-green-500 cursor-pointer hover:scale-105 transition-transform" : "border-gray-300 opacity-50"
              )}
            >
              <QrCode2Icon style={{ fontSize: 200 }} className="text-gray-800" />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {ticketStatus === 'valid' ? 'Tap to enlarge for scanning' : 'QR Code not available'}
            </p>
          </div>

          {/* Booking Reference */}
          <div className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
            <p className="text-sm opacity-90 mb-1">Booking Reference</p>
            <p className="text-3xl font-bold tracking-wider">{bookingRef}</p>
          </div>

          {/* Event Details */}
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{booking.eventTitle}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <ConfirmationNumberIcon fontSize="small" />
                <span className="text-sm">Booking ID: {ticketId.substring(0, 12)}</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <CalendarTodayIcon className="text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Event Date</p>
                <p className="text-gray-600">Saturday, March 15, 2026</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AccessTimeIcon className="text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Event Time</p>
                <p className="text-gray-600">6:00 PM - 11:00 PM IST</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <LocationOnIcon className="text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Venue</p>
                <p className="text-gray-600">Grand Convention Center</p>
                <p className="text-sm text-gray-500">123 Main Street, Mumbai, Maharashtra</p>
                <button className="text-blue-600 text-sm hover:underline mt-1">View on Map</button>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Ticket Details</h3>
              {Object.entries(booking.items.tickets).map(([tier, quantity]) => (
                <div key={tier} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{tier}</p>
                    <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                  </div>
                  <span className="text-blue-600 font-semibold">₹{(quantity * 999).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Attendees */}
            {booking.attendees && booking.attendees.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <PersonIcon fontSize="small" />
                  Attendees
                </h3>
                {booking.attendees.map((attendee, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span>{attendee.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{attendee.email}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Entry Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Entry Instructions</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Present this QR code at the venue entrance</li>
                <li>• Arrive 30 minutes before start time</li>
                <li>• Carry a valid photo ID</li>
                <li>• This ticket is non-transferable</li>
              </ul>
            </div>

            {/* Wallet Integration */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Add to Wallet</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleAddToWallet('apple')} className="justify-center">
                  <AppleIcon className="mr-2" />
                  Apple Wallet
                </Button>
                <Button variant="outline" onClick={() => handleAddToWallet('google')} className="justify-center">
                  <AndroidIcon className="mr-2" />
                  Google Pay
                </Button>
              </div>
            </div>

            {/* Screenshot Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <WarningIcon className="text-yellow-600 mb-2" />
              <p className="text-sm text-yellow-800 font-medium">
                Don&apos;t screenshot this ticket! Always use the official app for valid entry.
              </p>
            </div>

            {/* Support */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Need help?</p>
              <Button variant="outline" size="sm">
                <span className="material-icons-outlined mr-2 text-sm">support_agent</span>
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Offline Mode Notice */}
        <div className="mt-6 bg-white rounded-xl p-4 text-center border border-gray-200">
          <span className="material-icons-outlined text-green-600 mb-2">cloud_done</span>
          <p className="text-sm text-gray-700 font-medium">This ticket is available offline</p>
          <p className="text-xs text-gray-500 mt-1">Works even without internet connection</p>
        </div>
      </div>
    </div>
  );
}
