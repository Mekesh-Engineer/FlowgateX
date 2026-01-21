export default function AccessLogsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Access Logs - {params.id}</h1>
      <p className="text-gray-600">View detailed event access and entry logs</p>
    </div>
  );
}
