# 🚀 FlowGateX Routing Configuration

## Overview
This document outlines the complete routing structure for FlowGateX with role-based access control.

---

## 📍 Route Structure by Role

### 🌐 Public Routes (No Authentication Required)

#### Landing & Information
- **`/`** - Landing page with hero, events carousel, benefits
- **`/about`** - About us page
- **`/contact`** - Contact page  
- **`/help`** - Help center

#### Authentication
- **`/login`** - Login form with social login & 2FA
- **`/register`** - Registration with role selection & verification
- **`/forgot-password`** - Password recovery with OTP

#### Events (Public View)
- **`/events`** - Browse events with search, filters, map (limited view)
- **`/events/[slug]`** - Event detail page

#### Legal
- **`/terms`** - Terms of service
- **`/privacy`** - Privacy policy
- **`/refund-policy`** - Refund policy

#### Error Pages
- **`/404`** - Not found
- **`/unauthorized`** - Access denied

---

### 👤 User/Attendee Routes (Role: `user`)

**Base Path:** `/dashboard/user`

#### Overview
- **`/dashboard/user`** - User dashboard with stats, recommendations, bookings timeline, notifications

#### Events
- **`/dashboard/user/events`** - Events catalog with advanced filters, saves, capacity indicators
- **`/dashboard/user/saved`** - Saved events wishlist with alerts
- **`/events/[slug]`** - Event detail (info, tickets, reviews, booking CTA)

#### Bookings & Tickets
- **`/dashboard/user/bookings`** - My bookings with tabs (upcoming/past), QR codes, cancel/transfer
- **`/booking/[eventId]`** - Booking flow (quantity, add-ons, attendee form, promo)
- **`/payment/[bookingId]`** - Payment processing with multiple gateways
- **`/ticket/[ticketId]`** - Ticket viewer with QR code, details, wallet add

#### Account
- **`/dashboard/user/profile`** - Edit profile, payment methods, settings
- **`/dashboard/user/notifications`** - Notifications list with categories, real-time updates

**Navigation Menu:**
```
├── Dashboard
├── Events
│   ├── Browse Events
│   ├── Events Catalog
│   └── Saved Events
├── Bookings
│   └── All Bookings
└── Account
    ├── Profile
    └── Notifications
```

---

### 🎭 Organizer Routes (Role: `organizer`)

**Base Path:** `/dashboard/organizer`

#### Overview
- **`/dashboard/organizer`** - Organizer dashboard with metrics, charts, IoT overview, alerts

#### Event Management
- **`/dashboard/organizer/events/create`** - Create event (multi-step: info/schedule/venue/tickets/IoT)
- **`/dashboard/organizer/events`** - Manage events list with stats, bulk actions
- **`/dashboard/organizer/events/[id]/edit`** - Edit event with update notifications
- **`/dashboard/organizer/events/[id]/participants`** - Participants table, check-ins, exports

#### Operations & Monitoring
- **`/dashboard/organizer/iot`** - IoT device management, config, logs
- **`/dashboard/organizer/events/[id]/crowd`** - Live crowd monitoring (gauges, heatmaps, alerts)
- **`/dashboard/organizer/events/[id]/access-logs`** - Access audit logs with filters
- **`/dashboard/organizer/analytics`** - Revenue/sales trends with exports
- **`/dashboard/organizer/revenue`** - Payouts and revenue breakdowns
- **`/dashboard/organizer/marketing`** - Promo codes and campaigns

#### Account
- **`/dashboard/organizer/profile`** - Organization details, team management, payout settings

**Navigation Menu:**
```
├── Dashboard
├── Event Management
│   ├── Create Event (highlighted)
│   └── Manage Events
├── Operations
│   ├── IoT Management
│   ├── Analytics
│   └── Revenue
└── Account
    └── Profile
```

---

### 👨‍💼 Admin Routes (Role: `admin`)

**Base Path:** `/dashboard/admin`

#### Overview
- **`/dashboard/admin`** - Admin dashboard with global metrics, system health, alerts

#### User Management
- **`/dashboard/admin/users`** - User management table with suspend, role changes
- **`/dashboard/admin/organizers`** - Organizer approvals and metrics

#### Content & Events
- **`/dashboard/admin/events`** - Event moderation with flags
- **`/dashboard/admin/content`** - CMS for banners, FAQs, content management

#### Operations
- **`/dashboard/admin/analytics`** - Platform-wide analytics and trends
- **`/dashboard/admin/devices`** - IoT fleet management and diagnostics
- **`/dashboard/admin/payments`** - Transaction management and refunds
- **`/dashboard/admin/logs`** - System audit logs and error tracking

#### System Management
- **`/dashboard/admin/support`** - Support ticket management with SLA tracking
- **`/dashboard/admin/chatbot`** - AI chatbot configuration and logs
- **`/dashboard/admin/settings`** - System configurations and feature flags

**Navigation Menu:**
```
├── Dashboard
├── User Management
│   ├── Users
│   └── Organizers
├── Content & Events
│   ├── Events
│   └── Content
├── Operations
│   ├── Analytics
│   ├── IoT Devices
│   ├── Payments
│   └── System Logs
└── System
    ├── Support Tickets
    ├── Chatbot Config
    └── Settings
```

