'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`bg-gray-800 text-white h-screen flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        {isOpen && <span className="font-bold text-lg">Menu</span>}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          ☰
        </button>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
              {isOpen ? 'Dashboard' : '📊'}
            </Link>
          </li>
          <li>
            <Link href="/dashboard/events" className="block p-2 hover:bg-gray-700 rounded">
              {isOpen ? 'Events' : '📅'}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
