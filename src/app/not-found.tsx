'use client';

import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ExploreIcon from '@mui/icons-material/Explore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] font-primary relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--primary)] opacity-10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[var(--brand-primary-dark)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} 
      />

      {/* ========== HEADER ========== */}
      <header className="relative z-50 w-full py-6">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 group" aria-label="FlowGateX">
            <span className="font-heading text-2xl font-bold tracking-tight">
              <span className="text-[var(--text-primary)]">FlowGate</span>
              <span className="text-[var(--primary)]">X</span>
            </span>
          </Link>
        </nav>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow px-4">
        <div className="text-center max-w-2xl mx-auto">
          
          {/* Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            <SearchOffIcon className="text-5xl text-[var(--primary)]" />
          </div>
          
          {/* 404 Title */}
          <h1 className="text-8xl sm:text-9xl font-bold font-heading text-gradient">
            404
          </h1>
          
          <p className="mt-4 text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-wide font-heading">
            Page Not Found
          </p>
          <p className="mt-3 text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
            Sorry, we couldn&apos;t find the page you were looking for. It might have been moved, deleted, or never existed.
          </p>
          
          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/" 
              className="btn-primary px-6 py-3 flex items-center gap-2 group shadow-lg shadow-[var(--primary)]/20"
            >
              <HomeIcon className="text-xl group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <Link 
              href="/events" 
              className="btn-outline px-6 py-3 flex items-center gap-2 group"
            >
              <ExploreIcon className="text-xl group-hover:rotate-12 transition-transform" />
              Explore Events
            </Link>
          </div>

          {/* Help Link */}
          <div className="mt-8">
            <Link 
              href="/help" 
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              <SupportAgentIcon fontSize="small" />
              Need help? Contact Support
            </Link>
          </div>
        </div>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-10 mt-auto text-center py-6 border-t border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} FlowGateX. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}