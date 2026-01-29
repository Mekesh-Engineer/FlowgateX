# Firebase Realtime Database Security Rules - Complete Guide

## 📋 Table of Contents
1. [Security Rules Code](#security-rules-code)
2. [Firebase Console Setup](#firebase-console-setup)
3. [Rules Explanation](#rules-explanation)
4. [Testing Rules](#testing-rules)
5. [Common Scenarios](#common-scenarios)
6. [Troubleshooting](#troubleshooting)

---

## 1. Security Rules Code

### Complete Production-Ready Rules

Copy this entire JSON and paste it into your Firebase Console:

```json
{
  "rules": {
    "events": {
      "$eventId": {
        ".read": "data.child('status').val() === 'published' || auth != null",
        ".write": "auth != null && (
          !data.exists() || 
          data.child('organizerId').val() === auth.uid
        )",
        ".validate": "newData.hasChildren(['eventId', 'organizerId', 'basicInfo', 'schedule', 'venue', 'tickets'])",
        
        "eventId": {
          ".validate": "newData.val() === $eventId"
        },
        
        "organizerId": {
          ".validate": "newData.val() === auth.uid"
        },
        
        "status": {
          ".validate": "newData.val() === 'draft' || newData.val() === 'published' || newData.val() === 'cancelled' || newData.val() === 'completed'"
        },
        
        "basicInfo": {
          ".validate": "newData.hasChildren(['title', 'description', 'category'])",
          "title": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 200"
          },
          "description": {
            ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 5000"
          },
          "category": {
            ".validate": "newData.isString() && newData.val().length > 0"
          }
        },
        
        "schedule": {
          ".validate": "newData.hasChildren(['startDate', 'startTime', 'endDate', 'endTime', 'timezone', 'recurring'])"
        },
        
        "venue": {
          ".validate": "newData.hasChildren(['name', 'address', 'city', 'capacity'])",
          "capacity": {
            ".validate": "newData.isNumber() && newData.val() > 0"
          }
        },
        
        "tickets": {
          ".validate": "newData.hasChildren()",
          "$ticketId": {
            ".validate": "newData.hasChildren(['name', 'price', 'quantity'])",
            "price": {
              ".validate": "newData.isNumber() && newData.val() >= 0"
            },
            "quantity": {
              ".validate": "newData.isNumber() && newData.val() > 0"
            }
          }
        },
        
        "analytics": {
          ".read": true,
          "views": {
            ".write": true,
            ".validate": "newData.isNumber() && newData.val() >= 0"
          },
          "bookmarks": {
            ".write": true,
            ".validate": "newData.isNumber() && newData.val() >= 0"
          }
        }
      }
    },
    
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId",
        
        "events": {
          "$eventId": {
            ".validate": "newData.val() === true"
          }
        },
        
        "bookmarkedEvents": {
          "$eventId": {
            ".validate": "newData.val() === true"
          }
        },
        
        "tickets": {
          "$ticketId": {
            ".validate": "newData.hasChildren(['eventId', 'ticketType', 'purchaseDate'])"
          }
        }
      }
    },
    
    "eventMetrics": {
      "$eventId": {
        ".read": "auth != null",
        ".write": "auth != null && (
          root.child('events').child($eventId).child('organizerId').val() === auth.uid
        )",
        
        "liveAttendance": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "currentOccupancy": {
          ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100"
        },
        "alerts": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "lastUpdated": {
          ".validate": "newData.isNumber()"
        }
      }
    }
  }
}
```

### Simplified Rules (For Development/Testing)

If you need more permissive rules during development:

```json
{
  "rules": {
    "events": {
      ".read": true,
      ".write": "auth != null"
    },
    "users": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $userId"
      }
    },
    "eventMetrics": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

⚠️ **Warning**: Only use simplified rules in development. They're not secure for production!

---

## 2. Firebase Console Setup

### Step-by-Step Guide

#### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **FlowgateX**

![Firebase Console Home](https://via.placeholder.com/800x400?text=Firebase+Console+Home)

---

#### Step 2: Navigate to Realtime Database
1. In the left sidebar, click on **"Build"** section
2. Click on **"Realtime Database"**
3. You should see your database URL: `https://your-project-id-default-rtdb.firebaseio.com`

![Navigate to Database](https://via.placeholder.com/800x400?text=Navigate+to+Realtime+Database)

---

#### Step 3: Open Rules Tab
1. At the top of the Realtime Database page, you'll see three tabs:
   - **Data**
   - **Rules** ← Click this one
   - **Usage**
2. Click on the **"Rules"** tab

![Rules Tab](https://via.placeholder.com/800x400?text=Rules+Tab)

---

#### Step 4: Edit Security Rules

You'll see the current rules (probably default ones):

```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

**Do this:**

1. **Select all the existing text** (Ctrl+A / Cmd+A)
2. **Delete it**
3. **Copy the Production Rules** from Section 1 above
4. **Paste** into the editor

![Edit Rules](https://via.placeholder.com/800x400?text=Edit+Rules+in+Console)

---

#### Step 5: Publish Rules

1. Click the **"Publish"** button in the top right
2. You'll see a confirmation dialog
3. Click **"Publish"** again to confirm

![Publish Rules](https://via.placeholder.com/800x400?text=Publish+Rules)

---

#### Step 6: Verify Rules Are Active

After publishing, you should see:
- ✅ Green checkmark icon
- Message: "Your rules have been published"
- Timestamp of when rules were last updated

![Rules Published](https://via.placeholder.com/800x400?text=Rules+Successfully+Published)

---

### Video Tutorial Alternative

**Prefer a visual guide?**

1. Go to **Rules** tab in Firebase Console
2. Look for the **"Rules Playground"** button (top right)
3. You can test your rules before publishing!

---

## 3. Rules Explanation

### What Each Rule Does

#### **Events Collection Rules**

```json
"events": {
  "$eventId": {
    ".read": "data.child('status').val() === 'published' || auth != null"
  }
}
```

**Meaning:**
- **Public can read**: Only events with `status: 'published'`
- **Authenticated users can read**: Any event (including drafts, their own events)
- **Unauthenticated users cannot read**: Draft, cancelled, or completed events

---

```json
".write": "auth != null && (
  !data.exists() || 
  data.child('organizerId').val() === auth.uid
)"
```

**Meaning:**
- **User must be logged in** (`auth != null`)
- **Creating new event**: Anyone authenticated can create (no data exists yet)
- **Updating existing event**: Only the organizer who created it (`organizerId === auth.uid`)

---

```json
".validate": "newData.hasChildren(['eventId', 'organizerId', 'basicInfo', ...])"
```

**Meaning:**
- **Data structure validation**: Event MUST have these required fields
- Prevents incomplete or malformed data

---

```json
"basicInfo": {
  "title": {
    ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 200"
  }
}
```

**Meaning:**
- **Title must be a string**
- **Cannot be empty**
- **Maximum 200 characters**

---

#### **Users Collection Rules**

```json
"users": {
  "$userId": {
    ".read": "auth != null && auth.uid === $userId",
    ".write": "auth != null && auth.uid === $userId"
  }
}
```

**Meaning:**
- **Users can only read/write their own data**
- User with ID `user123` can ONLY access `/users/user123`
- Cannot read other users' bookmarks, tickets, etc.

---

#### **Event Metrics Rules**

```json
"eventMetrics": {
  "$eventId": {
    ".read": "auth != null",
    ".write": "auth != null && (
      root.child('events').child($eventId).child('organizerId').val() === auth.uid
    )"
  }
}
```

**Meaning:**
- **Any authenticated user can read metrics** (for viewing event stats)
- **Only the event organizer can write metrics** (update live data)

---

## 4. Testing Rules

### Method 1: Firebase Console Rules Simulator

1. Go to **Realtime Database → Rules** tab
2. Click **"Rules Playground"** button (top right)
3. Try these test scenarios:

#### Test 1: Read Published Event (Unauthenticated)
```
Location: /events/event-123
Read: ✅ Allowed (if status is 'published')
Authentication: None
```

#### Test 2: Read Draft Event (Unauthenticated)
```
Location: /events/event-456
Read: ❌ Denied (status is 'draft')
Authentication: None
```

#### Test 3: Create Event (Authenticated)
```
Location: /events/event-789
Write: ✅ Allowed
Authentication: uid = "user-123"
Data: { organizerId: "user-123", ... }
```

#### Test 4: Update Someone Else's Event
```
Location: /events/event-456
Write: ❌ Denied (organizerId doesn't match auth.uid)
Authentication: uid = "user-999"
Data: { organizerId: "user-123", ... }
```

---

### Method 2: Test in Your App

Add this test component:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { ref, get, set, push } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import { useAuth } from '@/providers/auth-provider';

export function SecurityRulesTest() {
  const { user } = useAuth();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (test: string, passed: boolean) => {
    setResults(prev => [...prev, `${passed ? '✅' : '❌'} ${test}`]);
  };

  const runTests = async () => {
    setResults([]);
    
    try {
      // Test 1: Read published event (should work)
      const publishedRef = ref(rtdb, 'events/test-published');
      await set(publishedRef, { 
        eventId: 'test-published',
        status: 'published',
        organizerId: user?.id || 'test',
        basicInfo: { title: 'Test', description: 'Test', category: 'test' },
        schedule: { startDate: '2026-01-01', startTime: '10:00', endDate: '2026-01-01', endTime: '18:00', timezone: 'UTC', recurring: false },
        venue: { name: 'Test', address: 'Test', city: 'Test', capacity: 100 },
        tickets: [{ name: 'Test', price: 10, quantity: 100 }]
      });
      
      const snapshot = await get(publishedRef);
      addResult('Read published event', snapshot.exists());
      
      // Test 2: Write to own event (should work)
      if (user) {
        const myEventRef = push(ref(rtdb, 'events'));
        await set(myEventRef, {
          eventId: myEventRef.key,
          organizerId: user.id,
          status: 'draft',
          basicInfo: { title: 'My Event', description: 'Test', category: 'test' },
          schedule: { startDate: '2026-01-01', startTime: '10:00', endDate: '2026-01-01', endTime: '18:00', timezone: 'UTC', recurring: false },
          venue: { name: 'Test', address: 'Test', city: 'Test', capacity: 100 },
          tickets: [{ name: 'Test', price: 10, quantity: 100 }]
        });
        addResult('Create own event', true);
      }
      
      // Test 3: Read/Write user data
      if (user) {
        const userRef = ref(rtdb, `users/${user.id}/events/test-123`);
        await set(userRef, true);
        const userSnapshot = await get(userRef);
        addResult('Write to own user data', userSnapshot.exists());
      }
      
    } catch (error: any) {
      addResult(`Test failed: ${error.message}`, false);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Security Rules Test</h2>
      
      <button
        onClick={runTests}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Run Tests
      </button>
      
      <div className="mt-4 space-y-2">
        {results.map((result, i) => (
          <div key={i} className="font-mono text-sm">{result}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Common Scenarios

### Scenario 1: Allow Event Updates by Organizer

**Current Rule:**
```json
".write": "auth != null && data.child('organizerId').val() === auth.uid"
```

**This allows:**
- ✅ Organizer can update their own event title
- ✅ Organizer can change event status
- ✅ Organizer can update tickets

**This prevents:**
- ❌ Other users cannot modify the event
- ❌ Unauthenticated users cannot write

---

### Scenario 2: Public Events Browsing

**Current Rule:**
```json
".read": "data.child('status').val() === 'published' || auth != null"
```

**This allows:**
- ✅ Anyone can browse published events
- ✅ Logged-in users can see ALL events (including their drafts)

**This prevents:**
- ❌ Unauthenticated users cannot see draft events
- ❌ Cannot see cancelled events unless logged in

---

### Scenario 3: Analytics Tracking

**Current Rule:**
```json
"analytics": {
  ".read": true,
  "views": {
    ".write": true
  }
}
```

**This allows:**
- ✅ Anyone can read analytics (view counts, bookmarks)
- ✅ Anyone can increment view count
- ✅ System can track public metrics

---

### Scenario 4: User Bookmarks

**Current Rule:**
```json
"users": {
  "$userId": {
    "bookmarkedEvents": {
      "$eventId": {
        ".read": "auth.uid === $userId",
        ".write": "auth.uid === $userId"
      }
    }
  }
}
```

**This allows:**
- ✅ Users can save/unsave their own bookmarks
- ✅ Users can see their bookmark list

**This prevents:**
- ❌ Other users cannot see your bookmarks
- ❌ Cannot modify other users' bookmarks

---

## 6. Troubleshooting

### Error: "Permission Denied"

**Symptom:**
```
Error: PERMISSION_DENIED: Permission denied
```

**Causes & Solutions:**

1. **User not authenticated**
   - Check: `const { user } = useAuth()` - is user null?
   - Solution: Redirect to login page

2. **Trying to read draft event while logged out**
   - Check: Event status is 'published'?
   - Solution: Only show published events to public

3. **Trying to update someone else's event**
   - Check: `event.organizerId === user.id`?
   - Solution: Only allow organizer to edit

---

### Error: "Validation Failed"

**Symptom:**
```
Error: Data does not match validation rules
```

**Causes & Solutions:**

1. **Missing required fields**
   - Check: Does your data have `eventId`, `organizerId`, `basicInfo`, etc.?
   - Solution: Ensure all required fields are present

2. **Invalid data types**
   - Check: Is `capacity` a number? Is `title` a string?
   - Solution: Convert data types before saving

3. **Field length exceeded**
   - Check: Is title > 200 characters?
   - Solution: Truncate or validate before submission

---

### Error: "Rules Not Updating"

**Symptom:**
Old rules still in effect after publishing new ones

**Solutions:**

1. **Hard refresh Firebase Console**
   - Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Wait 1-2 minutes**
   - Rules take time to propagate globally

3. **Check published timestamp**
   - Look at "Last updated" time in Rules tab

4. **Clear app cache**
   - Reload your Next.js app
   - Clear browser cache

---

### Testing Tip: Use Firebase CLI

Install Firebase CLI and test rules locally:

```bash
npm install -g firebase-tools
firebase login
firebase init database
firebase deploy --only database
```

---

## 📊 Quick Reference

### Rule Modifiers

| Modifier | Purpose | Example |
|----------|---------|---------|
| `.read` | Who can read data | `".read": true` |
| `.write` | Who can write data | `".write": "auth != null"` |
| `.validate` | Data validation | `".validate": "newData.isString()"` |
| `.indexOn` | Query indexing | `".indexOn": ["status", "category"]` |

### Common Conditions

| Condition | Meaning |
|-----------|---------|
| `auth != null` | User is logged in |
| `auth.uid === $userId` | User matches ID |
| `data.exists()` | Data already exists |
| `!data.exists()` | New data (creating) |
| `newData.val()` | New value being written |
| `data.val()` | Current value |
| `root.child('path')` | Access other node |

---

## ✅ Checklist

Before going to production:

- [ ] Published security rules to Firebase Console
- [ ] Tested read/write operations
- [ ] Verified authentication required for writes
- [ ] Tested permission denied scenarios
- [ ] Validated data structure requirements
- [ ] Tested with different user roles
- [ ] Removed any test/debug rules
- [ ] Enabled only production rules

---

## 🔐 Security Best Practices

1. **Never use `.read: true` and `.write: true` in production**
2. **Always validate data types and lengths**
3. **Require authentication for writes**
4. **Limit what each user can access**
5. **Use validation rules to prevent bad data**
6. **Test rules before deploying**
7. **Monitor database usage in Firebase Console**
8. **Review rules regularly**

---

## 📞 Need Help?

- **Firebase Documentation**: https://firebase.google.com/docs/database/security
- **Rules Simulator**: Firebase Console → Realtime Database → Rules → Rules Playground
- **Community**: Stack Overflow tag `firebase-realtime-database`

---

Your security rules are now properly configured! 🎉🔒
