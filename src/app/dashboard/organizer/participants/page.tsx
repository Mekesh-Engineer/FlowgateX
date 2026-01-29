'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EmailIcon from '@mui/icons-material/Email';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import PieChartIcon from '@mui/icons-material/PieChart';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// ==========================================
// MOCK DATA
// ==========================================

const GLOBAL_PARTICIPANTS = [
  { id: 'GP001', name: 'Amit Sharma', email: 'amit@example.com', event: 'Tech Conference 2026', type: 'VIP', status: 'Checked In', spent: 2500, visits: 3 },
  { id: 'GP002', name: 'Priya Patel', email: 'priya@example.com', event: 'Summer Music Fest', type: 'General', status: 'Checked In', spent: 1200, visits: 1 },
  { id: 'GP003', name: 'Rahul Kumar', email: 'rahul@example.com', event: 'Tech Conference 2026', type: 'Standard', status: 'Pending', spent: 800, visits: 2 },
  { id: 'GP004', name: 'Sneha Reddy', email: 'sneha@example.com', event: 'Food Expo', type: 'General', status: 'Checked In', spent: 500, visits: 5 },
  { id: 'GP005', name: 'John Doe', email: 'john@test.com', event: 'Startup Summit', type: 'Speaker', status: 'Checked In', spent: 0, visits: 1 },
  { id: 'GP006', name: 'Sarah Connor', email: 'sarah@skynet.net', event: 'Tech Conference 2026', type: 'VIP', status: 'Cancelled', spent: 2500, visits: 2 },
  { id: 'GP007', name: 'Amit Sharma', email: 'amit@example.com', event: 'Food Expo', type: 'General', status: 'Pending', spent: 500, visits: 3 }, // Repeat visitor entry
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function GlobalParticipantsPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('All Events');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Derived Stats
  const uniqueAttendees = new Set(GLOBAL_PARTICIPANTS.map(p => p.email)).size;
  const repeatVisitors = GLOBAL_PARTICIPANTS.filter(p => p.visits > 1).length;
  // Note: Simple mock logic for demonstration. In real app, you'd aggregate by email.
  const totalRevenue = GLOBAL_PARTICIPANTS.reduce((acc, curr) => acc + curr.spent, 0);

  // Filter Logic
  const filteredData = useMemo(() => {
    return GLOBAL_PARTICIPANTS.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEvent = eventFilter === 'All Events' || p.event === eventFilter;
      const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [searchQuery, eventFilter, statusFilter]);

  // Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Participant Directory</h1>
          <p className="text-gray-500">View and manage attendees across your entire event portfolio.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-white">
            <GroupIcon fontSize="small" /> Create Segment
          </Button>
          <Button className="gap-2 shadow-lg shadow-blue-500/20">
            <EmailIcon fontSize="small" /> Global Message
          </Button>
        </div>
      </div>

      {/* ================= LIFETIME STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Unique Attendees</p>
            <h4 className="text-2xl font-bold text-gray-900">{uniqueAttendees.toLocaleString()}</h4>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUpIcon style={{ fontSize: 14 }} /> +12% this month
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <PersonIcon />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Repeat Visitors</p>
            <h4 className="text-2xl font-bold text-gray-900">{repeatVisitors}</h4>
            <p className="text-xs text-gray-400 mt-1">
              {(repeatVisitors / GLOBAL_PARTICIPANTS.length * 100).toFixed(0)}% retention rate
            </p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <LoyaltyIcon />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Lifetime Value</p>
            <h4 className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</h4>
            <p className="text-xs text-gray-400 mt-1">Avg. spend per user</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <StarIcon />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Engagement</p>
            <h4 className="text-2xl font-bold text-gray-900">High</h4>
            <p className="text-xs text-gray-400 mt-1">Based on open rates</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <PieChartIcon />
          </div>
        </Card>
      </div>

      {/* ================= FILTERS & TOOLBAR ================= */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
            <input 
              type="text" 
              placeholder="Search across all events..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-sm"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            >
              <option>All Events</option>
              <option>Tech Conference 2026</option>
              <option>Summer Music Fest</option>
              <option>Food Expo</option>
            </select>

            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Checked In</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            
            <Button variant="outline" className="px-3" title="More Filters">
               <FilterListIcon fontSize="small" />
            </Button>
            <Button variant="outline" className="px-3" title="Export Data">
               <FileDownloadIcon fontSize="small" />
            </Button>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
           <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100 animate-fadeIn">
              <span className="text-sm font-semibold text-blue-800">{selectedIds.length} participants selected</span>
              <div className="flex gap-2">
                 <Button size="sm" className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-100">
                    Add to Segment
                 </Button>
                 <Button size="sm" className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-100">
                    Export Selection
                 </Button>
              </div>
           </div>
        )}
      </div>

      {/* ================= CROSS-EVENT TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                  />
                </th>
                <th className="p-4">Participant</th>
                <th className="p-4">Event Context</th>
                <th className="p-4">Ticket & Status</th>
                <th className="p-4">Engagement</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleSelectOne(p.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <EventIcon fontSize="small" className="text-gray-400" style={{ fontSize: 16 }} />
                        {p.event}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs border border-gray-200">{p.type}</span>
                        <Badge variant={p.status === 'Checked In' ? 'success' : p.status === 'Cancelled' ? 'destructive' : 'warning'}>
                          {p.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                          <LoyaltyIcon style={{ fontSize: 12 }} /> {p.visits} events visited
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mt-0.5">
                          <StarIcon style={{ fontSize: 12 }} /> ₹{p.spent} lifetime spend
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                          <MoreVertIcon fontSize="small" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                       No participants found.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
           <p className="text-sm text-gray-500">Showing {filteredData.length} records</p>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
           </div>
        </div>
      </div>
    </div>
  );
}