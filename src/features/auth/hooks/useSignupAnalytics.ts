// =============================================================================
// ANALYTICS HOOKS — Pluggable analytics interface for signup flow
// =============================================================================
// Emits frontend analytics events via a pluggable adapter pattern.
// Replace the default console adapter with your analytics provider
// (Mixpanel, Segment, GA4, etc.) by calling setAnalyticsAdapter().
// =============================================================================

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent): void;
}

// ---------------------------------------------------------------------------
// Default adapter — logs to console in development
// ---------------------------------------------------------------------------

const consoleAdapter: AnalyticsAdapter = {
  track(event) {
    if (import.meta.env.DEV) {
      console.log(
        `%c📊 Analytics%c ${event.name}`,
        'color: #00A3DB; font-weight: bold',
        'color: inherit',
        event.properties ?? '',
      );
    }
  },
};

let currentAdapter: AnalyticsAdapter = consoleAdapter;

/** Replace the analytics adapter at runtime */
export function setAnalyticsAdapter(adapter: AnalyticsAdapter): void {
  currentAdapter = adapter;
}

// ---------------------------------------------------------------------------
// Event emitters for the signup flow
// ---------------------------------------------------------------------------

function emit(name: string, properties?: Record<string, unknown>) {
  currentAdapter.track({ name, properties, timestamp: Date.now() });
}

/** User selected a role on the signup form */
export function trackRoleSelected(role: string) {
  emit('signup_role_selected', { role });
}

/** User advanced to the next step */
export function trackStepAdvanced(step: number, role: string) {
  emit('signup_step_advanced', { step, role });
}

/** OTP was sent */
export function trackOtpSent(email: string) {
  emit('signup_otp_sent', { email });
}

/** OTP was resent */
export function trackOtpResent(email: string, attempt: number) {
  emit('signup_otp_resent', { email, attempt });
}

/** OTP verification succeeded */
export function trackOtpVerified(email: string) {
  emit('signup_otp_verified', { email });
}

/** Signup completed successfully */
export function trackSignupSuccess(role: string, method: 'email' | 'google' | 'github' | 'apple' | 'phone') {
  emit('signup_success', { role, method });
}

/** Signup failed */
export function trackSignupFailure(role: string, errorCode: string) {
  emit('signup_failure', { role, errorCode });
}

/** Social sign-in button clicked */
export function trackSocialClick(provider: 'google' | 'github' | 'apple' | 'phone') {
  emit('signup_social_click', { provider });
}

/** Authorization code validated */
export function trackAuthCodeValidated(role: string, success: boolean) {
  emit('signup_auth_code_validated', { role, success });
}
