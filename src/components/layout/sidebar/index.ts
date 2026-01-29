/**
 * Sidebar Module Barrel Export
 * 
 * Usage:
 * import Sidebar from '@/components/layout/sidebar';
 * import { SIDEBAR_CONFIG, UserRole } from '@/components/layout/sidebar';
 */

// Main Component
export { default } from './sidebar';
export { default as Sidebar } from './sidebar';

// Types
export * from './types';

// Configuration
export { SIDEBAR_CONFIG, getSidebarConfig } from './config';

// Sub-components (for customization)
export { SidebarItem } from './sidebar-item';
export * from './widgets';
