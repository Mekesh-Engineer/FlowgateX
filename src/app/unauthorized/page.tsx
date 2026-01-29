'use client';

import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-primary">
      
      {/* Background Decorative Elements (FlowGateX Style) */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--brand-primary)] opacity-10 blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 translate-x-1/2 rounded-full bg-[var(--brand-primary-dark)] opacity-10 blur-[120px]" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} 
      />

      <div className="relative z-10 mx-auto w-full max-w-lg px-6 text-center">
        {/* Icon & Heading */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] shadow-xl shadow-[var(--primary)]/10">
            <ErrorOutlineIcon className="text-5xl text-[var(--primary)]" />
          </div>
        </div>

        <h1 className="mb-2 font-heading text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-muted)]">
          404
        </h1>
        
        <h2 className="mb-4 font-heading text-2xl font-bold text-[var(--text-primary)] uppercase tracking-widest">
          Page Not Found
        </h2>
        
        <p className="mb-10 text-[var(--text-muted)] leading-relaxed">
          Sorry, we couldn&apos;t find the page you were looking for. It might have been moved, deleted, or never existed in the first place.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="btn-primary group flex items-center justify-center gap-2 px-8 py-3 shadow-lg shadow-[var(--primary)]/20"
          >
            <HomeIcon fontSize="small" className="transition-transform group-hover:-translate-y-0.5" />
            Return Home
          </Link>
          <Link
            href="/contact"
            className="btn-outline group flex items-center justify-center gap-2 px-8 py-3 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]"
          >
            <SupportAgentIcon fontSize="small" className="transition-transform group-hover:scale-110" />
            Contact Support
          </Link>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="absolute bottom-8 w-full text-center">
        <p className="text-xs text-[var(--text-muted)] opacity-50">
          &copy; {new Date().getFullYear()} FlowGateX. All rights reserved.
        </p>
      </div>
    </div>
  );
}