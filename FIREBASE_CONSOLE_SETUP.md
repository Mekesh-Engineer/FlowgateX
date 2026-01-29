# Firebase Console Security Rules - Visual Setup Guide

## 🎯 Quick 5-Minute Setup

### Step 1: Access Firebase Console

1. Open your browser and go to: **https://console.firebase.google.com/**
2. Log in with your Google account
3. You'll see all your Firebase projects

**What you'll see:**
```
┌─────────────────────────────────────────────┐
│  Firebase Console                            │
├─────────────────────────────────────────────┤
│                                              │
│  Your Projects:                              │
│                                              │
│  ┌──────────────────────────────┐          │
│  │  FlowgateX                   │          │
│  │  Project ID: flowgatex-xxxx  │  ← Click │
│  └──────────────────────────────┘          │
│                                              │
└─────────────────────────────────────────────┘
```

---

### Step 2: Navigate to Realtime Database

**After clicking your project:**

1. Look at the left sidebar
2. Find the **"Build"** section (📱 icon)
3. Click on **"Realtime Database"**

**Left Sidebar Structure:**
```
Firebase Console
├── 📊 Dashboard
├── 📱 Build
│   ├── Authentication
│   ├── Firestore Database
│   ├── Realtime Database  ← Click this
│   ├── Storage
│   ├── Hosting
│   └── Functions
├── 🚀 Release & Monitor
└── ⚙️ Settings
```

---

### Step 3: Open Rules Editor

**On the Realtime Database page:**

You'll see three tabs at the top:
```
┌─────────────────────────────────────────────┐
│ [Data] [Rules] [Usage]                      │  ← Click "Rules"
└─────────────────────────────────────────────┘
```

Click on **"Rules"** tab (second tab)

---

### Step 4: View Current Rules

**You'll see a code editor with your current rules:**

