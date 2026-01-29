'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

// Material Icons
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PaymentsIcon from '@mui/icons-material/Payments';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';

// ==========================================
// DATA: CATEGORIES & FAQS
// ==========================================

const HELP_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: HelpOutlineIcon,
    description: 'New to FlowGateX? Learn the basics of setting up your account.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'account',
    title: 'Account & Profile',
    icon: AccountCircleIcon,
    description: 'Manage your profile settings, password, and preferences.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'ticketing',
    title: 'Ticketing & Orders',
    icon: ConfirmationNumberIcon,
    description: 'Issues with booking, refunds, or accessing your QR tickets.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'payments',
    title: 'Billing & Payments',
    icon: PaymentsIcon,
    description: 'Understand fees, invoices, and secure payment methods.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'security',
    title: 'Privacy & Security',
    icon: SecurityIcon,
    description: 'How we protect your data and ensure secure access.',
    color: 'from-red-500 to-rose-500',
  },
  {
    id: 'organizer',
    title: 'For Organizers',
    icon: EventIcon,
    description: 'Tools for creating events, managing crowds, and analytics.',
    color: 'from-indigo-500 to-violet-500',
  },
];

const FAQS = [
  {
    question: 'How do I access my event ticket?',
    answer: 'Once your booking is confirmed, your QR ticket is sent to your email and is also available in the "My Bookings" section of the app. You can present this QR code at the venue for seamless IoT-enabled entry.',
  },
  {
    question: 'Can I get a refund if I cancel?',
    answer: 'Refund policies vary by event organizer. Generally, you can request a refund up to 48 hours before the event starts via your "My Bookings" page. Check the specific event details for the organizer’s policy.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes. FlowGateX uses industry-standard encryption and partners with trusted gateways like Stripe and Razorpay. We do not store your credit card details on our servers.',
  },
  {
    question: 'How does the smart entry system work?',
    answer: 'Our venues are equipped with IoT scanners. Simply show your dynamic QR code at the gate. The system verifies it instantly, granting you access without the need for physical checks or long queues.',
  },
  {
    question: 'I forgot my password. How do I reset it?',
    answer: 'Go to the Login page and click "Forgot Password". Enter your registered email address, and we will send you a secure link to create a new password.',
  },
];

// ==========================================
// COMPONENT: FAQ ACCORDION
// ==========================================

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border-primary)] last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[var(--primary)]"
      >
        <span className="text-lg font-medium text-[var(--text-primary)]">{question}</span>
        <ExpandMoreIcon
          className={clsx(
            'text-[var(--text-muted)] transition-transform duration-300',
            isOpen && 'rotate-180 text-[var(--primary)]'
          )}
        />
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <p className="pb-5 text-[var(--text-secondary)] leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-primary">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[800px] bg-[var(--primary)] opacity-5 blur-[120px] rounded-full" />
        
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="badge badge-primary mb-6 inline-flex items-center gap-1">
            <SupportAgentIcon fontSize="small" />
            Help Center
          </span>
          <h1 className="font-heading text-4xl font-bold md:text-6xl mb-6">
            How can we <span className="text-gradient">help you?</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
            Find advice and answers from our support team fast.
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--brand-primary-dark)] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden shadow-2xl">
              <SearchIcon className="ml-4 text-[var(--text-muted)] text-2xl" />
              <input
                type="text"
                placeholder="Search for articles, questions, or topics..."
                className="w-full bg-transparent px-4 py-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
              />
              <button className="mr-2 btn-primary px-6 py-2 rounded-lg text-sm">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-heading text-2xl font-bold mb-8 text-[var(--text-primary)]">Browse by Category</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HELP_CATEGORIES.map((cat) => (
            <Link 
              href={`/help/${cat.id}`} 
              key={cat.id}
              className="card card-hover p-6 group block"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg`}>
                <cat.icon className="text-white text-2xl" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FAQ SECTION */}
      <section className="mx-auto max-w-3xl px-6 py-16 border-t border-[var(--border-primary)]">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-[var(--text-muted)]">Quick answers to common questions about FlowGateX.</p>
        </div>
        
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] px-6 md:px-8">
          {FAQS.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* 4. CONTACT CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border-primary)] p-8 md:p-12 text-center">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-5 blur-[80px]" />

          <h2 className="font-heading text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto mb-8">
            Our support team is available 24/7 to assist you with any issues regarding events, tickets, or your account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary flex items-center gap-2 px-8 py-3">
              <ChatIcon fontSize="small" />
              Chat with Support
            </Link>
            <Link href="mailto:support@flowgatex.com" className="btn-outline flex items-center gap-2 px-8 py-3">
              <EmailIcon fontSize="small" />
              Email Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}