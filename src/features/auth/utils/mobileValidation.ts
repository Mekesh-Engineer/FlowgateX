// =============================================================================
// MOBILE VALIDATION — Country codes, E.164 formatting, and validation
// =============================================================================

export interface CountryOption {
  code: string;
  dial: string;
  name: string;
  flag: string;
}

export const COUNTRY_CODES: CountryOption[] = [
  { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'US', dial: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', dial: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', dial: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', dial: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'JP', dial: '+81', name: 'Japan', flag: '🇯🇵' },
];

/** Combine country code + national number → E.164 */
export function toE164(countryCode: string, national: string): string {
  const cleaned = national.replace(/\D/g, '');
  if (!cleaned) return '';
  return `${countryCode}${cleaned}`;
}

/** Basic E.164 validation */
export function validateMobile(countryCode: string, national: string): string | null {
  if (!national.trim()) return null; // Optional field — no error if blank
  const cleaned = national.replace(/\D/g, '');
  if (cleaned.length < 6) return 'Phone number is too short.';
  if (cleaned.length > 15) return 'Phone number is too long.';
  const full = `${countryCode}${cleaned}`;
  if (!/^\+[1-9]\d{6,14}$/.test(full)) return 'Enter a valid phone number.';
  return null;
}
