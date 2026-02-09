// =============================================================================
// MOBILE INPUT — Country code selector + phone input with E.164 formatting
// =============================================================================

import { useState, useRef } from 'react';
import { Phone, ChevronDown, AlertCircle } from 'lucide-react';
import {
  COUNTRY_CODES,
  type CountryOption,
} from '@/features/auth/utils/mobileValidation';

interface MobileInputProps {
  value: string; // National number (without country code)
  countryCode: string; // e.g. "+91"
  onValueChange: (value: string) => void;
  onCountryCodeChange: (code: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function MobileInput({
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  error,
  disabled = false,
}: MobileInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRY_CODES.find((c) => c.dial === countryCode) ?? COUNTRY_CODES[0];

  const handleSelect = (country: CountryOption) => {
    onCountryCodeChange(country.dial);
    setDropdownOpen(false);
  };

  const handlePhoneChange = (raw: string) => {
    // Allow only digits and common formatting chars
    const cleaned = raw.replace(/[^\d\s\-()]/g, '');
    onValueChange(cleaned);
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label
        htmlFor="register-mobile"
        className="block text-sm font-semibold text-[var(--text-primary)]"
      >
        Mobile Number
      </label>

      <div className="register-mobile-wrapper">
        {/* Country code selector */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={disabled}
          aria-label={`Country code: ${selectedCountry.dial}`}
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
          className="register-mobile-country"
        >
          <span aria-hidden="true">{selectedCountry.flag}</span>
          <span className="text-xs font-medium text-[var(--text-primary)]">
            {selectedCountry.dial}
          </span>
          <ChevronDown size={12} className="text-[var(--text-muted)]" aria-hidden="true" />
        </button>

        {/* Phone input */}
        <div className="register-mobile-divider" aria-hidden="true" />
        <div className="relative flex-1">
          <Phone
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="register-mobile"
            type="tel"
            inputMode="tel"
            value={value}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Phone number"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? 'register-mobile-error' : undefined}
            className="register-mobile-input"
          />
        </div>

        {/* Country dropdown */}
        {dropdownOpen && (
          <ul
            role="listbox"
            aria-label="Select country code"
            className="register-mobile-dropdown"
          >
            {COUNTRY_CODES.map((country) => (
              <li
                key={country.code}
                role="option"
                aria-selected={country.dial === countryCode}
                onClick={() => handleSelect(country)}
                className={`register-mobile-option ${country.dial === countryCode ? 'register-mobile-option--active' : ''}`}
              >
                <span aria-hidden="true">{country.flag}</span>
                <span className="flex-1 text-sm">{country.name}</span>
                <span className="text-xs text-[var(--text-muted)]">{country.dial}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p
          id="register-mobile-error"
          className="flex items-center gap-1 text-xs text-[var(--color-error)]"
          role="alert"
        >
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
