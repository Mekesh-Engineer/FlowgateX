'use client';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
}

export function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{event.date}</p>
        <p className="text-sm text-gray-600">{event.location}</p>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          View Details
        </button>
      </div>
    </div>
  );
}
