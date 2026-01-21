'use client';

export function SeatMap() {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Seat Selection</h3>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 36 }).map((_, i) => (
          <button
            key={i}
            className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded text-white text-xs"
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