```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

**Interface elements:**
```
┌─────────────────────────────────────────────────┐
│  Rules                                  [Publish]│  ← Button to save
├─────────────────────────────────────────────────┤
│                                                  │
│  {                                              │
│    "rules": {                                   │
│      ".read": false,        ← Current rules     │
│      ".write": false                            │
│    }                                            │
│  }                                              │
│                                                  │
│  Last updated: Jan 23, 2026 10:30 AM           │
└─────────────────────────────────────────────────┘
```

---

### Step 5: Replace with New Rules

**Do this:**

1. **Select all text** in the editor:
   - Windows/Linux: `Ctrl + A`
   - Mac: `Cmd + A`

2. **Delete** the selected text:
   - Press `Delete` or `Backspace`

3. **Copy the production rules** (from below)

4. **Paste** into the now-empty editor:
   - Windows/Linux: `Ctrl + V`
   - Mac: `Cmd + V`

**Production Rules to Copy:**

```json
{
  "rules": {
    "events": {
      "$eventId": {
        ".read": "data.child('status').val() === 'published' || auth != null",
        ".write": "auth != null && (!data.exists() || data.child('organizerId').val() === auth.uid)",
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
        ".write": "auth != null && root.child('events').child($eventId).child('organizerId').val() === auth.uid",
        
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

---

### Step 6: Publish Rules

**After pasting the rules:**

1. Look for the **"Publish"** button (top-right corner of the editor)
2. **Click "Publish"**

**You'll see a confirmation dialog:**
```
┌─────────────────────────────────────────┐
│  Publish Rules?                         │
│                                         │
│  Are you sure you want to publish      │
│  these rules to production?            │
│                                         │
│  [Cancel]              [Publish] ←Click│
└─────────────────────────────────────────┘
```

3. **Click "Publish"** again in the dialog

---

### Step 7: Verify Success

**After publishing, you should see:**

✅ **Success message:**
```
┌─────────────────────────────────────────────┐
│ ✓ Your rules have been published           │
│   Last updated: Jan 23, 2026 2:45 PM       │
└─────────────────────────────────────────────┘
```

✅ **Green checkmark** next to the Publish button

✅ **Timestamp updated** at the bottom

---

## 🧪 Test Your Rules (Optional)

### Using Rules Playground

**After publishing rules:**

1. Look for **"Rules Playground"** link (top-right, near Publish button)
2. Click it

**You'll see a testing interface:**
```
┌─────────────────────────────────────────────────┐
│  Rules Playground                               │
├─────────────────────────────────────────────────┤
│  Location: /events/test-123                     │
│  Type: [Read] [Write]                           │
│  Auth: [Simulated User] uid: user-456          │
│                                                  │
│  Data: { ... }                                  │
│                                                  │
│  [Run]                                          │
│                                                  │
│  Result: ✅ Allowed / ❌ Denied                 │
└─────────────────────────────────────────────────┘
```

---

### Test Scenario 1: Read Published Event (Unauthenticated)

**Settings:**
- Location: `/events/test-event-1`
- Type: **Read**
- Auth: **None** (leave empty)
- Simulate data: `{ "status": "published", ... }`

**Expected Result:** ✅ **Allowed**

---

### Test Scenario 2: Read Draft Event (Unauthenticated)

**Settings:**
- Location: `/events/test-event-2`
- Type: **Read**
- Auth: **None**
- Simulate data: `{ "status": "draft", ... }`

**Expected Result:** ❌ **Denied**

---

### Test Scenario 3: Create Event (Authenticated)

**Settings:**
- Location: `/events/new-event-123`
- Type: **Write**
- Auth: **Authenticated** - uid: `user-789`
- Data to write:
```json
{
  "eventId": "new-event-123",
  "organizerId": "user-789",
  "status": "draft",
  "basicInfo": {
    "title": "Test Event",
    "description": "Test description",
    "category": "conference"
  },
  "schedule": {
    "startDate": "2026-03-01",
    "startTime": "10:00",
    "endDate": "2026-03-01",
    "endTime": "18:00",
    "timezone": "America/New_York",
    "recurring": false
  },
  "venue": {
    "name": "Test Venue",
    "address": "123 Main St",
    "city": "New York",
    "capacity": 100
  },
  "tickets": [
    {
      "name": "General",
      "price": 50,
      "quantity": 100
    }
  ]
}
```

**Expected Result:** ✅ **Allowed**

---

### Test Scenario 4: Update Someone Else's Event

**Settings:**
- Location: `/events/existing-event-456`
- Type: **Write**
- Auth: **Authenticated** - uid: `user-999`
- Existing data: `{ "organizerId": "user-123", ... }`
- New data: `{ "organizerId": "user-123", "title": "Updated" }`

**Expected Result:** ❌ **Denied** (not the organizer)

---

## 🔍 Verification Checklist

After publishing, verify these:

### ✅ Database Tab
- [ ] Click **"Data"** tab
- [ ] You should see your database structure
- [ ] Try to manually add data - should follow rules

### ✅ Usage Tab
- [ ] Click **"Usage"** tab
- [ ] Check reads/writes statistics
- [ ] Monitor for unusual activity

### ✅ In Your App
- [ ] Test creating an event (should work when logged in)
- [ ] Test viewing published events (should work for everyone)
- [ ] Test viewing draft events (should only work when logged in)
- [ ] Test updating own event (should work)
- [ ] Test updating someone else's event (should fail)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Rules contain syntax errors"

**Error Message:**
```
Error on line 5: Expected '}' but found ','
```

**Solution:**
- Check for missing commas
- Check for missing quotes
- Use a JSON validator: https://jsonlint.com/
- Copy rules again carefully

---

### Issue 2: Publish button is disabled/greyed out

**Reasons:**
- Syntax error in rules
- No changes made
- Not connected to internet

**Solution:**
- Fix syntax errors first
- Make sure you changed something
- Check your internet connection

---

### Issue 3: Rules not taking effect immediately

**Symptoms:**
- Old rules still working
- New rules not applied

**Solution:**
- Wait 1-2 minutes for propagation
- Hard refresh Firebase Console (Ctrl+Shift+R)
- Clear browser cache
- Restart your development server

---

### Issue 4: "Permission Denied" in app after publishing

**Cause:**
Rules are working correctly! This means:
- User not authenticated, OR
- User doesn't have permission for that action

**Solution:**
- Check if user is logged in: `console.log(user)`
- Verify user ID matches organizer ID
- Check event status (draft vs published)

---

## 📋 Quick Command Reference

### Firebase CLI (Optional Advanced Method)

If you prefer using terminal:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize database rules
firebase init database

# Deploy rules from firebase.json
firebase deploy --only database

# Test rules locally
firebase emulators:start --only database
```

This creates a `database.rules.json` file you can edit locally.

---

## 🎓 Understanding the Rules

### Basic Rule Structure

```json
{
  "rules": {
    "path": {
      ".read": "condition",   // Who can read
      ".write": "condition",  // Who can write
      ".validate": "checks"   // Data validation
    }
  }
}
```

### Variables Available

| Variable | Meaning | Example |
|----------|---------|---------|
| `auth` | Current user info | `auth.uid` |
| `$variable` | Path variable | `$eventId` |
| `data` | Current data | `data.val()` |
| `newData` | New data being written | `newData.val()` |
| `root` | Database root | `root.child('users')` |

### Common Patterns

**Anyone can read:**
```json
".read": true
```

**Only authenticated users:**
```json
".read": "auth != null"
```

**Only owner:**
```json
".read": "auth.uid === $userId"
```

**Conditional access:**
```json
".read": "data.child('public').val() === true"
```

**Data validation:**
```json
".validate": "newData.isString() && newData.val().length > 0"
```

---

## ✅ Success!

Your Firebase Realtime Database security rules are now configured! 🎉

**What's protected:**
- ✅ Users can only modify their own data
- ✅ Only organizers can edit their events
- ✅ Public can view published events only
- ✅ Invalid data is rejected
- ✅ Unauthenticated access is controlled

**Next steps:**
1. Test your app thoroughly
2. Monitor usage in Firebase Console
3. Review rules periodically
4. Update as your app grows

---

## 📚 Resources

- **Firebase Security Rules Docs**: https://firebase.google.com/docs/database/security
- **Rules Language Reference**: https://firebase.google.com/docs/reference/security/database
- **Best Practices**: https://firebase.google.com/docs/database/security/best-practices
- **Common Mistakes**: https://firebase.google.com/docs/database/security/common-mistakes

Need help? Check [FIREBASE_SECURITY_RULES_GUIDE.md](./FIREBASE_SECURITY_RULES_GUIDE.md) for detailed explanations!
