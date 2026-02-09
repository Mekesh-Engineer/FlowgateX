// =============================================================================
// REGISTRATION SERVICE TYPES & CONTRACTS
// =============================================================================
// These types define the API contract for the registration flow.
// The frontend calls these interfaces; the backend team implements them.

export type SignupRole = 'attendee' | 'organizer' | 'admin';

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

/** Payload sent to POST /api/auth/register */
export interface CreateUserPayload {
  role: SignupRole;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  password: string;
  mobile?: string;
  gender?: Gender;
  liveLocationConsent?: boolean;
  organization?: string;
  department?: string;
  authorizationCode?: string;
  consents: {
    terms: boolean;
    marketing: boolean;
    whatsapp: boolean;
  };
}

/** Response from POST /api/auth/register */
export interface CreateUserResponse {
  success: boolean;
  userId: string;
  email: string;
  role: SignupRole;
  message: string;
}

/** Payload sent to POST /api/auth/otp/send */
export interface SendOtpPayload {
  /** Email or phone number to send the OTP to */
  target: string;
  /** Channel: email or sms */
  channel: 'email' | 'sms';
}

/** Response from POST /api/auth/otp/send */
export interface SendOtpResponse {
  success: boolean;
  message: string;
  /** Seconds until OTP expires */
  expiresIn: number;
}

/** Payload sent to POST /api/auth/otp/verify */
export interface VerifyOtpPayload {
  target: string;
  channel: 'email' | 'sms';
  code: string;
}

/** Response from POST /api/auth/otp/verify */
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

/** Payload sent to POST /api/auth/validate-auth-code */
export interface ValidateAuthCodePayload {
  code: string;
  role: SignupRole;
}

/** Response from POST /api/auth/validate-auth-code */
export interface ValidateAuthCodeResponse {
  success: boolean;
  message: string;
  /** When the code expires (ISO string) */
  expiresAt?: string;
}

// =============================================================================
// ERROR CODES — Backend returns these, frontend maps to messages
// =============================================================================

export const REGISTRATION_ERROR_CODES = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_AUTH_CODE: 'INVALID_AUTH_CODE',
  AUTH_CODE_EXPIRED: 'AUTH_CODE_EXPIRED',
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_INVALID: 'OTP_INVALID',
  OTP_MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  DOB_UNDERAGE: 'DOB_UNDERAGE',
  INVALID_MOBILE: 'INVALID_MOBILE',
} as const;

export type RegistrationErrorCode =
  (typeof REGISTRATION_ERROR_CODES)[keyof typeof REGISTRATION_ERROR_CODES];

/** Map backend error codes to user-friendly messages */
export const ERROR_MESSAGE_MAP: Record<RegistrationErrorCode, string> = {
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists. Try signing in instead.',
  INVALID_AUTH_CODE: 'The authorization code is invalid. Please check and try again.',
  AUTH_CODE_EXPIRED: 'The authorization code has expired. Please request a new one.',
  OTP_EXPIRED: 'The verification code has expired. Please request a new one.',
  OTP_INVALID: 'Invalid verification code. Please check and try again.',
  OTP_MAX_ATTEMPTS: 'Too many attempts. Please wait before trying again.',
  WEAK_PASSWORD: 'Your password does not meet the requirements.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  DOB_UNDERAGE: 'You must be at least 13 years old to create an account.',
  INVALID_MOBILE: 'Please enter a valid mobile number in E.164 format.',
};
