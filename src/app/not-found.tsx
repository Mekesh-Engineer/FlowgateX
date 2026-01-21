import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Not Found</h2>
        <p className="text-gray-600 mb-8">Could not find the requested resource.</p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
