// =============================================================================
// MOCK REGISTRATION SERVICE
// =============================================================================
// Stubbed implementations for frontend development. The backend team replaces
// these with real API calls. Each method simulates network latency and returns
// typed responses matching the contracts in registration.types.ts.
//
// Feature flag: when VITE_MOCK_MODE=true these stubs are used automatically.
// =============================================================================

import type {
  CreateUserPayload,
  CreateUserResponse,
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  ValidateAuthCodePayload,
  ValidateAuthCodeResponse,
} from '../types/registration.types';

export type { SendOtpPayload, VerifyOtpPayload };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Simulate a random network delay between min and max ms */
const networkDelay = (min = 400, max = 900) =>
  delay(min + Math.random() * (max - min));

// ---------------------------------------------------------------------------
// Known test data
// ---------------------------------------------------------------------------

const EXISTING_EMAILS = new Set([
  'mekesh.officials@gmail.com',
  'mekeshkumarm.23eee@kongu.edu',
  'mekeshkumar1236@gmail.com',
  'mekesh.engineer@gmail.com',
  'demo@flowgatex.com',
  'organizer@flowgatex.com',
  'admin@flowgatex.com',
]);

/** Accepted authorization codes for testing */
const VALID_AUTH_CODES: Record<string, { role: string; label: string }> = {
  'ADMIN-2026-FLOWGATEX': { role: 'admin', label: 'Admin Access' },
  'ORG-KEC-2026': { role: 'organizer', label: 'KEC Organizer' },
  'ORG-ACME-2026': { role: 'organizer', label: 'Acme Events Organizer' },
};

// In-memory OTP store (test only)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// ---------------------------------------------------------------------------
// Service Methods
// ---------------------------------------------------------------------------

/**
 * POST /api/auth/register
 * Creates a new user account.
 */
export async function createUser(
  payload: CreateUserPayload,
): Promise<CreateUserResponse> {
  await networkDelay();

  // Simulate duplicate email check
  if (EXISTING_EMAILS.has(payload.email.toLowerCase())) {
    throw {
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'An account with this email already exists.',
    };
  }

  // Add to known set so duplicate check works within session
  EXISTING_EMAILS.add(payload.email.toLowerCase());

  return {
    success: true,
    userId: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: payload.email,
    role: payload.role,
    message: 'Account created successfully.',
  };
}

/**
 * POST /api/auth/otp/send
 * Sends a 6-digit OTP to the given target via email or sms.
 */
export async function sendOtp(
  payload: SendOtpPayload,
): Promise<SendOtpResponse> {
  await networkDelay();

  // Generate a deterministic test OTP (always 123456 in mock mode)
  const code = '123456';
  otpStore.set(payload.target.toLowerCase(), {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  const icon = payload.channel === 'sms' ? '📱' : '📧';
  console.log(
    `${icon} [Mock] OTP for ${payload.target}: ${code}  (use this in the verification field)`,
  );

  return {
    success: true,
    message: `Verification code sent to ${payload.target}.`,
    expiresIn: 300,
  };
}

/**
 * POST /api/auth/otp/verify
 * Verifies a 6-digit OTP for any channel.
 */
export async function verifyOtp(
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> {
  await networkDelay(300, 600);

  const entry = otpStore.get(payload.target.toLowerCase());

  if (!entry) {
    throw { code: 'OTP_EXPIRED', message: 'No OTP found. Please request a new one.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(payload.target.toLowerCase());
    throw { code: 'OTP_EXPIRED', message: 'The verification code has expired.' };
  }

  if (entry.code !== payload.code) {
    throw { code: 'OTP_INVALID', message: 'Invalid verification code.' };
  }

  // Clean up
  otpStore.delete(payload.target.toLowerCase());

  return {
    success: true,
    message: `${payload.channel === 'sms' ? 'Phone' : 'Email'} verified successfully.`,
  };
}

/**
 * POST /api/auth/validate-auth-code
 * Validates an authorization code for admin/organizer signup.
 */
export async function validateAuthCode(
  payload: ValidateAuthCodePayload,
): Promise<ValidateAuthCodeResponse> {
  await networkDelay();

  const entry = VALID_AUTH_CODES[payload.code.toUpperCase().trim()];

  if (!entry) {
    throw { code: 'INVALID_AUTH_CODE', message: 'Invalid authorization code.' };
  }

  return {
    success: true,
    message: `Authorization code accepted: ${entry.label}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Stubbed Social Auth flows
// ---------------------------------------------------------------------------

export async function signUpWithGoogle(): Promise<CreateUserResponse> {
  await networkDelay(600, 1200);
  return {
    success: true,
    userId: `usr_google_${Date.now()}`,
    email: 'google-user@gmail.com',
    role: 'attendee',
    message: 'Signed up with Google.',
  };
}

export async function signUpWithPhone(phone: string): Promise<CreateUserResponse> {
  await networkDelay(600, 1200);
  return {
    success: true,
    userId: `usr_phone_${Date.now()}`,
    email: '',
    role: 'attendee',
    message: `Phone signup initiated for ${phone}.`,
  };
}
