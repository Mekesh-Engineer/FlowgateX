# Firebase Security Rules - Quick Reference Card

## 🚀 Copy-Paste Rules (Production)

```json
{
  "rules": {
    "events": {
      "$eventId": {
        ".read": "data.child('status').val() === 'published' || auth != null",
        ".write": "auth != null && (!data.exists() || data.child('organizerId').val() === auth.uid)",
        ".validate": "newData.hasChildren(['eventId', 'organizerId', 'basicInfo', 'schedule', 'venue', 'tickets'])",
        "eventId": { ".validate": "newData.val() === $eventId" },
        "organizerId": { ".validate": "newData.val() === auth.uid" },
        "status": { ".validate": "newData.val() === 'draft' || newData.val() === 'published' || newData.val() === 'cancelled' || newData.val() === 'completed'" },
        "basicInfo": {
          ".validate": "newData.hasChildren(['title', 'description', 'category'])",
          "title": { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 200" },
          "description": { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 5000" },
          "category": { ".validate": "newData.isString() && newData.val().length > 0" }
        },
        "schedule": { ".validate": "newData.hasChildren(['startDate', 'startTime', 'endDate', 'endTime', 'timezone', 'recurring'])" },
        "venue": {
          ".validate": "newData.hasChildren(['name', 'address', 'city', 'capacity'])",
          "capacity": { ".validate": "newData.isNumber() && newData.val() > 0" }
        },
        "tickets": {
          ".validate": "newData.hasChildren()",
          "$ticketId": {
            ".validate": "newData.hasChildren(['name', 'price', 'quantity'])",
            "price": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "quantity": { ".validate": "newData.isNumber() && newData.val() > 0" }
          }
        },
        "analytics": {
          ".read": true,
          "views": { ".write": true, ".validate": "newData.isNumber() && newData.val() >= 0" },
          "bookmarks": { ".write": true, ".validate": "newData.isNumber() && newData.val() >= 0" }
        }
      }
    },
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId",
        "events": { "$eventId": { ".validate": "newData.val() === true" } },
        "bookmarkedEvents": { "$eventId": { ".validate": "newData.val() === true" } },
        "tickets": { "$ticketId": { ".validate": "newData.hasChildren(['eventId', 'ticketType', 'purchaseDate'])" } }
      }
    },
    "eventMetrics": {
      "$eventId": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('events').child($eventId).child('organizerId').val() === auth.uid",
        "liveAttendance": { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "currentOccupancy": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
        "alerts": { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "lastUpdated": { ".validate": "newData.isNumber()" }
      }
    }
  }
}
```

---

## 📝 5-Step Setup

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Navigate**: Build → Realtime Database → **Rules** tab
3. **Clear**: Select all (Ctrl+A) and delete
4. **Paste**: Copy rules above and paste
5. **Publish**: Click "Publish" button (top-right)

✅ **Done!** Rules are now active.

---

## 🧪 Quick Test Commands

### Test in Browser Console (Your App)

```javascript
// Import functions
import { ref, get, set } from 'firebase/database';
import { rtdb } from '@/lib/firebase';

// Test 1: Read published event (should work)
const testRef = ref(rtdb, 'events/test-123');
get(testRef).then(snap => console.log('✅ Read:', snap.exists()));

// Test 2: Write own event (should work if logged in)
const myRef = ref(rtdb, 'events/my-test');
set(myRef, {
  eventId: 'my-test',
  organizerId: 'YOUR_USER_ID',
  status: 'draft',
  basicInfo: { title: 'Test', description: 'Test', category: 'test' },
  schedule: { startDate: '2026-01-01', startTime: '10:00', endDate: '2026-01-01', endTime: '18:00', timezone: 'UTC', recurring: false },
  venue: { name: 'Test', address: 'Test', city: 'Test', capacity: 100 },
  tickets: [{ name: 'General', price: 10, quantity: 100 }]
}).then(() => console.log('✅ Write successful'));
```

---

## 🎯 What Each Rule Does

### Events Collection

| Action | Who | Condition |
|--------|-----|-----------|
| **Read** | Anyone | Event is `published` |
| **Read** | Logged in | Any event |
| **Write (Create)** | Logged in | New event |
| **Write (Update)** | Organizer only | Must be event creator |

### Users Collection

| Action | Who | Condition |
|--------|-----|-----------|
| **Read** | Owner only | Must be your own user data |
| **Write** | Owner only | Cannot modify other users |

### Event Metrics

| Action | Who | Condition |
|--------|-----|-----------|
| **Read** | Logged in | Any authenticated user |
| **Write** | Organizer only | Must be event creator |

---

## ✅ Validation Rules Summary

### Event Fields

