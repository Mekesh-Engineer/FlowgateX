# Firebase Realtime Database Integration Guide

## Overview
This document explains the Firebase Realtime Database (RTDB) integration for the FlowgateX event management system. Events are now stored in RTDB instead of Firestore for real-time synchronization capabilities.

---

## 🔧 Setup Instructions

### 1. Environment Configuration

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

**Important**: Add your **Firebase Realtime Database URL**:
```env
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

You can find this URL in:
- Firebase Console → Project Settings → General → Your Apps
- Or Firebase Console → Realtime Database → Data tab (top of page)

### 2. Firebase Console Setup

1. **Enable Realtime Database**:
   - Go to Firebase Console → Build → Realtime Database
   - Click "Create Database"
   - Choose your region (e.g., `us-central1`)
   - Start in **test mode** (for development) or configure security rules

2. **Security Rules (Development)**:
   ```json
   {
     "rules": {
       "events": {
         ".read": true,
         ".write": "auth != null",
         "$eventId": {
           ".validate": "newData.hasChildren(['eventId', 'organizerId', 'status', 'basicInfo', 'schedule', 'venue'])"
         }
       }
     }
   }
   ```

3. **Security Rules (Production)**:
   ```json
   {
     "rules": {
       "events": {
         ".read": true,
         "$eventId": {
           ".write": "auth != null && (!data.exists() || data.child('organizerId').val() === auth.uid)",
           ".validate": "newData.hasChildren(['eventId', 'organizerId', 'status', 'basicInfo', 'schedule', 'venue'])"
         }
       }
     }
   }
   ```

---

## 📊 Database Structure

### Root Path: `/events`

Each event is stored under a unique auto-generated key (e.g., `-Noy8z7a9s8d7f6g5h4j`):

```
/events
  ├── -Noy8z7a9s8d7f6g5h4j
  │     ├── eventId: "-Noy8z7a9s8d7f6g5h4j"
  │     ├── organizerId: "uid_123456789"
  │     ├── status: "published"
  │     ├── createdAt: 1716382000000
  │     ├── basicInfo/
  │     ├── schedule/
  │     ├── venue/
  │     ├── tickets/
  │     ├── promoCodes/
  │     ├── iotGates/
  │     └── settings/
  └── -NpAbc123def456...
```

### Complete Event Schema

```json
{
  "eventId": "-Noy8z7a9s8d7f6g5h4j",
  "organizerId": "uid_123456789",
  "organizerEmail": "organizer@example.com",
  "status": "published",
  "createdAt": 1716382000000,
  
  "basicInfo": {
    "title": "Global Tech Innovators Summit 2024",
    "description": "A premier gathering of technology leaders...",
    "category": "conference",
    "videoUrl": "https://youtube.com/watch?v=...",
    "bannerImage": "https://firebasestorage.googleapis.com/..."
  },
  
  "schedule": {
    "startDate": "2024-11-15",
    "startTime": "09:00",
    "endDate": "2024-11-17",
    "endTime": "18:00",
    "timezone": "Asia/Kolkata",
    "recurring": false,
    "frequency": null
  },
  
  "venue": {
    "name": "Jio World Convention Centre",
    "address": "Bandra Kurla Complex, Mumbai",
    "city": "Mumbai",
    "capacity": 5000,
    "coordinates": {
      "lat": 19.0607,
      "lng": 72.8643
    },
    "zones": [
      { "name": "Main Hall", "capacity": 3000 },
      { "name": "Breakout Room A", "capacity": 500 }
    ]
  },
  
  "tickets": [
    {
      "name": "General Admission",
      "price": 4999,
      "quantity": 4000,
      "earlyBird": false
    },
    {
      "name": "VIP Access",
      "price": 12999,
      "quantity": 500,
      "earlyBird": true
    }
  ],
  
  "promoCodes": [
    {
      "code": "EARLY10",
      "discount": "10%",
      "limit": 100
    }
  ],
  
  "iotGates": [
    {
      "id": "GT001",
      "name": "Main Entrance",
      "type": "Entry",
      "assigned": true,
      "accessRule": "general",
      "sensorConfig": true
    },
    {
      "id": "GT002",
      "name": "VIP Lounge Entry",
      "type": "Entry",
      "assigned": true,
      "accessRule": "vip",
      "sensorConfig": true
    }
  ],
  
  "settings": {
    "amenities": {
      "wifi": true,
      "parking": true,
      "wheelchair": true
    },
    "services": {
      "merch": true,
      "food": true,
      "vipLounge": true
    },
    "ageRestriction": "18+",
    "refundPolicy": "Full refund if cancelled 48 hours prior..."
  }
}
```

---

## 💻 Code Implementation

### File Structure

```
src/
├── lib/
│   └── firebase.ts              # Firebase config with RTDB export
├── services/
│   └── eventService.ts          # Event CRUD operations
└── app/dashboard/organizer/events/
    └── create/
        └── page.tsx             # Event creation form
