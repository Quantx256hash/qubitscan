"use client";

import { LenisProvider } from "@/components/lenis/LenisProvider";
import { Cursor } from "@/components/ui/Cursor";
import { useMagnet } from "@/lib/useMagnet";

/**
 * Minimal client shell for QubitScan: the HUD cursor, magnetic hover, and
 * Lenis smooth scroll — the "feel" layer, without the marketing site's
 * curtain / section-index / canvas chrome.
 */
export function QubitScanShell({ children }: { children: React.ReactNode }) {
  useMagnet("[data-magnet]");
  return (
    <LenisProvider>
      <Cursor />
      {children}
    </LenisProvider>
  );
}
