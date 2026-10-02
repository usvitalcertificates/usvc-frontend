import "../staff.css";

/**
 * Staff sign-in loads staff.css only. The Inter variable (--font-flow) lives
 * on <html> in the root layout so it scopes the whole staff tree.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
