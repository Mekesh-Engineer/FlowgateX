// =============================================================================
// REVIEW SCREEN — Read-only summary of all fields with Edit buttons per section
// =============================================================================

import {
  User, Mail, Calendar, Phone, Shield, MapPin, Building2, Hash, Edit3,
} from 'lucide-react';
import type { Gender } from '../types/registration.types';

interface ReviewData {
  // Step 1 — Identity
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;

  // Step 2 — Security
  mobile: string;
  countryCode: string;
  gender: Gender | '';
  acceptTerms: boolean;
  liveLocationConsent: boolean;

  // Step 3 — Verify (role-specific)
  organization?: string;
  department?: string;
  authorizationCode?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface ReviewScreenProps {
  data: ReviewData;
  onEditStep: (step: number) => void;
  disabled?: boolean;
}

/** Helper to format date for display */
function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatGender(g: Gender | ''): string {
  if (!g) return '—';
  const map: Record<Gender, string> = {
    male: 'Male',
    female: 'Female',
    'non-binary': 'Non-binary',
    'prefer-not-to-say': 'Prefer not to say',
  };
  return map[g] ?? '—';
}

function formatRole(r: string): string {
  return r.charAt(0).toUpperCase() + r.slice(1);
}

export default function ReviewScreen({ data, onEditStep, disabled }: ReviewScreenProps) {
  const isOrgRole = data.role === 'organizer' || data.role === 'admin';
  const fullMobile =
    data.mobile ? `${data.countryCode} ${data.mobile}` : '—';

  return (
    <div className="register-review">
      {/* Section 1: Identity */}
      <section className="register-review-section" aria-label="Identity details">
        <div className="register-review-header">
          <h3 className="register-review-title">Identity</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            disabled={disabled}
            className="register-review-edit"
            aria-label="Edit identity details"
          >
            <Edit3 size={13} aria-hidden="true" />
            Edit
          </button>
        </div>

        <dl className="register-review-grid">
          <div className="register-review-field">
            <dt><Shield size={13} aria-hidden="true" /> Role</dt>
            <dd>{formatRole(data.role)}</dd>
          </div>
          <div className="register-review-field">
            <dt><User size={13} aria-hidden="true" /> Full Name</dt>
            <dd>{data.firstName} {data.lastName}</dd>
          </div>
          <div className="register-review-field">
            <dt><Mail size={13} aria-hidden="true" /> Email</dt>
            <dd>{data.email}</dd>
          </div>
          <div className="register-review-field">
            <dt><Calendar size={13} aria-hidden="true" /> Date of Birth</dt>
            <dd>{formatDate(data.dob)}</dd>
          </div>
        </dl>
      </section>

      {/* Section 2: Contact & Security */}
      <section className="register-review-section" aria-label="Contact and security details">
        <div className="register-review-header">
          <h3 className="register-review-title">Contact & Security</h3>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            disabled={disabled}
            className="register-review-edit"
            aria-label="Edit contact and security details"
          >
            <Edit3 size={13} aria-hidden="true" />
            Edit
          </button>
        </div>

        <dl className="register-review-grid">
          <div className="register-review-field">
            <dt><Phone size={13} aria-hidden="true" /> Mobile</dt>
            <dd>{fullMobile}</dd>
          </div>
          <div className="register-review-field">
            <dt><User size={13} aria-hidden="true" /> Gender</dt>
            <dd>{formatGender(data.gender)}</dd>
          </div>
          <div className="register-review-field">
            <dt><MapPin size={13} aria-hidden="true" /> Live Location</dt>
            <dd>{data.liveLocationConsent ? 'Consented' : 'Not consented'}</dd>
          </div>
        </dl>
      </section>

      {/* Section 3: Verification & Role-Specific Fields */}
      {isOrgRole && (
        <section className="register-review-section" aria-label="Organization details">
          <div className="register-review-header">
            <h3 className="register-review-title">Organization</h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              disabled={disabled}
              className="register-review-edit"
              aria-label="Edit organization details"
            >
              <Edit3 size={13} aria-hidden="true" />
              Edit
            </button>
          </div>

          <dl className="register-review-grid">
            {data.organization && (
              <div className="register-review-field">
                <dt><Building2 size={13} aria-hidden="true" /> Organization</dt>
                <dd>{data.organization}</dd>
              </div>
            )}
            {data.department && (
              <div className="register-review-field">
                <dt><Building2 size={13} aria-hidden="true" /> Department</dt>
                <dd>{data.department}</dd>
              </div>
            )}
            {data.authorizationCode && (
              <div className="register-review-field">
                <dt><Hash size={13} aria-hidden="true" /> Auth Code</dt>
                <dd className="font-mono text-xs">{data.authorizationCode}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* Verification status badges */}
      <section className="register-review-section" aria-label="Verification status">
        <div className="register-review-header">
          <h3 className="register-review-title">Verification</h3>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            disabled={disabled}
            className="register-review-edit"
            aria-label="Edit verification"
          >
            <Edit3 size={13} aria-hidden="true" />
            Edit
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`register-review-badge ${data.emailVerified ? 'register-review-badge--success' : 'register-review-badge--pending'}`}
          >
            <Mail size={12} aria-hidden="true" />
            Email {data.emailVerified ? 'Verified' : 'Pending'}
          </span>
          {data.mobile && (
            <span
              className={`register-review-badge ${data.phoneVerified ? 'register-review-badge--success' : 'register-review-badge--pending'}`}
            >
              <Phone size={12} aria-hidden="true" />
              Phone {data.phoneVerified ? 'Verified' : 'Pending'}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
