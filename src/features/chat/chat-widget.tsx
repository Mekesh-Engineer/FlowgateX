'use client';

export function ChatWidget() {
  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold">FlowGateX Support</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-sm text-gray-600">
          Chat widget coming soon...
        </div>
      </div>
      <div className="p-4 border-t border-gray-300">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
