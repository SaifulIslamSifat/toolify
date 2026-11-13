"use client";

import { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function Interactive3DSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Generate 3D Fibonacci sphere points
    const pointCount = 110;
    const points: Point3D[] = [];
    const sphereRadius = 88;

    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = i * 2.3999632; // Golden ratio angle
      points.push({
        x: Math.cos(theta) * radiusAtY * sphereRadius,
        y: y * sphereRadius,
        z: Math.sin(theta) * radiusAtY * sphereRadius,
      });
    }

    // Dynamic rotation state
    let rotX = 0.3;
    let rotY = 0.4;
    let rotZ = 0.1;
    let targetSpeedX = 0.004;
    let targetSpeedY = 0.007;

    let mouseX = 0;
    let mouseY = 0;

    const size = 260;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      mouseX = Math.max(-1, Math.min(1, dx));
      mouseY = Math.max(-1, Math.min(1, dy));
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible && !prefersReducedMotion) {
        lastTime = performance.now();
        render(lastTime);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isVisible) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!prefersReducedMotion) {
        // Continuous rotation with smooth mouse influence
        rotY += (targetSpeedY + mouseX * 0.015) * delta * 60;
        rotX += (targetSpeedX + mouseY * 0.015) * delta * 60;
        rotZ += 0.002 * delta * 60;
      }

      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      const fov = 300;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const isDarkMode = document.documentElement.classList.contains("dark");
      const primaryColor = isDarkMode ? "129, 140, 248" : "99, 102, 241"; // Brand Indigo
      const accentColor = isDarkMode ? "56, 189, 248" : "79, 70, 229"; // Cyan/Deep brand

      // Project points
      interface ProjectedPoint {
        x2d: number;
        y2d: number;
        z3d: number;
        scale: number;
      }

      const projected: ProjectedPoint[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // 3D Matrix Rotation (Y -> X -> Z)
        let x1 = cosY * p.x + sinY * p.z;
        let z1 = -sinY * p.x + cosY * p.z;

        let y2 = cosX * p.y - sinX * z1;
        let z2 = sinX * p.y + cosX * z1;

        let x3 = cosZ * x1 - sinZ * y2;
        let y3 = sinZ * x1 + cosZ * y2;
        let z3 = z2;

        const perspective = fov / (fov + z3);
        projected.push({
          x2d: centerX + x3 * perspective,
          y2d: centerY + y3 * perspective,
          z3d: z3,
          scale: perspective,
        });
      }

      // Sort by depth (back to front)
      projected.sort((a, b) => a.z3d - b.z3d);

      // Draw faint connections between nearby projected points
      ctx.lineWidth = 0.7;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.z3d < -40) continue; // Don't draw connections on far backside

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.x2d - p2.x2d, p1.y2d - p2.y2d);
          if (dist < 34) {
            const depthAlpha = Math.max(0, (p1.z3d + sphereRadius) / (sphereRadius * 2));
            const lineAlpha = (1 - dist / 34) * depthAlpha * (isDarkMode ? 0.35 : 0.2);
            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.strokeStyle = `rgba(${primaryColor}, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw glowing nodes with 3D depth attenuation
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        // Depth-based size and opacity
        const depthRatio = (p.z3d + sphereRadius) / (sphereRadius * 2); // 0 (far) to 1 (near)
        const radius = Math.max(0.8, (depthRatio * 2.5 + 0.8) * p.scale);
        const alpha = Math.max(0.15, Math.min(1, depthRatio * 0.85 + 0.15));

        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, radius, 0, Math.PI * 2);

        if (depthRatio > 0.7) {
          ctx.fillStyle = `rgba(${accentColor}, ${alpha})`;
          ctx.shadowColor = `rgba(${primaryColor}, 0.8)`;
          ctx.shadowBlur = isDarkMode ? 8 : 4;
        } else {
          ctx.fillStyle = `rgba(${primaryColor}, ${alpha * 0.7})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial draw
    render(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none pointer-events-none">
      {/* Ambient decorative glowing backdrops */}
      <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 dark:from-brand-500/30 dark:to-cyan-500/20 blur-2xl animate-pulse" />
      <canvas
        ref={canvasRef}
        aria-label="Interactive 3D Digital Sphere"
        role="img"
        className="relative z-10 transition-transform duration-300"
      />
    </div>
  );
}