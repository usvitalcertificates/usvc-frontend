import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Resume your saved application",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";
export default function RecoveryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
