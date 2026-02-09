// =============================================================================
// SYSTEM INFO FOOTER — Admin-only platform version & deployment status
// =============================================================================

import { APP_NAME } from '@/lib/constants';

interface SystemInfoFooterProps {
  isCollapsed: boolean;
}

// Mock data — will be replaced by real system info endpoint
const SYSTEM_INFO = {
  version: '2.4.1',
  environment: 'production',
  lastDeploy: '2h ago',
  buildHash: 'a3f7c2d',
};

const ENV_COLORS: Record<string, string> = {
  production: 'bg-green-500',
  staging: 'bg-amber-500',
  development: 'bg-primary-500',
};

export default function SystemInfoFooter({ isCollapsed }: SystemInfoFooterProps) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center py-2 border-t border-gray-200 dark:border-neutral-800">
        <div className={`size-2 rounded-full ${ENV_COLORS[SYSTEM_INFO.environment] ?? 'bg-gray-400'}`} title={`${SYSTEM_INFO.environment} v${SYSTEM_INFO.version}`} />
      </div>
    );
  }

  return (
    <div className="px-3 py-2 border-t border-gray-200 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1.5">
          <span className={`size-2 rounded-full ${ENV_COLORS[SYSTEM_INFO.environment] ?? 'bg-gray-400'}`} />
          <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">
            {APP_NAME} v{SYSTEM_INFO.version}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 dark:text-neutral-500 capitalize">
          {SYSTEM_INFO.environment}
        </span>
      </div>
      <p className="mt-0.5 text-[10px] text-gray-400 dark:text-neutral-500">
        Deployed {SYSTEM_INFO.lastDeploy} &middot; {SYSTEM_INFO.buildHash}
      </p>
    </div>
  );
}
