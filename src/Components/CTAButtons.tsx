"use client";

import { track } from "@/lib/gtag";

export default function CTAButtons() {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          track("cta_click", { location: "hero", label: "Start Discovery Button" });
        }}
        className="rounded-xl px-5 py-3 bg-white text-black font-medium hover:opacity-90 transition"
      >
        Start Discovery (15 min)
      </a>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          track("gift_click", { location: "hero", label: "Gift Button" });
        }}
        className="rounded-xl px-5 py-3 border border-white/30 text-white/90 hover:bg-white/10 transition"
      >
        Give the Gift of Clarity
      </a>
    </div>
  );
}
