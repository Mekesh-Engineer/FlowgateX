// ===========================
// EVENT DATA TYPES
// ===========================

export interface EventLocation {
  venue: string;
  address?: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface EventOrganizer {
  name: string;
  avatar: string;
  verified: boolean;
}

export interface EventVenue {
  name: string;
  address: string;
  mapUrl: string;
  amenities: string[];
}

export interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface TicketTier {
  id: number;
  name: string;
  price: number;
  available: number;
  perks: string[];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ReviewItem {
  id: number;
  user: string;
  avatar: string | null;
  rating: number;
  comment: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: EventLocation;
  category: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  capacity: number;
  attendees: number;
  available: number;
  rating: number;
  reviews: number;
  isFeatured: boolean;
  isTrending: boolean;
  isOnline: boolean;
  tags: string[];
  organizer: EventOrganizer;
  generatedAt: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  video: string | null;
  venue: EventVenue;
  agenda: AgendaItem[];
  ticketTiers: TicketTier[];
  faq: FAQItem[];
  reviewsList: ReviewItem[];
  relatedEvents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export interface SortOption {
  value: string;
  label: string;
  icon: string;
}

export interface DateRangeOption {
  value: string;
  label: string;
  icon: string;
}
