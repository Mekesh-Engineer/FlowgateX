# FlowGateX - Enterprise Event Management Platform

A complete Next.js 14+ application with App Router architecture, featuring multi-role access control (User, Organizer, Admin), IoT integration, and real-time analytics.

## Project Structure

```
flowgatex/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router (60+ pages)
│   ├── components/        # Shared UI components
│   ├── features/          # Feature-based modules
│   ├── lib/              # Utilities & config
│   ├── providers/        # React contexts
│   ├── store/            # Redux state management
│   └── hooks/            # Global hooks
├── middleware.ts         # RBAC security
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Features

- **60+ Pages** organized by route groups: `(auth)`, `(dashboard)`, `(public)`
- **Multi-Role Access Control**: User, Organizer, Admin dashboards
- **Server-First Architecture**: Server Components by default
- **Feature-Owned Modules**: Self-contained features with UI/types/actions
- **RBAC via Middleware**: Secure route protection at the edge
- **Real-time IoT**: Firestore listeners for live data
- **Analytics Dashboard**: Event metrics and insights
- **Booking System**: Seat selection and payment integration
- **ChatBot Support**: AI-powered customer support

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flowgatex
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT_KEY=your_service_account_key
```

4. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Key Routes

### Public Routes
- `/` - Landing page
- `/events` - Browse events
- `/events/[slug]` - Event details
- `/about` - About page
- `/help` - Help & support
- `/contact` - Contact page

### Auth Routes
- `/login` - User login
- `/register` - User registration

### User Dashboard
- `/dashboard/user` - User home
- `/dashboard/user/bookings` - My bookings
- `/dashboard/user/profile` - Profile settings
- `/dashboard/user/saved-events` - Saved events
- `/dashboard/user/notifications` - Notifications

### Organizer Dashboard
- `/dashboard/organizer` - Organizer home
- `/dashboard/organizer/events` - Manage events
- `/dashboard/organizer/events/create` - Create event
- `/dashboard/organizer/events/[id]/*` - Event management
- `/dashboard/organizer/iot` - IoT devices
- `/dashboard/organizer/analytics` - Event analytics
- `/dashboard/organizer/revenue` - Revenue tracking

### Admin Dashboard
- `/dashboard/admin` - Admin home
- `/dashboard/admin/users` - User management
- `/dashboard/admin/organizers` - Organizer management
- `/dashboard/admin/events` - Event moderation
- `/dashboard/admin/devices` - Device management
- `/dashboard/admin/analytics` - System analytics
- `/dashboard/admin/settings` - System settings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **State**: Redux Toolkit, React Context
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Validation**: Zod
- **API Client**: Axios
- **Types**: TypeScript

## Development

### Lint & Format
```bash
npm run lint
npm run format
```

### Type Checking
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
npm start
```

## Architecture Principles

1. **Server Components First** - All `page.tsx` are Server Components by default
2. **Feature Ownership** - Each feature owns its UI, hooks, types, and actions
3. **RBAC Protection** - Route guards via middleware, not client-side checks
4. **Modular Design** - Features are self-contained and reusable
5. **Type Safety** - Full TypeScript coverage with Zod validation

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

---

Built with ❤️ for enterprise event management
