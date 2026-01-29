'use client';

import { useState, forwardRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal'; 
import type { Event } from '@/features/events/event.types';

// ============================================================================
// Generic Card Component
// ============================================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-gray-200 bg-white shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ============================================================================
// EventCard Component
// ============================================================================

// Placeholder for the detail modal if it exists as a separate feature component
// import EventDetailModal from './event-detail-modal'; 

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact';
  isSelected?: boolean;
  onSelectCard?: (id: string) => void;
  className?: string;
}

export function EventCard({
  event,
  variant = 'default',
  isSelected = false,
  onSelectCard,
  className
}: EventCardProps) {
  const router = useRouter();
  
  // State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Destructure Event Data
  const {
    id,
    title,
    image,
    date,
    time,
    location,
    price,
    category,
    attendees = 0,
    capacity = 0,
    isFeatured,
  } = event;

  // Computed Values
  const isCompact = variant === 'compact';
  const formattedDate = date ? dayjs(date).format('MMM D, YYYY') : '';
  const formattedTime = time ? dayjs(`${date} ${time}`).format('h:mm A') : '';
  const spotsLeft = capacity - attendees;
  const isSoldOut = spotsLeft <= 0;
  const percentFilled = capacity > 0 ? (attendees / capacity) * 100 : 0;

  // -- Handlers --

  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to details page instead of modal for better SEO/UX in Next.js
    // or toggle details modal if preferred
    router.push(`/events/${id}`);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectCard) {
      onSelectCard(id);
    } else {
      setShowBookingModal(true);
    }
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) return;
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      alert('Payment processed successfully! Ticket sent to email.');
      setIsProcessing(false);
      setShowBookingModal(false);
    }, 1000);
  };

  const incrementQuantity = () => {
    if (ticketQuantity < Math.min(10, spotsLeft)) setTicketQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (ticketQuantity > 1) setTicketQuantity(prev => prev - 1);
  };

  // -- Calculations --
  const subtotal = price * ticketQuantity;
  const serviceFee = price === 0 ? 0 : 50;
  const total = subtotal + serviceFee;

  return (
    <>
      {/* ===========================
          Main Card Component
      =========================== */}
      <div
        onClick={handleCardClick}
        className={cn(
          'card card-hover group relative flex flex-col h-full cursor-pointer bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden',
          isSelected && 'ring-2 ring-[var(--brand-primary)]',
          isCompact && 'flex-row min-h-[160px]',
          className
        )}
      >
        {/* --- Image Section --- */}
        <div
          className={cn(
            'relative overflow-hidden bg-gray-900',
            isCompact ? 'w-48 shrink-0' : 'aspect-[16/9] w-full'
          )}
        >
          <Image
            src={image || '/placeholder-event.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/90 via-transparent to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <Badge variant="primary" className="shadow-lg backdrop-blur-md">
              {category}
            </Badge>
            {isFeatured && (
              <Badge variant="warning" className="shadow-lg backdrop-blur-md flex items-center gap-1">
                <span className="material-icons-outlined text-[10px]">star</span> Featured
              </Badge>
            )}
          </div>

          {/* Date Badge (Desktop/Default View) */}
          {!isCompact && date && (
            <div className="absolute bottom-3 left-3 z-10 hover-lift">
              <div className="glass rounded-lg px-3 py-1.5 text-center border-l-2 border-[var(--brand-primary)]">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] tracking-wider">
                  {dayjs(date).format('MMM')}
                </div>
                <div className="text-xl font-heading font-bold text-[var(--text-primary)] leading-none">
                  {dayjs(date).format('DD')}
                </div>
              </div>
            </div>
          )}

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="border-2 border-[var(--brand-primary)] px-6 py-2 rounded-lg transform -rotate-12">
                <span className="text-[var(--brand-primary)] font-heading font-bold text-2xl tracking-widest uppercase">
                  Sold Out
                </span>
              </div>
            </div>
          )}
        </div>

        {/* --- Content Section --- */}
        <div className="flex flex-col flex-1 p-5 relative">
          
          {/* Title & Price Row */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] leading-tight line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
              {title}
            </h3>
            <div className="text-right shrink-0">
              {price === 0 ? (
                <span className="text-emerald-500 font-bold font-mono">Free</span>
              ) : (
                <span className="text-[var(--text-primary)] font-bold font-mono">₹{price}</span>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-icons-outlined text-base text-[var(--brand-primary)]">schedule</span>
              <span>{formattedDate} • {formattedTime}</span>
            </div>
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="material-icons-outlined text-base text-[var(--brand-primary)]">location_on</span>
              <span className="truncate">{typeof location === 'string' ? location : location?.venue || 'No location'}</span>
            </div>
          </div>

          {/* Capacity Bar */}
          {!isSoldOut && !isCompact && (
            <div className="mt-auto mb-5">
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                <span>{attendees} going</span>
                <span className={percentFilled > 80 ? 'text-[var(--brand-primary)]' : ''}>
                  {spotsLeft} spots left
                </span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary transition-all duration-500"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>
          )}

          {/* --- Action Buttons --- */}
          <div className={cn("grid gap-3", isCompact ? "mt-2" : "mt-auto grid-cols-2")}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCardClick}
              className="w-full hover:border-[var(--brand-primary)]"
            >
              View Details
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSelectClick}
              disabled={isSoldOut}
              className={cn("w-full", isSoldOut && "opacity-50 cursor-not-allowed grayscale")}
            >
              {isSoldOut ? 'Waitlist' : 'Select'}
            </Button>
          </div>
        </div>
      </div>

      {/* ===========================
          Booking Modal (Integrated)
      =========================== */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Checkout"
        description={title}
        size="lg"
      >
        <div className="space-y-6">
          {/* Quantity Selector */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-[var(--text-primary)]">Number of Tickets</span>
              <span className="text-[var(--text-muted)] text-sm">Max 10 per user</span>
            </div>
            <div className="flex items-center justify-between bg-[var(--bg-card)] p-2 rounded-lg border border-[var(--border-primary)]">
              <button 
                onClick={decrementQuantity} 
                className="p-2 hover:bg-[var(--bg-hover)] rounded-md text-[var(--text-primary)] disabled:opacity-50"
                disabled={ticketQuantity <= 1}
              >
                <span className="material-icons-outlined">remove</span>
              </button>
              <span className="font-mono text-xl font-bold text-[var(--text-primary)]">{ticketQuantity}</span>
              <button 
                onClick={incrementQuantity} 
                className="p-2 hover:bg-[var(--bg-hover)] rounded-md text-[var(--text-primary)] disabled:opacity-50"
                disabled={ticketQuantity >= Math.min(10, spotsLeft)}
              >
                <span className="material-icons-outlined">add</span>
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-3">Select Payment Method</h4>
            <div className="grid gap-3">
              {['UPI', 'Card', 'Wallet'].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={cn(
                    "flex items-center p-4 rounded-xl border transition-all duration-200 text-left w-full",
                    selectedPaymentMethod === method
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10"
                      : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)]"
                  )}
                >
                  <span className={cn(
                    "material-icons-outlined mr-3",
                    selectedPaymentMethod === method ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)]"
                  )}>
                    {method === 'UPI' ? 'qr_code' : method === 'Card' ? 'credit_card' : 'account_balance_wallet'}
                  </span>
                  <span className="font-semibold text-[var(--text-primary)]">{method}</span>
                  {selectedPaymentMethod === method && (
                    <span className="material-icons ml-auto text-[var(--brand-primary)]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-[var(--border-primary)] pt-4 space-y-2">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Service Fee</span>
              <span>₹{serviceFee}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[var(--text-primary)] mt-4 pt-4 border-t border-[var(--border-primary)] border-dashed">
              <span>Total</span>
              <span className="text-gradient-primary">₹{total}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2">
            <Button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || isProcessing}
              variant="primary"
              className="w-full py-6 text-lg font-bold shadow-red-lg"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${total}`}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}