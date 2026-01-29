'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getEventsByOrganizer, EventData, deleteEvent } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ==========================================
// TYPES
// ==========================================

type ViewMode = 'grid' | 'list' | 'calendar';
type FilterStatus = 'all' | 'published' | 'draft' | 'completed' | 'cancelled';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: string;
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  const colorStyles = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="card p-4 flex items-center justify-between hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorStyles[color])}>
          <span className="material-icons-outlined">{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          <p className="text-sm text-[var(--text-muted)]">{label}</p>
        </div>
      </div>
      {trend && (
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", 
          trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        )}>
          {trend}
        </span>
      )}
    </div>
  );
}

function CalendarView({ events }: { events: EventData[] }) {
  // Simplified Calendar Logic for Demo
  const days = Array.from({ length: 35 }, (_, i) => i + 1); // Mock 5 weeks
  
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">October 2026</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><span className="material-icons-outlined">chevron_left</span></Button>
          <Button variant="outline" size="sm"><span className="material-icons-outlined">chevron_right</span></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="bg-gray-50 p-2 text-center text-xs font-semibold uppercase text-gray-500">
            {d}
          </div>
        ))}
        {days.map((day) => {
          // Find events on this "mock" day (using simple modulo for demo distribution)
          const daysEvents = events.filter(e => new Date(e.schedule?.startDate || '').getDate() % 30 === (day % 30));
          
          return (
            <div key={day} className="bg-white min-h-[100px] p-2 hover:bg-gray-50 transition-colors cursor-pointer group relative">
              <span className={cn("text-sm font-medium", day === 15 ? "bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full" : "text-gray-700")}>
                {day <= 31 ? day : day - 31}
              </span>
              <div className="mt-2 space-y-1">
                {daysEvents.slice(0, 3).map(evt => (
                  <div key={evt.eventId || evt.basicInfo?.title} className="text-[10px] truncate px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    {evt.basicInfo?.title || 'Untitled'}
                  </div>
                ))}
                {daysEvents.length > 3 && (
                  <div className="text-[10px] text-gray-400 pl-1">
                    + {daysEvents.length - 3} more
                  </div>
                )}
              </div>
              {/* Add Event Hover Button */}
              <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-500">
                <span className="material-icons-outlined text-sm">add</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function ManageEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State
  const [view, setView] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch events from Firebase
  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      try {
        const organizerEvents = await getEventsByOrganizer(user.id);
        setEvents(organizerEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);
  
  // Stats Calculation (Dynamic based on Firebase data)
  const totalEvents = events.length;
  const activeEvents = events.filter(e => new Date(e.schedule.startDate) > new Date()).length;
  const totalRevenue = events.reduce((acc, curr) => {
    const ticketRevenue = curr.tickets.reduce((sum, ticket) => sum + (ticket.price * (ticket.sold || 0)), 0);
    return acc + ticketRevenue;
  }, 0);
  const avgCapacity = totalEvents > 0 
    ? Math.round(events.reduce((acc, curr) => {
        const totalSold = curr.tickets.reduce((sum, ticket) => sum + (ticket.sold || 0), 0);
        return acc + (totalSold / curr.venue.capacity * 100);
      }, 0) / totalEvents)
    : 0;

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.basicInfo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.venue.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const eventDate = new Date(event.schedule.startDate);
      const now = new Date();
      let matchesStatus = true;

      if (statusFilter === 'published') matchesStatus = event.status === 'published';
      if (statusFilter === 'draft') matchesStatus = event.status === 'draft';
      if (statusFilter === 'completed') matchesStatus = event.status === 'completed' || eventDate < now;
      if (statusFilter === 'cancelled') matchesStatus = event.status === 'cancelled';
      
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  // Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredEvents.map(evt => evt.eventId || ''));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectEvent = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    alert(`${action} applied to ${selectedIds.length} events`);
    setSelectedIds([]);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">Manage Events</h1>
          <p className="text-[var(--text-muted)]">Oversee your event portfolio and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex gap-2">
             <span className="material-icons-outlined">file_download</span> Export
          </Button>
          <Link href="/dashboard/organizer/events/create">
            <Button variant="primary" className="gap-2 shadow-lg shadow-blue-500/20">
              <span className="material-icons-outlined">add</span> Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Portfolio" 
          value={totalEvents.toString()} 
          icon="layers" 
          color="blue" 
          trend="+2 this month"
        />
        <StatCard 
          label="Active Events" 
          value={activeEvents.toString()} 
          icon="event_available" 
          color="green" 
        />
        <StatCard 
          label="Total Revenue" 
          value={`₹${(totalRevenue / 100000).toFixed(2)}L`} 
          icon="payments" 
          color="purple" 
          trend="+12% vs last mo"
        />
        <StatCard 
          label="Avg. Capacity" 
          value={`${avgCapacity}%`} 
          icon="pie_chart" 
          color="orange" 
        />
      </div>

      {/* Controls Toolbar */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        
        {/* Top Row: Tabs & Search */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-auto">
            {['all', 'published', 'draft', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab as FilterStatus)}
                className={cn(
                  "flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all capitalize",
                  statusFilter === tab 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                type="text" 
                placeholder="Search events..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="px-3">
              <span className="material-icons-outlined">filter_list</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row: Bulk Actions & View Toggle */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          
          {/* Bulk Actions (Conditional) */}
          <div className="h-9">
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-3 animate-fadeIn">
                <span className="text-sm font-medium text-blue-600">{selectedIds.length} selected</span>
                <div className="h-4 w-px bg-gray-300 mx-2" />
                <button onClick={() => handleBulkAction('Publish')} className="text-xs font-medium hover:text-blue-600 flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">publish</span> Publish
                </button>
                <button onClick={() => handleBulkAction('Archive')} className="text-xs font-medium hover:text-gray-600 flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">archive</span> Archive
                </button>
                <button onClick={() => handleBulkAction('Delete')} className="text-xs font-medium hover:text-red-600 flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">delete</span> Delete
                </button>
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">Select items for bulk actions</span>
            )}
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-1.5 rounded-md transition-all", view === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              <span className="material-icons-outlined text-xl block">grid_view</span>
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-1.5 rounded-md transition-all", view === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              <span className="material-icons-outlined text-xl block">view_list</span>
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={cn("p-1.5 rounded-md transition-all", view === 'calendar' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              <span className="material-icons-outlined text-xl block">calendar_today</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {view === 'calendar' ? (
        <CalendarView events={filteredEvents} />
      ) : view === 'list' ? (
        // List View Table
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                  <th className="p-4 w-12 text-center">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredEvents.length && filteredEvents.length > 0} />
                  </th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Revenue</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map(event => {
                  const totalSold = event.tickets?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0;
                  const capacity = event.venue?.capacity || 100;
                  const percent = Math.round((totalSold / capacity) * 100);
                  const isPast = new Date(event.schedule?.startDate || '') < new Date();
                  const eventId = event.eventId || '';
                  
                  return (
                    <tr key={eventId} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(eventId)} 
                          onChange={() => handleSelectEvent(eventId)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{event.basicInfo?.title || 'Untitled'}</div>
                        <div className="text-xs text-gray-500">{event.venue?.city || ''}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-700">{event.schedule?.startDate || ''}</div>
                        <div className="text-xs text-gray-500">{event.schedule?.startTime || ''}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant={isPast ? 'secondary' : 'primary'} className={cn(isPast && "bg-gray-100 text-gray-600")}>
                          {isPast ? 'Completed' : 'Published'}
                        </Badge>
                      </td>
                      <td className="p-4 w-48">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{totalSold} / {capacity}</span>
                          <span className="font-semibold">{percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={cn("h-1.5 rounded-full", percent > 90 ? 'bg-red-500' : 'bg-green-500')} 
                            style={{ width: `${percent}%` }} 
                          />
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm">
                        ₹{event.tickets?.reduce((sum, t) => sum + (t.price * (t.sold || 0)), 0).toLocaleString() || '0'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/dashboard/organizer/events/${eventId}/edit`}>
                             <Button variant="secondary" size="sm" className="h-8 w-8 p-0"><span className="material-icons-outlined text-sm">edit</span></Button>
                          </Link>
                          <Link href={`/dashboard/organizer/events/${eventId}/participants`}>
                             <Button variant="secondary" size="sm" className="h-8 w-8 p-0"><span className="material-icons-outlined text-sm">people</span></Button>
                          </Link>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0"><span className="material-icons-outlined text-sm">more_vert</span></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map(event => {
            const totalSold = event.tickets?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0;
            const capacity = event.venue?.capacity || 100;
            const percent = Math.round((totalSold / capacity) * 100);
            const isPast = new Date(event.schedule?.startDate || '') < new Date();
            const eventId = event.eventId || '';

            return (
              <div 
                key={eventId} 
                className={cn(
                  "group relative bg-white border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1",
                  selectedIds.includes(eventId) ? "ring-2 ring-blue-500 border-transparent" : "border-gray-200"
                )}
              >
                {/* Card Header Image */}
                <div className="h-32 bg-gray-100 relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                     <input 
                       type="checkbox" 
                       className="w-5 h-5 rounded border-gray-300 cursor-pointer shadow-sm"
                       checked={selectedIds.includes(eventId)}
                       onChange={() => handleSelectEvent(eventId)}
                     />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                     <Badge variant={isPast ? 'secondary' : 'primary'} className="shadow-sm backdrop-blur-md bg-white/90">
                       {isPast ? 'Completed' : 'Published'}
                     </Badge>
                  </div>

                  {/* Mock Image Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <span className="material-icons-outlined text-4xl opacity-50">image</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1" title={event.basicInfo?.title || 'Untitled'}>{event.basicInfo?.title || 'Untitled'}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span className="material-icons-outlined text-sm">calendar_today</span>
                    {event.schedule?.startDate || ''}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Revenue</span>
                      <span className="font-bold text-gray-700">₹{((event.tickets?.reduce((sum, t) => sum + (t.price * (t.sold || 0)), 0) || 0) / 1000).toFixed(1)}k</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">Bookings</span>
                      <span className="font-bold text-gray-700">{totalSold}</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Capacity</span>
                      <span className="font-medium text-gray-700">{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className={cn("h-1.5 rounded-full", percent > 90 ? 'bg-orange-500' : 'bg-blue-500')} 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/organizer/events/${eventId}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Edit</Button>
                    </Link>
                    <Link href={`/dashboard/organizer/events/${eventId}/participants`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Guests</Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <span className="material-icons-outlined text-6xl text-gray-300 mb-4">event_busy</span>
           <h3 className="text-xl font-bold text-gray-900">No events found</h3>
           <p className="text-gray-500 mt-2">Try adjusting your filters or create a new event.</p>
           <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
             Clear Filters
           </Button>
        </div>
      )}

    </div>
  );
}