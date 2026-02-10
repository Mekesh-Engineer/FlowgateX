// =============================================================================
// DOB VALIDATION — Date of birth validation utilities
// =============================================================================

const MIN_AGE = 13;

/** Validate a YYYY-MM-DD date of birth string. Returns error string or null. */
export function validateDob(value: string): string | null {
  if (!value) return 'Date of birth is required.';

  const dob = new Date(value);
  if (isNaN(dob.getTime())) return 'Invalid date.';

  const today = new Date();
  
  // Calculate age based on year difference
  let age = today.getFullYear() - dob.getFullYear();
  
  // Adjust if birthday hasn't occurred yet this year
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < MIN_AGE) return `You must be at least ${MIN_AGE} years old.`;
  if (age > 120) return 'Please enter a valid date of birth.';

  return null;
}
