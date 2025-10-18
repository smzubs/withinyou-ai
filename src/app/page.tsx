// src/app/page.tsx - RESPONSIVE PERFECTED FOR ALL SCREENS
"use client";

import Image from "next/image";
import { track } from "../lib/gtag";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home() {
  return (
    <main className="min-h-screen text-white" style={{ margin: 0, padding: 0 }}>
      {/* HERO SECTION - Works on ALL Devices */}
      <section
        className="relative flex items-center justify-center text-center overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #050814 0%, #0a0e1f 25%, #070b18 50%, #0d0f1a 75%, #050814 100%)",
          minHeight: "100vh",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        {/* Animated Background Component */}
        <AnimatedBackground />

        {/* Top Navy Gradient Fade - Hides Browser Bar */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-20"
          style={{
            height: "200px",
            background: "linear-gradient(180deg, rgba(15, 25, 45, 0.95) 0%, rgba(10, 14, 31, 0.85) 25%, rgba(7, 11, 24, 0.6) 50%, rgba(5, 8, 20, 0.3) 75%, transparent 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 w-full pb-8">
          {/* Brand Logo & Name - Responsive Size */}
          <div className="mx-auto mb-3 lg:mb-4 w-fit animate-fadeUp" style={{ animationDelay: "80ms" }}>
            <div className="mx-auto mb-1 flex items-center justify-center">
              <Image
                src="/logo-wings.png"
                alt="WithinYouAi logo"
                width={90}
                height={90}
                priority
                className="select-none pointer-events-none lg:hidden"
                style={{
                  filter: "drop-shadow(0 0 25px rgba(232, 180, 192, 0.7)) drop-shadow(0 0 50px rgba(245, 232, 220, 0.5))"
                }}
              />
              <Image
                src="/logo-wings.png"
                alt="WithinYouAi logo"
                width={110}
                height={110}
                priority
                className="select-none pointer-events-none hidden lg:block"
                style={{
                  filter: "drop-shadow(0 0 25px rgba(232, 180, 192, 0.7)) drop-shadow(0 0 50px rgba(245, 232, 220, 0.5))"
                }}
              />
            </div>

            <div
              className="tracking-wider"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.1rem, 2.5vw, 2.2rem)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "0.12em",
                background: "linear-gradient(135deg, #e8b4c0 0%, #f5e8dc 50%, #d4a5af 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 35px rgba(232, 180, 192, 0.6), 0 0 70px rgba(245, 232, 220, 0.4)",
                filter: "drop-shadow(0 0 25px rgba(232, 180, 192, 0.5))",
              }}
            >
              WITHINYOUAI
            </div>
            <p 
              className="text-xs tracking-[0.15em] mt-1.5 lg:mt-2 uppercase font-light"
              style={{
                color: "rgba(180, 200, 200, 0.7)"
              }}
            >
              Self-Discovery
            </p>
          </div>

          {/* Elegant Accent Line */}
          <div
            className="mx-auto mb-3 lg:mb-4 h-px w-24 lg:w-32 animate-fadeUp"
            style={{ 
              background: "linear-gradient(90deg, transparent 0%, rgba(232, 180, 192, 0.8) 50%, transparent 100%)",
              animationDelay: "160ms" 
            }}
          />

          {/* Main Headline - Responsive Size */}
          <h1
            className="animate-fadeUp mb-6 lg:mb-8 px-2"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)",
              lineHeight: 1.3,
              background: "linear-gradient(135deg, #e8b4c0 0%, #f5e8dc 40%, #f0ddd0 60%, #d4a5af 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.01em",
              textShadow: "0 0 70px rgba(232, 180, 192, 0.2)",
              filter: "drop-shadow(0 0 15px rgba(232, 180, 192, 0.15))",
              animationDelay: "240ms",
            }}
          >
            Unlock the Life You're Meant to Live
          </h1>

          {/* Premium CTA Buttons - Responsive */}
          <div 
            className="mb-10 lg:mb-14 flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 animate-fadeUp" 
            style={{ animationDelay: "320ms" }}
          >
            {/* Premium CTA - Primary (Teal Gradient) */}
            <button
              onClick={() => {
                track("cta_click", {
                  location: "hero",
                  label: "Get Premium Access Button",
                  debug_mode: true,
                });
                window.location.href = "/discover?plan=premium";
              }}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.25rem 2.5rem",
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#ffffff",
                background: "linear-gradient(135deg, #1b4d4d 0%, #2a6b6b 100%)",
                border: "2px solid rgba(74, 155, 155, 0.4)",
                borderRadius: "1rem",
                boxShadow: "0 10px 30px rgba(27, 77, 77, 0.3)",
                cursor: "pointer",
                transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                overflow: "hidden",
                width: "100%",
                maxWidth: "380px",
              }}
              className="lg:text-xl lg:py-6 lg:px-14"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(74, 155, 155, 0.6), 0 20px 50px rgba(27, 77, 77, 0.5)";
                e.currentTarget.style.background = "linear-gradient(135deg, #2a6b6b 0%, #3a8b8b 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(27, 77, 77, 0.3)";
                e.currentTarget.style.background = "linear-gradient(135deg, #1b4d4d 0%, #2a6b6b 100%)";
              }}
            >
              GET PREMIUM – $14.99
            </button>

            {/* Freemium CTA - Secondary (Rose Gold Outline) */}
            <button
              onClick={() => {
                track("cta_click", {
                  location: "hero",
                  label: "Try Free Version Button",
                  debug_mode: true,
                });
                window.location.href = "/discover?plan=free";
              }}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.25rem 2.5rem",
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#e8b4c0",
                background: "rgba(232, 180, 192, 0.08)",
                border: "2px solid rgba(232, 180, 192, 0.7)",
                borderRadius: "1rem",
                backdropFilter: "blur(10px)",
                cursor: "pointer",
                transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                width: "100%",
                maxWidth: "380px",
              }}
              className="lg:text-xl lg:py-6 lg:px-14"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.background = "rgba(232, 180, 192, 0.2)";
                e.currentTarget.style.borderColor = "#e8b4c0";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(232, 180, 192, 0.5), 0 20px 50px rgba(232, 180, 192, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.color = "#e8b4c0";
                e.currentTarget.style.background = "rgba(232, 180, 192, 0.08)";
                e.currentTarget.style.borderColor = "rgba(232, 180, 192, 0.7)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              TRY IT FREE
            </button>
          </div>

          {/* Main Description - Responsive Size */}
          <p
            className="max-w-5xl mx-auto animate-fadeUp leading-relaxed font-light text-center px-2"
            style={{ 
              fontSize: "clamp(1.35rem, 3vw, 3rem)",
              color: "#f8f9fa",
              animationDelay: "400ms",
              letterSpacing: "0.01em",
              lineHeight: "1.6",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
            }}
          >
            Step into an exclusive experience designed for those ready to transcend. 
            Our AI-powered transformation sessions reveal your deepest potential, 
            clarity, and path forward.
          </p>

          {/* Trust Section - Responsive Spacing */}
          <div className="mt-12 lg:mt-16">
            {/* Trust Indicator - 30-Day */}
            <div
              className="flex items-center justify-center gap-2 animate-fadeUp"
              style={{ 
                animationDelay: "480ms",
                fontSize: "0.95rem"
              }}
            >
              <span style={{ color: "#e8b4c0", fontSize: "1.15rem" }}>✓</span>
              <span style={{ color: "#e8e8e8" }}>30-Day Transformation</span>
            </div>

            {/* Privacy Notice */}
            <p 
              className="mt-4 lg:mt-5 text-center animate-fadeUp px-4" 
              style={{ 
                animationDelay: "540ms",
                fontSize: "0.85rem",
                color: "#b8b8b8",
                lineHeight: "1.5"
              }}
            >
              We use your answers only to personalize guidance — edit/delete any time.
            </p>

            {/* Bank-Level Encryption at Bottom */}
            <div
              className="mt-6 flex items-center justify-center gap-2 animate-fadeUp pb-4"
              style={{ 
                animationDelay: "600ms",
                fontSize: "0.85rem"
              }}
            >
              <span style={{ color: "#e8b4c0", fontSize: "1.05rem" }}>🔒</span>
              <span style={{ color: "#a8a8a8" }}>Bank-Level Encryption</span>
            </div>
          </div>
        </div>

        {/* Depth Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </section>
    </main>
  );
}