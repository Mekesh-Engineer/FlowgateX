/**
 * Sidebar Component
 * 
 * This file re-exports the modular sidebar implementation.
 * The sidebar has been refactored into a modular structure for better maintainability.
 * 
 * Structure:
 * - sidebar/types.ts - Type definitions
 * - sidebar/config.ts - Role-based configuration using routes.ts
 * - sidebar/icon-map.tsx - MUI icon exports
 * - sidebar/sidebar-item.tsx - Navigation item component
 * - sidebar/widgets/ - Extracted widget components
 * - sidebar/sidebar.tsx - Main component
 * 
 * Changes from original:
 * 1. Replaced string-based icons with MUI component imports
 * 2. Uses useAuth from auth-provider for user data (not props)
 * 3. Routes imported from lib/routes.ts (single source of truth)
 * 4. Added logout button for authenticated users
 * 5. Organizer widgets use OrganizerContext for real data
 * 6. Extracted widgets into separate files
 */

// Re-export everything from the modular sidebar
export * from './sidebar/index';
export { default } from './sidebar/index';
