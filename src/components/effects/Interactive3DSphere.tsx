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

    // Sphere specifications
    const sphereRadius = 90;
    const size = 280;
    const centerX = size / 2;
    const centerY = size / 2;
    const fov = 320;

    // Generate 3D Fibonacci surface points
    const pointCount = 105;
    const points: Point3D[] = [];

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

    // Precalculate orbital wireframe rings (latitude circles & meridian circles)
    const RING_SEGMENTS = 36;
    interface RingSegment {
      p1: Point3D;
      p2: Point3D;
    }
    const ringSegments: RingSegment[] = [];

    // Helper to add a circular ring
    const addRing = (radius: number, yOffset: number, plane: "horizontal" | "verticalX" | "verticalZ") => {
      const step = (Math.PI * 2) / RING_SEGMENTS;
      for (let i = 0; i < RING_SEGMENTS; i++) {
        const a1 = i * step;
        const a2 = (i + 1) * step;
        let pt1: Point3D;
        let pt2: Point3D;

        if (plane === "horizontal") {
          pt1 = { x: Math.cos(a1) * radius, y: yOffset, z: Math.sin(a1) * radius };
          pt2 = { x: Math.cos(a2) * radius, y: yOffset, z: Math.sin(a2) * radius };
        } else if (plane === "verticalX") {
          pt1 = { x: 0, y: Math.cos(a1) * radius, z: Math.sin(a1) * radius };
          pt2 = { x: 0, y: Math.cos(a2) * radius, z: Math.sin(a2) * radius };
        } else {
          pt1 = { x: Math.cos(a1) * radius, y: Math.sin(a1) * radius, z: 0 };
          pt2 = { x: Math.cos(a2) * radius, y: Math.sin(a2) * radius, z: 0 };
        }
        ringSegments.push({ p1: pt1, p2: pt2 });
      }
    };

    // 1. Equator
    addRing(sphereRadius, 0, "horizontal");
    // 2. North latitude (+36 deg)
    const latRadius = sphereRadius * Math.cos((36 * Math.PI) / 180);
    const latY = sphereRadius * Math.sin((36 * Math.PI) / 180);
    addRing(latRadius, latY, "horizontal");
    // 3. South latitude (-36 deg)
    addRing(latRadius, -latY, "horizontal");
    // 4. Longitudinal Meridian
    addRing(sphereRadius, 0, "verticalX");
    // 5. Orthogonal Meridian
    addRing(sphereRadius, 0, "verticalZ");

    // Dynamic rotation state
    let rotX = 0.35;
    let rotY = 0.45;
    let rotZ = 0.08;
    const targetSpeedX = 0.0035;
    const targetSpeedY = 0.0065;

    let mouseX = 0;
    let mouseY = 0;

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
        // Continuous smooth 3D rotation influenced by cursor
        rotY += (targetSpeedY + mouseX * 0.014) * delta * 60;
        rotX += (targetSpeedX + mouseY * 0.014) * delta * 60;
        rotZ += 0.0018 * delta * 60;
      }

      ctx.clearRect(0, 0, size, size);

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const isDarkMode = document.documentElement.classList.contains("dark");

      // Projection helper with 3D rotation matrix (Y -> X -> Z)
      const projectPoint = (pt: Point3D) => {
        const x1 = cosY * pt.x + sinY * pt.z;
        const z1 = -sinY * pt.x + cosY * pt.z;

        const y2 = cosX * pt.y - sinX * z1;
        const z2 = sinX * pt.y + cosX * z1;

        const x3 = cosZ * x1 - sinZ * y2;
        const y3 = sinZ * x1 + cosZ * y2;
        const z3 = z2;

        const perspective = fov / (fov + z3);
        return {
          x2d: centerX + x3 * perspective,
          y2d: centerY + y3 * perspective,
          z3d: z3,
          scale: perspective,
        };
      };

      // 1. Draw inner depth holographic core for 3D body
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        4,
        centerX,
        centerY,
        sphereRadius * 0.95
      );
      if (isDarkMode) {
        coreGrad.addColorStop(0, "rgba(99, 102, 241, 0.18)");
        coreGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.08)");
        coreGrad.addColorStop(1, "rgba(99, 102, 241, 0)");
      } else {
        coreGrad.addColorStop(0, "rgba(99, 102, 241, 0.12)");
        coreGrad.addColorStop(0.55, "rgba(165, 180, 252, 0.06)");
        coreGrad.addColorStop(1, "rgba(99, 102, 241, 0)");
      }
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 0.95, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // 2. Draw 3D orbital rings (back segments dashed, front segments solid & vibrant)
      for (let i = 0; i < ringSegments.length; i++) {
        const seg = ringSegments[i];
        const proj1 = projectPoint(seg.p1);
        const proj2 = projectPoint(seg.p2);
        const avgZ = (proj1.z3d + proj2.z3d) / 2;

        ctx.beginPath();
        ctx.moveTo(proj1.x2d, proj1.y2d);
        ctx.lineTo(proj2.x2d, proj2.y2d);

        if (avgZ > 0) {
          // Front of sphere: crisp, clear wireframe
          ctx.setLineDash([]);
          ctx.lineWidth = isDarkMode ? 1.1 : 1.0;
          ctx.strokeStyle = isDarkMode
            ? "rgba(129, 140, 248, 0.50)"
            : "rgba(79, 70, 229, 0.38)";
        } else {
          // Back of sphere: soft dashed depth
          ctx.setLineDash([2, 4]);
          ctx.lineWidth = 0.7;
          ctx.strokeStyle = isDarkMode
            ? "rgba(99, 102, 241, 0.20)"
            : "rgba(165, 180, 252, 0.22)";
        }
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset line dash

      // 3. Project and sort Fibonacci surface nodes
      interface ProjectedNode {
        x2d: number;
        y2d: number;
        z3d: number;
        scale: number;
      }
      const projectedNodes: ProjectedNode[] = [];
      for (let i = 0; i < points.length; i++) {
        projectedNodes.push(projectPoint(points[i]));
      }

      // Draw constellation mesh between nearby nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        const p1 = projectedNodes[i];
        if (p1.z3d < -45) continue; // Skip far rear nodes for performance and clarity

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p2 = projectedNodes[j];
          if (p2.z3d < -45) continue;

          const dist = Math.hypot(p1.x2d - p2.x2d, p1.y2d - p2.y2d);
          if (dist < 42) {
            const minZ = Math.min(p1.z3d, p2.z3d);
            const depthAlpha = Math.max(0, (minZ + sphereRadius) / (sphereRadius * 2));

            const lineAlpha =
              (1 - dist / 42) *
              (depthAlpha * 0.55 + 0.15) *
              (isDarkMode ? 0.45 : 0.42);

            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.strokeStyle = isDarkMode
              ? `rgba(129, 140, 248, ${lineAlpha})`
              : `rgba(79, 70, 229, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Sort nodes from back to front for proper occlusion rendering
      projectedNodes.sort((a, b) => a.z3d - b.z3d);

      // Draw nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        const p = projectedNodes[i];
        const depthRatio = (p.z3d + sphereRadius) / (sphereRadius * 2); // 0 (far) to 1 (near)

        ctx.beginPath();

        if (depthRatio > 0.62) {
          // Front nodes: prominent and highlighted
          const radius = Math.max(1.2, (depthRatio * 2.4 + 0.7) * p.scale);
          ctx.arc(p.x2d, p.y2d, radius, 0, Math.PI * 2);

          if (isDarkMode) {
            ctx.fillStyle = "rgba(56, 189, 248, 0.95)";
            ctx.shadowColor = "rgba(129, 140, 248, 0.8)";
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = "rgba(79, 70, 229, 0.95)";
            ctx.shadowColor = "rgba(99, 102, 241, 0.35)";
            ctx.shadowBlur = 4;
          }
        } else {
          // Back nodes: soft and subtle
          const radius = Math.max(0.7, (depthRatio * 1.6 + 0.5) * p.scale);
          ctx.arc(p.x2d, p.y2d, radius, 0, Math.PI * 2);

          if (isDarkMode) {
            ctx.fillStyle = "rgba(99, 102, 241, 0.45)";
          } else {
            ctx.fillStyle = "rgba(165, 180, 252, 0.45)";
          }
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
      {/* Ambient decorative glowing backdrop */}
      <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-brand-500/15 via-indigo-500/10 to-transparent dark:from-brand-500/25 dark:to-cyan-500/20 blur-2xl pointer-events-none" />
      <canvas
        ref={canvasRef}
        aria-label="Interactive 3D Digital Sphere"
        role="img"
        className="relative z-10 transition-transform duration-300"
      />
    </div>
  );
}
