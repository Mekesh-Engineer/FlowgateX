export default function ParticipantsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Event Participants - {params.id}</h1>
      <p className="text-gray-600">Manage event attendees and registrations</p>
    </div>
  );
}
