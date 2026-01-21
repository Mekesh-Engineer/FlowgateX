'use client';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className = '', ...props }: TableProps) {
  return (
    <table
      className={`w-full border-collapse border border-gray-300 ${className}`}
      {...props}
    />
  );
}

export function TableHeader({ className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`border border-gray-300 px-4 py-2 ${className}`}
      {...props}
    />
  );
}
