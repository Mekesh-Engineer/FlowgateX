'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { getEventById, EventData, deleteEvent, updateEventStatus } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CancelIcon from '@mui/icons-material/Cancel';
import PublicIcon from '@mui/icons-material/Public';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// ==========================================
// TYPES & MOCK DATA
// ==========================================

const TABS = [
  { label: 'Overview', href: '', active: true },
  { label: 'Analytics', href: '/analytics', active: false },
  { label: 'Participants', href: '/participants', active: false },
  { label: 'Access Logs', href: '/access-logs', active: false },
  { label: 'Crowd Density', href: '/crowd', active: false },
];

const RECENT_ENTRIES = [
  { id: 1, name: 'Alice Freeman', ticket: 'VIP Access', time: 'Just now', gate: 'Main Entrance A' },
  { id: 2, name: 'John Cooper', ticket: 'General Admission', time: '2 mins ago', gate: 'North Gate' },
  { id: 3, name: 'Marcus Chen', ticket: 'General Admission', time: '5 mins ago', gate: 'Main Entrance A' },
  { id: 4, name: 'Sarah Jessica', ticket: 'Staff', time: '8 mins ago', gate: 'Backstage Entry' },
];

// ==========================================
// SUB-COMPONENTS
// ==========================================

function StatCard({ label, value, subtext, icon, color }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className="p-4 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={cn("p-2 rounded-lg", colors[color as keyof typeof colors])}>
        {icon}
      </div>
    </Card>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    params.then(async (p) => {
      setId(p.id);
      try {
        const eventData = await getEventById(p.id);
        if (eventData) {
          // Check if user is the organizer
          if (user && eventData.organizerId !== user.id) {
            alert('You do not have permission to view this event');
            router.push('/dashboard/organizer/events');
            return;
          }
          setEvent(eventData);
        } else {
          alert('Event not found');
          router.push('/dashboard/organizer/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    });
  }, [params, user, router]);

  if (loading || !event || !id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)]">Loading event...</p>
        </div>
      </div>
    );
  }

  // Computed Stats
  const totalTicketsSold = event.tickets.reduce((sum, ticket) => sum + (ticket.sold || 0), 0);
  const revenue = event.tickets.reduce((sum, ticket) => sum + (ticket.price * (ticket.sold || 0)), 0);
  const percentFilled = Math.round((totalTicketsSold / event.venue.capacity) * 100);
  const checkInCount = event.analytics?.checkIns || 0;
  const checkInPercent = totalTicketsSold > 0 ? Math.round((checkInCount / totalTicketsSold) * 100) : 0;

  // Handlers
  const handleDuplicate = () => {
    const confirmed = window.confirm('Are you sure you want to duplicate this event?');
    if (confirmed) alert('Event duplicated to drafts!');
  };

  const handleCancelEvent = async () => {
    const confirmed = window.confirm('DANGER: This will cancel the event and notify attendees. Proceed?');
    if (confirmed && user) {
      try {
        await updateEventStatus(id, 'cancelled');
        alert('Event cancelled successfully');
        router.refresh();
      } catch (error) {
        console.error('Error cancelling event:', error);
        alert('Failed to cancel event');
      }
    }
  };

  const handleDeleteEvent = async () => {
    const confirmed = window.confirm('PERMANENT: This will delete the event permanently. This cannot be undone. Proceed?');
    if (confirmed && user) {
      try {
        await deleteEvent(id, user.id);
        alert('Event deleted successfully');
        router.push('/dashboard/organizer/events');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-white border-b border-gray-200">
        {/* Banner */}
        <div className="h-48 md:h-64 relative bg-gray-900 w-full">
          {event.basicInfo.bannerImage && (
            <Image 
              src={event.basicInfo.bannerImage} 
              alt={event.basicInfo.title} 
              fill 
              className="object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className="absolute bottom-6 left-6 md:left-8 right-6 text-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={event.status === 'published' ? 'success' : 'warning'} className="border-none">
                    {event.status === 'published' ? 'Live' : event.status}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-gray-300">
                    <CalendarTodayIcon style={{ fontSize: 14 }} /> {new Date(event.schedule.startDate).toDateString()}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-300">
                    <LocationOnIcon style={{ fontSize: 14 }} /> {event.venue.city}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-heading">{event.basicInfo.title}</h1>
              </div>

              {/* Header Actions */}
              <div className="flex flex-wrap gap-2">
                <Link href={`/events/${id}`} target="_blank">
                  <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
                    <PublicIcon fontSize="small" className="mr-2" /> View Public
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  onClick={handleDuplicate} 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                >
                  <ContentCopyIcon fontSize="small" className="mr-2" /> Duplicate
                </Button>
                <Link href={`/dashboard/organizer/events/${id}/edit`}>
                  <Button size="sm" variant="primary" className="shadow-lg shadow-blue-500/30">
                    <EditIcon fontSize="small" className="mr-2" /> Edit Event
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tabs Navigation */}
        <div className="px-6 md:px-8 flex overflow-x-auto no-scrollbar border-b border-gray-100">
          {TABS.map((tab) => (
            <Link 
              key={tab.label} 
              href={`/dashboard/organizer/events/${id}${tab.href}`}
              className={cn(
                "px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                tab.active 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ================= DASHBOARD CONTENT ================= */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Total Revenue" 
            value={`₹${revenue.toLocaleString()}`} 
            subtext="+12% from last week"
            icon={<TrendingUpIcon />} 
            color="green" 
          />
          <StatCard 
            label="Tickets Sold" 
            value={`${totalTicketsSold} / ${event.venue?.capacity || 0}`} 
            subtext={`${(event.venue?.capacity || 0) - totalTicketsSold} remaining`}
            icon={<ConfirmationNumberIcon />} 
            color="blue" 
          />
          <StatCard 
            label="Checked In" 
            value={`${checkInCount}`} 
            subtext={`${checkInPercent}% of attendees`}
            icon={<QrCodeScannerIcon />} 
            color="purple" 
          />
          <StatCard 
            label="Days Left" 
            value="14" 
            subtext="Until event start"
            icon={<AccessTimeIcon />} 
            color="orange" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: LIVE METRICS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Real-time Capacity Gauge */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Live Capacity</h3>
                  <p className="text-sm text-gray-500">Real-time venue density based on IoT sensors</p>
                </div>
                <Badge variant="success" className="animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Live
                </Badge>
              </div>

              {/* Capacity Bar Visual */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <span className="text-4xl font-bold text-gray-900">{percentFilled}%</span>
                   <span className="text-sm text-gray-500 font-medium">{totalTicketsSold} / {event.venue?.capacity || 0} Occupied</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                      percentFilled > 90 ? "bg-red-500" : percentFilled > 70 ? "bg-orange-500" : "bg-blue-500"
                    )}
                    style={{ width: `${percentFilled}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                   <div className="text-center">
                      <span className="block text-xs text-gray-500 uppercase">Main Hall</span>
                      <span className="block font-bold text-gray-800">85%</span>
                   </div>
                   <div className="text-center border-l border-gray-100">
                      <span className="block text-xs text-gray-500 uppercase">VIP Lounge</span>
                      <span className="block font-bold text-gray-800">42%</span>
                   </div>
                   <div className="text-center border-l border-gray-100">
                      <span className="block text-xs text-gray-500 uppercase">Outdoor</span>
                      <span className="block font-bold text-gray-800">12%</span>
                   </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors group">
                 <div className="flex items-center gap-3">
                   <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                     <EditIcon />
                   </div>
                   <div>
                     <h4 className="font-bold text-blue-900">Edit Details</h4>
                     <p className="text-xs text-blue-700">Update info, schedule, or tickets</p>
                   </div>
                 </div>
                 <ChevronRightIcon className="text-blue-400 group-hover:translate-x-1 transition-transform" />
               </div>

               <div onClick={handleCancelEvent} className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors group">
                 <div className="flex items-center gap-3">
                   <div className="bg-white p-2 rounded-lg text-red-600 shadow-sm">
                     <CancelIcon />
                   </div>
                   <div>
                     <h4 className="font-bold text-red-900">Cancel Event</h4>
                     <p className="text-xs text-red-700">Manage refunds and cancellation</p>
                   </div>
                 </div>
                 <ChevronRightIcon className="text-red-400 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN: RECENT ENTRIES & ACTIVITY */}
          <div className="space-y-6">
            <Card className="h-full max-h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Recent Entries</h3>
                <Link href={`/dashboard/organizer/events/${id}/access-logs`} className="text-xs text-blue-600 hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {RECENT_ENTRIES.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <PersonIcon fontSize="small" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-gray-900 truncate">{entry.name}</h5>
                      <p className="text-xs text-gray-500 truncate">{entry.ticket} • {entry.gate}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-xs font-medium text-gray-900">{entry.time}</span>
                      <span className="block text-[10px] text-green-600 font-medium">Checked In</span>
                    </div>
                  </div>
                ))}
                
                {/* Placeholder for empty state */}
                {RECENT_ENTRIES.length === 0 && (
                   <div className="text-center py-10 text-gray-400">
                     <p>No recent activity</p>
                   </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                 <Button variant="outline" size="sm" className="w-full text-xs h-8">
                   <QrCodeScannerIcon fontSize="small" className="mr-2" /> Open Scanner
                 </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}