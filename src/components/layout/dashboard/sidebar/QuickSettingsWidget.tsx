// =============================================================================
// QUICK SETTINGS WIDGET — User-only inline theme toggle in sidebar
// =============================================================================

type Theme = 'light' | 'dark' | 'auto';

interface QuickSettingsWidgetProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isCollapsed: boolean;
}

export default function QuickSettingsWidget({ theme, setTheme, isCollapsed }: QuickSettingsWidgetProps) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center py-1.5">
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="size-7 rounded-md bg-gray-200 dark:bg-neutral-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
        >
          {theme === 'dark' ? (
            <svg className="size-3.5 text-amber-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v1"/><path d="M12 20v1"/><path d="M3 12h1"/><path d="M20 12h1"/><path d="m18.364 5.636-.707.707"/><path d="m6.343 17.657-.707.707"/><path d="m5.636 5.636.707.707"/><path d="m17.657 17.657.707.707"/></svg>
          ) : (
            <svg className="size-3.5 text-gray-600 dark:text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-auto pt-3 mb-2">
      <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-neutral-300">Theme</span>
          <div className="p-0.5 inline-flex bg-gray-100 dark:bg-neutral-700 rounded-full">
            {/* Light */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`size-6 flex justify-center items-center rounded-full transition-all ${theme === 'light' ? 'bg-white dark:bg-neutral-800 shadow-sm text-amber-500' : 'text-gray-500 dark:text-neutral-400'}`}
              title="Light mode"
            >
              <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v1"/><path d="M12 20v1"/><path d="M3 12h1"/><path d="M20 12h1"/><path d="m18.364 5.636-.707.707"/><path d="m6.343 17.657-.707.707"/><path d="m5.636 5.636.707.707"/><path d="m17.657 17.657.707.707"/></svg>
            </button>
            {/* Dark */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`size-6 flex justify-center items-center rounded-full transition-all ${theme === 'dark' ? 'bg-gray-800 dark:bg-neutral-100 text-white dark:text-neutral-800 shadow-sm' : 'text-gray-500 dark:text-neutral-400'}`}
              title="Dark mode"
            >
              <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>
            {/* Auto */}
            <button
              type="button"
              onClick={() => setTheme('auto')}
              className={`size-6 flex justify-center items-center rounded-full transition-all ${theme === 'auto' ? 'bg-white dark:bg-neutral-800 shadow-sm text-primary-500' : 'text-gray-500 dark:text-neutral-400'}`}
              title="System default"
            >
              <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
