// =============================================================================
// NOTIFICATION DROPDOWN — Mega menu notification panel
// Uses CSS classes from navbar.css for consistent styling
// =============================================================================

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, CreditCard, AlertCircle, Users, Settings } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'event' | 'payment' | 'alert' | 'user' | 'system';
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Event Registration',
    message: 'Tech Conference 2026 has 50 new registrations',
    time: '5 min ago',
    read: false,
    type: 'event',
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'You received ₹15,000 for event tickets',
    time: '1 hour ago',
    read: false,
    type: 'payment',
  },
  {
    id: '3',
    title: 'System Alert',
    message: 'IoT gateway connection restored',
    time: '2 hours ago',
    read: true,
    type: 'alert',
  },
  {
    id: '4',
    title: 'New Team Member',
    message: 'John Doe joined as Event Coordinator',
    time: '3 hours ago',
    read: true,
    type: 'user',
  },
  {
    id: '5',
    title: 'Settings Updated',
    message: 'Notification preferences saved successfully',
    time: '1 day ago',
    read: true,
    type: 'system',
  },
];

// =============================================================================
// UTILITIES
// =============================================================================

function getIconClassName(type: Notification['type']): string {
  const baseClass = 'notification-icon';
  switch (type) {
    case 'event':
      return `${baseClass} is-primary`;
    case 'payment':
      return `${baseClass} is-success`;
    case 'alert':
      return `${baseClass} is-warning`;
    case 'user':
      return `${baseClass} is-info`;
    case 'system':
      return `${baseClass} is-muted`;
    default:
      return baseClass;
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Mark single as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Get icon for notification type
  const getIcon = (type: Notification['type']) => {
    const iconSize = 16;
    switch (type) {
      case 'event':
        return <Calendar size={iconSize} />;
      case 'payment':
        return <CreditCard size={iconSize} />;
      case 'alert':
        return <AlertCircle size={iconSize} />;
      case 'user':
        return <Users size={iconSize} />;
      case 'system':
        return <Settings size={iconSize} />;
    }
  };

  return (
    <div ref={dropdownRef} className="notification-dropdown-container">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="dash-header-icon-btn notification-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-badge" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`notification-dropdown-panel ${isOpen ? 'is-open' : ''}`}
        role="menu"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <header className="notification-dropdown-header">
          <span className="notification-dropdown-title">Notifications</span>
          {unreadCount > 0 && (
            <span className="notification-unread-count">{unreadCount} unread</span>
          )}
        </header>

        {/* Actions */}
        <div className="notification-dropdown-actions">
          <button
            type="button"
            onClick={markAllAsRead}
            className="notification-action-btn"
            disabled={unreadCount === 0}
          >
            <Check size={14} />
            Mark all read
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="notification-action-btn is-danger"
            disabled={notifications.length === 0}
          >
            <Trash2 size={14} />
            Clear all
          </button>
        </div>

        {/* Notification List */}
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <Bell size={32} className="notification-empty-icon" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-item ${!notification.read ? 'is-unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    markAsRead(notification.id);
                  }
                }}
                role="menuitem"
                tabIndex={0}
              >
                <div className={getIconClassName(notification.type)}>
                  {getIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                {!notification.read && <div className="notification-dot" aria-label="Unread" />}
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <footer className="notification-dropdown-footer">
            <a href="/notifications" className="notification-view-all">
              View all notifications
            </a>
          </footer>
        )}
      </div>
    </div>
  );
}
