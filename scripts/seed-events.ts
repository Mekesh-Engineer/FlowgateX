/**
 * Seed Events Script
 * Run with: npx ts-node scripts/seed-events.ts
 * Or add to package.json: "seed:events": "ts-node scripts/seed-events.ts"
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  
  if (!serviceAccountKey || !databaseURL) {
    console.error('❌ Missing FIREBASE_SERVICE_ACCOUNT_KEY or NEXT_PUBLIC_FIREBASE_DATABASE_URL');
    process.exit(1);
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
    databaseURL: databaseURL,
  });
}

const rtdb = admin.database();

// Sample events data
const sampleEvents = [
  {
    eventId: 'event-001',
    organizerId: 'demo-organizer-001',
    organizerEmail: 'organizer@flowgatex.com',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    basicInfo: {
      title: 'Tech Conference 2026',
      description: 'Join us for the biggest tech conference of the year! Featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.',
      category: 'conference',
      bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      tags: ['technology', 'innovation', 'networking'],
    },
    schedule: {
      startDate: '2026-03-15',
      startTime: '09:00',
      endDate: '2026-03-17',
      endTime: '18:00',
    },
    venue: {
      name: 'Tech Convention Center',
      address: '123 Innovation Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      capacity: 5000,
      coordinates: { lat: 19.0760, lng: 72.8777 },
    },
    tickets: [
      { id: 'ticket-001', name: 'Early Bird', price: 2999, quantity: 1000, sold: 450 },
      { id: 'ticket-002', name: 'Regular', price: 4999, quantity: 2000, sold: 800 },
      { id: 'ticket-003', name: 'VIP', price: 9999, quantity: 500, sold: 150 },
    ],
    analytics: { views: 15000, bookmarks: 500 },
  },
  {
    eventId: 'event-002',
    organizerId: 'demo-organizer-001',
    organizerEmail: 'organizer@flowgatex.com',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    basicInfo: {
      title: 'Summer Music Festival',
      description: 'Experience the ultimate summer music festival with performances from top artists across multiple stages. Food, fun, and unforgettable memories await!',
      category: 'music',
      bannerImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
      tags: ['music', 'festival', 'summer', 'outdoor'],
    },
    schedule: {
      startDate: '2026-05-20',
      startTime: '14:00',
      endDate: '2026-05-22',
      endTime: '23:00',
    },
    venue: {
      name: 'Beachside Arena',
      address: 'Marine Drive',
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      postalCode: '403001',
      capacity: 20000,
      coordinates: { lat: 15.2993, lng: 74.1240 },
    },
    tickets: [
      { id: 'ticket-001', name: 'General Admission', price: 1499, quantity: 15000, sold: 8000 },
      { id: 'ticket-002', name: 'Premium', price: 3999, quantity: 3000, sold: 1200 },
      { id: 'ticket-003', name: 'Backstage Pass', price: 14999, quantity: 200, sold: 50 },
    ],
    analytics: { views: 45000, bookmarks: 2000 },
  },
  {
    eventId: 'event-003',
    organizerId: 'demo-organizer-002',
    organizerEmail: 'events@startup.com',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    basicInfo: {
      title: 'Startup Pitch Night',
      description: 'Watch innovative startups pitch their ideas to top investors. A great opportunity to discover the next big thing and network with entrepreneurs.',
      category: 'business',
      bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      tags: ['startup', 'investment', 'entrepreneurship'],
    },
    schedule: {
      startDate: '2026-02-28',
      startTime: '18:00',
      endDate: '2026-02-28',
      endTime: '22:00',
    },
    venue: {
      name: 'Startup Hub',
      address: 'Koramangala 5th Block',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560095',
      capacity: 300,
      coordinates: { lat: 12.9352, lng: 77.6245 },
    },
    tickets: [
      { id: 'ticket-001', name: 'Attendee', price: 499, quantity: 200, sold: 120 },
      { id: 'ticket-002', name: 'Investor', price: 0, quantity: 50, sold: 30 },
      { id: 'ticket-003', name: 'Startup Founder', price: 1999, quantity: 50, sold: 25 },
    ],
    analytics: { views: 3500, bookmarks: 150 },
  },
  {
    eventId: 'event-004',
    organizerId: 'demo-organizer-003',
    organizerEmail: 'comedy@funtime.com',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    basicInfo: {
      title: 'Stand-Up Comedy Night',
      description: 'Get ready to laugh out loud with the funniest comedians in town! An evening of non-stop entertainment and hilarious performances.',
      category: 'comedy',
      bannerImage: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
      tags: ['comedy', 'entertainment', 'standup'],
    },
    schedule: {
      startDate: '2026-02-14',
      startTime: '20:00',
      endDate: '2026-02-14',
      endTime: '23:00',
    },
    venue: {
      name: 'Laugh Factory',
      address: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110001',
      capacity: 500,
      coordinates: { lat: 28.6315, lng: 77.2167 },
    },
    tickets: [
      { id: 'ticket-001', name: 'Standard', price: 799, quantity: 400, sold: 350 },
      { id: 'ticket-002', name: 'Front Row', price: 1499, quantity: 100, sold: 85 },
    ],
    analytics: { views: 8000, bookmarks: 450 },
  },
  {
    eventId: 'event-005',
    organizerId: 'demo-organizer-001',
    organizerEmail: 'organizer@flowgatex.com',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    basicInfo: {
      title: 'AI & Machine Learning Workshop',
      description: 'Hands-on workshop covering the latest in AI and machine learning. Perfect for developers looking to enhance their skills with practical projects.',
      category: 'workshop',
      bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      tags: ['AI', 'machine learning', 'workshop', 'coding'],
    },
    schedule: {
      startDate: '2026-04-10',
      startTime: '10:00',
      endDate: '2026-04-11',
      endTime: '17:00',
    },
    venue: {
      name: 'Tech Learning Center',
      address: 'Hinjewadi Phase 1',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '411057',
      capacity: 150,
      coordinates: { lat: 18.5912, lng: 73.7388 },
    },
    tickets: [
      { id: 'ticket-001', name: 'Student', price: 1999, quantity: 50, sold: 35 },
      { id: 'ticket-002', name: 'Professional', price: 4999, quantity: 100, sold: 60 },
    ],
    analytics: { views: 5200, bookmarks: 280 },
  },
  {
    eventId: 'event-006',
    organizerId: 'demo-organizer-004',
    organizerEmail: 'sports@arena.com',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    basicInfo: {
      title: 'Marathon 2026',
      description: 'Join thousands of runners in the annual city marathon! Categories for all levels - from 5K fun run to full marathon. Medals for all finishers.',
      category: 'sports',
      bannerImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
      tags: ['marathon', 'running', 'fitness', 'sports'],
    },
    schedule: {
      startDate: '2026-06-15',
      startTime: '05:30',
      endDate: '2026-06-15',
      endTime: '12:00',
    },
    venue: {
      name: 'City Marathon Route',
      address: 'Starting Point: Gateway of India',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      capacity: 25000,
      coordinates: { lat: 18.9220, lng: 72.8347 },
    },
    tickets: [
      { id: 'ticket-001', name: '5K Fun Run', price: 599, quantity: 10000, sold: 6500 },
      { id: 'ticket-002', name: '10K Run', price: 999, quantity: 8000, sold: 4200 },
      { id: 'ticket-003', name: 'Half Marathon', price: 1499, quantity: 5000, sold: 2800 },
      { id: 'ticket-004', name: 'Full Marathon', price: 1999, quantity: 2000, sold: 1100 },
    ],
    analytics: { views: 35000, bookmarks: 1800 },
  },
];

async function seedEvents() {
  console.log('🌱 Starting to seed events...\n');
  
  try {
    for (const event of sampleEvents) {
      const eventRef = rtdb.ref(`events/${event.eventId}`);
      await eventRef.set(event);
      console.log(`✅ Created event: ${event.basicInfo.title}`);
    }
    
    console.log('\n🎉 Successfully seeded all events!');
    console.log(`📊 Total events created: ${sampleEvents.length}`);
    
    // Verify
    const snapshot = await rtdb.ref('events').once('value');
    console.log(`📊 Events in database: ${Object.keys(snapshot.val() || {}).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding events:', error);
  } finally {
    process.exit(0);
  }
}

seedEvents();
