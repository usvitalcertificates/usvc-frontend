import { Inter } from "next/font/google";

import "../staff.css";

/**
 * Staff-only chrome: Inter + staff.css load solely for /staff/* routes,
 * keeping public pages on a single stylesheet (Times stack).
 */
const flowFont = Inter({
  subsets: ["latin"],
  variable: "--font-flow",
  display: "swap",
});

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <div className={flowFont.variable}>{children}</div>;
}
