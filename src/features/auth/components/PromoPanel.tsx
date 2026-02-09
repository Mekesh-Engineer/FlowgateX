// =============================================================================
// PROMO PANEL - Left-side branding panel with video background & sliding text
// =============================================================================

import { useRef, useEffect } from 'react';

// =============================================================================
// DATA
// =============================================================================

const SLIDING_HEADLINES = [
  {
    headline: 'Experience world-class events.',
    sub: 'Curated experiences, unforgettable moments.',
  },
  {
    headline: 'Seamless ticketing, instant access.',
    sub: 'From booking to entry — all in one place.',
  },
  {
    headline: 'Your gateway to greatness.',
    sub: 'VIP perks, backstage passes, early bird pricing.',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function PromoPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Ensure video plays (some browsers need explicit play call)
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div
      className="hidden lg:flex w-1/2 login-video-panel relative flex-col justify-between p-12 xl:p-16 overflow-hidden"
      aria-hidden="true"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster=""
      >
        <source src="/src/assets/video/Hero_homepage.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <div className="login-video-overlay" />

      {/* Floating lime particles */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <div className="login-particle" />
        <div className="login-particle" />
        <div className="login-particle" />
        <div className="login-particle" />
        <div className="login-particle" />
        <div className="login-particle" />
      </div>

      {/* Top — empty for spacing (logo is now fixed outside) */}
      <div className="relative z-10" />

      {/* Centre — Sliding Text Headlines */}
      <div className="relative z-10 max-w-lg login-sliding-text h-[200px]">
        {SLIDING_HEADLINES.map(({ headline, sub }, i) => (
          <div key={i} className="slide-text-item px-1">
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
              {headline}
            </h2>
            <p className="text-white/70 text-base xl:text-lg leading-relaxed font-medium">
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom — Copyright */}
      <p className="relative z-10 text-white/40 text-sm font-medium">
        &copy; {currentYear} FlowGateX Inc.
      </p>
    </div>
  );
}
