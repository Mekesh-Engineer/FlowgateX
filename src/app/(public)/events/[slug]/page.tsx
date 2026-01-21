export default function EventDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Event: {params.slug}</h1>
      <p className="text-gray-600">Event details and booking information</p>
    </div>
  );
}
