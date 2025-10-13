'use client';

import { track } from "@/lib/gtag";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0E1116] text-white flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Clarity feels like this.
        </h1>
        <p className="mt-4 text-lg text-white/80">
          Your dream life is within you. Discover it in 15 minutes.
        </p>

        {/* CTA Buttons (inline to avoid import issues) */}
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
              track("gift_click", { location: "hero", label: "Gift of Clarity Button" });
            }}
            className="rounded-xl px-5 py-3 border border-white/30 text-white/90 hover:bg-white/10 transition"
          >
            Give the Gift of Clarity
          </a>
        </div>

        <p className="mt-6 text-xs text-white/50">
          We use your answers only to personalize guidance — edit/delete any time.
        </p>
      </div>
    </main>
  );
}
