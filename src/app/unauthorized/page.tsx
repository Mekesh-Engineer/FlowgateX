import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Unauthorized</h2>
        <p className="text-gray-600 mb-8">You do not have permission to access this page.</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return Home
          </Link>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
