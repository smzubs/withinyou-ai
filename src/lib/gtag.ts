"use client";

/**
 * GA4 helpers without using `any` so ESLint passes.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** Is GA available on the client and GA_ID set? */
function hasGA() {
  return typeof window !== "undefined" && typeof window.gtag === "function" && GA_ID.length > 0;
}

// Type for GA4 event params (string/number/boolean/undefined is enough for most cases)
export type GtagParams = Record<string, string | number | boolean | undefined>;

// Make TS aware of window.gtag if it exists (loaded by the script tag in your layout)
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Track a page_view */
export function pageview(path: string) {
  if (!hasGA()) return;
  window.gtag!("config", GA_ID, { page_path: path });
}

/** Fire a custom event */
export function track(eventName: string, params: GtagParams = {}) {
  if (!hasGA()) return;
  window.gtag!("event", eventName, params);
}
