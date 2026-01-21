'use client';

export function QRCode({ value = 'https://flowgatex.com' }: { value?: string }) {
  return (
    <div className="flex items-center justify-center bg-white p-4 rounded-lg border border-gray-300">
      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
        <span className="text-gray-600 text-sm">QR Code: {value}</span>
      </div>
    </div>
  );
}
