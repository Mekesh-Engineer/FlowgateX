export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event - {params.id}</h1>
      <p className="text-gray-600">Modify your event information</p>
    </div>
  );
}
