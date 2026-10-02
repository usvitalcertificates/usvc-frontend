import "../staff.css";

/**
 * Staff routes load staff.css only. The Inter variable (--font-flow) lives on
 * <html> in the root layout so it scopes the whole staff tree.
 */
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
