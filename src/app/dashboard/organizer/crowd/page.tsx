'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { cn } from '@/lib/utils';

// Icons
import GroupsIcon from '@mui/icons-material/Groups';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import MapIcon from '@mui/icons-material/Map';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FilterListIcon from '@mui/icons-material/FilterList';

// ==========================================
// MOCK DATA
// ==========================================

const ACTIVE_EVENTS = [
  { id: 1, name: 'Tech Conference 2026', current: 1240, capacity: 1500, status: 'high' },
  { id: 2, name: 'Summer Music Fest', current: 4500, capacity: 10000, status: 'normal' },
  { id: 3, name: 'Food & Wine Expo', current: 280, capacity: 300, status: 'critical' },
  { id: 4, name: 'Gaming Summit', current: 800, capacity: 2000, status: 'low' },
];

const HEATMAP_DATA = [
  { day: 'Mon', hours: [10, 20, 40, 60, 80, 90, 70, 50, 30, 10] },
  { day: 'Tue', hours: [15, 25, 45, 65, 85, 95, 75, 55, 35, 15] },
  { day: 'Wed', hours: [10, 30, 50, 70, 60, 50, 40, 30, 20, 10] },
  { day: 'Thu', hours: [20, 40, 60, 80, 90, 85, 65, 45, 25, 15] },
  { day: 'Fri', hours: [30, 50, 70, 90, 100, 95, 80, 60, 40, 20] },
  { day: 'Sat', hours: [50, 70, 90, 95, 90, 80, 70, 60, 50, 30] },
  { day: 'Sun', hours: [40, 60, 80, 85, 80, 70, 60, 50, 40, 20] },
];

const ALERT_HISTORY = [
  { id: 1, event: 'Food & Wine Expo', message: 'Zone B capacity exceeded (98%)', time: '10 mins ago', type: 'critical' },
  { id: 2, event: 'Tech Conference 2026', message: 'Main Hall approaching limit (85%)', time: '45 mins ago', type: 'warning' },
  { id: 3, event: 'Summer Music Fest', message: 'Gate 1 High Influx detected', time: '2 hours ago', type: 'info' },
  { id: 4, event: 'Tech Conference 2026', message: 'VIP Lounge capacity stabilized', time: 'Yesterday', type: 'success' },
];

const TIME_SLOTS = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'];

// ==========================================
// SUB-COMPONENTS
// ==========================================

