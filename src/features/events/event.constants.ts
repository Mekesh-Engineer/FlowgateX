// src/features/events/event.constants.ts

/**
 * Event Categories Configuration
 * Defines all available event categories with their display properties
 */

export interface EventCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: 'music',
    name: 'Music & Concerts',
    icon: 'headphones',
    color: 'from-purple-500 to-pink-500',
    description: 'Live music, concerts, and performances',
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    icon: 'sports_soccer',
    color: 'from-green-500 to-emerald-500',
    description: 'Sports events, tournaments, and fitness activities',
  },
  {
    id: 'tech',
    name: 'Tech & Innovation',
    icon: 'computer',
    color: 'from-blue-500 to-cyan-500',
    description: 'Technology conferences, hackathons, and innovation',
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    icon: 'restaurant',
    color: 'from-orange-500 to-amber-500',
    description: 'Food festivals, wine tasting, and culinary experiences',
  },
  {
    id: 'art',
    name: 'Art & Culture',
    icon: 'palette',
    color: 'from-rose-500 to-pink-500',
    description: 'Art exhibitions, cultural events, and performances',
  },
  {
    id: 'business',
    name: 'Business & Networking',
    icon: 'business_center',
    color: 'from-indigo-500 to-blue-500',
    description: 'Business conferences, networking events, and seminars',
  },
  {
    id: 'education',
    name: 'Education & Workshops',
    icon: 'school',
    color: 'from-teal-500 to-cyan-500',
    description: 'Educational workshops, training, and learning sessions',
  },
  {
    id: 'gaming',
    name: 'Gaming & Esports',
    icon: 'sports_esports',
    color: 'from-violet-500 to-purple-500',
    description: 'Gaming tournaments, esports events, and competitions',
  },
];

/**
 * Date Range Options for Filtering
 */
export interface DateRangeOption {
  value: string;
  label: string;
  icon: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: 'all', label: 'All Dates', icon: 'date_range' },
  { value: 'today', label: 'Today', icon: 'today' },
  { value: 'tomorrow', label: 'Tomorrow', icon: 'event' },
  { value: 'this-week', label: 'This Week', icon: 'view_week' },
  { value: 'this-weekend', label: 'This Weekend', icon: 'weekend' },
  { value: 'this-month', label: 'This Month', icon: 'calendar_month' },
  { value: 'next-month', label: 'Next Month', icon: 'calendar_today' },
];

/**
 * Sort Options for Event Listing
 */
export interface SortOption {
  value: string;
  label: string;
  icon: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'date-asc', label: 'Date: Earliest First', icon: 'arrow_upward' },
  { value: 'date-desc', label: 'Date: Latest First', icon: 'arrow_downward' },
  { value: 'price-asc', label: 'Price: Low to High', icon: 'trending_up' },
  { value: 'price-desc', label: 'Price: High to Low', icon: 'trending_down' },
  { value: 'popularity', label: 'Most Popular', icon: 'local_fire_department' },
  { value: 'rating', label: 'Highest Rated', icon: 'star' },
];

/**
 * Price Range Limits
 */
export const PRICE_RANGE = {
  MIN: 0,
  MAX: 10000,
  STEP: 500,
  CURRENCY: 'INR',
  SYMBOL: '₹',
} as const;

/**
 * Event Status Options
 */
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];
