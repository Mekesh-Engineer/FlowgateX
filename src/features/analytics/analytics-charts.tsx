'use client';

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-300">
        <h3 className="text-lg font-semibold mb-4">Ticket Sales</h3>
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
          Chart will render here
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-300">
        <h3 className="text-lg font-semibold mb-4">Revenue</h3>
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
          Chart will render here
        </div>
      </div>
    </div>
  );
}