const GaugeCard = ({ event }: { event: typeof ACTIVE_EVENTS[0] }) => {
  const percentage = Math.round((event.current / event.capacity) * 100);
  
  // Determine color based on percentage
  let colorClass = 'gauge-info';
  
  if (percentage >= 90) {
    colorClass = 'gauge-critical';
  } else if (percentage >= 75) {
    colorClass = 'gauge-warning';
  } else if (percentage < 30) {
    colorClass = 'gauge-success';
  }

  return (
    <div className={cn("crowd-gauge-card organizer-card", colorClass)}>
      <div className="gauge-card-content">
        <h3 className="gauge-card-title">{event.name}</h3>
        <p className="gauge-card-capacity">Capacity: {event.capacity.toLocaleString()}</p>
        
        {/* Semi-Circle Gauge */}
        <div className="gauge-visual">
          <div className="gauge-track"></div>
          <div 
            className="gauge-progress"
            style={{ 
              transform: `rotate(${percentage * 1.8 - 45}deg)`,
            }}
          ></div>
          <div className="gauge-cover"></div>
        </div>
        
        <div className="gauge-value-container">
           <span className="gauge-percentage">{percentage}%</span>
           <p className="gauge-active-count">{event.current.toLocaleString()} Active</p>
        </div>
      </div>

      {/* Status Badge */}
      {percentage >= 90 && (
        <div className="gauge-badge">
          <span className="status-badge critical">Critical</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function GlobalCrowdPage() {
  const [timeRange, setTimeRange] = useState('Today');

  // Computed Totals
  const totalActive = ACTIVE_EVENTS.reduce((acc, curr) => acc + curr.current, 0);
  const totalCapacity = ACTIVE_EVENTS.reduce((acc, curr) => acc + curr.capacity, 0);
  const globalOccupancy = Math.round((totalActive / totalCapacity) * 100);

  return (
    <div className="organizer-page">
      
      {/* ================= HEADER ================= */}
      <div className="organizer-header">
        <div className="organizer-header-row">
          <div>
            <h1>Global Crowd Monitoring</h1>
            <p>Real-time density tracking and cross-event patterns.</p>
          </div>
          <div className="organizer-header-actions">
            <button className="organizer-btn organizer-btn-secondary" onClick={() => window.location.reload()}>
              <RefreshIcon fontSize="small" /> Refresh Data
            </button>
            <button className="organizer-btn organizer-btn-primary">
              <MapIcon fontSize="small" /> View Live Map
            </button>
          </div>
        </div>
      </div>

      {/* ================= TOP METRICS ================= */}
      <div className="metrics-grid">
        <div className="metric-card metric-card-info">
          <div className="metric-card-content">
            <span className="metric-card-label">Global Occupancy</span>
            <span className="metric-card-value">{globalOccupancy}%<span className="metric-card-suffix"> / 100%</span></span>
            <div className="metric-card-footer">
              <GroupsIcon style={{fontSize: 14}}/> {totalActive.toLocaleString()} total attendees
            </div>
          </div>
        </div>

        <div className="metric-card metric-card-warning">
          <div className="metric-card-content">
            <span className="metric-card-label">Critical Zones</span>
            <span className="metric-card-value">3</span>
            <div className="metric-card-footer">
              <WarningAmberIcon style={{fontSize: 14}}/> Requires attention
            </div>
          </div>
        </div>

        <div className="metric-card metric-card-primary">
          <div className="metric-card-content">
            <span className="metric-card-label">Peak Time Today</span>
            <span className="metric-card-value">2:00 PM</span>
            <div className="metric-card-footer">
              <TrendingUpIcon style={{fontSize: 14}}/> Predicted high influx
            </div>
          </div>
        </div>

        <div className="metric-card metric-card-success">
          <div className="metric-card-content">
            <span className="metric-card-label">System Health</span>
            <span className="metric-card-value">98%</span>
            <div className="metric-card-footer">
              <AccessTimeIcon style={{fontSize: 14}}/> All sensors online
            </div>
          </div>
        </div>
      </div>

      {/* ================= LIVE EVENT GAUGES ================= */}
      <section className="organizer-card">
        <div className="organizer-card-header">
          <h2 className="organizer-card-title">Active Events Overview</h2>
          <button className="organizer-btn organizer-btn-ghost organizer-btn-sm">View All</button>
        </div>
        <div className="organizer-card-body">
          <div className="gauges-grid">
            {ACTIVE_EVENTS.map(event => (
              <GaugeCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <div className="dashboard-grid">
        
        {/* ================= HEATMAP SECTION ================= */}
        <section className="organizer-card dashboard-main">
          <div className="organizer-card-header">
            <div>
              <h3 className="organizer-card-title">Portfolio Heatmap</h3>
              <p className="organizer-card-subtitle">Cross-event crowd density patterns</p>
            </div>
            <div className="organizer-tabs">
              {['Today', 'Week', 'Month'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={cn("organizer-tab", timeRange === t && "organizer-tab-active")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="organizer-card-body">
            <div className="heatmap-wrapper">
              {/* Header Row */}
              <div className="heatmap-header">
                <div className="heatmap-label"></div>
                {TIME_SLOTS.map(time => (
                  <div key={time} className="heatmap-time">{time}</div>
                ))}
              </div>

              {/* Data Rows */}
              <div className="heatmap-rows">
                {HEATMAP_DATA.map((row) => (
                  <div key={row.day} className="heatmap-row">
                    <div className="heatmap-day">{row.day}</div>
                    {row.hours.map((intensity, idx) => (
                      <div 
                        key={idx} 
                        className="heatmap-cell"
                        data-intensity={intensity > 80 ? 'critical' : intensity > 60 ? 'high' : intensity > 40 ? 'moderate' : 'low'}
                        style={{ opacity: intensity / 100 + 0.2 }}
                        title={`${intensity}% Density`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="heatmap-legend">
              <div className="heatmap-legend-item"><span className="heatmap-legend-dot heatmap-low"></span> Low Traffic</div>
              <div className="heatmap-legend-item"><span className="heatmap-legend-dot heatmap-moderate"></span> Moderate</div>
              <div className="heatmap-legend-item"><span className="heatmap-legend-dot heatmap-high"></span> High</div>
              <div className="heatmap-legend-item"><span className="heatmap-legend-dot heatmap-critical"></span> Critical</div>
            </div>
          </div>
        </section>

        {/* ================= ALERT HISTORY ================= */}
        <section className="organizer-card dashboard-sidebar">
          <div className="organizer-card-header">
            <h3 className="organizer-card-title">
              <HistoryIcon fontSize="small" /> Alert History
            </h3>
            <button className="organizer-btn organizer-btn-ghost organizer-btn-sm">
              <FilterListIcon fontSize="small" />
            </button>
          </div>
          <div className="activity-feed">
            {ALERT_HISTORY.map((alert) => (
              <div key={alert.id} className="alert-item">
                <div className={cn(
                  "alert-indicator",
                  alert.type === 'critical' && 'alert-critical',
                  alert.type === 'warning' && 'alert-warning',
                  alert.type === 'success' && 'alert-success',
                  alert.type === 'info' && 'alert-info'
                )} />
                <div className="alert-content">
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-event">{alert.event}</p>
                  <p className="alert-time">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="organizer-card-footer">
            <button className="organizer-btn organizer-btn-secondary organizer-btn-full">View Full Logs</button>
          </div>
        </section>

      </div>
    </div>
  );
}