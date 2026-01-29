# Mock Data Removal Guide

## ⚠️ Important Notice

The mock data file `src/data/event_data/mockEvents.ts` is currently still being used by several organizer dashboard pages. **Do not delete it yet** until those pages have been migrated to use Firebase data.

## 📍 Current Usage

### Files Still Using Mock Data:

1. **[src/app/dashboard/organizer/page.tsx](src/app/dashboard/organizer/page.tsx)**
   - Uses: `mockEvents` for upcoming events display
   - **Migration:** Replace with `getEventsByOrganizer(organizerId)` + filter by date

2. **[src/app/dashboard/organizer/events/page.tsx](src/app/dashboard/organizer/events/page.tsx)**
   - Uses: `mockEvents` for event statistics and listing
   - **Migration:** Use `getEventsByOrganizer(organizerId)` from eventService

3. **[src/app/dashboard/organizer/events/[id]/page.tsx](src/app/dashboard/organizer/events/[id]/page.tsx)**
   - Uses: `mockEvents` to find event by ID
   - **Migration:** Use `getEventById(eventId)` from eventService

4. **[src/app/dashboard/organizer/events/[id]/edit/page.tsx](src/app/dashboard/organizer/events/[id]/edit/page.tsx)**
   - Uses: `mockEvents` to load event for editing
   - **Migration:** Use `getEventById(eventId)` from eventService

## 🔄 Migration Steps (When Ready)

### Step 1: Migrate Organizer Dashboard

**File:** [src/app/dashboard/organizer/page.tsx](src/app/dashboard/organizer/page.tsx)

**Current Code:**
```typescript
import { mockEvents } from '@/data/event_data/mockEvents';

const upcomingEvents = mockEvents
  .filter(e => new Date(e.date) > new Date())
  .slice(0, 5);
```

**Replace With:**
```typescript
import { getEventsByOrganizer } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';

const { user } = useAuth();
const [events, setEvents] = useState([]);

useEffect(() => {
  if (user?.uid) {
    getEventsByOrganizer(user.uid).then(data => {
      const upcoming = data
        .filter(e => new Date(e.schedule.startDate) > new Date())
        .sort((a, b) => new Date(a.schedule.startDate) - new Date(b.schedule.startDate))
        .slice(0, 5);
      setEvents(upcoming);
    });
  }
}, [user]);
```

### Step 2: Migrate Events List Page

**File:** [src/app/dashboard/organizer/events/page.tsx](src/app/dashboard/organizer/events/page.tsx)

**Current Code:**
```typescript
const totalEvents = mockEvents.length;
const activeEvents = mockEvents.filter(e => new Date(e.date) > new Date()).length;
const totalRevenue = mockEvents.reduce((acc, curr) => acc + (curr.price * (curr.attendees || 0)), 0);
```

**Replace With:**
```typescript
import { getEventsByOrganizer, convertEventDataToEvent } from '@/services/eventService';

const [stats, setStats] = useState({ total: 0, active: 0, revenue: 0 });

useEffect(() => {
  if (user?.uid) {
    getEventsByOrganizer(user.uid).then(data => {
      const events = data.map(convertEventDataToEvent);
      const now = new Date();
      
      setStats({
        total: events.length,
        active: events.filter(e => new Date(e.date) > now).length,
        revenue: events.reduce((acc, e) => acc + (e.price * (e.attendees || 0)), 0),
      });
    });
  }
}, [user]);
```

### Step 3: Migrate Event Detail Page

**File:** [src/app/dashboard/organizer/events/[id]/page.tsx](src/app/dashboard/organizer/events/[id]/page.tsx)

**Current Code:**
```typescript
const event = mockEvents.find(e => e.id === params.id);
```

**Replace With:**
```typescript
import { getEventById } from '@/services/eventService';

const [event, setEvent] = useState(null);

useEffect(() => {
  getEventById(params.id).then(data => {
    if (data) setEvent(convertEventDataToEvent(data));
  });
}, [params.id]);
```

### Step 4: Migrate Event Edit Page

**File:** [src/app/dashboard/organizer/events/[id]/edit/page.tsx](src/app/dashboard/organizer/events/[id]/edit/page.tsx)

Same as Step 3, use `getEventById()` to load event data for editing.

## 🗑️ Final Removal Steps

Once all the above migrations are complete:

### 1. Verify No Imports Remain
```bash
# Search for any remaining imports
grep -r "mockEvents" src/
```

### 2. Remove the Mock Data Files
```bash
# Backup first (optional)
mv src/data/event_data/mockEvents.ts src/data/event_data/mockEvents.ts.backup
mv src/data/event_data/eventTypes.ts src/data/event_data/eventTypes.ts.backup

# Or delete directly
rm src/data/event_data/mockEvents.ts
rm src/data/event_data/eventTypes.ts
```

### 3. Remove the Entire Directory (if empty)
```bash
rm -rf src/data/event_data/
```

### 4. Update package.json (if needed)
Remove any references to mock data generation scripts.

### 5. Run Type Check
```bash
npm run type-check
```

## ✅ Verification Checklist

Before removing mock data, ensure:

- [ ] All organizer pages fetch from Firebase
- [ ] Event creation/update uses Firebase
- [ ] Event deletion uses Firebase
- [ ] No TypeScript errors after removal
- [ ] All pages render correctly
- [ ] Event statistics calculate from real data
- [ ] Search for "mockEvents" returns no results in src/

## 🚨 Rollback Plan

If issues occur after removal:

1. **Restore from backup:**
   ```bash
   git checkout HEAD -- src/data/event_data/
   ```

2. **Or recreate from Git history:**
   ```bash
   git log --all --full-history -- src/data/event_data/mockEvents.ts
   git checkout <commit-hash> -- src/data/event_data/mockEvents.ts
   ```

## 📝 Notes

- **User Events Catalog**: ✅ Already migrated to Firebase
- **Event Filters**: ✅ Already using constants instead of mock data
- **Event Categories**: ✅ Now defined in event.constants.ts
- **Organizer Pages**: ⚠️ Still need migration (follow steps above)

---

**Recommendation:** Test each organizer page thoroughly after migration before removing the mock data file. This ensures a smooth transition without breaking existing functionality.