---

## 🔐 Authentication & Authorization

### Route Protection Levels

| Route Pattern | Access |
|--------------|--------|
| `/` | Public |
| `/login`, `/register` | Public (redirects if authenticated) |
| `/events` | Public (limited view) |
| `/dashboard/user/*` | Authenticated users only |
| `/dashboard/organizer/*` | Organizers and Admins |
| `/dashboard/admin/*` | Admins only |

### Middleware Protection

File: `middleware.ts`

```typescript
// Admin routes - only admins
if (path.startsWith('/dashboard/admin') && role !== 'admin') {
  redirect('/unauthorized');
}

// Organizer routes - organizers and admins
if (path.startsWith('/dashboard/organizer') && !['organizer', 'admin'].includes(role)) {
  redirect('/unauthorized');
}

// User routes - authenticated users
if (path.startsWith('/dashboard/user') && !role) {
  redirect('/login');
}
```

---

## 🎯 Role-Based Redirects After Login

| Role | Redirect To |
|------|-------------|
| **guest** | `/` (landing) |
| **user** | `/dashboard/user` |
| **organizer** | `/dashboard/organizer` |
| **admin** | `/dashboard/admin` |

### Test Accounts

```typescript
// Admin
email: admin@flowgatex.com
password: admin@123
→ Redirects to /dashboard/admin

// Organizer  
email: organizer@flowgatex.com
password: organizer@123
→ Redirects to /dashboard/organizer

// User
email: user@flowgatex.com
password: user@123
→ Redirects to /dashboard/user
```

---

## 🛠️ Implementation Files

### Core Files

1. **`src/lib/routes.ts`** - Centralized routing configuration
   - `DASHBOARD_ROUTES` - Role-to-dashboard mapping
   - `PUBLIC_ROUTES` - Public route constants
   - `USER_ROUTES` - User-specific routes
   - `ORGANIZER_ROUTES` - Organizer-specific routes
   - `ADMIN_ROUTES` - Admin-specific routes
   - Helper functions: `getDashboardRoute()`, `canAccessRoute()`, `getRedirectPath()`

2. **`src/components/shared/role-guard.tsx`** - Route protection component
   - `<RoleGuard>` - Component wrapper for role-based protection
   - `withRoleGuard()` - HOC for component protection

3. **`src/components/layout/sidebar.tsx`** - Dynamic sidebar navigation
   - `SIDEBAR_CONFIG` - Role-based menu configuration
   - Automatically shows correct menu items per role

4. **`middleware.ts`** - Server-side route protection
   - Validates role from cookies
   - Redirects unauthorized access

5. **`src/features/auth/components/auth-view.tsx`** - Authentication UI
   - Redirects to correct dashboard after login
   - Uses `getDashboardRoute()` helper

---

## 📱 Navigation Menus Summary

### Guest Navigation
- Browse Events
- About Us
- Help Center
- Contact
- **Sign In** (highlighted)

### User Navigation
- Dashboard
- Browse Events
- Events Catalog
- Saved Events
- All Bookings
- Profile
- Notifications
- Help Center

### Organizer Navigation
- Dashboard
- **Create Event** (highlighted)
- Manage Events
- IoT Management
- Analytics
- Revenue
- Profile
- Support

### Admin Navigation
- Dashboard
- Users
- Organizers
- Events
- Content
- Analytics
- IoT Devices
- Payments
- System Logs
- Support Tickets
- Chatbot Config
- Settings
- System Health

---

## 🚦 Route Status

| Status | Routes |
|--------|--------|
| ✅ Configured | All role-based redirects |
| ✅ Protected | Middleware for dashboard routes |
| ✅ Sidebar | Dynamic menus per role |
| 🔄 Pending | Individual page implementations |

---

## 📝 Usage Examples

### Using Route Constants

```typescript
import { USER_ROUTES, getDashboardRoute } from '@/lib/routes';

// Navigate to user bookings
router.push(USER_ROUTES.BOOKINGS);

// Navigate to event detail
router.push(USER_ROUTES.EVENT_DETAIL('event-slug-123'));

// Get dashboard for current user
const dashboard = getDashboardRoute(user.role);
router.push(dashboard);
```

### Using RoleGuard

```tsx
import { RoleGuard } from '@/components/shared/role-guard';

export default function OrganizerPage() {
  return (
    <RoleGuard requiredRole="organizer">
      <YourComponent />
    </RoleGuard>
  );
}
```

### Using HOC

```tsx
import { withRoleGuard } from '@/components/shared/role-guard';

function AdminPanel() {
  return <div>Admin Content</div>;
}

export default withRoleGuard(AdminPanel, 'admin');
```

---

## 🔄 Next Steps

1. ✅ Configure role-based redirects - **COMPLETED**
2. ✅ Update sidebar navigation - **COMPLETED**
3. ✅ Create route protection utilities - **COMPLETED**
4. 🔄 Implement individual page components
5. 🔄 Add page-level metadata and SEO
6. 🔄 Implement breadcrumb navigation
7. 🔄 Add analytics tracking per route

---

**Last Updated:** January 22, 2026  
**Status:** ✅ Role-Based Authentication & Routing Fully Configured
