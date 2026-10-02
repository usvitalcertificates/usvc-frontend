import { Inter } from "next/font/google";

import "../staff.css";

/**
 * Staff sign-in uses the staff theme (Inter + staff.css), loaded only here
 * so public pages never download staff styles.
 */
const flowFont = Inter({
  subsets: ["latin"],
  variable: "--font-flow",
  display: "swap",
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className={flowFont.variable}>{children}</div>;
}
