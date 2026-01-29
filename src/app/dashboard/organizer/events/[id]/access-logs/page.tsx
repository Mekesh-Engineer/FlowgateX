'use client';

import React, { useState, useMemo, use } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

// ==========================================
// MOCK DATA
// ==========================================

const GATES = ['Main Entrance A', 'North Gate', 'VIP Entry', 'Backstage'];

const MOCK_LOGS = [
  { id: 'L-1001', timestamp: '10:45:22 AM', attendee: 'Alice Freeman', ticket: 'VIP-001', gate: 'VIP Entry', status: 'Success', reason: null },
  { id: 'L-1002', timestamp: '10:44:15 AM', attendee: 'Mark Taylor', ticket: 'GEN-402', gate: 'Main Entrance A', status: 'Duplicate', reason: 'Already Checked In (10:10 AM)' },
  { id: 'L-1003', timestamp: '10:42:00 AM', attendee: 'Sarah Jenkins', ticket: 'GEN-105', gate: 'North Gate', status: 'Success', reason: null },
  { id: 'L-1004', timestamp: '10:40:55 AM', attendee: 'Unknown User', ticket: 'INVALID-QR', gate: 'Main Entrance A', status: 'Failed', reason: 'Invalid Ticket ID' },
  { id: 'L-1005', timestamp: '10:38:30 AM', attendee: 'David Chen', ticket: 'STF-009', gate: 'Backstage', status: 'Success', reason: null },
  { id: 'L-1006', timestamp: '10:35:12 AM', attendee: 'Emily Rose', ticket: 'GEN-882', gate: 'Main Entrance A', status: 'Failed', reason: 'Wrong Gate (VIP Only)' },
  { id: 'L-1007', timestamp: '10:30:00 AM', attendee: 'James Bond', ticket: 'VIP-007', gate: 'VIP Entry', status: 'Success', reason: null },
  { id: 'L-1008', timestamp: '10:25:45 AM', attendee: 'Chris Evans', ticket: 'GEN-300', gate: 'North Gate', status: 'Success', reason: null },
  { id: 'L-1009', timestamp: '10:20:10 AM', attendee: 'Tom Holland', ticket: 'GEN-111', gate: 'Main Entrance A', status: 'Duplicate', reason: 'Already Checked In' },
  { id: 'L-1010', timestamp: '10:15:00 AM', attendee: 'Tony Stark', ticket: 'VIP-999', gate: 'VIP Entry', status: 'Success', reason: null },
];

