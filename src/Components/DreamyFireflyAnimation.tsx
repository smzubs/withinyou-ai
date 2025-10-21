// src/components/DreamyFireflyAnimation.tsx
"use client";

import { useEffect, useRef } from "react";

export default function DreamyFireflyAnimation() {
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
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      pulseSpeed: number;
      pulsePhase: number;
      glowIntensity: number;
      wanderAngle: number;
      wanderSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.08;
        this.speedY = (Math.random() - 0.5) * 0.08;
        
        const colors = [
          "rgba(52, 211, 153, ",
          "rgba(34, 197, 194, ",
          "rgba(59, 130, 246, ",
          "rgba(96, 165, 250, ",
          "rgba(45, 212, 191, ",
          "rgba(16, 185, 129, ",
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
        
        const outerGlow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowRadius * 2
        );
        outerGlow.addColorStop(0, this.color + (this.opacity * 0.3) + ")");
        outerGlow.addColorStop(0.5, this.color + (this.opacity * 0.1) + ")");
        outerGlow.addColorStop(1, this.color + "0)");
        
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        const innerGlow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowRadius
        );
        innerGlow.addColorStop(0, this.color + (this.opacity * 0.8) + ")");
        innerGlow.addColorStop(0.5, this.color + (this.opacity * 0.4) + ")");
        innerGlow.addColorStop(1, this.color + "0)");
        
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        const core = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        core.addColorStop(0, this.color + this.opacity + ")");
        core.addColorStop(1, this.color + (this.opacity * 0.6) + ")");
        
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const drawConnections = (particles: FireflyParticle[]) => {
      if (!ctx) return;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = (1 - distance / 150);
            
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `rgba(52, 211, 153, ${opacity * 0.08})`);
            gradient.addColorStop(0.5, `rgba(34, 197, 194, ${opacity * 0.12})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity * 0.08})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            
            if (distance < 80) {
              const midX = (particles[i].x + particles[j].x) / 2;
              const midY = (particles[i].y + particles[j].y) / 2;
              
              const nodeGradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, 2);
              nodeGradient.addColorStop(0, `rgba(34, 197, 194, ${opacity * 0.3})`);
              nodeGradient.addColorStop(1, `rgba(34, 197, 194, 0)`);
              
              ctx.fillStyle = nodeGradient;
              ctx.beginPath();
              ctx.arc(midX, midY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    };

    let waveOffset1 = 0;
    let waveOffset2 = 0;
    
    const drawAmbientWaves = () => {
      if (!ctx) return;
      
      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient1.addColorStop(0, "rgba(16, 185, 129, 0.02)");
      gradient1.addColorStop(0.5, "rgba(34, 197, 194, 0.04)");
      gradient1.addColorStop(1, "rgba(52, 211, 153, 0.02)");

      ctx.fillStyle = gradient1;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 10) {
        const y = Math.sin((x + waveOffset1) * 0.002) * 40 + 
                  Math.sin((x + waveOffset1) * 0.004) * 20 + 
                  canvas.height * 0.2;
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
      gradient2.addColorStop(0, "rgba(59, 130, 246, 0.02)");
      gradient2.addColorStop(0.5, "rgba(45, 212, 191, 0.03)");
      gradient2.addColorStop(1, "rgba(96, 165, 250, 0.02)");

      ctx.fillStyle = gradient2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 10) {
        const y = Math.sin((x + waveOffset2) * 0.0015) * 60 + 
                  Math.cos((x + waveOffset2) * 0.003) * 30 + 
                  canvas.height * 0.75;
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

      waveOffset1 += 0.12;
      waveOffset2 += 0.08;
    };

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
      
      ctx.fillStyle = "rgba(8, 24, 24, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawAmbientWaves();

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
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none" 
      style={{ zIndex: 1 }} 
    />
  );
}