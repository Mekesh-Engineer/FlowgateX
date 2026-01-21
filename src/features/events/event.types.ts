export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  image?: string;
  organizer: string;
  status: 'draft' | 'published' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCreateInput {
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
}
