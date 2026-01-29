import { redirect } from 'next/navigation';

// Redirect /dashboard/user/saved to /dashboard/user/saved-events for consistency
export default function SavedRedirect() {
  redirect('/dashboard/user/saved-events');
}
