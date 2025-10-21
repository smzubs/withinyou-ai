// src/components/AnimatedBackground.tsx
"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
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

    // Enhanced particle system
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
          "rgba(212, 175, 185, ",  // Rose gold
          "rgba(232, 220, 196, ",  // Warm cream
          "rgba(184, 168, 196, ",  // Mauve
          "rgba(74, 155, 155, ",   // Light teal
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.pulseSpeed = Math.random() * 0.015 + 0.008;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.angle = 0;
        this.distance = Math.random() * 3 + 1;
      }

      update(mouseX: number, mouseY: number) {
        // Gentle drift
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Subtle mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= (dx / dist) * force * 0.5;
          this.y -= (dy / dist) * force * 0.5;
        }

        // Orbital motion around base position
        this.angle += 0.001;
        this.x += Math.cos(this.angle) * this.distance * 0.1;
        this.y += Math.sin(this.angle) * this.distance * 0.1;

        // Wrap around edges smoothly
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.y > canvas.height + 50) this.y = -50;
        if (this.y < -50) this.y = canvas.height + 50;

        // Breathing effect
        this.pulsePhase += this.pulseSpeed;
        this.opacity = (Math.sin(this.pulsePhase) + 1) * 0.2 + 0.08;
      }

      draw() {
        if (!ctx) return;
        
        // Main particle with gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, this.color + this.opacity + ")");
        gradient.addColorStop(1, this.color + "0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Connection lines between nearby particles
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

    // Create particles
    const particles: LuxuryParticle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new LuxuryParticle());
    }

    // Aurora wave layers
    let waveOffset1 = 0;
    let waveOffset2 = 0;
    
    const drawAuroraWaves = () => {
      if (!ctx) return;
      
      // First aurora layer
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

      // Second aurora layer
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

    // Mouse tracking for subtle interactivity
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Darker fade effect for deeper background
      ctx.fillStyle = "rgba(5, 8, 20, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw aurora waves
      drawAuroraWaves();

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(mouseX, mouseY);
        particle.draw();
      });

      // Draw connection lines
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
      {/* Canvas for particle system */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Enhanced gradient overlay layers */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* Large breathing orbs with blur */}
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

        {/* Rotating gradient mesh */}
        <div
          className="absolute inset-0 animate-gradient-shift opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(27, 77, 77, 0.1) 0%, rgba(212, 175, 185, 0.15) 30%, rgba(184, 168, 196, 0.1) 60%, rgba(74, 155, 155, 0.05) 100%)",
            backgroundSize: "400% 400%",
          }}
        />

        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 opacity-5 animate-light-rays"
          style={{
            background: "repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(212, 175, 185, 0.15) 60px, rgba(212, 175, 185, 0.15) 120px)",
          }}
        />

        {/* Vignette effect for depth */}
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