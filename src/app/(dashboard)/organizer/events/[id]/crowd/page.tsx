export default function CrowdPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crowd Analytics - {params.id}</h1>
      <p className="text-gray-600">Real-time crowd monitoring and IoT sensor data</p>
    </div>
  );
}
