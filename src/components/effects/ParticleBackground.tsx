"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  connections: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Screen-adaptive particle density
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 22 : 46;
    const maxDistance = isMobile ? 90 : 130;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for gentle interaction
    const mouse = {
      x: -1000,
      y: -1000,
      radius: isMobile ? 80 : 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible) {
        lastTime = performance.now();
        render(lastTime);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 1.5 + 0.8;
      const baseAlpha = Math.random() * 0.35 + 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        radius,
        alpha: baseAlpha,
        baseAlpha,
        connections: 0,
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isVisible) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const isDarkMode = document.documentElement.classList.contains("dark");
      // In light mode: use ultra-soft brand lavender/periwinkle so particles feel like subtle stardust, not dark specks
      const dotColor = isDarkMode ? "129, 140, 248" : "165, 180, 252";
      const lineColor = isDarkMode ? "99, 102, 241" : "199, 210, 254";

      // Reset connections
      for (let i = 0; i < particles.length; i++) {
        particles[i].connections = 0;
      }

      // Update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx * delta * 60;
        p.y += p.vy * delta * 60;

        // Bounce at boundaries
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        // Mouse gentle proximity push
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.8;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }
      }

      // Draw connections first
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distBetween < maxDistance) {
            p.connections++;
            p2.connections++;
            const lineAlpha = (1 - distBetween / maxDistance) * (isDarkMode ? 0.22 : 0.16);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
            ctx.lineWidth = isDarkMode ? 0.8 : 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw particle dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let renderAlpha: number;
        let renderRadius = p.radius;

        if (isDarkMode) {
          renderAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, renderRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dotColor}, ${renderAlpha})`;
          ctx.shadowColor = `rgba(${dotColor}, 0.5)`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Light mode: no blur halo to prevent dark smudges; soft lavender tint
          if (p.connections > 0) {
            renderAlpha = Math.min(0.24, p.alpha * 0.5);
            renderRadius = p.radius * 0.85;
          } else {
            renderAlpha = 0.08;
            renderRadius = Math.min(1.0, p.radius * 0.65);
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, renderRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dotColor}, ${renderAlpha})`;
          ctx.shadowBlur = 0;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60 dark:opacity-75 transition-opacity duration-700"
    />
  );
}