| Field | Rules |
|-------|-------|
| `title` | String, 1-200 chars |
| `description` | String, 1-5000 chars |
| `category` | String, not empty |
| `capacity` | Number, > 0 |
| `ticket.price` | Number, ≥ 0 |
| `ticket.quantity` | Number, > 0 |
| `status` | Must be: draft, published, cancelled, completed |

---

## 🚨 Common Errors & Fixes

### "Permission Denied"

**Cause**: Not authenticated or not the owner

**Fix**:
```javascript
// Check auth status
const { user } = useAuth();
console.log('User:', user?.id);

// Verify ownership
console.log('Event organizer:', event.organizerId);
console.log('Match:', event.organizerId === user?.id);
```

---

### "Validation Failed"

**Cause**: Missing required fields or wrong data type

**Fix**:
```javascript
// Ensure all required fields present
const eventData = {
  eventId: 'xxx',          // Required
  organizerId: 'xxx',      // Required
  status: 'draft',         // Required
  basicInfo: { /* ... */ },  // Required
  schedule: { /* ... */ },   // Required
  venue: { /* ... */ },      // Required
  tickets: [ /* ... */ ]     // Required
};
```

---

## 🔍 Rules Playground Tests

### In Firebase Console → Rules → Rules Playground

**Test 1: Public Read Published Event**
```
Location: /events/test-123
Type: Read
Auth: None
Simulated data: { "status": "published" }
Result: ✅ Allowed
```

**Test 2: Private Read Draft Event**
```
Location: /events/test-456
Type: Read
Auth: None
Simulated data: { "status": "draft" }
Result: ❌ Denied
```

**Test 3: Create Own Event**
```
Location: /events/new-789
Type: Write
Auth: uid = "user-123"
Data: { "organizerId": "user-123", ... }
Result: ✅ Allowed
```

**Test 4: Update Other's Event**
```
Location: /events/existing-456
Type: Write
Auth: uid = "user-999"
Existing: { "organizerId": "user-123" }
Result: ❌ Denied
```

---

## 📊 Access Matrix

| Action | Guest | Logged In User | Event Organizer | Other Organizer |
|--------|-------|----------------|-----------------|-----------------|
| View published events | ✅ | ✅ | ✅ | ✅ |
| View draft events | ❌ | ✅ | ✅ | ✅ |
| Create event | ❌ | ✅ | ✅ | ✅ |
| Update own event | ❌ | ❌ | ✅ | ❌ |
| Delete own event | ❌ | ❌ | ✅ | ❌ |
| View analytics | ✅ | ✅ | ✅ | ✅ |
| Update analytics | ✅ | ✅ | ✅ | ✅ |
| View own bookmarks | ❌ | ✅ | ✅ | ✅ |
| View metrics | ❌ | ✅ | ✅ | ✅ |

---

## 🛡️ Security Best Practices

✅ **DO:**
- Require authentication for writes
- Validate all data types and lengths
- Restrict user data to owners only
- Use specific path variables (`$eventId`)
- Test rules before deployment

❌ **DON'T:**
- Use `.read: true` and `.write: true` together
- Allow anonymous writes
- Skip data validation
- Trust client-side data
- Expose sensitive user data

---

## 📚 Documentation Links

- **Main Guide**: [FIREBASE_SECURITY_RULES_GUIDE.md](./FIREBASE_SECURITY_RULES_GUIDE.md)
- **Console Setup**: [FIREBASE_CONSOLE_SETUP.md](./FIREBASE_CONSOLE_SETUP.md)
- **Database Guide**: [FIREBASE_REALTIME_DATABASE_GUIDE.md](./FIREBASE_REALTIME_DATABASE_GUIDE.md)
- **Firebase Docs**: https://firebase.google.com/docs/database/security

---

## 🔄 Update Rules

### When you need to update:

1. Firebase Console → Realtime Database → Rules
2. Edit the JSON
3. Click **Publish**
4. Wait 1-2 minutes for propagation
5. Test changes

---

## ⚡ Emergency: Rollback Rules

If something breaks:

1. Go to **Rules** tab
2. Click **"View history"** (bottom of page)
3. Select previous version
4. Click **"Restore"**
5. Click **"Publish"**

---

## 🎯 Checklist Before Production

- [ ] Rules published successfully
- [ ] Tested read operations (public & authenticated)
- [ ] Tested write operations (create, update, delete)
- [ ] Verified permission denials work
- [ ] Validated data structure enforcement
- [ ] Tested with multiple user roles
- [ ] Removed any `.read: true, .write: true` rules
- [ ] Monitored usage tab for anomalies

---

**Your database is now secure!** 🔒✨

Print this reference card and keep it handy!
