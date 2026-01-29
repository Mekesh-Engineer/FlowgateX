# Events Catalog Quick Reference

## 🚀 Quick Start

The Events Catalog is now fully integrated with Firebase Realtime Database. All you need to do is ensure you have published events in your Firebase database.

## 📂 File Locations

| Component | Path |
|-----------|------|
| **Main Catalog** | [src/features/events/components/event-catalog.tsx](src/features/events/components/event-catalog.tsx) |
| **Event Card** | [src/features/events/components/catalog-event-card.tsx](src/features/events/components/catalog-event-card.tsx) |
| **Filters** | [src/features/events/store/event-filters.tsx](src/features/events/store/event-filters.tsx) |
| **Store** | [src/features/events/store/event-catalog.store.ts](src/features/events/store/event-catalog.store.ts) |
| **Constants** | [src/features/events/event.constants.ts](src/features/events/event.constants.ts) |
| **Service** | [src/services/eventService.ts](src/services/eventService.ts) |
| **Page** | [src/app/dashboard/user/events/page.tsx](src/app/dashboard/user/events/page.tsx) |

## 🎯 Key Functions

### Fetch Published Events
```typescript
import { getPublishedEvents } from '@/services/eventService';

const events = await getPublishedEvents();
// Returns: Event[] (only published, future events)
```

### Real-time Subscription
```typescript
import { subscribeToPublishedEvents } from '@/services/eventService';

const unsubscribe = subscribeToPublishedEvents((events) => {
  console.log('Events updated:', events);
  // Update your state here
});

// Don't forget to cleanup:
useEffect(() => {
  return () => unsubscribe();
}, []);
```

### Get Single Event
```typescript
import { getEventById } from '@/services/eventService';

const event = await getEventById('event-123');
// Returns: EventData | null
```

### Convert to Frontend Format
```typescript
import { convertEventDataToEvent } from '@/services/eventService';

const firebaseEvent = await getEventById('event-123');
const frontendEvent = convertEventDataToEvent(firebaseEvent);
// Now has the Event type with all computed fields
```

## 🎨 Store Actions

### Access the Store
```typescript
import { useEventCatalogStore } from '@/features/events/store/event-catalog.store';

const { 
  viewMode,      // 'grid' | 'list'
  filters,       // Current filter state
  setViewMode,   // Change view
  setFilter,     // Update a filter
  resetFilters   // Reset all filters
} = useEventCatalogStore();
```

### Change View Mode
```typescript
setViewMode('grid');  // or 'list'
```

### Update Filters
```typescript
// Category
setFilter('category', 'music'); // or 'sports', 'tech', etc.

// Search
setFilter('search', 'concert');

// Price Range
setFilter('priceRange', [0, 5000]);

// Availability
setFilter('onlyAvailable', true);

// Reset All
resetFilters();
```

## 🗂️ Event Categories

Available in `EVENT_CATEGORIES` from [src/features/events/event.constants.ts](src/features/events/event.constants.ts):

| ID | Name | Icon |
|----|------|------|
| `music` | Music & Concerts | headphones |
| `sports` | Sports & Fitness | sports_soccer |
| `tech` | Tech & Innovation | computer |
| `food` | Food & Drinks | restaurant |
| `art` | Art & Culture | palette |
| `business` | Business & Networking | business_center |
| `education` | Education & Workshops | school |
| `gaming` | Gaming & Esports | sports_esports |

## 📊 Event Data Structure

### Firebase Schema (EventData)
```typescript
{
  eventId: string;
  organizerId: string;
  status: 'published';
  basicInfo: {
    title: string;
    description: string;
    category: string;
    bannerImage: string | null;
  };
  schedule: {
    startDate: string;      // 'YYYY-MM-DD'
    startTime: string;      // 'HH:MM'
    endDate: string;
    endTime: string;
  };
  venue: {
    name: string;
    address: string;
    city: string;
    capacity: number;
    coordinates: { lat: number; lng: number };
  };
  tickets: Array<{
    name: string;
    price: number;
    quantity: number;
    sold: number;
  }>;
}
```

### Frontend Schema (Event)
```typescript
{
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: {
    venue: string;
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  price: number;           // Minimum ticket price
  capacity: number;
  attendees: number;       // Total sold
  available: number;       // Remaining seats
  category: string;
  image: string;
  organizer: { id, name, email };
  status: 'published';
  ticketTiers: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    available: number;
    sold: number;
  }>;
}
```

## 🎭 Component Usage

### Use the Complete Catalog
```tsx
import { EventCatalog } from '@/features/events/components/event-catalog';

export default function EventsPage() {
  return <EventCatalog />;
}
```