const ANALYTICS_DATA = [
  { time: '09:00', Success: 45, Failed: 2 },
  { time: '09:30', Success: 120, Failed: 5 },
  { time: '10:00', Success: 280, Failed: 12 },
  { time: '10:30', Success: 350, Failed: 8 },
  { time: '11:00', Success: 200, Failed: 4 },
  { time: '11:30', Success: 150, Failed: 1 },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AccessLogsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gateFilter, setGateFilter] = useState('All Gates');

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchesSearch = 
        log.attendee.toLowerCase().includes(searchQuery.toLowerCase()) || 
        log.ticket.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
      const matchesGate = gateFilter === 'All Gates' || log.gate === gateFilter;

      return matchesSearch && matchesStatus && matchesGate;
    });
  }, [searchQuery, statusFilter, gateFilter]);

  // Stats
  const totalScans = MOCK_LOGS.length;
  const failedScans = MOCK_LOGS.filter(l => l.status === 'Failed').length;
  const duplicateScans = MOCK_LOGS.filter(l => l.status === 'Duplicate').length;
  const successRate = Math.round(((totalScans - failedScans - duplicateScans) / totalScans) * 100) || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-3xl font-bold text-gray-900">Access Logs</h1>
             <Badge variant="outline" className="font-mono text-xs text-gray-500">{id}</Badge>
          </div>
          <p className="text-gray-500">Real-time audit trail of all entry and exit attempts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-white" onClick={() => window.location.reload()}>
            <RefreshIcon fontSize="small" /> Refresh Logs
          </Button>
          <Button className="gap-2 shadow-lg shadow-blue-500/20">
            <FileDownloadIcon fontSize="small" /> Export Audit
          </Button>
        </div>
      </div>

      {/* ================= ANALYTICS SUMMARY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Metrics Column */}
        <div className="space-y-4">
          <Card className="p-5 border-l-4 border-l-blue-500 flex justify-between items-center">
             <div>
                <p className="text-sm text-gray-500 font-medium">Total Scans</p>
                <h4 className="text-2xl font-bold text-gray-900">{totalScans}</h4>
             </div>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <AccessTimeIcon />
             </div>
          </Card>
          
          <Card className="p-5 border-l-4 border-l-red-500 flex justify-between items-center">
             <div>
                <p className="text-sm text-gray-500 font-medium">Failed / Denied</p>
                <h4 className="text-2xl font-bold text-red-600">{failedScans}</h4>
                <p className="text-xs text-red-500 mt-1">Invalid tickets or wrong gate</p>
             </div>
             <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <ErrorIcon />
             </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-orange-500 flex justify-between items-center">
             <div>
                <p className="text-sm text-gray-500 font-medium">Duplicates</p>
                <h4 className="text-2xl font-bold text-orange-600">{duplicateScans}</h4>
                <p className="text-xs text-orange-500 mt-1">Re-entry attempts</p>
             </div>
             <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <WarningIcon />
             </div>
          </Card>
        </div>

        {/* Chart Column */}
        <Card className="lg:col-span-2 p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900">Peak Entry Times</h3>
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                 {successRate}% Success Rate
              </Badge>
           </div>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={ANALYTICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                    <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                       cursor={{fill: 'var(--bg-hover)'}}
                       contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-card)' }}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="Success" fill="var(--status-success)" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="Failed" fill="var(--status-error)" radius={[4, 4, 0, 0]} stackId="a" />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </Card>
      </div>

      {/* ================= FILTERS & TOOLBAR ================= */}
      <Card className="p-4 mb-6 shadow-sm border-gray-200">
         <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
               <input 
                 type="text" 
                 placeholder="Search by attendee or ticket ID..." 
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>

            {/* Dropdowns */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
               <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={gateFilter}
                  onChange={(e) => setGateFilter(e.target.value)}
               >
                  <option>All Gates</option>
                  {GATES.map(g => <option key={g} value={g}>{g}</option>)}
               </select>

               <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
               >
                  <option>All</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                  <option value="Duplicate">Duplicate</option>
               </select>

               <Button variant="outline" className="px-3 bg-gray-50 border-gray-200 text-gray-600">
                  <FilterListIcon fontSize="small" />
               </Button>
            </div>
         </div>
      </Card>

      {/* ================= LOG TABLE ================= */}
      <Card className="overflow-hidden border-gray-200 shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                     <th className="p-4">Timestamp</th>
                     <th className="p-4">Attendee / Ticket</th>
                     <th className="p-4">Gate</th>
                     <th className="p-4">Status</th>
                     <th className="p-4">Details</th>
                     <th className="p-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {filteredLogs.length > 0 ? (
                     filteredLogs.map((log) => (
                        <tr key={log.id} className={cn(
                           "hover:bg-gray-50 transition-colors",
                           log.status === 'Failed' ? "bg-red-50/30" : log.status === 'Duplicate' ? "bg-yellow-50/30" : ""
                        )}>
                           <td className="p-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                              {log.timestamp}
                           </td>
                           <td className="p-4">
                              <div className="font-bold text-gray-900 text-sm">{log.attendee}</div>
                              <div className="text-xs text-gray-500 font-mono">{log.ticket}</div>
                           </td>
                           <td className="p-4">
                              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                 <MeetingRoomIcon style={{fontSize: 16}} className="text-gray-400" />
                                 {log.gate}
                              </div>
                           </td>
                           <td className="p-4">
                              <Badge variant={
                                 log.status === 'Success' ? 'success' : 
                                 log.status === 'Failed' ? 'destructive' : 'warning'
                              } className="flex w-fit items-center gap-1">
                                 {log.status === 'Success' && <CheckCircleIcon style={{fontSize: 12}} />}
                                 {log.status === 'Failed' && <ErrorIcon style={{fontSize: 12}} />}
                                 {log.status === 'Duplicate' && <WarningIcon style={{fontSize: 12}} />}
                                 {log.status}
                              </Badge>
                           </td>
                           <td className="p-4">
                              {log.reason ? (
                                 <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                                    <ErrorIcon style={{fontSize: 14}} /> {log.reason}
                                 </span>
                              ) : (
                                 <span className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircleIcon style={{fontSize: 14}} /> Access Granted
                                 </span>
                              )}
                           </td>
                           <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" className="text-xs h-8 text-gray-500">
                                 Details
                              </Button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={6} className="p-12 text-center text-gray-500 italic">
                           No logs found for the selected filters.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-center text-gray-500">
            Showing {filteredLogs.length} most recent entries
         </div>
      </Card>

    </div>
  );
}