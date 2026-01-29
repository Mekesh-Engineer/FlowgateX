// src/features/booking/components/booking-flow.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBooking, updateTicketQuantities, getEventById } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';
import type { Event } from '@/features/events/event.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- TYPES & ZOD SCHEMAS ---

const attendeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  specialRequests: z.string().optional(),
});

const bookingSchema = z.object({
  attendees: z.array(attendeeSchema),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type Step = 'tickets' | 'addons' | 'attendees' | 'payment';

const ADDONS = [
  { id: 'parking', name: 'VIP Parking', price: 500, icon: 'local_parking' },
  { id: 'merch', name: 'Event T-Shirt', price: 800, icon: 'checkroom' },
  { id: 'lounge', name: 'Lounge Access', price: 1500, icon: 'weekend' },
];

// --- COMPONENT ---

export function BookingFlow({ event }: { event: Event }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State
  const [step, setStep] = useState<Step>('tickets');
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { attendees: [], termsAccepted: true as any }
  });
  
  // Calculate Totals
  const ticketTotal = Object.entries(selectedTickets).reduce((sum, [id, qty]) => {
    const tier = event.ticketTiers?.find(t => t.id === id) || { price: event.price };
    return sum + (tier.price * qty);
  }, 0);

  const addonTotal = ADDONS.reduce((sum, addon) => 
    selectedAddons[addon.id] ? sum + addon.price : sum, 0
  );

  const subtotal = ticketTotal + addonTotal;
  const fees = Math.round(subtotal * 0.05); // 5% platform fee
  const taxes = Math.round((subtotal + fees) * 0.18); // 18% GST
  const finalTotal = Math.max(0, subtotal + fees + taxes - discount);
  const totalTickets = Object.values(selectedTickets).reduce((a, b) => a + b, 0);

  // --- HANDLERS ---

  const updateTicket = (tierId: string, delta: number) => {
    setSelectedTickets(prev => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [tierId]: next };
    });
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FLOWGATE20') {
      setDiscount(Math.round(subtotal * 0.2));
      toast('20% discount applied!', 'success');
    } else {
      toast('Invalid promo code. Please try again.', 'error');
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    if (!user) {
      toast('Please log in to complete your booking.', 'error');
      router.push('/login?redirect=/booking/' + event.id);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create booking in Firebase RTDB
      const bookingPayload = {
        userId: user.id,
        eventId: event.id,
        eventTitle: event.title,
        organizerId: typeof event.organizer === 'object' ? event.organizer.id || '' : '',
        status: 'pending' as const, // Will be confirmed after payment
        items: { 
          tickets: selectedTickets, 
          addons: selectedAddons 
        },
        attendees: data.attendees,
        financials: { 
          subtotal, 
          fees, 
          taxes, 
          discount, 
          total: finalTotal 
        },
        paymentMethod: 'card',
      };

      const bookingId = await createBooking(bookingPayload);
      
      // In production: redirect to payment gateway here
      // For now, simulate successful payment
      
      // Update ticket quantities in event
      await updateTicketQuantities(event.id, selectedTickets);
      
      toast(`Booking Confirmed! ID: ${bookingId}. Check your email for tickets.`, 'success');
      
      // Redirect to bookings page
      router.push(`/dashboard/user/bookings?new=${bookingId}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast('An error occurred. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER HELPERS ---

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-8 px-2">
      {['Tickets', 'Add-ons', 'Details', 'Payment'].map((label, idx) => {
        const stepIdx = ['tickets', 'addons', 'attendees', 'payment'].indexOf(step);
        const isActive = idx === stepIdx;
        const isCompleted = idx < stepIdx;
        
        return (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
              isActive ? "bg-[var(--brand-primary)] text-white" : 
              isCompleted ? "bg-green-500 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)]"
            )}>
              {isCompleted ? <span className="material-icons-outlined text-sm">check</span> : idx + 1}
            </div>
            <span className={cn("text-xs font-medium hidden sm:block", isActive ? "text-[var(--brand-primary)]" : "text-[var(--text-secondary)]")}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: STEPS */}
      <div className="lg:col-span-2 space-y-6">
        <StepIndicator />

        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6 min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: TICKETS */}
            {step === 'tickets' && (
              <motion.div 
                key="tickets"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold">Select Tickets</h2>
                {event.ticketTiers?.map(tier => (
                  <div key={tier.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-[var(--brand-primary)] transition-colors">
                    <div>
                      <h3 className="font-bold text-lg">{tier.name}</h3>
                      <p className="text-[var(--text-secondary)] text-sm">₹{tier.price} • {tier.quantity || 100} left</p>
                      <div className="flex gap-2 mt-1">
                        {tier.perks?.map(perk => (
                          <span key={perk} className="text-[10px] px-2 py-0.5 bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)]">
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => updateTicket(String(tier.id), -1)} disabled={!selectedTickets[tier.id]}>-</Button>
                      <span className="w-6 text-center font-bold">{selectedTickets[tier.id] || 0}</span>
                      <Button variant="outline" size="sm" onClick={() => updateTicket(String(tier.id), 1)}>+</Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end mt-8">
                   <Button 
                     onClick={() => setStep('addons')} 
                     disabled={totalTickets === 0}
                     className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white"
                   >
                     Next: Add-ons
                   </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ADD-ONS */}
            {step === 'addons' && (
              <motion.div 
                key="addons"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold">Enhance Your Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ADDONS.map(addon => (
                     <label key={addon.id} className={cn(
                       "flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all",
                       selectedAddons[addon.id] ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5" : "hover:bg-[var(--bg-secondary)]"
                     )}>
                        <input 
                          type="checkbox" 
                          className="mt-1 w-5 h-5 accent-[var(--brand-primary)]"
                          checked={!!selectedAddons[addon.id]}
                          onChange={(e) => setSelectedAddons(prev => ({ ...prev, [addon.id]: e.target.checked }))}
                        />
                        <div className="flex-1">
                           <div className="flex justify-between">
                             <span className="font-bold">{addon.name}</span>
                             <span className="text-[var(--brand-primary)] font-bold">₹{addon.price}</span>
                           </div>
                           <p className="text-xs text-[var(--text-secondary)] mt-1">Add this to your booking for extra comfort.</p>
                        </div>
                     </label>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                   <Button variant="ghost" onClick={() => setStep('tickets')}>Back</Button>
                   <Button onClick={() => setStep('attendees')} className="bg-[var(--brand-primary)] text-white">Next: Attendee Details</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ATTENDEE FORMS */}
            {step === 'attendees' && (
              <motion.div 
                key="attendees"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                 <h2 className="text-xl font-bold">Guest Details</h2>
                 <p className="text-sm text-[var(--text-secondary)]">Please fill in details for all {totalTickets} tickets.</p>
                 
                 <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                    {Array.from({ length: totalTickets }).map((_, idx) => (
                      <div key={idx} className="p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)]/30">
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                          <span className="material-icons-outlined text-sm">person</span> Ticket #{idx + 1}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Input 
                              placeholder="Full Name" 
                              {...register(`attendees.${idx}.name` as const)} 
                              className={errors.attendees?.[idx]?.name ? "border-red-500" : ""}
                            />
                            {errors.attendees?.[idx]?.name && <span className="text-xs text-red-500">{errors.attendees[idx]?.name?.message}</span>}
                          </div>
                          <div>
                            <Input 
                              placeholder="Email Address" 
                              {...register(`attendees.${idx}.email` as const)}
                              className={errors.attendees?.[idx]?.email ? "border-red-500" : ""}
                            />
                             {errors.attendees?.[idx]?.email && <span className="text-xs text-red-500">{errors.attendees[idx]?.email?.message}</span>}
                          </div>
                          <div className="md:col-span-2">
                            <Input placeholder="Special Requests (Accessibility, Dietary, etc.)" {...register(`attendees.${idx}.specialRequests` as const)} />
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>

                 <div className="flex justify-between mt-8">
                   <Button variant="ghost" onClick={() => setStep('addons')}>Back</Button>
                   <Button onClick={handleSubmit(() => setStep('payment'))} className="bg-[var(--brand-primary)] text-white">Next: Review & Pay</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PAYMENT */}
            {step === 'payment' && (
               <motion.div 
                 key="payment"
                 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                 className="space-y-6"
               >
                 <h2 className="text-xl font-bold">Payment Method</h2>
                 
                 {/* Payment Options */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['UPI', 'Credit/Debit Card', 'Wallets'].map((method) => (
                      <button key={method} className="p-4 border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]">
                        <span className="material-icons-outlined text-2xl">
                          {method === 'UPI' ? 'qr_code_scanner' : method.includes('Card') ? 'credit_card' : 'account_balance_wallet'}
                        </span>
                        <span className="text-sm font-medium">{method}</span>
                      </button>
                    ))}
                 </div>
                 
                 <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Order Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Tickets ({totalTickets})</span> <span>₹{ticketTotal}</span></div>
                      <div className="flex justify-between"><span>Add-ons</span> <span>₹{addonTotal}</span></div>
                      <div className="flex justify-between"><span>Fees & Taxes</span> <span>₹{fees + taxes}</span></div>
                      {discount > 0 && <div className="flex justify-between text-green-600 font-bold"><span>Discount</span> <span>-₹{discount}</span></div>}
                      <div className="border-t border-gray-300 my-2 pt-2 flex justify-between font-bold text-lg"><span>Total</span> <span>₹{finalTotal}</span></div>
                    </div>
                 </div>

                 {/* Terms */}
                 <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...register('termsAccepted')} className="mt-1 accent-[var(--brand-primary)]" />
                    <span className="text-xs text-[var(--text-secondary)]">
                      I agree to the <a href="#" className="underline">Terms of Service</a>, Refund Policy, and confirm that all attendees meet the age requirements.
                    </span>
                 </label>
                 {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>}

                 <div className="flex justify-between mt-8">
                   <Button variant="ghost" onClick={() => setStep('attendees')}>Back</Button>
                   <Button 
                     onClick={handleSubmit(onSubmit)} 
                     disabled={isProcessing}
                     className="bg-[var(--brand-primary)] text-white w-full sm:w-auto px-8"
                   >
                     {isProcessing ? 'Processing...' : `Pay ₹${finalTotal}`}
                   </Button>
                </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: STICKY SUMMARY */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-6">
           
           {/* Event Card */}
           <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden shadow-sm">
             <div className="relative h-40 bg-[var(--bg-secondary)]">
               {event.image && <Image src={event.image} alt={event.title} fill className="object-cover" />}
             </div>
             <div className="p-4">
               <h3 className="font-bold text-lg leading-tight mb-2">{event.title}</h3>
               <div className="text-sm text-[var(--text-secondary)] space-y-1">
                 <div className="flex items-center gap-2"><span className="material-icons-outlined text-sm">event</span> {new Date(event.date).toLocaleDateString()}</div>
                 <div className="flex items-center gap-2"><span className="material-icons-outlined text-sm">location_on</span> {typeof event.location === 'string' ? event.location : event.location.city}</div>
               </div>
             </div>
           </div>

           {/* Live Pricing */}
           <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-4 shadow-sm">
             <h4 className="font-bold text-[var(--text-primary)] mb-4">Price Breakdown</h4>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between text-[var(--text-secondary)]">
                 <span>Subtotal</span>
                 <span>₹{subtotal}</span>
               </div>
               <div className="flex justify-between text-[var(--text-secondary)]">
                 <span>Platform Fee</span>
                 <span>₹{fees}</span>
               </div>
               <div className="flex justify-between text-[var(--text-secondary)]">
                 <span>GST (18%)</span>
                 <span>₹{taxes}</span>
               </div>
               
               {/* Promo Input */}
               <div className="pt-4 border-t border-[var(--border-primary)]">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Promo Code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Button size="sm" variant="outline" onClick={handleApplyPromo} className="h-9">Apply</Button>
                  </div>
                  {discount > 0 && <p className="text-xs text-green-600 mt-2 font-medium">Discount applied!</p>}
               </div>

               <div className="pt-4 mt-2 border-t border-[var(--border-primary)] flex justify-between items-center">
                 <span className="font-bold text-lg">Total</span>
                 <span className="font-bold text-xl text-[var(--brand-primary)]">₹{finalTotal}</span>
               </div>
             </div>
           </div>

           {/* Trust Badges */}
           <div className="grid grid-cols-2 gap-2">
             <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] p-2 rounded">
               <span className="material-icons-outlined">lock</span> Secure Payment
             </div>
             <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] p-2 rounded">
               <span className="material-icons-outlined">verified</span> Verified Event
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}