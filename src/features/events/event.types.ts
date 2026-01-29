// ===========================
// EVENT TYPE DEFINITIONS
// ===========================

export interface EventOrganizer {
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  verified?: boolean;
}

export interface EventLocation {
  venue?: string;
  address?: string;
  city: string;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TicketTier {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
  available?: number;
  sold?: number;
  benefits?: string[];
  perks?: string[];
}

export interface EventReview {
  id: string | number;
  userId?: string;
  userName?: string;
  user?: string;
  userAvatar?: string;
  avatar?: string | null;
  rating: number;
  comment: string;
  date?: string;
  createdAt?: Date | string;
}

export interface EventFAQ {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface EventVenue {
  name: string;
  address?: string;
  mapUrl?: string;
  amenities?: string[];
}

export interface Event {
  // Core Fields
  id: string;
  title: string;
  description: string;
  
  // Date & Time
  date: Date | string;
  time?: string;
  endDate?: Date | string;
  endTime?: string;
  
  // Location
  location: string | EventLocation;
  venue?: string | EventVenue;
  isOnline?: boolean;
  
  // Pricing
  price: number;
  originalPrice?: number | null;
  currency?: string;
  
  // Capacity & Attendance
  capacity: number;
  attendees?: number;
  available?: number;
  
  // Categorization
  category: string;
  tags?: string[];
  
  // Media
  image?: string;
  video?: string | null;
  gallery?: string[];
  
  // Organizer
  organizer: string | EventOrganizer;
  
  // Generated timestamp
  generatedAt?: string;
  
  // Status & Visibility
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isFeatured?: boolean;
  isTrending?: boolean;
  
  // Ratings & Reviews
  rating?: number;
  reviews?: number;
  reviewsList?: EventReview[];
  
  // Additional Details
  ticketTiers?: TicketTier[];
  agenda?: AgendaItem[];
  faq?: EventFAQ[];
  relatedEvents?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCreateInput {
  title: string;
  description: string;
  date: Date | string;
  time?: string;
  location: string | EventLocation;
  capacity: number;
  price?: number;
  category?: string;
  image?: string;
}

export interface EventUpdateInput extends Partial<EventCreateInput> {
  status?: Event['status'];
  isFeatured?: boolean;
}
