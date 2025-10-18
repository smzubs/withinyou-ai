// src/app/page.tsx - ALL IN ONE FILE (NO IMPORTS!)
"use client";

import Image from "next/image";
import { track } from "../lib/gtag";
import { useEffect, useRef } from "react";

// AnimatedBackground Component - INLINE
function AnimatedBackground() {
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

    class LuxuryParticle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      pulseSpeed: number;
      pulsePhase: number;
      angle: number;
      distance: number;

      constructor() {
        this.baseX = this.x = Math.random() * canvas.width;
        this.baseY = this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;
        
        const colors = [
          "rgba(212, 175, 185, ",
          "rgba(232, 220, 196, ",
          "rgba(184, 168, 196, ",
          "rgba(74, 155, 155, ",
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.pulseSpeed = Math.random() * 0.015 + 0.008;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.angle = 0;
        this.distance = Math.random() * 3 + 1;
      }

      update(mouseX: number, mouseY: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= (dx / dist) * force * 0.5;
          this.y -= (dy / dist) * force * 0.5;
        }

        this.angle += 0.001;
        this.x += Math.cos(this.angle) * this.distance * 0.1;
        this.y += Math.sin(this.angle) * this.distance * 0.1;

        if (this.x > canvas.width + 50) this.x = -50;
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.y > canvas.height + 50) this.y = -50;
        if (this.y < -50) this.y = canvas.height + 50;

        this.pulsePhase += this.pulseSpeed;
        this.opacity = (Math.sin(this.pulsePhase) + 1) * 0.2 + 0.08;
      }

      draw() {
        if (!ctx) return;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, this.color + this.opacity + ")");
        gradient.addColorStop(1, this.color + "0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const drawConnections = (particles: LuxuryParticle[]) => {
      if (!ctx) return;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.strokeStyle = `rgba(212, 175, 185, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const particles: LuxuryParticle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new LuxuryParticle());
    }

    let waveOffset1 = 0;
    let waveOffset2 = 0;
    
    const drawAuroraWaves = () => {
      if (!ctx) return;
      
      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient1.addColorStop(0, "rgba(27, 77, 77, 0.04)");
      gradient1.addColorStop(0.5, "rgba(212, 175, 185, 0.06)");
      gradient1.addColorStop(1, "rgba(184, 168, 196, 0.04)");

      ctx.fillStyle = gradient1;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 8) {
        const y = Math.sin((x + waveOffset1) * 0.004) * 60 + 
                  Math.sin((x + waveOffset1) * 0.008) * 30 + 
                  canvas.height * 0.25;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      const gradient2 = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
      gradient2.addColorStop(0, "rgba(184, 168, 196, 0.03)");
      gradient2.addColorStop(0.5, "rgba(74, 155, 155, 0.05)");
      gradient2.addColorStop(1, "rgba(212, 175, 185, 0.03)");

      ctx.fillStyle = gradient2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 8) {
        const y = Math.sin((x + waveOffset2) * 0.003) * 80 + 
                  Math.cos((x + waveOffset2) * 0.006) * 40 + 
                  canvas.height * 0.7;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      waveOffset1 += 0.25;
      waveOffset2 += 0.18;
    };

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!ctx) return;
      
      ctx.fillStyle = "rgba(5, 8, 20, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawAuroraWaves();

      particles.forEach((particle) => {
        particle.update(mouseX, mouseY);
        particle.draw();
      });

      drawConnections(particles);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-25 animate-breathing-orb-1"
          style={{
            background: "radial-gradient(circle, rgba(212, 175, 185, 0.5) 0%, rgba(232, 220, 196, 0.3) 40%, transparent 70%)",
            top: "5%",
            right: "5%",
            filter: "blur(60px)",
          }}
        />
        
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 animate-breathing-orb-2"
          style={{
            background: "radial-gradient(circle, rgba(27, 77, 77, 0.6) 0%, rgba(74, 155, 155, 0.4) 40%, transparent 70%)",
            bottom: "10%",
            left: "5%",
            filter: "blur(60px)",
          }}
        />

        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 animate-breathing-orb-3"
          style={{
            background: "radial-gradient(circle, rgba(184, 168, 196, 0.5) 0%, rgba(212, 175, 185, 0.3) 40%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(70px)",
          }}
        />

        <div
          className="absolute inset-0 animate-gradient-shift opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(27, 77, 77, 0.1) 0%, rgba(212, 175, 185, 0.15) 30%, rgba(184, 168, 196, 0.1) 60%, rgba(74, 155, 155, 0.05) 100%)",
            backgroundSize: "400% 400%",
          }}
        />

        <div
          className="absolute inset-0 opacity-5 animate-light-rays"
          style={{
            background: "repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(212, 175, 185, 0.15) 60px, rgba(212, 175, 185, 0.15) 120px)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(5, 8, 20, 0.6) 100%)",
          }}
        />
      </div>
    </>
  );
}

// MAIN HOME COMPONENT
export default function Home() {
  return (
    <main className="min-h-screen text-white" style={{ margin: 0, padding: 0 }}>
      <section
        className="relative flex items-center justify-center text-center overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #050814 0%, #0a0e1f 25%, #070b18 50%, #0d0f1a 75%, #050814 100%)",
          minHeight: "100vh",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        <AnimatedBackground />

        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-20"
          style={{
            height: "200px",
            background: "linear-gradient(180deg, rgba(15, 25, 45, 0.95) 0%, rgba(10, 14, 31, 0.85) 25%, rgba(7, 11, 24, 0.6) 50%, rgba(5, 8, 20, 0.3) 75%, transparent 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 w-full pb-8">
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

          <div
            className="mx-auto mb-3 lg:mb-4 h-px w-24 lg:w-32 animate-fadeUp"
            style={{ 
              background: "linear-gradient(90deg, transparent 0%, rgba(232, 180, 192, 0.8) 50%, transparent 100%)",
              animationDelay: "160ms" 
            }}
          />

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

          <div 
            className="mb-10 lg:mb-14 flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 animate-fadeUp" 
            style={{ animationDelay: "320ms" }}
          >
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

          <div className="mt-12 lg:mt-16">
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
              <span style={{ color: "#e8b4c0", fontSize: "1.05rem" }}>🔒</span>
              <span style={{ color: "#a8a8a8" }}>Bank-Level Encryption</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </section>
    </main>
  );
}