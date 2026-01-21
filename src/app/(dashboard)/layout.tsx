export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar will be added here */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
