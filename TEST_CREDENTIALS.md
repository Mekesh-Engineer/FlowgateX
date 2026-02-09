# FlowGateX Test Credentials

This document contains hardcoded test credentials for initial development and testing purposes.

## ⚠️ Important

These credentials are **ONLY for development/testing** and should **NEVER** be used in production.

## Test Accounts

### 1. 👤 Attendee (User Role)

- **Email:** `mekesh.officials@gmail.com`
- **Password:** `Mekesh@attendee1236`
- **Role:** User
- **Access Level:** Basic attendee access, can browse events, book tickets, view personal dashboard

---

### 2. 📋 Organizer

- **Email:** `mekeshkumarm.23eee@kongu.edu`
- **Password:** `Mekesh@organizer1236`
- **Role:** Organizer
- **Access Level:** Create and manage events, view analytics, manage attendees

---

### 3. 🛡️ Admin

- **Email:** `mekeshkumar1236@gmail.com`
- **Password:** `Mekesh@admin1236`
- **Role:** Admin
- **Access Level:** Full system administration, user management, system monitoring

---

### 4. 👑 Super Admin

- **Email:** `mekesh.engineer@gmail.com`
- **Password:** `Mekesh@superadmin1236`
- **Role:** Super Admin
- **Access Level:** Highest level access, complete system control

---

## Legacy Demo Accounts (Backward Compatibility)

### Demo User

- **Email:** `demo@flowgatex.com`
- **Password:** `demo123`
- **Role:** User

### Demo Organizer

- **Email:** `organizer@flowgatex.com`
- **Password:** `demo123`
- **Role:** Organizer

### Demo Admin

- **Email:** `admin@flowgatex.com`
- **Password:** `demo123`
- **Role:** Admin

---

## Using These Credentials

1. Navigate to the login page at `/login`
2. Enter one of the email addresses above
3. Enter the corresponding password
4. The system will automatically authenticate and redirect to the appropriate dashboard based on role

## Mock Mode

These credentials work when the app is running in **mock mode** (default for development):

- Mock mode is enabled when `VITE_MOCK_MODE=true` in your environment variables
- No Firebase/backend connection is required
- Authentication happens entirely client-side
- User data is stored in localStorage

## Implementation Details

- **Location:** `src/lib/mockAuth.ts`
- **Role Definitions:** `src/lib/constants.ts` (UserRole enum)
- **Auth Service:** `src/features/auth/services/authService.ts`

## Security Notes

- Passwords are validated during login
- Passwords are NOT stored in localStorage after authentication
- All mock users have `emailVerified: true` by default
- Session persists via localStorage with key `flowgatex_mock_user`

---

**Last Updated:** February 7, 2026
