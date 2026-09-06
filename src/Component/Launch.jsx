import React, { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────── Utility ─────────────── */
const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

/* ─────────────── Firework Engine ─────────────── */
const PALETTES = [
  ["#ff0033", "#ffffff", "#ff4466", "#ff0000"],
  ["#ffffff", "#ff0000", "#ff3333", "#ffffff"],
  ["#ff1744", "#ffffff", "#ff5252", "#ff0000"],
  ["#ff0000", "#ffffff", "#ff3344", "#ffffff"],
  ["#ffffff", "#ff0000", "#ff2244", "#ff0000"],
];
const WHITE_RED = ["#ffffff", "#ffffff", "#ff0000", "#ff3333", "#ffffff", "#ff4444"];

function useFireworksEngine(canvasRef) {
  const raf = useRef(null);
  const particles = useRef([]);
  const sparklers = useRef([]);
  const rockets = useRef([]);
  const frame = useRef(0);
  const W = useRef(0);
  const H = useRef(0);

  const spawnDust = useCallback((x, y, n, speed = 2.5, pal = null) => {
    const p = pal || WHITE_RED;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = rand(0.3, speed);
      sparklers.current.push({
        x: x + rand(-3, 3), y: y + rand(-3, 3),
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - rand(0.1, 1.2),
        color: p[randInt(0, p.length)], alpha: rand(0.85, 1),
        size: rand(1.2, 2.6), decay: rand(0.007, 0.014),
        gravity: rand(0.018, 0.04), drag: rand(0.975, 0.988),
        twS: rand(0.1, 0.22), twP: rand(0, Math.PI * 2),
      });
    }
  }, []);

  const burst = useCallback((x, y, pal, cnt = null) => {
    const mob = window.innerWidth < 768;
    const p = pal || PALETTES[randInt(0, PALETTES.length)];
    const n = cnt || (mob ? randInt(55, 75) : randInt(95, 130));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(-0.08, 0.08);
      const sp = rand(mob ? 2.0 : 2.6, mob ? 5.5 : 7.8);
      particles.current.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        color: p[randInt(0, p.length)], alpha: 1,
        size: rand(mob ? 2.2 : 2.8, mob ? 3.4 : 4.4),
        decay: rand(0.008, 0.016), gravity: rand(0.03, 0.065),
        trail: [], twinkle: Math.random() > 0.3,
        twS: rand(0.09, 0.18), twP: rand(0, Math.PI * 2), sdc: 0,
      });
    }
    spawnDust(x, y, mob ? randInt(45, 65) : randInt(85, 130), mob ? 3.5 : 5.0, WHITE_RED);
    const ring = mob ? 16 : 26;
    for (let i = 0; i < ring; i++) {
      const a = (i / ring) * Math.PI * 2;
      particles.current.push({
        x, y,
        vx: Math.cos(a) * rand(mob ? 3.5 : 5.0, mob ? 6.0 : 8.5),
        vy: Math.sin(a) * rand(mob ? 3.5 : 5.0, mob ? 6.0 : 8.5),
        color: "#ffffff", alpha: 1, size: rand(1.4, 2.2),
        decay: rand(0.015, 0.028), gravity: 0.025,
        trail: [], twinkle: true, twS: 0.25, twP: rand(0, Math.PI * 2), sdc: 999,
      });
    }
  }, [spawnDust]);

  const launch = useCallback((tx, ty, pal) => {
    const sx = W.current * rand(0.2, 0.8);
    const sy = H.current + 10;
    const dur = rand(54, 76);
    rockets.current.push({
      x: sx, y: sy, vx: (tx - sx) / dur, vy: (ty - sy) / dur,
      trail: [], life: dur, palette: pal,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      W.current = canvas.width;
      H.current = canvas.height;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const mob = window.innerWidth < 768;
    const ids = [];

    ids.push(setTimeout(() => burst(W.current * 0.5, H.current * 0.22, PALETTES[0], 160), 200));
    ids.push(setTimeout(() => burst(W.current * 0.25, H.current * 0.20, PALETTES[1], 550), 400));
    ids.push(setTimeout(() => burst(W.current * 0.75, H.current * 0.20, PALETTES[2], 550), 600));

    [[0.22, 0.26], [0.78, 0.26], [0.5, 0.13]].forEach(([tx, ty], i) => {
      ids.push(setTimeout(() => launch(W.current * tx, H.current * ty, PALETTES[i % PALETTES.length]), 500 + i * 300));
    });
    ids.push(setInterval(() => launch(W.current * rand(0.15, 0.85), H.current * rand(0.1, 0.32), PALETTES[randInt(0, PALETTES.length)]), mob ? 600 : 450));

    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W.current, H.current);
      ctx.globalCompositeOperation = "lighter";

      rockets.current = rockets.current.filter((r) => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > (mob ? 8 : 12)) r.trail.shift();
        r.x += r.vx; r.y += r.vy; r.life--;
        if (frame.current % 3 === 0) {
          sparklers.current.push({
            x: r.x + rand(-2, 2), y: r.y + rand(0, 6),
            vx: rand(-0.8, 0.8), vy: rand(1.0, 2.5),
            color: Math.random() > 0.4 ? "#ffffff" : "#ff0000",
            alpha: 1, size: rand(1.2, 2.2), decay: rand(0.018, 0.035),
            gravity: 0.03, drag: 0.975, twS: 0.2, twP: rand(0, Math.PI * 2),
          });
        }
        for (let i = 0; i < r.trail.length; i++) {
          const pt = r.trail[i];
          const a = (i / r.trail.length) * 0.75;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, (i / r.trail.length) * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239,68,68,${a})`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff"; ctx.fill();
        if (r.life <= 0) { burst(r.x, r.y, r.palette); return false; }
        return true;
      });

      particles.current = particles.current.filter((p) => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > (mob ? 3 : 5)) p.trail.shift();
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= 0.985; p.alpha -= p.decay;
        if (p.alpha <= 0) return false;
        p.sdc++;
        if (p.sdc === 4 && p.alpha > 0.35 && sparklers.current.length < (mob ? 180 : 350)) {
          p.sdc = 0;
          sparklers.current.push({ x: p.x, y: p.y, vx: rand(-0.5, 0.5), vy: rand(0.1, 1.0), color: "#ffffff", alpha: p.alpha * 0.85, size: rand(1.0, 1.8), decay: rand(0.012, 0.025), gravity: 0.025, drag: 0.985, twS: 0.18, twP: rand(0, Math.PI * 2) });
        }
        const tm = p.twinkle ? 0.4 + 0.6 * Math.sin(frame.current * p.twS + p.twP) : 1;
        const ea = Math.max(0, p.alpha * tm);
        p.trail.forEach((pt, i) => {
          ctx.beginPath(); ctx.arc(pt.x, pt.y, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = p.color; ctx.globalAlpha = (i / p.trail.length) * ea * 0.35; ctx.fill();
        });
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = ea; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff"; ctx.globalAlpha = ea * 0.85; ctx.fill();
        ctx.globalAlpha = 1; return true;
      });

      sparklers.current = sparklers.current.filter((s) => {
        s.x += s.vx; s.y += s.vy; s.vy += s.gravity; s.vx *= (s.drag || 0.98); s.alpha -= s.decay;
        if (s.alpha <= 0) return false;
        const tw = 0.35 + 0.65 * Math.sin(frame.current * s.twS + s.twP);
        const ea = Math.max(0, s.alpha * tw);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color; ctx.globalAlpha = ea; ctx.fill();
        if (tw > 0.7) {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff"; ctx.globalAlpha = ea; ctx.fill();
        }
        ctx.globalAlpha = 1; return true;
      });

      ctx.globalCompositeOperation = "source-over";
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      ids.forEach((id) => { clearTimeout(id); clearInterval(id); });
      window.removeEventListener("resize", resize);
      particles.current = []; sparklers.current = []; rockets.current = [];
    };
  }, [burst, launch, spawnDust]);
}

/* ─────────────── Stars Background ─────────────── */
function Stars() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 137.5) % 100}%`,
          top: `${(i * 79.3) % 100}%`,
          width: i % 8 === 0 ? 2.5 : 1,
          height: i % 8 === 0 ? 2.5 : 1,
          borderRadius: "50%",
          background: i % 3 === 0 ? "#ff4444" : "#ffffff",
          opacity: 0.3 + (i % 5) * 0.1,
          animation: `twinkle ${2 + (i % 3) * 0.6}s ${(i * 0.08) % 3}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────── Letter Drop ─────────────── */
function Word({ text, delay, gradient }) {
  return (
    <span style={{ display: "block" }}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{
          display: "inline-block", opacity: 0,
          fontSize: "clamp(36px,10vw,100px)", fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: gradient, backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", letterSpacing: "0.04em",
          animation: "drop .38s cubic-bezier(.23,1.5,.6,1) both",
          animationDelay: `${delay + i * 0.035}s`,
          animationFillMode: "forwards",
        }}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ─────────────── Main Launch Component ─────────────── */
export default function Launch({ onComplete }) {
  const canvasRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useFireworksEngine(canvasRef);

  useEffect(() => {
    const ids = [];
    const t = (fn, ms) => { const id = setTimeout(fn, ms); ids.push(id); };

    t(() => { setShowContent(true); }, 150);

    const TOTAL = 1400; // Snappy quick launcher animation
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / TOTAL) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 20);
    ids.push(tick);

    t(() => setExiting(true), 1100);
    t(() => onComplete?.(), 1400);

    return () => ids.forEach((id) => { clearTimeout(id); clearInterval(id); });
  }, [onComplete]);

  const handleSkip = () => {
    setExiting(true);
    setTimeout(() => onComplete?.(), 200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "#000000",
      overflow: "hidden",
      transform: exiting ? "scale(1.04)" : "scale(1)",
      opacity: exiting ? 0 : 1,
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>
      <style>{`
        @keyframes twinkle    { 0%,100%{opacity:.15} 50%{opacity:.9} }
        @keyframes drop       { 0%{opacity:0;transform:translateY(-24px) scaleX(0.8)} 100%{opacity:1;transform:translateY(0) scaleX(1)} }
        @keyframes fadeUp     { 0%{opacity:0;transform:translateY(14px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes progressGlow { 0%{box-shadow:0 0 8px #ef4444} 100%{box-shadow:0 0 20px #ef4444} }
        @keyframes sparkFade  { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.3)} }
      `}</style>

      <Stars />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }} />

      {/* Top Bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 18px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#dc2626",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.3)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#ffffff" />
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 900,
              fontSize: "clamp(12px,2vw,14px)", color: "#ffffff", letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>Deepa Crackers</div>
            <div style={{ fontSize: 9, color: "#ef4444", letterSpacing: "0.15em", fontWeight: 700 }}>
              SINCE 1985 · THIRUTHURAIPOONDI
            </div>
          </div>
        </div>

        <button onClick={handleSkip} style={{
          cursor: "pointer", background: "rgba(220,38,38,0.15)",
          border: "1px solid #ef4444", color: "#f87171",
          fontSize: 11, fontWeight: 800, padding: "5px 14px",
          borderRadius: 8, letterSpacing: "0.08em", textTransform: "uppercase",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,38,38,0.15)"; e.currentTarget.style.color = "#f87171"; }}
        >
          Skip
        </button>
      </div>

      {/* Center Content */}
      {showContent && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 9,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "0 20px", textAlign: "center",
          pointerEvents: "none",
          gap: 8,
        }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              padding: "6px",
              width: "clamp(64px, 12vw, 88px)",
              height: "clamp(64px, 12vw, 88px)",
              border: "2px solid rgba(255,255,255,0.4)",
              margin: "0 0 12px",
              boxShadow: "0 0 30px rgba(220,38,38,0.45)",
              animation: "fadeUp .3s .02s ease both",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="/logo.png"
              alt="Deepa Firecracker Shop"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <p style={{
            fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 700,
            fontSize: "clamp(10px,1.8vw,12px)", color: "#ef4444",
            letterSpacing: "0.28em", textTransform: "uppercase", margin: "0 0 8px",
            animation: "fadeUp .3s .05s ease both", opacity: 0, animationFillMode: "forwards",
          }}>
            Illuminating Every Celebration
          </p>

          <h1 style={{ margin: "0 0 6px", lineHeight: 1.0 }}>
            <Word text="DEEPA" delay={0.06}
              gradient="linear-gradient(135deg, #ffffff 0%, #ff4444 40%, #dc2626 80%, #ffffff 100%)" />
            <Word text="CRACKERS" delay={0.18}
              gradient="linear-gradient(135deg, #ffffff 0%, #ef4444 50%, #dc2626 80%, #ffffff 100%)" />
          </h1>

          <p style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "clamp(11px,1.9vw,14px)", color: "#a3a3a3",
            letterSpacing: "0.02em", maxWidth: 380, lineHeight: 1.6,
            margin: "8px 0 14px",
            animation: "fadeUp .4s .3s ease both", opacity: 0, animationFillMode: "forwards",
          }}>
            Supreme quality fireworks — direct from Sivakasi.
          </p>

          <div style={{
            marginTop: 10,
            animation: "fadeUp .4s .5s ease both", opacity: 0, animationFillMode: "forwards",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 20px", borderRadius: 8,
              border: "1px solid #dc2626",
              background: "rgba(127,29,29,0.2)",
              color: "#ffffff", fontSize: 11, fontWeight: 800,
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              <span style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#ef4444",
                    display: "inline-block",
                    animation: `sparkFade 0.8s ${i * 0.2}s ease-in-out infinite alternate`,
                    boxShadow: "0 0 6px #ef4444",
                  }} />
                ))}
              </span>
              Entering Store
            </div>
          </div>
        </div>
      )}

      {/* Bottom Progress Bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
        paddingTop: 20,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "4px 20px 6px",
          fontSize: 9, color: "#525252",
          fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          <span>Loading Catalog</span>
          <span style={{ color: progress > 80 ? "#ef4444" : "#525252" }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 3, background: "#171717", position: "relative", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #7f1d1d, #dc2626, #ef4444, #ffffff)",
            transition: "width .05s linear",
            animation: "progressGlow 1s ease-in-out infinite alternate",
          }} />
          <div style={{
            position: "absolute", top: -3, left: `${progress}%`,
            width: 8, height: 8, borderRadius: "50%",
            background: "#ffffff", boxShadow: "0 0 10px #ef4444",
            transform: "translateX(-50%)",
            transition: "left .05s linear",
            display: progress > 1 ? "block" : "none",
          }} />
        </div>
      </div>
    </div>
  );
}

