// =============================================================================
// PASSWORD VALIDATION UTILITIES — Shared between PasswordMeter and RegisterPage
// =============================================================================

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

export const PASSWORD_RULES: Rule[] = [
  { label: 'At least 12 characters', test: (pw) => pw.length >= 12 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw) => /\d/.test(pw) },
  { label: 'One special character (!@#$…)', test: (pw) => /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;']/.test(pw) },
];

/** Returns true when password meets all rules */
export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(password));
}
