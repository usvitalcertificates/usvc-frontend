"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { staffLogout, staffTokens } from "@/lib/staff-client";

const INACTIVITY_MS = 30 * 60 * 1000;

/** Signs staff out after 30 minutes without interaction. */
export function useInactivitySignout(): void {
  const router = useRouter();
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await staffLogout();
        router.replace("/auth?reason=inactivity");
      }, INACTIVITY_MS);
    };
    const activity = () => reset();
    reset();
    for (const event of ["mousedown", "keydown", "touchstart", "scroll"]) {
      window.addEventListener(event, activity, { passive: true });
    }
    return () => {
      clearTimeout(timer);
      for (const event of ["mousedown", "keydown", "touchstart", "scroll"]) {
        window.removeEventListener(event, activity);
      }
    };
  }, [router]);
}

/** Redirects to /auth when no staff session exists. Returns true when signed in. */
export function useRequireStaffAuth(): boolean {
  const router = useRouter();
  useEffect(() => {
    if (!staffTokens().access) router.replace("/auth");
  }, [router]);
  return true;
}
