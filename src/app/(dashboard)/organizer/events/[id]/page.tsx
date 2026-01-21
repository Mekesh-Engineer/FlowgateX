export default function EventDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Event Details - {params.id}</h1>
      <p className="text-gray-600">View and manage event details</p>
    </div>
  );
}