```

### Key Functions

#### 1. **Create Event** (`eventService.ts`)

```typescript
import { createEventInRealtimeDB } from '@/services/eventService';

const eventId = await createEventInRealtimeDB(eventData, userId);
console.log("Event created:", eventId);
```

#### 2. **Read Events** (Future Implementation)

```typescript
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

const eventsRef = ref(rtdb, 'events');
onValue(eventsRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});
```

#### 3. **Update Event** (Future Implementation)

```typescript
import { rtdb } from '@/lib/firebase';
import { ref, update } from 'firebase/database';

const eventRef = ref(rtdb, `events/${eventId}`);
await update(eventRef, {
  'basicInfo/title': 'Updated Title',
  'status': 'draft'
});
```

#### 4. **Delete Event** (Future Implementation)

```typescript
import { rtdb } from '@/lib/firebase';
import { ref, remove } from 'firebase/database';

const eventRef = ref(rtdb, `events/${eventId}`);
await remove(eventRef);
```

---

## ✅ Verification Steps

### 1. Test Event Creation

1. Navigate to: `/dashboard/organizer/events/create`
2. Fill in all required fields (Title, Date, Venue)
3. Upload a banner image or provide a URL
4. Complete all 7 steps and click **"Publish Event"**
5. Check browser console for success message:
   ```
   ✅ Event created successfully in Realtime Database!
   📍 Event ID: -Noy8z7a9s8d7f6g5h4j
   ```

### 2. Firebase Console Verification

1. Open Firebase Console → Realtime Database → Data tab
2. Expand the `events` node
3. You should see your event with auto-generated ID
4. Verify the nested structure matches the schema above
5. **Real-time Test**: Keep the console open and create another event - it will appear instantly (highlighted in yellow)

### 3. Data Validation Checklist

- [ ] `eventId` matches the Firebase-generated key
- [ ] `organizerId` matches authenticated user UID
- [ ] `createdAt` is a server timestamp (number)
- [ ] `basicInfo.bannerImage` is a valid Firebase Storage URL
- [ ] `venue.coordinates` has valid lat/lng numbers
- [ ] `tickets` array has properly typed price/quantity (numbers)
- [ ] `iotGates` only includes assigned gates
- [ ] All nested objects follow the schema structure

---

## 🔍 Debugging Tips

### Issue: "databaseURL is not set"
**Solution**: Ensure `.env.local` contains:
```env
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

### Issue: "Permission denied"
**Solution**: Check RTDB security rules. For development, use:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

### Issue: "Data not appearing in console"
**Solution**: 
1. Check browser console for errors
2. Verify user is authenticated (`user` state is not null)
3. Ensure all required fields are filled

### Issue: "Image upload fails"
**Solution**: 
1. Check Firebase Storage rules
2. Verify `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set correctly
3. Ensure user has authentication token

---

## 🚀 Next Steps

1. **Implement Event Listing**: Read events from RTDB and display in `/dashboard/organizer/events`
2. **Real-time Updates**: Use `onValue` listeners for live event updates
3. **Event Editing**: Add update functionality for existing events
4. **Event Deletion**: Implement soft delete (status: 'archived') or hard delete
5. **Indexing**: Add `.indexOn` rules for efficient queries:
   ```json
   {
     "rules": {
       "events": {
         ".indexOn": ["organizerId", "status", "createdAt"]
       }
     }
   }
   ```

---

## 📚 Additional Resources

- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Security Rules Guide](https://firebase.google.com/docs/database/security)
- [Data Modeling Best Practices](https://firebase.google.com/docs/database/web/structure-data)
- [Offline Capabilities](https://firebase.google.com/docs/database/web/offline-capabilities)

---

## 🎯 Summary

✅ **Firebase RTDB configured** in `firebase.ts`  
✅ **Event service created** with `createEventInRealtimeDB()`  
✅ **Create page updated** to use RTDB instead of Firestore  
✅ **Schema documented** with complete JSON example  
✅ **Security rules provided** for development and production  

Your FlowgateX event creation now saves directly to Firebase Realtime Database with proper structure and validation! 🎉
