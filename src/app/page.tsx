// src/app/page.tsx
"use client";

import CTAButtons from "../components/CTAButtons";

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

        {/* CTA Buttons */}
        <CTAButtons />

        <p className="mt-6 text-xs text-white/50">
          We use your answers only to personalize guidance — edit/delete any time.
        </p>
      </div>
    </main>
  );
}
