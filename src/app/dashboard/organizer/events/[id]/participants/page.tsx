'use client';

import React, { useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';

// ==========================================
// MOCK DATA & TYPES
// ==========================================

interface Participant {
  id: string;
  name: string;
  email: string;
  ticketType: 'VIP' | 'General' | 'Early Bird' | 'Staff';
  status: 'Checked In' | 'Pending' | 'Cancelled';
  date: string;
  qrCode: string;
}

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'P001', name: 'Alice Freeman', email: 'alice.f@example.com', ticketType: 'VIP', status: 'Checked In', date: '2025-10-12', qrCode: 'qr-001' },
  { id: 'P002', name: 'Bob Smith', email: 'bob.smith@test.co', ticketType: 'General', status: 'Pending', date: '2025-10-15', qrCode: 'qr-002' },
  { id: 'P003', name: 'Charlie Kim', email: 'ckim@design.net', ticketType: 'Early Bird', status: 'Checked In', date: '2025-09-20', qrCode: 'qr-003' },
  { id: 'P004', name: 'Diana Prince', email: 'diana@themyscira.com', ticketType: 'VIP', status: 'Pending', date: '2025-10-18', qrCode: 'qr-004' },
  { id: 'P005', name: 'Evan Wright', email: 'evan.w@tech.io', ticketType: 'General', status: 'Cancelled', date: '2025-10-05', qrCode: 'qr-005' },
  { id: 'P006', name: 'Fiona Gallagher', email: 'fiona@chi.com', ticketType: 'General', status: 'Checked In', date: '2025-10-22', qrCode: 'qr-006' },
  { id: 'P007', name: 'George Miller', email: 'gmiller@fury.road', ticketType: 'Staff', status: 'Checked In', date: '2025-08-10', qrCode: 'qr-007' },
  { id: 'P008', name: 'Hannah Montana', email: 'hannah@disney.com', ticketType: 'VIP', status: 'Pending', date: '2025-10-30', qrCode: 'qr-008' },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Checked In' | 'Pending'>('All');
  const [ticketFilter, setTicketFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);

  // Stats Calculation
  const total = participants.length;
  const checkedIn = participants.filter(p => p.status === 'Checked In').length;
  const pending = participants.filter(p => p.status === 'Pending').length;
  const checkInRate = Math.round((checkedIn / total) * 100) || 0;

  // Filtering Logic
  const filteredData = useMemo(() => {
    return participants.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesTicket = ticketFilter === 'All' || p.ticketType === ticketFilter;

      return matchesSearch && matchesStatus && matchesTicket;
    });
  }, [searchQuery, statusFilter, ticketFilter, participants]);

  // Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (participantId: string) => {
    setSelectedIds(prev => 
      prev.includes(participantId) ? prev.filter(id => id !== participantId) : [...prev, participantId]
    );
  };

  const handleBulkCheckIn = () => {
    setParticipants(prev => prev.map(p => 
      selectedIds.includes(p.id) && p.status === 'Pending' ? { ...p, status: 'Checked In' } : p
    ));
    setSelectedIds([]);
    alert(`Manually checked in ${selectedIds.length} participants.`);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Ticket Type", "Status", "Date"];
    const rows = filteredData.map(p => [p.id, p.name, p.email, p.ticketType, p.status, p.date]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `participants_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <Link href={`/dashboard/organizer/events/${id}`} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 w-fit">
          <ArrowBackIcon fontSize="small" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Participants</h1>
            <p className="text-gray-500 mt-1">Manage attendees, tickets, and check-in status.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
               <RefreshIcon fontSize="small" /> Refresh
            </Button>
            <Button variant="outline" onClick={handleExportCSV} className="gap-2 bg-white">
               <FileDownloadIcon fontSize="small" /> Export CSV
            </Button>
            <Button className="gap-2 shadow-lg shadow-blue-500/20">
               <PersonIcon fontSize="small" /> Add Attendee
            </Button>
          </div>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500">Total Registrations</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500">Checked In</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-green-700">{checkedIn}</p>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{checkInRate}%</span>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <p className="text-sm text-gray-500">Pending Arrival</p>
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-gray-400">
          <p className="text-sm text-gray-500">Cancellations</p>
          <p className="text-2xl font-bold text-gray-600">{participants.filter(p => p.status === 'Cancelled').length}</p>
        </Card>
      </div>

      {/* ================= TOOLBAR & FILTERS ================= */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All Status</option>
                <option value="Checked In">Checked In</option>
                <option value="Pending">Pending</option>
              </select>
              <FilterListIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fontSize="small" />
            </div>

            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={ticketFilter}
                onChange={(e) => setTicketFilter(e.target.value)}
              >
                <option value="All">All Tickets</option>
                <option value="VIP">VIP</option>
                <option value="General">General</option>
                <option value="Early Bird">Early Bird</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100 animate-fadeIn">
             <span className="text-sm font-semibold text-blue-800">{selectedIds.length} users selected</span>
             <div className="flex gap-2">
               <Button size="sm" onClick={handleBulkCheckIn} className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-100">
                 <CheckCircleIcon fontSize="small" className="mr-2" /> Mark Checked-in
               </Button>
               <Button size="sm" className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-100">
                 <MailOutlineIcon fontSize="small" className="mr-2" /> Email
               </Button>
               <Button size="sm" className="bg-white text-red-600 border border-red-200 hover:bg-red-50">
                 <RemoveCircleOutlineIcon fontSize="small" className="mr-2" /> Refund
               </Button>
             </div>
          </div>
        )}
      </div>

      {/* ================= DATA TABLE ================= */}
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
                <th className="p-4">Name / ID</th>
                <th className="p-4">Ticket Info</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">QR</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIds.includes(participant.id)}
                        onChange={() => handleSelectOne(participant.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{participant.name}</div>
                      <div className="text-xs text-gray-500">{participant.email}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{participant.id}</div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold border",
                        participant.ticketType === 'VIP' ? "bg-purple-50 text-purple-700 border-purple-200" :
                        participant.ticketType === 'Staff' ? "bg-gray-100 text-gray-700 border-gray-300" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      )}>
                        {participant.ticketType}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={
                        participant.status === 'Checked In' ? 'success' : 
                        participant.status === 'Cancelled' ? 'destructive' : 'warning'
                      }>
                        {participant.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {participant.date}
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded hover:bg-gray-200">
                        <QrCodeIcon fontSize="small" />
                      </button>
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
                  <td colSpan={7} className="p-12 text-center text-gray-500 italic bg-gray-50">
                    No participants found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Static Mock) */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <p className="text-sm text-gray-500">Showing {filteredData.length} of {total} results</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredData.length < 10}>Next</Button>
          </div>
        </div>
      </div>

    </div>
  );
}