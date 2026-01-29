'use client';

import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
} from 'recharts';

// Icons
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FilterListIcon from '@mui/icons-material/FilterList';

// ==========================================
// MOCK DATA
// ==========================================

const SALES_TRENDS_DATA = [
  { date: 'Oct 01', EventA: 4000, EventB: 2400, EventC: 2400 },
  { date: 'Oct 05', EventA: 3000, EventB: 1398, EventC: 2210 },
  { date: 'Oct 10', EventA: 2000, EventB: 9800, EventC: 2290 },
  { date: 'Oct 15', EventA: 2780, EventB: 3908, EventC: 2000 },
  { date: 'Oct 20', EventA: 1890, EventB: 4800, EventC: 2181 },
  { date: 'Oct 25', EventA: 2390, EventB: 3800, EventC: 2500 },
  { date: 'Oct 30', EventA: 3490, EventB: 4300, EventC: 2100 },
];

const FUNNEL_DATA = [
  { value: 12500, name: 'Page Views', fill: 'hsl(217, 91%, 60%)' },
  { value: 4800, name: 'Add to Cart', fill: 'hsl(258, 90%, 66%)' },
  { value: 3100, name: 'Bookings', fill: 'var(--status-success)' },
];

// Mock Revenue for the final step context
const TOTAL_REVENUE = 3100 * 150; // Avg ticket price 150

const DEMOGRAPHICS_AGE = [
  { name: '18-24', value: 35 },
  { name: '25-34', value: 45 },
  { name: '35-44', value: 15 },
  { name: '45+', value: 5 },
];

const DEMOGRAPHICS_LOCATION = [
  { name: 'Mumbai', value: 40 },
  { name: 'Delhi', value: 25 },
  { name: 'Bangalore', value: 20 },
  { name: 'Other', value: 15 },
];

const COLORS = ['hsl(217, 91%, 60%)', 'var(--status-success)', 'var(--status-warning)', 'hsl(258, 90%, 66%)'];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [activeView, setActiveView] = useState<'overview' | 'events'>('overview');

  const handleExportPDF = () => {
    // Logic to generate PDF would go here
    alert('Generating Analytics PDF Report...');
  };

  return (
    <div className="organizer-page">
      
      {/* ================= HEADER ================= */}
      <div className="organizer-header">
        <div className="organizer-header-row">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Business intelligence and performance insights.</p>
          </div>
          
          <div className="organizer-header-actions">
            {/* Date Picker */}
            <div className="organizer-select-wrapper">
              <CalendarTodayIcon fontSize="small" className="organizer-select-icon" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="organizer-select organizer-select-with-icon"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
                <option>Year to Date</option>
              </select>
            </div>

            <button className="organizer-btn organizer-btn-secondary" onClick={handleExportPDF}>
              <DownloadIcon fontSize="small" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="metrics-grid metrics-grid-3">
        <div className="metric-card metric-card-success">
          <div className="metric-card-content">
            <span className="metric-card-label">Total Revenue</span>
            <span className="metric-card-value">₹{TOTAL_REVENUE.toLocaleString()}</span>
            <div className="metric-card-change trend-up">
              <TrendingUpIcon style={{fontSize: 14}} /> +18.2%
              <span className="change-label">vs previous period</span>
            </div>
          </div>
          <div className="metric-card-icon">
            <MonetizationOnIcon />
          </div>
        </div>

        <div className="metric-card metric-card-info">
          <div className="metric-card-content">
            <span className="metric-card-label">Total Bookings</span>
            <span className="metric-card-value">3,100</span>
            <div className="metric-card-change trend-up">
              <TrendingUpIcon style={{fontSize: 14}} /> +5.4%
              <span className="change-label">vs previous period</span>
            </div>
          </div>
          <div className="metric-card-icon">
            <PeopleIcon />
          </div>
        </div>

        <div className="metric-card metric-card-primary">
          <div className="metric-card-content">
            <span className="metric-card-label">Conversion Rate</span>
            <span className="metric-card-value">24.8%</span>
            <div className="metric-card-change trend-down">
              <TrendingUpIcon style={{fontSize: 14, transform: 'rotate(180deg)'}} /> -1.2%
              <span className="change-label">vs previous period</span>
            </div>
          </div>
          <div className="metric-card-icon">
            <FilterListIcon />
          </div>
        </div>
      </div>

      <div className="dashboard-grid analytics-layout">
        
        {/* ================= REVENUE FUNNEL ================= */}
        <section className="organizer-card">
          <div className="organizer-card-header">
            <div>
              <h3 className="organizer-card-title">Conversion Funnel</h3>
              <p className="organizer-card-subtitle">Views → Cart → Bookings</p>
            </div>
          </div>
          <div className="organizer-card-body">
            <div className="chart-container-sm">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}
                  />
                  <Funnel
                    dataKey="value"
                    data={FUNNEL_DATA}
                    isAnimationActive
                  >
                    <LabelList position="right" fill="var(--text-muted)" stroke="none" dataKey="name" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footer">
              <p>
                <span className="chart-footer-highlight">42%</span> drop-off from Cart to Booking
              </p>
            </div>
          </div>
        </section>

        {/* ================= SALES TRENDS ================= */}
        <section className="organizer-card chart-wide">
          <div className="organizer-card-header">
            <div>
              <h3 className="organizer-card-title">Sales Trends Comparison</h3>
              <p className="organizer-card-subtitle">Revenue performance over time</p>
            </div>
            <div className="chart-legend">
              <span className="status-badge" style={{ background: 'hsla(217, 91%, 60%, 0.15)', color: 'hsl(217, 91%, 60%)' }}>Event A</span>
              <span className="status-badge" style={{ background: 'hsla(258, 90%, 66%, 0.15)', color: 'hsl(258, 90%, 66%)' }}>Event B</span>
              <span className="status-badge" style={{ background: 'hsla(25, 95%, 53%, 0.15)', color: 'hsl(25, 95%, 53%)' }}>Event C</span>
            </div>
          </div>
          <div className="organizer-card-body">
            <div className="chart-container-md">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SALES_TRENDS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}
                  />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="EventA" stroke="hsl(217, 91%, 60%)" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="EventB" stroke="hsl(258, 90%, 66%)" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="EventC" stroke="hsl(25, 95%, 53%)" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      {/* ================= DEMOGRAPHICS ================= */}
      <div className="section-header">
        <h2>Attendee Demographics</h2>
      </div>
      <div className="dashboard-grid dashboard-grid-2">
        
        {/* Age Distribution */}
        <section className="organizer-card">
          <div className="organizer-card-header">
            <h3 className="organizer-card-title">Age Distribution</h3>
          </div>
          <div className="organizer-card-body">
            <div className="pie-chart-layout">
              <div className="chart-container-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEMOGRAPHICS_AGE}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                  >
                    {DEMOGRAPHICS_AGE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend-list">
              {DEMOGRAPHICS_AGE.map((item, index) => (
                <div key={item.name} className="chart-legend-item">
                  <div className="chart-legend-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="chart-legend-label">{item.name}</span>
                  <span className="chart-legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* Location Distribution */}
        <section className="organizer-card">
          <div className="organizer-card-header">
            <h3 className="organizer-card-title">Top Locations</h3>
          </div>
          <div className="organizer-card-body">
            <div className="pie-chart-layout">
              <div className="chart-container-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEMOGRAPHICS_LOCATION}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {DEMOGRAPHICS_LOCATION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-primary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend-list">
                {DEMOGRAPHICS_LOCATION.map((item, index) => (
                  <div key={item.name} className="chart-legend-item">
                    <div className="chart-legend-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="chart-legend-label">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}