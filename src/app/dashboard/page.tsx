import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to organizer dashboard as the default
  redirect('/dashboard/organizer');
}