### Use Individual Cards
```tsx
import { CatalogEventCard } from '@/features/events/components/catalog-event-card';
import { getPublishedEvents } from '@/services/eventService';

const events = await getPublishedEvents();

return events.map(event => (
  <CatalogEventCard 
    key={event.id} 
    event={event} 
    viewMode="grid" 
  />
));
```

### Use Filters Standalone
```tsx
import { EventFilters } from '@/features/events/store/event-filters';

return (
  <aside>
    <EventFilters />
  </aside>
);
```

## 🔍 Filtering Logic

The catalog automatically filters events based on:

```typescript
// 1. Search (title or location)
if (filters.search) {
  const searchLower = filters.search.toLowerCase();
  // Matches title or city
}

// 2. Category
if (filters.category !== 'all') {
  // Matches exact category
}

// 3. Price Range
if (event.price < filters.priceRange[0] || 
    event.price > filters.priceRange[1]) {
  // Out of range
}

// 4. Availability
if (filters.onlyAvailable && event.available <= 0) {
  // Sold out
}
```

## 🎨 Customization Examples

### Add a New Category
```typescript
// In src/features/events/event.constants.ts
export const EVENT_CATEGORIES: EventCategory[] = [
  // ... existing categories
  {
    id: 'wellness',
    name: 'Health & Wellness',
    icon: 'spa',
    color: 'from-green-400 to-teal-500',
    description: 'Yoga, meditation, and wellness events',
  },
];
```

### Change Price Range
```typescript
// In src/features/events/event.constants.ts
export const PRICE_RANGE = {
  MIN: 0,
  MAX: 20000,  // Changed from 10000
  STEP: 1000,  // Changed from 500
  CURRENCY: 'INR',
  SYMBOL: '₹',
} as const;
```

### Customize Card Appearance
Edit [src/features/events/components/catalog-event-card.tsx](src/features/events/components/catalog-event-card.tsx):
```tsx
// Change urgency thresholds
const urgencyColor = 
  percentageSold >= 95 ? 'bg-red-500' :   // Changed from 90
  percentageSold >= 80 ? 'bg-amber-500' :  // Changed from 70
  'bg-emerald-500';
```

## 🐛 Common Issues

### Events Not Loading
**Symptom:** Loading spinner never stops, no events appear.

**Solutions:**
1. Check Firebase connection: Open browser console for errors
2. Verify events exist with `status: 'published'` in Firebase
3. Check date: Only future events are shown
4. Ensure user is authenticated

### Real-time Updates Not Working
**Symptom:** Events don't update when changed in Firebase.

**Solutions:**
1. Check Firebase Realtime Database rules (read access required)
2. Verify WebSocket connection in Network tab
3. Ensure subscription cleanup isn't called prematurely
4. Check browser console for subscription errors

### Type Errors
**Symptom:** TypeScript compilation errors.

**Solutions:**
1. Run `npm run type-check`
2. Ensure all imports are correct
3. Verify Event interface matches both schemas
4. Check `convertEventDataToEvent` mapping

### Filters Not Working
**Symptom:** Changing filters doesn't update results.

**Solutions:**
1. Verify Zustand store is properly initialized
2. Check filter logic in event-catalog.tsx
3. Ensure store actions are called correctly
4. Use React DevTools to inspect store state

## 📱 Mobile Responsiveness

The catalog is fully responsive:
- **Mobile:** Filters in collapsible panel, single column cards
- **Tablet:** Two column grid, toggle-able filters
- **Desktop:** Permanent sidebar filters, three column grid

View toggles:
- **Grid:** Best for browsing multiple events
- **List:** Best for detailed comparison

## 🔗 Related Documentation

- [Full Integration Guide](EVENTS_CATALOG_FIREBASE_INTEGRATION.md)
- [Mock Data Removal Guide](MOCK_DATA_REMOVAL_GUIDE.md)
- [Firebase RTDB Integration](FIREBASE_RTDB_INTEGRATION.md)
- [Security Rules Guide](SECURITY_RULES_QUICK_REF.md)

## 💡 Pro Tips

1. **Performance:** Use `subscribeToPublishedEvents` for dashboards, `getPublishedEvents` for one-time loads
2. **SEO:** Consider server-side rendering for public event pages
3. **Caching:** Implement React Query or SWR for better cache management
4. **Analytics:** Track filter usage to understand user preferences
5. **Search:** Add fuzzy search or Algolia integration for better results

---

**Need Help?** Check the full integration guide or review the inline code comments in each component file.
