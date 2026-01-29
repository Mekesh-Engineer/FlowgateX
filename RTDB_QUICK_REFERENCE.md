# 🔥 Firebase RTDB Quick Reference

## ⚡ Quick Start

### 1. Add Environment Variable
```env
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

### 2. Import and Use
```typescript
import { createEventInRealtimeDB } from '@/services/eventService';

// Create event
const eventId = await createEventInRealtimeDB(formData, userId);
```

---

## 📁 Files Modified

| File | Changes |
|------|---------|
| `src/lib/firebase.ts` | ✅ Added `getDatabase` import<br>✅ Added `databaseURL` to config<br>✅ Exported `rtdb` instance |
| `src/services/eventService.ts` | ✅ NEW - Event CRUD service<br>✅ `createEventInRealtimeDB()` function |
| `src/app/dashboard/organizer/events/create/page.tsx` | ✅ Replaced Firestore with RTDB<br>✅ Updated `handlePublish()` function |
| `.env.local.example` | ✅ NEW - Environment template |
| `FIREBASE_RTDB_INTEGRATION.md` | ✅ NEW - Complete documentation |

---

## 🎯 Database Path Structure

```
/events
  └── {auto-generated-id}
        ├── eventId
        ├── organizerId
        ├── status
        ├── createdAt
        ├── basicInfo/
        │     ├── title
        │     ├── description
        │     ├── category
        │     ├── videoUrl
        │     └── bannerImage
        ├── schedule/
        │     ├── startDate
        │     ├── startTime
        │     ├── endDate
        │     ├── endTime
        │     ├── timezone
        │     ├── recurring
        │     └── frequency
        ├── venue/
        │     ├── name
        │     ├── address
        │     ├── city
        │     ├── capacity
        │     ├── coordinates/
        │     └── zones[]
        ├── tickets[]
        ├── promoCodes[]
        ├── iotGates[]
        └── settings/
              ├── amenities/
              ├── services/
              ├── ageRestriction
              └── refundPolicy
```

---

## 🧪 Testing Checklist

- [ ] Set `NEXT_PUBLIC_FIREBASE_DATABASE_URL` in `.env.local`
- [ ] Enable Realtime Database in Firebase Console
- [ ] Configure security rules (see `FIREBASE_RTDB_INTEGRATION.md`)
- [ ] Create test event via `/dashboard/organizer/events/create`
- [ ] Verify data in Firebase Console → Realtime Database → Data tab
- [ ] Check browser console for success logs

---

## 🔒 Security Rules (Quick Copy)

**Development (Permissive):**
```json
{
  "rules": {
    "events": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**Production (Secure):**
```json
{
  "rules": {
    "events": {
      ".read": true,
      "$eventId": {
        ".write": "auth != null && (!data.exists() || data.child('organizerId').val() === auth.uid)"
      }
    }
  }
}
```

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "databaseURL is not set" | Add `NEXT_PUBLIC_FIREBASE_DATABASE_URL` to `.env.local` |
| "Permission denied" | Update RTDB security rules in Firebase Console |
| "Data not saving" | Check console for errors, verify user authentication |
| "Import error: rtdb" | Restart dev server: `npm run dev` |

---

## 📊 Data Flow

```
User Fills Form (7 Steps)
        ↓
Click "Publish Event"
        ↓
Upload Banner to Firebase Storage
        ↓
Call createEventInRealtimeDB()
        ↓
Generate Unique Event ID (push)
        ↓
Structure Data According to Schema
        ↓
Save to /events/{eventId}
        ↓
Return Event ID
        ↓
Redirect to Events Dashboard
```

---

## 🎨 Form Input Mapping

| Form Field | Database Path |
|-----------|---------------|
| Title | `basicInfo.title` |
| Description | `basicInfo.description` |
| Category | `basicInfo.category` |
| Banner | `basicInfo.bannerImage` |
| Video URL | `basicInfo.videoUrl` |
| Start Date | `schedule.startDate` |
| Start Time | `schedule.startTime` |
| Venue Name | `venue.name` |
| Address | `venue.address` |
| Map Pin | `venue.coordinates` |
| Capacity | `venue.capacity` |
| Tickets | `tickets[]` |
| IoT Gates | `iotGates[]` |
| Amenities | `settings.amenities` |

---

## 💡 Next Steps

1. **Read Events**: Implement listing page with `onValue` listener
2. **Update Events**: Add edit functionality with `update()`
3. **Delete Events**: Implement soft/hard delete with `remove()`
4. **Real-time Sync**: Add listeners for live dashboard updates
5. **Indexing**: Optimize queries with `.indexOn` rules

---

**📖 Full Documentation**: See `FIREBASE_RTDB_INTEGRATION.md`
