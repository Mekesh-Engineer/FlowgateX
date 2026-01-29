'use client';

import Link from 'next/link';
import Image from 'next/image';

// Social Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// UI Icons
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PaymentsIcon from '@mui/icons-material/Payments';
import ArticleIcon from '@mui/icons-material/Article';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import ExtensionIcon from '@mui/icons-material/Extension';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';

// ============================================================================
// TYPES & DATA
// ============================================================================

interface FooterLink {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'For Attendees',
    links: [
      { label: 'Browse Events', href: '/events', icon: SearchIcon },
      { label: 'My Tickets', href: '/tickets', icon: ConfirmationNumberIcon },
      { label: 'Saved Events', href: '/favorites', icon: FavoriteBorderIcon },
      { label: 'Get Help', href: '/support', icon: SupportAgentIcon },
    ],
  },
  {
    title: 'For Organizers',
    links: [
      { label: 'Create Event', href: '/create-event', icon: AddCircleOutlineIcon },
      { label: 'Dashboard', href: '/dashboard', icon: DashboardCustomizeIcon },
      { label: 'Analytics', href: '/analytics', icon: AnalyticsIcon },
      { label: 'Pricing', href: '/pricing', icon: PaymentsIcon },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog', icon: ArticleIcon },
      { label: 'Guides', href: '/guides', icon: MenuBookIcon },
      { label: 'API Docs', href: '/api-docs', icon: CodeIcon },
      { label: 'Integrations', href: '/integrations', icon: ExtensionIcon },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about', icon: InfoOutlinedIcon },
      { label: 'Careers', href: '/careers', icon: WorkOutlineIcon },
      { label: 'Contact', href: '/contact', icon: MailOutlineIcon },
      { label: 'Press Kit', href: '/press', icon: NewspaperIcon },
    ],
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-secondary)] pt-16 pb-8 border-t border-[var(--border-primary)] mt-auto">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 block group">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--shadow-primary)] transition-transform group-hover:scale-105">
                  <ConfirmationNumberIcon className="text-white" fontSize="small" />
                </div>
                <span className="font-heading text-2xl font-bold tracking-tight">
                  <span className="text-[var(--text-primary)]">Flow</span>
                  <span className="text-[var(--brand-primary)]">Gate</span>
                  <span className="text-[var(--text-primary)]">X</span>
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs leading-relaxed">
              Next-generation event management platform with IoT-powered access control and real-time analytics.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: FacebookIcon, href: '#' },
                { icon: InstagramIcon, href: '#' },
                { icon: TwitterIcon, href: '#' },
                { icon: YouTubeIcon, href: '#' },
                { icon: LinkedInIcon, href: '#' },
              ].map((Social, index) => (
                <a
                  key={index}
                  href={Social.href}
                  className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:text-white transition-all duration-300"
                >
                  <Social.icon fontSize="small" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="font-heading font-bold text-lg mb-6 text-[var(--text-primary)]">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                    >
                      {link.icon && (
                        <link.icon className="text-[18px] text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors" />
                      )}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download Section */}
        <div className="border-t border-b border-[var(--border-primary)] py-10 mb-8 bg-[var(--bg-primary)]/50 rounded-2xl px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-heading font-bold text-xl text-[var(--text-primary)] mb-2">
                Get the FlowGateX App
              </h4>
              <p className="text-sm text-[var(--text-muted)]">
                Download now for the best mobile experience and real-time ticketing.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="group flex items-center gap-3 px-5 py-3 bg-[var(--bg-card)] rounded-xl hover:bg-[var(--bg-hover)] transition-all border border-[var(--border-primary)] shadow-sm hover:shadow-md">
                <AppleIcon className="text-3xl text-[var(--text-primary)]" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Download on</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] leading-none">App Store</p>
                </div>
              </button>
              <button className="group flex items-center gap-3 px-5 py-3 bg-[var(--bg-card)] rounded-xl hover:bg-[var(--bg-hover)] transition-all border border-[var(--border-primary)] shadow-sm hover:shadow-md">
                <AndroidIcon className="text-3xl text-[var(--text-primary)]" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Get it on</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] leading-none">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
          <p className="text-xs text-[var(--text-muted)] text-center md:text-left">
            © {currentYear} FlowGateX. All rights reserved. Made with{' '}
            <FavoriteBorderIcon className="text-xs text-red-500 mx-1 align-text-top inline" fontSize="inherit" />{' '}
            for event lovers.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Accessibility'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}