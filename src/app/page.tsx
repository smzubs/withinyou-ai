// src/app/page.tsx - DARK TEAL + GLASS OVERLAY + SHARP GLASS BUTTONS
"use client";

import Image from "next/image";
import { track } from "../lib/gtag";
import { useEffect, useRef } from "react";

// DREAMY FIREFLY ANIMATION (ORIGINAL)
function DreamyFireflyAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    class FireflyParticle {
      x: number; y: number; size: number; speedX: number; speedY: number;
      opacity: number; color: string; pulseSpeed: number; pulsePhase: number;
      glowIntensity: number; wanderAngle: number; wanderSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.08;
        this.speedY = (Math.random() - 0.5) * 0.08;
        
        const colors = [
          "rgba(52, 211, 153, ", "rgba(34, 197, 194, ", "rgba(59, 130, 246, ",
          "rgba(96, 165, 250, ", "rgba(45, 212, 191, ", "rgba(16, 185, 129, ",
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.pulseSpeed = Math.random() * 0.004 + 0.002;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.glowIntensity = Math.random() * 0.15 + 0.05;
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderSpeed = Math.random() * 0.02 + 0.01;
      }

      update(mouseX: number, mouseY: number) {
        this.wanderAngle += (Math.random() - 0.5) * 0.1;
        this.x += Math.cos(this.wanderAngle) * this.wanderSpeed + this.speedX;
        this.y += Math.sin(this.wanderAngle) * this.wanderSpeed + this.speedY;
        
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          const force = (200 - dist) / 200;
          this.x -= (dx / dist) * force * 0.15;
          this.y -= (dy / dist) * force * 0.15;
        }

        if (this.x > canvas.width + 100) this.x = -100;
        if (this.x < -100) this.x = canvas.width + 100;
        if (this.y > canvas.height + 100) this.y = -100;
        if (this.y < -100) this.y = canvas.height + 100;

        this.pulsePhase += this.pulseSpeed;
        const pulse = Math.sin(this.pulsePhase);
        this.opacity = (pulse * 0.5 + 0.5) * this.glowIntensity;
      }

      draw() {
        if (!ctx) return;
        
        const glowRadius = this.size * 8;
        
        const outerGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius * 2);
        outerGlow.addColorStop(0, this.color + (this.opacity * 0.3) + ")");
        outerGlow.addColorStop(0.5, this.color + (this.opacity * 0.1) + ")");
        outerGlow.addColorStop(1, this.color + "0)");
        
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        const innerGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
        innerGlow.addColorStop(0, this.color + (this.opacity * 0.8) + ")");
        innerGlow.addColorStop(0.5, this.color + (this.opacity * 0.4) + ")");
        innerGlow.addColorStop(1, this.color + "0)");
        
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        const core = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        core.addColorStop(0, this.color + this.opacity + ")");
        core.addColorStop(1, this.color + (this.opacity * 0.6) + ")");
        
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: FireflyParticle[] = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new FireflyParticle());
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!ctx) return;
      
      ctx.fillStyle = "rgba(15, 61, 62, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(mouseX, mouseY);
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ margin: 0, padding: 0 }}>
      <section
        className="relative flex items-center justify-center text-center overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #0f3d3e 0%, #1a4d4e 25%, #0f3d3e 50%, #0a3536 75%, #0f3d3e 100%)",
          minHeight: "100vh",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        <DreamyFireflyAnimation />

        {/* FROSTED GLASS OVERLAY LAYER */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            zIndex: 2,
            background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
            backdropFilter: "blur(0.5px)",
          }} 
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 w-full pb-8">
          {/* LOGO */}
          <div className="mx-auto mb-8 lg:mb-12 w-fit animate-fadeUp" style={{ animationDelay: "80ms" }}>
            <div className="mx-auto mb-2 flex items-center justify-center">
              <Image
                src="/logo-wings.png"
                alt="WithinYouAi logo"
                width={90}
                height={90}
                priority
                className="select-none pointer-events-none lg:hidden"
                style={{
                  filter: "drop-shadow(0 0 25px rgba(52, 211, 153, 0.7)) drop-shadow(0 0 50px rgba(34, 197, 194, 0.5))"
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
                  filter: "drop-shadow(0 0 25px rgba(52, 211, 153, 0.7)) drop-shadow(0 0 50px rgba(34, 197, 194, 0.5))"
                }}
              />
            </div>

            <div
              className="tracking-wider"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.1rem, 2.5vw, 2.2rem)",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "0.12em",
                background: "linear-gradient(135deg, #34d399 0%, #22c5c2 50%, #10b981 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              WITHINYOUAI
            </div>
            <p 
              className="text-xs tracking-[0.15em] mt-1.5 lg:mt-2 uppercase font-light"
              style={{
                color: "rgba(52, 211, 153, 0.7)"
              }}
            >
              Self-Discovery
            </p>
          </div>

          <div
            className="mx-auto mb-3 lg:mb-4 h-px w-24 lg:w-32 animate-fadeUp"
            style={{ 
              background: "linear-gradient(90deg, transparent 0%, rgba(52, 211, 153, 0.8) 50%, transparent 100%)",
              animationDelay: "160ms" 
            }}
          />

          {/* HEADLINE */}
          <h1
            className="animate-fadeUp mb-6 lg:mb-8 px-2"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)",
              lineHeight: 1.3,
              background: "linear-gradient(135deg, #34d399 0%, #22c5c2 40%, #2dd4bf 60%, #10b981 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.01em",
              textShadow: "0 0 70px rgba(52, 211, 153, 0.2)",
              filter: "drop-shadow(0 0 15px rgba(52, 211, 153, 0.15))",
              animationDelay: "240ms",
            }}
          >
            Unlock the Life You&apos;re Meant to Live
          </h1>

          {/* SHARP GLASS BUTTONS WITH BIG GAP */}
          <div 
            className="mb-10 lg:mb-14 flex flex-col items-center justify-center animate-fadeUp" 
            style={{ 
              animationDelay: "320ms",
              gap: "2rem"  // 32px gap - MUCH BIGGER!
            }}
          >
            {/* GET PREMIUM BUTTON */}
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
                padding: "1.4rem 2.8rem",
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: "#34d399",
                background: "linear-gradient(145deg, rgba(52, 211, 153, 0.12), rgba(45, 212, 191, 0.08))",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(52, 211, 153, 0.3)",
                borderRadius: "3rem",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%",
                maxWidth: "380px",
              }}
              className="lg:text-lg lg:py-7 lg:px-16"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(52, 211, 153, 0.3), 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.background = "linear-gradient(145deg, rgba(52, 211, 153, 0.18), rgba(45, 212, 191, 0.12))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.background = "linear-gradient(145deg, rgba(52, 211, 153, 0.12), rgba(45, 212, 191, 0.08))";
              }}
            >
              GET PREMIUM – $14.99
            </button>

            {/* TRY FREE BUTTON */}
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
                padding: "1.4rem 2.8rem",
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.8)",
                background: "linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(240, 245, 250, 0.06))",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "3rem",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%",
                maxWidth: "380px",
              }}
              className="lg:text-lg lg:py-7 lg:px-16"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(52, 211, 153, 0.2), 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.background = "linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(240, 245, 250, 0.10))";
                e.currentTarget.style.color = "#34d399";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.background = "linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(240, 245, 250, 0.06))";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
              }}
            >
              TRY IT FREE
            </button>
          </div>

          {/* DESCRIPTION */}
          <p
            className="max-w-4xl mx-auto animate-fadeUp leading-relaxed font-light text-center px-2"
            style={{ 
              fontSize: "clamp(1.1rem, 2.2vw, 1.85rem)",
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

          {/* FEATURES */}
          <div className="mt-12 lg:mt-16">
            <div
              className="flex items-center justify-center gap-2 animate-fadeUp"
              style={{ 
                animationDelay: "480ms",
                fontSize: "0.95rem"
              }}
            >
              <span style={{ color: "#34d399", fontSize: "1.15rem" }}>✓</span>
              <span style={{ color: "#e8e8e8" }}>30-Day Transformation</span>
            </div>

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

            <div
              className="mt-6 flex items-center justify-center gap-2 animate-fadeUp pb-4"
              style={{ 
                animationDelay: "600ms",
                fontSize: "0.85rem"
              }}
            >
              <span style={{ color: "#34d399", fontSize: "1.05rem" }}>🔒</span>
              <span style={{ color: "#a8a8a8" }}>Bank-Level Encryption</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.03),transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0f3d3e]/80 via-[#0f3d3e]/30 to-transparent" />
      </section>

      <style jsx global>{`
        @keyframes fadeUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeUp { 
          animation: fadeUp 0.6s ease-out forwards; 
        }
      `}</style>
    </main>
  );
}