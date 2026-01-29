'use client';

import React, { useState, use } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Icons
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// ==========================================
// MOCK DATA
// ==========================================

const LIVE_FLOW_DATA = [
  { time: '10:00', in: 45, out: 5 },
  { time: '10:15', in: 120, out: 10 },
  { time: '10:30', in: 250, out: 15 },
  { time: '10:45', in: 380, out: 25 },
  { time: '11:00', in: 290, out: 40 },
  { time: '11:15', in: 150, out: 60 },
  { time: '11:30', in: 90, out: 85 },
  { time: '11:45', in: 60, out: 110 },
];

const ZONES = [
  { id: 'Z1', name: 'Main Stage', current: 850, capacity: 1000, status: 'warning' },
  { id: 'Z2', name: 'Food Court', current: 120, capacity: 400, status: 'normal' },
  { id: 'Z3', name: 'VIP Lounge', current: 48, capacity: 50, status: 'critical' },
  { id: 'Z4', name: 'Entrance Hall', current: 200, capacity: 500, status: 'normal' },
];

const ALERTS = [
  { id: 1, type: 'critical', message: 'VIP Lounge capacity exceeded (96%)', time: '2 mins ago' },
  { id: 2, type: 'warning', message: 'Main Stage approaching limit (85%)', time: '15 mins ago' },
  { id: 3, type: 'info', message: 'Peak entry rate detected at Gate 1', time: '1 hour ago' },
];

const GAUGE_DATA = [
  { name: 'Occupied', value: 1218 },
  { name: 'Remaining', value: 782 }, // Total 2000
];
const GAUGE_COLORS = ['hsl(217, 91%, 60%)', 'hsl(220, 13%, 91%)']; // Blue, Gray

// ==========================================
// SUB-COMPONENTS
// ==========================================

