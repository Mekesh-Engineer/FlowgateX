export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Public navbar here */}
      <main>{children}</main>
      {/* Footer here */}
    </div>
  );
}
