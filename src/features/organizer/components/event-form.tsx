'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EventData, createEvent, updateEvent } from '@/services/eventService';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// ===========================================
// VALIDATION SCHEMA
// ===========================================

const eventSchema = z.object({
  basicInfo: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    category: z.string().min(1, 'Category is required'),
    videoUrl: z.string().url().optional().or(z.literal('')),
    bannerImage: z.string().url().optional().or(z.literal('')),
  }),
  schedule: z.object({
    startDate: z.string().min(1, 'Start date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endDate: z.string().min(1, 'End date is required'),
    endTime: z.string().min(1, 'End time is required'),
    timezone: z.string().default('Asia/Kolkata'),
    recurring: z.boolean().default(false),
    frequency: z.string().optional().nullable(),
  }),
  venue: z.object({
    name: z.string().min(3, 'Venue name is required'),
    address: z.string().min(10, 'Address must be at least 10 characters'),
    city: z.string().min(2, 'City is required'),
    capacity: z.number().min(1, 'Capacity must be at least 1'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    zones: z.array(z.object({
      name: z.string(),
      capacity: z.number(),
    })).optional(),
  }),
  tickets: z.array(z.object({
    name: z.string().min(1, 'Ticket name is required'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    sold: z.number().optional(),
    earlyBird: z.boolean().optional(),
  })).min(1, 'At least one ticket tier is required'),
  promoCodes: z.array(z.object({
    code: z.string(),
    discount: z.string(),
    limit: z.number(),
    used: z.number().optional(),
  })).optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('draft'),
});

type EventFormData = z.infer<typeof eventSchema>;

// ===========================================
// EVENT CATEGORIES
// ===========================================

const CATEGORIES = [
  { id: 'music', name: 'Music & Concerts', icon: 'music_note' },
  { id: 'sports', name: 'Sports & Fitness', icon: 'sports_soccer' },
  { id: 'tech', name: 'Tech & Innovation', icon: 'computer' },
  { id: 'food', name: 'Food & Drinks', icon: 'restaurant' },
  { id: 'art', name: 'Art & Culture', icon: 'palette' },
  { id: 'business', name: 'Business & Networking', icon: 'business_center' },
  { id: 'education', name: 'Education & Workshops', icon: 'school' },
  { id: 'gaming', name: 'Gaming & Esports', icon: 'sports_esports' },
  { id: 'comedy', name: 'Comedy & Entertainment', icon: 'theater_comedy' },
  { id: 'wellness', name: 'Health & Wellness', icon: 'spa' },
];

// ===========================================
// MAIN COMPONENT
// ===========================================

interface EventFormProps {
  eventData?: EventData;
  mode?: 'create' | 'edit';
  onSuccess?: (eventId: string) => void;
}

export default function EventForm({ eventData, mode = 'create', onSuccess }: EventFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('unsaved');

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventData ? {
      basicInfo: {
        ...eventData.basicInfo,
        videoUrl: eventData.basicInfo.videoUrl ?? undefined,
        bannerImage: eventData.basicInfo.bannerImage ?? undefined,
      },
      schedule: {
        ...eventData.schedule,
        frequency: eventData.schedule.frequency ?? undefined,
      },
      venue: eventData.venue,
      tickets: eventData.tickets,
      promoCodes: eventData.promoCodes || [],
      status: eventData.status,
    } : {
      basicInfo: {
        title: '',
        description: '',
        category: '',
        videoUrl: '',
        bannerImage: '',
      },
      schedule: {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        timezone: 'Asia/Kolkata',
        recurring: false,
        frequency: null,
      },
      venue: {
        name: '',
        address: '',
        city: '',
        capacity: 100,
        coordinates: { lat: 0, lng: 0 },
        zones: [],
      },
      tickets: [
        { name: 'General Admission', price: 0, quantity: 100, sold: 0, earlyBird: false },
      ],
      promoCodes: [],
      status: 'draft',
    },
  });

  const { fields: ticketFields, append: appendTicket, remove: removeTicket } = useFieldArray({
    control,
    name: 'tickets',
  });

  const { fields: promoFields, append: appendPromo, remove: removePromo } = useFieldArray({
    control,
    name: 'promoCodes',
  });

  // Auto-save draft
  useEffect(() => {
    const subscription = watch(() => {
      setSaveStatus('unsaved');
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Form submission
  const onSubmit = async (data: EventFormData) => {
    if (!user) {
      alert('You must be logged in to create/edit events');
      return;
    }

    setLoading(true);
    setSaveStatus('saving');

    try {
      const payload: Omit<EventData, 'eventId' | 'createdAt' | 'updatedAt'> = {
        ...data,
        organizerId: user.id,
        organizerEmail: user.email || undefined,
        settings: {
          amenities: {
            wifi: true,
            parking: true,
            wheelchair: true,
          },
          services: {
            merch: false,
            food: false,
            vipLounge: false,
          },
          ageRestriction: '18+',
          refundPolicy: '50% refund up to 7 days before event',
        },
        iotGates: [],
        analytics: {
          views: 0,
          bookmarks: 0,
          checkIns: 0,
          revenue: 0,
        },
      };

      if (mode === 'edit' && eventData?.eventId) {
        await updateEvent(eventData.eventId, payload);
        setSaveStatus('saved');
        alert('Event updated successfully!');
        if (onSuccess) onSuccess(eventData.eventId);
      } else {
        const eventId = await createEvent(payload, user.id);
        setSaveStatus('saved');
        alert('Event created successfully!');
        if (onSuccess) {
          onSuccess(eventId);
        } else {
          router.push(`/dashboard/organizer/events/${eventId}`);
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
      setSaveStatus('unsaved');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    const data = watch();
    if (!user) return;

    setSaveStatus('saving');
    try {
      const payload: Omit<EventData, 'eventId' | 'createdAt' | 'updatedAt'> = {
        ...data,
        organizerId: user.id,
        organizerEmail: user.email || undefined,
        status: 'draft',
        settings: {
          amenities: { wifi: true, parking: true, wheelchair: true },
          services: { merch: false, food: false, vipLounge: false },
          ageRestriction: '18+',
          refundPolicy: '50% refund up to 7 days before event',
        },
        iotGates: [],
        analytics: { views: 0, bookmarks: 0, checkIns: 0, revenue: 0 },
      };

      if (mode === 'edit' && eventData?.eventId) {
        await updateEvent(eventData.eventId, payload);
      } else {
        await createEvent(payload, user.id);
      }
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveStatus('unsaved');
    }
  };

  const STEPS = [
    { id: 'basics', label: 'Basic Info', icon: 'info' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar_today' },
    { id: 'venue', label: 'Venue', icon: 'location_on' },
    { id: 'tickets', label: 'Tickets', icon: 'confirmation_number' },
    { id: 'review', label: 'Review', icon: 'check_circle' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            {mode === 'edit' ? 'Update your event details' : 'Fill in the details to create your event'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={saveDraft} disabled={loading || saveStatus === 'saved'}>
            <span className="material-icons-outlined mr-2">save</span>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save Draft'}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
            <span className="material-icons-outlined mr-2">publish</span>
            {mode === 'edit' ? 'Update Event' : 'Publish Event'}
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                  currentStep === index
                    ? "bg-blue-500 text-white"
                    : currentStep > index
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                <span className="material-icons-outlined text-lg">{step.icon}</span>
                <span className="font-medium">{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "h-1 flex-1 mx-2",
                  currentStep > index ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div className="card p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="material-icons-outlined">info</span>
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Event Title *
              </label>
              <Input
                {...register('basicInfo.title')}
                placeholder="e.g., Tech Conference 2026"
                className="w-full"
              />
              {errors.basicInfo?.title && (
                <p className="text-red-500 text-sm mt-1">{errors.basicInfo.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Description *
              </label>
              <textarea
                {...register('basicInfo.description')}
                placeholder="Describe your event..."
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.basicInfo?.description && (
                <p className="text-red-500 text-sm mt-1">{errors.basicInfo.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                      watch('basicInfo.category') === cat.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      {...register('basicInfo.category')}
                      value={cat.id}
                      className="sr-only"
                    />
                    <span className="material-icons-outlined text-3xl mb-2">{cat.icon}</span>
                    <span className="text-sm font-medium text-center">{cat.name}</span>
                  </label>
                ))}
              </div>
              {errors.basicInfo?.category && (
                <p className="text-red-500 text-sm mt-1">{errors.basicInfo.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Banner Image URL
              </label>
              <Input
                {...register('basicInfo.bannerImage')}
                placeholder="https://example.com/banner.jpg"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Video URL (Optional)
              </label>
              <Input
                {...register('basicInfo.videoUrl')}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {currentStep === 1 && (
          <div className="card p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="material-icons-outlined">calendar_today</span>
              Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Start Date *
                </label>
                <Input
                  type="date"
                  {...register('schedule.startDate')}
                  className="w-full"
                />
                {errors.schedule?.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.schedule.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Start Time *
                </label>
                <Input
                  type="time"
                  {...register('schedule.startTime')}
                  className="w-full"
                />
                {errors.schedule?.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.schedule.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  End Date *
                </label>
                <Input
                  type="date"
                  {...register('schedule.endDate')}
                  className="w-full"
                />
                {errors.schedule?.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.schedule.endDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  End Time *
                </label>
                <Input
                  type="time"
                  {...register('schedule.endTime')}
                  className="w-full"
                />
                {errors.schedule?.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.schedule.endTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Timezone
              </label>
              <select
                {...register('schedule.timezone')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Venue */}
        {currentStep === 2 && (
          <div className="card p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="material-icons-outlined">location_on</span>
              Venue
            </h2>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Venue Name *
              </label>
              <Input
                {...register('venue.name')}
                placeholder="e.g., Grand Convention Center"
                className="w-full"
              />
              {errors.venue?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.venue.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Address *
              </label>
              <Input
                {...register('venue.address')}
                placeholder="Full street address"
                className="w-full"
              />
              {errors.venue?.address && (
                <p className="text-red-500 text-sm mt-1">{errors.venue.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  City *
                </label>
                <Input
                  {...register('venue.city')}
                  placeholder="e.g., Mumbai"
                  className="w-full"
                />
                {errors.venue?.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.venue.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Total Capacity *
                </label>
                <Input
                  type="number"
                  {...register('venue.capacity', { valueAsNumber: true })}
                  placeholder="e.g., 500"
                  className="w-full"
                />
                {errors.venue?.capacity && (
                  <p className="text-red-500 text-sm mt-1">{errors.venue.capacity.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Tickets */}
        {currentStep === 3 && (
          <div className="card p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span className="material-icons-outlined">confirmation_number</span>
                Ticket Tiers
              </h2>
              <Button
                type="button"
                variant="outline"
                onClick={() => appendTicket({ name: '', price: 0, quantity: 0, sold: 0, earlyBird: false })}
              >
                <span className="material-icons-outlined mr-2">add</span>
                Add Tier
              </Button>
            </div>

            {ticketFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[var(--text-primary)]">Tier #{index + 1}</h3>
                  {ticketFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTicket(index)}
                    >
                      <span className="material-icons-outlined">delete</span>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Tier Name *
                    </label>
                    <Input
                      {...register(`tickets.${index}.name` as const)}
                      placeholder="e.g., VIP Pass"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Price (₹) *
                    </label>
                    <Input
                      type="number"
                      {...register(`tickets.${index}.price` as const, { valueAsNumber: true })}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      {...register(`tickets.${index}.quantity` as const, { valueAsNumber: true })}
                      placeholder="100"
                      className="w-full"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register(`tickets.${index}.earlyBird` as const)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-[var(--text-primary)]">Early Bird Discount</span>
                </label>
              </div>
            ))}

            {errors.tickets && (
              <p className="text-red-500 text-sm">{errors.tickets.message}</p>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 4 && (
          <div className="card p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="material-icons-outlined">check_circle</span>
              Review & Publish
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Basic Info</h3>
                <p><strong>Title:</strong> {watch('basicInfo.title')}</p>
                <p><strong>Category:</strong> {watch('basicInfo.category')}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Schedule</h3>
                <p><strong>Start:</strong> {watch('schedule.startDate')} at {watch('schedule.startTime')}</p>
                <p><strong>End:</strong> {watch('schedule.endDate')} at {watch('schedule.endTime')}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Venue</h3>
                <p><strong>Name:</strong> {watch('venue.name')}</p>
                <p><strong>City:</strong> {watch('venue.city')}</p>
                <p><strong>Capacity:</strong> {watch('venue.capacity')} people</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Tickets</h3>
                {watch('tickets')?.map((ticket, idx) => (
                  <p key={idx}>
                    <strong>{ticket.name}:</strong> ₹{ticket.price} ({ticket.quantity} available)
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="material-icons-outlined text-blue-600">info</span>
              <p className="text-sm text-blue-700">
                By publishing, your event will be visible to all users on the platform.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <span className="material-icons-outlined mr-2">arrow_back</span>
            Previous
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1))}
            >
              Next
              <span className="material-icons-outlined ml-2">arrow_forward</span>
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              <span className="material-icons-outlined mr-2">publish</span>
              {loading ? 'Publishing...' : mode === 'edit' ? 'Update Event' : 'Publish Event'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
