'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalyticsCharts } from '@/features/analytics/analytics-charts';
import { LiveStatus } from '@/features/iot/components/live-status';
import { EventCard } from '@/features/events/components/event-card';
import { getEventsByOrganizer, EventData } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

// Helper function to convert EventData to EventCard format
const convertEventDataToCard = (event: EventData) => ({
  id: event.eventId || '',
  title: event.basicInfo?.title || 'Untitled Event',
  date: event.schedule?.startDate || '',
  location: {
    city: event.venue?.city || '',
    venue: event.venue?.name || '',
  },
  category: event.basicInfo?.category || '',
  price: event.tickets?.[0]?.price || 0,
  image: event.basicInfo?.bannerImage || '',
});

// --- Local Components for Dashboard Widgets ---

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: string;
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

function MetricCard({ title, value, change, trend, icon, variant = 'primary' }: MetricCardProps) {
  return (
    <div className={cn("metric-card", `metric-card-${variant}`)}>
      <div className="metric-card-content">
        <span className="metric-card-label">{title}</span>
        <span className="metric-card-value">{value}</span>
        {change && (
          <div className={cn("metric-card-change", trend === 'up' ? 'trend-up' : 'trend-down')}>
            <span className="material-icons-outlined">
              {trend === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            <span>{change}</span>
            <span className="change-label">vs last month</span>
          </div>
        )}
      </div>
      <div className="metric-card-icon">
        <span className="material-icons-outlined">{icon}</span>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  time: string;
  icon: string;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'muted';
}

function ActivityItem({ title, time, icon, variant = 'primary' }: ActivityItemProps) {
  return (
    <div className="activity-item">
      <div className={cn("activity-item-icon", `activity-icon-${variant}`)}>
        <span className="material-icons-outlined">{icon}</span>
      </div>
      <div className="activity-item-content">
        <p className="activity-item-title">{title}</p>
        <p className="activity-item-time">{time}</p>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Filter for upcoming events
  const upcomingEvents = events
    .filter(e => new Date(e.schedule.startDate) > new Date())
    .sort((a, b) => new Date(a.schedule.startDate).getTime() - new Date(b.schedule.startDate).getTime())
    .slice(0, 2);

  return (
    <div className="organizer-page">
      
      {/* Header & Quick Actions */}
      <div className="organizer-header">
        <div className="organizer-header-row">
          <div>
            <h1>Organizer Dashboard</h1>
            <p>Central command for your events and real-time insights.</p>
          </div>
          <div className="organizer-header-actions">
            <button className="organizer-btn organizer-btn-secondary">
              <span className="material-icons-outlined">file_download</span>
              Reports
            </button>
            <button className="organizer-btn organizer-btn-secondary">
              <span className="material-icons-outlined">settings_remote</span>
              IoT Controls
            </button>
            <button className="organizer-btn organizer-btn-primary">
              <span className="material-icons-outlined">add</span>
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="ai-insight-banner">
        <div className="ai-insight-icon">
          <span className="material-icons-outlined">auto_awesome</span>
        </div>
        <div className="ai-insight-content">
          <div className="ai-insight-header">
            <h4>AI Insight: High No-Show Risk Detected</h4>
            <button className="ai-insight-dismiss">
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
          <p>
            Predictive analysis suggests a <strong>15% drop in attendance</strong> for &ldquo;Summer Music Fest&rdquo; due to predicted thunderstorms. 
            <span className="block mt-1 sm:inline sm:mt-0"> Consider sending a &ldquo;Rain Advisory&rdquo; or &ldquo;Indoor Venue&rdquo; update to attendees.</span>
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <MetricCard 
          title="Total Events" 
          value="12" 
          change="+2" 
          trend="up" 
          icon="event" 
          variant="info" 
        />
        <MetricCard 
          title="Active Bookings" 
          value="1,248" 
          change="+18%" 
          trend="up" 
          icon="confirmation_number" 
          variant="success" 
        />
        <MetricCard 
          title="Revenue (YTD)" 
          value="₹8.4L" 
          change="+12%" 
          trend="up" 
          icon="payments" 
          variant="primary" 
        />
        <MetricCard 
          title="Checked In" 
          value="856" 
          change="-5%" 
          trend="down" 
          icon="qr_code_scanner" 
          variant="warning" 
        />
      </div>

      {/* Main Dashboard Layout */}
      <div className="dashboard-grid">
        
        {/* Left Column: Analytics & Timeline (66% width on large screens) */}
        <div className="dashboard-main">
          
          {/* Charts Section */}
          <section className="organizer-card">
            <div className="organizer-card-header">
              <h2 className="organizer-card-title">Performance Analytics</h2>
              <select className="organizer-select">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="organizer-card-body">
              {/* Renders Ticket Sales & Revenue Charts */}
              <AnalyticsCharts />
            </div>
          </section>

          {/* Upcoming Timeline */}
          <section className="organizer-card">
            <div className="organizer-card-header">
              <h2 className="organizer-card-title">Upcoming Timeline</h2>
              <Link href="/dashboard/organizer/events" className="organizer-link">
                View All Events <span className="material-icons-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="organizer-card-body">
              <div className="events-grid">
                {upcomingEvents.map(event => (
                  <EventCard key={event.eventId || event.basicInfo?.title} event={convertEventDataToCard(event)} />
                ))}
                
                {/* Add New Event Placeholder */}
                <button className="add-event-card">
                  <div className="add-event-icon">
                    <span className="material-icons-outlined">add</span>
                  </div>
                  <span>Schedule New Event</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Status & Activity (33% width) */}
        <div className="dashboard-sidebar">
          
          {/* IoT Status */}
          <section className="organizer-card">
            <div className="organizer-card-header">
               <h2 className="organizer-card-title">Venue Status</h2>
               <span className="live-indicator">
                  <span className="live-indicator-ping"></span>
                  <span className="live-indicator-dot"></span>
               </span>
            </div>
            <div className="organizer-card-body">
              <LiveStatus />
            </div>
          </section>

          {/* Recent Activity Feed */}
          <section className="organizer-card">
            <div className="organizer-card-header">
              <h3 className="organizer-card-title">Recent Activity</h3>
              <button className="organizer-btn organizer-btn-ghost organizer-btn-sm">
                Clear
              </button>
            </div>
            <div className="activity-feed">
              <ActivityItem 
                title="New VIP booking for Tech Summit" 
                time="2 minutes ago" 
                icon="confirmation_number" 
                variant="success"
              />
              <ActivityItem 
                title="Gate A density warning resolved" 
                time="15 minutes ago" 
                icon="check_circle" 
                variant="info"
              />
              <ActivityItem 
                title="Payment received: ₹2,500" 
                time="1 hour ago" 
                icon="attach_money" 
                variant="primary"
              />
              <ActivityItem 
                title="System maintenance scheduled" 
                time="3 hours ago" 
                icon="build" 
                variant="muted"
              />
               <ActivityItem 
                title="New 5-star review received" 
                time="5 hours ago" 
                icon="star" 
                variant="warning"
              />
            </div>
            <div className="organizer-card-footer">
              <Link href="/dashboard/organizer/activity" className="organizer-link organizer-link-center">
                View Full History
              </Link>
            </div>
          </section>

          {/* Quick Stats / Capacity Utilization */}
          <section className="organizer-card">
            <div className="organizer-card-header">
              <h3 className="organizer-card-title">Capacity Utilization</h3>
            </div>
            <div className="organizer-card-body">
              <div className="capacity-list">
                <div className="capacity-item">
                  <div className="capacity-item-header">
                    <span className="capacity-label">Main Hall A</span>
                    <span className="capacity-value">85%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill progress-info" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="capacity-item">
                  <div className="capacity-item-header">
                    <span className="capacity-label">Outdoor Arena</span>
                    <span className="capacity-value">42%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill progress-success" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div className="capacity-item">
                  <div className="capacity-item-header">
                    <span className="capacity-label">VIP Lounge</span>
                    <span className="capacity-value capacity-danger">98%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill progress-danger" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}