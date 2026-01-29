'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

// Material Icons
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatIcon from '@mui/icons-material/Chat';

// ==========================================
// COMPONENT: CONTACT FORM
// ==========================================

const ContactForm = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  if (formState === 'success') {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-12 text-center border-[var(--primary)] bg-[var(--bg-card)]">
        <div className="w-20 h-20 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-6 text-[var(--primary)]">
          <CheckCircleIcon style={{ fontSize: 48 }} />
        </div>
        <h3 className="font-heading text-2xl font-bold mb-2">Message Sent!</h3>
        <p className="text-[var(--text-muted)] mb-8 max-w-xs">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <button 
          onClick={() => setFormState('idle')}
          className="btn-outline px-8"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="card p-8 md:p-10 bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-5 blur-[100px] pointer-events-none" />

      <h3 className="font-heading text-2xl font-bold mb-6 text-[var(--text-primary)]">Send us a Message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="label">Full Name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="John Doe"
              className="input bg-[var(--bg-tertiary)]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="label">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="john@example.com"
              className="input bg-[var(--bg-tertiary)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="label">Subject</label>
          <select id="subject" className="input bg-[var(--bg-tertiary)] appearance-none">
            <option>General Inquiry</option>
            <option>Event Support</option>
            <option>Organizer Partnership</option>
            <option>Technical Issue</option>
            <option>Billing & Refunds</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="label">Message</label>
          <textarea
            id="message"
            rows={5}
            required
            placeholder="How can we help you today?"
            className="input bg-[var(--bg-tertiary)] resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={formState === 'submitting'}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 group"
        >
          {formState === 'submitting' ? (
            <span className="animate-pulse">Sending...</span>
          ) : (
            <>
              <span>Send Message</span>
              <SendIcon fontSize="small" className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// ==========================================
// COMPONENT: INFO CARD
// ==========================================

const InfoCard = ({ icon: Icon, title, value, link, subtext }: any) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors duration-200 border border-transparent hover:border-[var(--border-primary)] group">
    <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] group-hover:bg-[var(--primary)] group-hover:text-white text-[var(--primary)] flex items-center justify-center flex-shrink-0 transition-all duration-300">
      <Icon />
    </div>
    <div>
      <h4 className="font-heading font-bold text-lg text-[var(--text-primary)]">{title}</h4>
      {link ? (
        <Link href={link} className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors block mt-1">
          {value}
        </Link>
      ) : (
        <p className="text-[var(--text-secondary)] mt-1">{value}</p>
      )}
      {subtext && <p className="text-xs text-[var(--text-muted)] mt-1">{subtext}</p>}
    </div>
  </div>
);

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-primary">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden text-center">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--brand-primary)] opacity-10 blur-[120px] rounded-full -z-10" />
        
        <div className="mx-auto max-w-3xl px-6">
          <span className="badge badge-primary mb-6 inline-flex items-center gap-1">
            <ChatIcon fontSize="small" />
            Get In Touch
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            We&apos;d love to <span className="text-gradient">hear from you</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed">
            Have a question about an event, pricing, or partnership? Our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card p-6 border border-[var(--border-primary)] space-y-2">
              <InfoCard 
                icon={EmailIcon} 
                title="Email Us" 
                value="mekesh.engineer@gmail.com" 
                link="mailto:mekesh.engineer@gmail.com"
                subtext="We usually reply within 24 hours."
              />
              <div className="h-px bg-[var(--border-primary)] w-full my-2 opacity-50" />
              <InfoCard 
                icon={LocalPhoneIcon} 
                title="Call Us" 
                value="+91 8220810170" 
                link="tel:+918220810170"
                subtext="Mon-Fri from 9am to 6pm IST."
              />
              <div className="h-px bg-[var(--border-primary)] w-full my-2 opacity-50" />
              <InfoCard 
                icon={LocationOnIcon} 
                title="Visit HQ" 
                value="7JF4+RPF, Perundurai - Perundurai Railway Station Road" 
                subtext="Kumaran Nagar, Perundurai, Tamil Nadu 638060"
              />
            </div>

            {/* Social Links */}
            <div className="card p-6 border border-[var(--border-primary)]">
              <h4 className="font-heading font-bold text-lg mb-4">Connect with us</h4>
              <div className="flex gap-4">
                {[
                  { icon: TwitterIcon, href: '#' },
                  { icon: FacebookIcon, href: '#' },
                  { icon: InstagramIcon, href: '#' },
                  { icon: LinkedInIcon, href: '#' }
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300"
                  >
                    <social.icon fontSize="small" />
                  </a>
                ))}
              </div>
            </div>

            {/* Support CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border-primary)] text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-center justify-center mx-auto mb-4">
                <SupportAgentIcon className="text-[var(--primary)]" />
              </div>
              <h4 className="font-heading font-bold text-lg mb-2">Looking for support?</h4>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Visit our Help Center for guides and FAQs regarding tickets and events.
              </p>
              <Link href="/help" className="btn-outline w-full text-sm py-2">
                Visit Help Center
              </Link>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 3. MAP SECTION */}
      <section className="h-[400px] w-full relative border-t border-[var(--border-primary)] filter grayscale hover:grayscale-0 transition-all duration-700">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.831885698734!2d77.60472931480584!3d11.266203991989448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96d7810fe32d5%3A0x8578e78693026e63!2sKongu%20Engineering%20College!5e0!3m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="bg-[var(--bg-tertiary)]"
        />
        {/* Overlay to blend map with dark theme */}
        <div className="absolute inset-0 bg-[var(--brand-primary)] mix-blend-overlay opacity-10 pointer-events-none" />
      </section>

    </main>
  );
}