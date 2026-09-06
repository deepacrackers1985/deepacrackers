import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Award, Zap, Flame, Rocket, Star } from "lucide-react";

export default function SpatialStage3D() {
  const highlights = [
    {
      icon: Sparkles,
      title: "Direct Sivakasi",
      subtitle: "0% Middlemen Markup",
      color: "from-amber-500 to-yellow-400",
      glow: "rgba(245, 158, 11, 0.4)",
    },
    {
      icon: Shield,
      title: "100% Legal & Safe",
      subtitle: "Supreme Court Compliant",
      color: "from-emerald-500 to-teal-400",
      glow: "rgba(16, 185, 129, 0.4)",
    },
    {
      icon: Award,
      title: "Wholesale Rates",
      subtitle: "Up to 80% Factory Savings",
      color: "from-red-600 to-rose-500",
      glow: "rgba(239, 68, 68, 0.4)",
    },
    {
      icon: Zap,
      title: "Instant Estimate Bill",
      subtitle: "Auto PDF Download",
      color: "from-cyan-500 to-blue-400",
      glow: "rgba(6, 182, 212, 0.4)",
    },
  ];

  return (
    <div className="relative w-full my-6 select-none" style={{ perspective: "1200px" }}>
      {/* 3D Depth Grid Backdrop & Ambient Radial Flare */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 via-amber-500/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 z-10">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.7, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                translateY: -8,
                rotateX: -6,
                rotateY: idx % 2 === 0 ? 6 : -6,
              }}
              className="group relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-neutral-900/90 via-neutral-950/95 to-black border border-white/15 hover:border-amber-400/60 shadow-[0_12px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.2)] transition-all duration-300 transform-gpu overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* 3D Top Glow Stripe */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Floating 3D Icon Badge */}
              <div
                style={{ transform: "translateZ(30px)" }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/15 flex items-center justify-center mb-3 group-hover:border-amber-400/50 transition-all shadow-inner"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.color} flex items-center justify-center shadow-lg shadow-${item.glow}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>

              {/* Title & Subtitle with 3D Depth Layering */}
              <div style={{ transform: "translateZ(20px)" }}>
                <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 font-medium leading-tight">
                  {item.subtitle}
                </p>
              </div>

              {/* Subtle Corner Hologram Watermark */}
              <div className="absolute -bottom-2 -right-2 text-white/5 group-hover:text-amber-400/10 transition-colors pointer-events-none">
                <Star className="w-14 h-14" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
