'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              FlowGateX
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-gray-900">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
