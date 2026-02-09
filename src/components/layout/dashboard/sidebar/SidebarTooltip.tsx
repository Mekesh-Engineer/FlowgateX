// =============================================================================
// SIDEBAR TOOLTIP — Shows label on hover when sidebar is in collapsed mode
// =============================================================================

import { type ReactNode, useState } from 'react';

interface SidebarTooltipProps {
  label: string;
  children: ReactNode;
  isCollapsed: boolean;
}

export default function SidebarTooltip({ label, children, isCollapsed }: SidebarTooltipProps) {
  const [show, setShow] = useState(false);

  if (!isCollapsed) return <>{children}</>;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ms-2 z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-white dark:text-neutral-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
          {label}
          <div className="absolute top-1/2 -translate-y-1/2 -start-1 size-2 bg-gray-900 dark:bg-white rotate-45" />
        </div>
      )}
    </div>
  );
}
