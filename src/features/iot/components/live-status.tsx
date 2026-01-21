'use client';

export function LiveStatus() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Live IoT Status</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Temperature</span>
          <span className="text-xl font-bold text-blue-600">22°C</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Crowd Density</span>
          <span className="text-xl font-bold text-green-600">42%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Entry Rate</span>
          <span className="text-xl font-bold text-orange-600">125/min</span>
        </div>
      </div>
    </div>
  );
}
