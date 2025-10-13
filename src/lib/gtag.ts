// src/lib/gtag.ts

// Your GA4 Measurement ID must be available on the client.
// Add it to .env.local as: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Make TypeScript aware of window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

/**
 * Send a page view to GA4.
 * Call this if you manually track route changes (optional for now).
 */
export function pageview(path: string) {
  if (typeof window === "undefined" || !GA_ID) return;
  window.gtag?.("config", GA_ID, {
    page_path: path,
  });
}

/**
 * Send a custom event to GA4.
 * In dev, it adds debug_mode so the event appears instantly in DebugView.
 *
 * Usage:
 *   track("cta_click", { location: "hero", label: "Start Discovery Button" });
 */
export function track(event: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined" || !GA_ID) return;

  const payload =
    process.env.NODE_ENV !== "production"
      ? { ...params, debug_mode: true } // shows up fast in GA4 DebugView
      : params;

  window.gtag?.("event", event, payload);
}
