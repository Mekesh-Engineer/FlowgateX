import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const EventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.date(),
  location: z.string().min(3, 'Location is required'),
  capacity: z.number().positive('Capacity must be positive'),
});

export const BookingSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  ticketCount: z.number().positive('Ticket count must be positive'),
  totalPrice: z.number().positive('Total price must be positive'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type EventInput = z.infer<typeof EventSchema>;
export type BookingInput = z.infer<typeof BookingSchema>;
