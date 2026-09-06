import React, { useEffect, useRef } from "react";

const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

// Clean unified Red, White, and Silver fireworks for professional e-commerce feel
const FIREWORK_COLORS = [
  { r: 239, g: 68, b: 68, hex: "#ef4444" },   // Vivid Crimson Red
  { r: 220, g: 38, b: 38, hex: "#dc2626" },   // Deep Ruby Red
  { r: 248, g: 113, b: 113, hex: "#f87171" }, // Light Crimson
  { r: 255, g: 255, b: 255, hex: "#ffffff" }, // Pure Sparkling White
  { r: 254, g: 202, b: 202, hex: "#fecaca" }, // Silver Red
  { r: 245, g: 245, b: 245, hex: "#f5f5f5" }, // Bright Silver
  { r: 185, g: 28, b: 28, hex: "#b91c1c" },   // Deep Red
  { r: 255, g: 255, b: 255, hex: "#ffffff" }, // White Accent
];

export default function BackgroundFireworks({ isPaused = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = null;
    let isMobile = window.innerWidth < 768;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let rockets = [];
    let particles = [];
    let flashes = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      isMobile = width < 768;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Spawn a firework burst
    const createBurst = (x, y, baseColor) => {
      const isMob = width < 768;
      // High performance count: 32-45 particles on mobile, 60-80 on desktop
      const count = isMob ? randInt(28, 42) : randInt(60, 85);
      const colorScheme = baseColor || FIREWORK_COLORS[randInt(0, FIREWORK_COLORS.length - 1)];

      // Center glowing flash ring
      flashes.push({
        x,
        y,
        radius: isMob ? 20 : 35,
        maxRadius: isMob ? 80 : 130,
        color: colorScheme,
        alpha: 0.8,
        decay: 0.05,
      });

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + rand(-0.08, 0.08);
        const speed = rand(isMob ? 2.5 : 3.5, isMob ? 6.5 : 9.5);
        const altColor = Math.random() > 0.35 ? colorScheme : FIREWORK_COLORS[randInt(0, FIREWORK_COLORS.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: altColor,
          alpha: 1,
          size: rand(isMob ? 1.6 : 2.0, isMob ? 2.8 : 3.6),
          decay: rand(0.012, 0.022),
          gravity: rand(0.06, 0.11),
          drag: 0.982,
          flicker: Math.random() > 0.4,
          flickerPhase: rand(0, Math.PI * 2),
        });
      }
    };

    // Launch a rocket rising smoothly from bottom or lower edge
    const launchRocket = () => {
      const isMob = width < 768;
      const startX = rand(width * 0.15, width * 0.85);
      const startY = height + 10;
      const targetX = startX + rand(-width * 0.15, width * 0.15);
      const targetY = rand(height * 0.12, height * (isMob ? 0.45 : 0.5));
      const dur = rand(36, 52);
      const color = FIREWORK_COLORS[randInt(0, FIREWORK_COLORS.length - 1)];

      rockets.push({
        x: startX,
        y: startY,
        vx: (targetX - startX) / dur,
        vy: (targetY - startY) / dur,
        life: dur,
        color,
        trail: [],
      });
    };

    // Rocket launch interval (every 1.6s on mobile, 1.1s on desktop for smooth festival ambience)
    const launchIntervalMs = isMobile ? 1800 : 1200;
    const rocketTimer = setInterval(launchRocket, launchIntervalMs);

    // Initial instant welcome bursts
    setTimeout(() => createBurst(width * 0.3, height * 0.25, FIREWORK_COLORS[0]), 200);
    setTimeout(() => createBurst(width * 0.7, height * 0.28, FIREWORK_COLORS[2]), 700);

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Hardware-accelerated glowing additive blending
      ctx.globalCompositeOperation = "lighter";

      // 1. Draw Flashes
      flashes = flashes.filter((f) => {
        f.radius += (f.maxRadius - f.radius) * 0.18;
        f.alpha -= f.decay;
        if (f.alpha <= 0) return false;

        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha * 0.9})`);
        grad.addColorStop(0.35, `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${f.alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // 2. Draw Rising Rockets
      rockets = rockets.filter((r) => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > (isMobile ? 5 : 8)) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.life--;

        // Draw trail
        for (let i = 0; i < r.trail.length; i++) {
          const pt = r.trail[i];
          const a = (i / r.trail.length) * 0.7;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (i / r.trail.length) * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, ${a})`;
          ctx.fill();
        }

        // Rocket head spark
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        if (r.life <= 0) {
          createBurst(r.x, r.y, r.color);
          return false;
        }
        return true;
      });

      // 3. Draw Sparking Particles
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        let alpha = p.alpha;
        if (p.flicker) {
          alpha *= 0.6 + 0.4 * Math.sin(frame * 0.2 + p.flickerPhase);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${Math.max(0, alpha)})`;
        ctx.fill();

        // Inner bright spark core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha * 0.85)})`;
        ctx.fill();

        return true;
      });

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over";

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      clearInterval(rocketTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPaused]);

  if (isPaused) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient background soft glow pulses */}
      <div className="absolute top-1/4 left-1/6 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-red-600/10 blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-red-950/20 blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* 60FPS Hardware-Accelerated Additive Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