const MetricCard = ({ title, value, subtext, icon, color }: any) => (
  <Card className="p-5 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
    <div className={cn("p-3 rounded-xl", color)}>
      {icon}
    </div>
  </Card>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function EventCrowdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('live');

  // Stats
  const currentOccupancy = 1218;
  const maxCapacity = 2000;
  const occupancyRate = Math.round((currentOccupancy / maxCapacity) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-3xl font-bold text-gray-900">Crowd Analytics</h1>
             <Badge variant="outline" className="font-mono text-xs">{id}</Badge>
          </div>
          <p className="text-gray-500">Real-time monitoring, zone heatmaps, and predictive safety alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={occupancyRate > 90 ? "destructive" : "success"} className="px-3 py-1.5 text-sm">
             {occupancyRate > 90 ? "Critical Density" : "Safe Levels"}
          </Badge>
          <Button variant="outline" className="gap-2 bg-white" onClick={() => window.location.reload()}>
            <RefreshIcon fontSize="small" /> Refresh
          </Button>
        </div>
      </div>

      {/* ================= TOP METRICS & GAUGE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* 1. Live Occupancy Gauge */}
        <Card className="p-6 flex flex-col items-center justify-center relative min-h-[250px]">
          <h3 className="absolute top-6 left-6 font-bold text-gray-900">Live Occupancy</h3>
          <div className="w-full h-[180px] relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GAUGE_DATA}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={occupancyRate > 90 ? 'var(--status-error)' : occupancyRate > 75 ? 'var(--status-warning)' : 'hsl(217, 91%, 60%)'} />
                  <Cell fill="hsl(220, 13%, 91%)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-4">
              <span className={cn("text-4xl font-bold", occupancyRate > 90 ? "text-red-600" : "text-blue-600")}>
                {occupancyRate}%
              </span>
              <p className="text-xs text-gray-500">Filled</p>
            </div>
          </div>
          <div className="flex justify-between w-full mt-2 px-4 text-sm border-t border-gray-100 pt-3">
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase">Current</p>
              <p className="font-bold text-gray-900">{currentOccupancy.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase">Capacity</p>
              <p className="font-bold text-gray-900">{maxCapacity.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* 2. Key Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
           <MetricCard 
             title="Entry Rate" 
             value="45 / min" 
             subtext="High influx at Main Gate" 
             icon={<LoginIcon />} 
             color="bg-green-50 text-green-600"
           />
           <MetricCard 
             title="Exit Rate" 
             value="12 / min" 
             subtext="Steady outflow" 
             icon={<ExitToAppIcon />} 
             color="bg-orange-50 text-orange-600"
           />
           <MetricCard 
             title="Predicted Peak" 
             value="02:30 PM" 
             subtext="Expect ~95% occupancy" 
             icon={<TrendingUpIcon />} 
             color="bg-purple-50 text-purple-600"
           />
           <MetricCard 
             title="Active Sensors" 
             value="24/24" 
             subtext="100% System Health" 
             icon={<GroupsIcon />} 
             color="bg-blue-50 text-blue-600"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= FLOW GRAPHS & HEATMAP ================= */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Entry/Exit Graph */}
           <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-gray-900">Flow Dynamics (Live)</h3>
                 <div className="flex gap-2">
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Entries</span>
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Exits</span>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={LIVE_FLOW_DATA}>
                       <defs>
                          <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--status-success)" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="var(--status-success)" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--status-error)" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="var(--status-error)" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                       <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}
                          labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                       />
                       <Area type="monotone" dataKey="in" stroke="var(--status-success)" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                       <Area type="monotone" dataKey="out" stroke="var(--status-error)" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Venue Heatmap (Zone Cards) */}
           <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">Zone Heatmap</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {ZONES.map((zone) => {
                    const pct = Math.round((zone.current / zone.capacity) * 100);
                    return (
                       <Card key={zone.id} className="p-4 relative overflow-hidden">
                          <div className="flex justify-between items-start mb-2 relative z-10">
                             <div>
                                <h4 className="font-bold text-gray-900">{zone.name}</h4>
                                <p className="text-xs text-gray-500">{zone.current} / {zone.capacity}</p>
                             </div>
                             <Badge variant={
                                zone.status === 'critical' ? 'destructive' : 
                                zone.status === 'warning' ? 'warning' : 'success'
                             }>
                                {pct}%
                             </Badge>
                          </div>
                          
                          <div className="w-full bg-gray-100 rounded-full h-2 mt-2 relative z-10">
                             <div 
                                className={cn("h-full rounded-full transition-all duration-500", 
                                   zone.status === 'critical' ? 'bg-red-500' : 
                                   zone.status === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                                )} 
                                style={{ width: `${pct}%` }} 
                             />
                          </div>

                          {/* Subtle Background Tint */}
                          <div className={cn("absolute inset-0 opacity-5", 
                             zone.status === 'critical' ? 'bg-red-500' : 
                             zone.status === 'warning' ? 'bg-orange-500' : 'bg-transparent'
                          )} />
                       </Card>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* ================= ALERTS & PREDICTIONS ================= */}
        <div className="space-y-8">
           
           {/* Alerts Panel */}
           <Card className="h-full max-h-[400px] flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-xl">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <NotificationsActiveIcon className="text-yellow-600" /> Threshold Alerts
                 </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {ALERTS.map((alert) => (
                    <div key={alert.id} className={cn(
                       "p-3 rounded-lg border flex gap-3",
                       alert.type === 'critical' ? "bg-red-50 border-red-200" :
                       alert.type === 'warning' ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"
                    )}>
                       <div className="mt-0.5">
                          {alert.type === 'critical' && <WarningIcon fontSize="small" className="text-red-600" />}
                          {alert.type === 'warning' && <WarningIcon fontSize="small" className="text-orange-600" />}
                          {alert.type === 'info' && <GroupsIcon fontSize="small" className="text-blue-600" />}
                       </div>
                       <div>
                          <p className={cn("text-sm font-bold", 
                             alert.type === 'critical' ? "text-red-900" : 
                             alert.type === 'warning' ? "text-orange-900" : "text-blue-900"
                          )}>{alert.message}</p>
                          <p className="text-xs opacity-70 mt-1">{alert.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-3 border-t border-gray-100 text-center text-xs text-gray-400">
                 Alerts trigger at 80% (Warn) and 95% (Crit)
              </div>
           </Card>

           {/* Predictive Insight Card */}
           <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
              <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-3">
                 <TrendingUpIcon /> AI Prediction
              </h3>
              <p className="text-sm text-indigo-800 leading-relaxed">
                 Based on current influx rates, <strong>Main Stage</strong> capacity will be reached by <strong>02:30 PM</strong>.
              </p>
              <div className="mt-4 p-3 bg-white/60 rounded-lg border border-indigo-100">
                 <div className="flex justify-between text-xs text-indigo-700 mb-1">
                    <span>Current Rate</span>
                    <span className="font-bold">+45 / min</span>
                 </div>
                 <div className="flex justify-between text-xs text-indigo-700">
                    <span>Est. Time to Full</span>
                    <span className="font-bold">25 mins</span>
                 </div>
              </div>
              <Button size="sm" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                 Divert Traffic Action
              </Button>
           </Card>

        </div>
      </div>
    </div>
  );
}