'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/features/events/event.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function BookingSidebar({ event }: { event: Event }) {
  const [selectedTier, setSelectedTier] = useState<number | string>(event.ticketTiers?.[0]?.id || 1);
  const [quantity, setQuantity] = useState(1);
  const [liveCapacity, setLiveCapacity] = useState(event.available || 0);
  const [isBooking, setIsBooking] = useState(false);
  
  // Real-time capacity updates from Firebase (if event has real-time listeners)
  // For now, we use the static available value from Firebase
  useEffect(() => {
    setLiveCapacity(event.available || 0);
  }, [event.available]);

  const currentTier = event.ticketTiers?.find(t => t.id === selectedTier);
  const tierPrice = currentTier?.price || event.price;
  const tierAvailable = currentTier?.available || liveCapacity;
  const totalPrice = tierPrice * quantity;
  
  // Calculate urgency level
  const percentageAvailable = (tierAvailable / (currentTier?.quantity || event.capacity)) * 100;
  const isLowStock = percentageAvailable < 20;
  const isCritical = percentageAvailable < 10;

  const handleBookNow = async () => {
    setIsBooking(true);
    
    // Navigate to booking page
    window.location.href = `/booking/${event.id}`;
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] shadow-lg overflow-hidden">
      
      {/* Real-time Status Bar */}
      <div className={cn(
        "p-3 flex items-center justify-center gap-2 text-sm font-medium border-b",
        isCritical 
          ? "bg-red-500/10 text-red-600 border-red-500/20" 
          : isLowStock 
            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
            : "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20"
      )}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
        {isCritical ? `Only ${tierAvailable} seats left!` : isLowStock ? `Hurry! ${tierAvailable} seats remaining` : `${tierAvailable} spots available`}
      </div>

      <div className="p-6 space-y-6">
        {/* Ticket Tiers */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[var(--text-secondary)]">Select Ticket Type</label>
          {event.ticketTiers && event.ticketTiers.length > 0 ? (
            <div className="space-y-2">
              {event.ticketTiers.map((tier) => {
                const isAvailable = (tier.available || 0) > 0;
                const isSoldOut = !isAvailable;
                
                return (
                  <div 
                    key={tier.id}
                    onClick={() => isAvailable && setSelectedTier(tier.id)}
                    className={cn(
                      "rounded-lg border p-3 transition-all",
                      isSoldOut 
                        ? "opacity-50 cursor-not-allowed bg-gray-50" 
                        : "cursor-pointer hover:border-[var(--brand-primary)]",
                      selectedTier === tier.id 
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 ring-1 ring-[var(--brand-primary)]" 
                        : "border-[var(--border-primary)]"
                    )}
                  >
                    <div className="flex justify-between items-center">
                       <div>
                         <span className="font-semibold text-sm flex items-center gap-2">
                           {tier.name}
                           {isSoldOut && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Sold Out</span>}
                         </span>
                         <span className="text-xs text-[var(--text-secondary)]">
                           {tier.available || 0} of {tier.quantity || 0} remaining
                         </span>
                       </div>
                       <span className="font-bold text-[var(--text-primary)]">₹{tier.price.toLocaleString()}</span>
                    </div>
                    {/* Collapsible Perks */}
                    <AnimatePresence>
                      {selectedTier === tier.id && tier.perks && tier.perks.length > 0 && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                           <ul className="mt-2 text-xs text-[var(--text-secondary)] space-y-1">
                             {tier.perks.map((perk, i) => (
                               <li key={i} className="flex items-start gap-1">
                                 <span className="material-icons-outlined text-[10px] text-[var(--brand-primary)] mt-0.5">check_circle</span>
                                 {perk}
                               </li>
                             ))}
                           </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="p-4 bg-[var(--bg-secondary)] rounded-lg text-center border border-[var(--border-primary)]">
                <span className="font-bold text-lg block">General Admission</span>
                <div className="text-[var(--brand-primary)] font-bold text-2xl mt-2">₹{event.price.toLocaleString()}</div>
                <span className="text-xs text-[var(--text-secondary)] mt-1 block">{liveCapacity} tickets available</span>
             </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
           <label className="text-sm font-semibold text-[var(--text-secondary)]">Quantity</label>
           <div className="flex items-center border border-[var(--border-primary)] rounded-md">
             <button 
               onClick={() => setQuantity(Math.max(1, quantity - 1))}
               className="px-3 py-1 hover:bg-[var(--bg-secondary)] text-lg disabled:opacity-50 transition-colors"
               disabled={quantity <= 1}
             >-</button>
             <span className="px-4 py-1 font-mono w-10 text-center font-semibold">{quantity}</span>
             <button 
               onClick={() => setQuantity(Math.min(Math.min(10, tierAvailable), quantity + 1))}
               className="px-3 py-1 hover:bg-[var(--bg-secondary)] text-lg disabled:opacity-50 transition-colors"
               disabled={quantity >= tierAvailable || quantity >= 10}
             >+</button>
           </div>
        </div>

        {/* Total & CTA */}
        <div className="pt-4 border-t border-[var(--border-primary)]">
           <div className="flex justify-between items-end mb-4">
              <span className="text-sm text-[var(--text-secondary)]">Total Amount</span>
              <span className="text-3xl font-bold text-[var(--text-primary)]">₹{totalPrice.toLocaleString()}</span>
           </div>
           
           <Button 
             onClick={handleBookNow}
             disabled={isBooking || tierAvailable <= 0}
             className="w-full h-12 text-lg font-bold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 shadow-lg shadow-[var(--brand-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isBooking ? (
               <><span className="animate-spin mr-2">⏳</span> Processing...</>
             ) : tierAvailable <= 0 ? (
               'Sold Out'
             ) : (
               'Book Now'
             )}
           </Button>
           
           <p className="text-xs text-center text-[var(--text-tertiary)] mt-3 flex items-center justify-center gap-1">
             <span className="material-icons-outlined text-green-600" style={{ fontSize: '14px' }}>lock</span>
             Secure payment • 100% Refundable until 24h before event
           </p>
        </div>
        
        {/* Additional Info */}
        <div className="pt-4 border-t border-[var(--border-primary)] space-y-2">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="material-icons-outlined text-sm">confirmation_number</span>
            Instant ticket delivery via email
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="material-icons-outlined text-sm">phone_iphone</span>
            Mobile tickets accepted
          </div>
        </div>
      </div>
    </div>
  );
}