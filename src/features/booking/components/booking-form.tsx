'use client';

export function BookingForm() {
  return (
    <form className="space-y-4 bg-white p-6 rounded-lg border border-gray-300">
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Tickets</label>
        <input
          type="number"
          min="1"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Proceed to Checkout
      </button>
    </form>
  );
}
