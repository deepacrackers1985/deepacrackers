import React, { useState, useRef } from "react";
import { Copy, Check, Sparkles, X, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Multi-point Random Firework Explosion Component
const MultiRandomFireworkBurst = () => {
  const isMob = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  // Multiple randomized burst locations across the display (Red and White palette)
  const burstLocations = [
    { x: screenWidth * 0.5, y: screenHeight * 0.35, color: "#dc2626", scale: 1.1, delay: 0 },
    { x: screenWidth * 0.25, y: screenHeight * 0.28, color: "#ffffff", scale: 0.9, delay: 0.15 },
    { x: screenWidth * 0.75, y: screenHeight * 0.32, color: "#ef4444", scale: 0.95, delay: 0.28 },
    { x: screenWidth * 0.4, y: screenHeight * 0.52, color: "#b91c1c", scale: 0.85, delay: 0.4 },
    { x: screenWidth * 0.65, y: screenHeight * 0.48, color: "#ffffff", scale: 0.9, delay: 0.5 },
  ];

  const particleCount = isMob ? 14 : 22;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {burstLocations.map((burst, bIdx) => (
        <motion.div
          key={`burst-${bIdx}`}
          className="absolute"
          style={{ left: burst.x, top: burst.y, transform: "translate(-50%, -50%)" }}
        >
          {/* Radial Firework Particles */}
          {Array.from({ length: particleCount }).map((_, i) => {
            const angle = i * (360 / particleCount) * (Math.PI / 180);
            const dist = (isMob ? 100 : 180) * burst.scale;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            const particleColor = i % 3 === 0 ? "#ffffff" : burst.color;

            return (
              <motion.div
                key={`p-${bIdx}-${i}`}
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  background: particleColor,
                  boxShadow: `0 0 10px ${particleColor}, 0 0 4px #ffffff`,
                  willChange: "transform, opacity",
                }}
                animate={{
                  x: [0, x * 0.3, x * 0.8, x],
                  y: [0, y * 0.3, y * 0.8, y + 12],
                  opacity: [1, 1, 0.6, 0],
                  scale: [0.8, 1.3, 0.9, 0],
                }}
                transition={{
                  duration: 2.2,
                  delay: burst.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            );
          })}

          {/* Central Flash and Halo */}
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{
              background: `radial-gradient(circle, #ffffff 0%, ${burst.color} 40%, transparent 70%)`,
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 40px ${burst.color}`,
              willChange: "transform, opacity",
            }}
            animate={{ scale: [0, 2.5, 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.8, delay: burst.delay, ease: "easeOut" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function PromoBurst({ promoCodes = [], onApplyPromo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBursted, setHasBursted] = useState(false);
  const [showPromoCard, setShowPromoCard] = useState(false);
  const [copied, setCopied] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [hasRocketBeenUsed, setHasRocketBeenUsed] = useState(false);

  const handleClick = () => {
    if (!hasBursted && !hasRocketBeenUsed) {
      setHasRocketBeenUsed(true);
      setIsOpen(true);
      setTimeout(() => {
        setHasBursted(true);
        setTimeout(() => setShowPromoCard(true), 2400);
      }, 1400);
    }
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      if (onApplyPromo) onApplyPromo(code);
      setTimeout(() => setCopied(""), 2200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (!promoCodes || promoCodes.length === 0) return null;

  return (
    <>
      {/* Sleek Floating Festival Rocket Launcher at Bottom Center */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-5 sm:bottom-6 z-40">
        <AnimatePresence>
          {!hasRocketBeenUsed && !isOpen && !hasBursted && (
            <motion.div
              key="rocket-launcher"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
              exit={{
                y: "-110vh",
                opacity: [1, 1, 0.8, 0],
                scale: [1, 1.2, 0.9, 0.4],
                rotate: 8,
                transition: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] },
              }}
              className="relative cursor-pointer flex flex-col items-center select-none"
              onClick={handleClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              whileHover={{ scale: 1.08, y: -6 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    className="absolute -top-10 bg-black/90 text-amber-300 border border-amber-500/40 text-[11px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)] whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md"
                  >
                    <span>Click to Launch Promocodes!</span> 🚀
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Modern Sleek Aerodynamic Missile/Rocket Design */}
              <motion.div
                className="relative flex flex-col items-center"
                animate={{
                  y: [-3, 3, -3],
                  rotate: [-1, 1, -1],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.8, ease: "easeInOut" }}
              >
                {/* Nose Cone Tip with glowing golden jewel */}
                <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-red-600 filter drop-shadow-[0_-2px_6px_rgba(239,68,68,0.8)] relative">
                  <div className="absolute top-[8px] -left-[3px] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#ffd700]" />
                </div>

                {/* Main Rocket Fuselage */}
                <div className="w-9 h-16 bg-gradient-to-b from-red-600 via-neutral-900 to-red-800 rounded-b-md relative border-x border-amber-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)] flex flex-col items-center justify-between py-1.5 overflow-hidden">
                  {/* Metallic Highlight Stripe */}
                  <div className="absolute left-1 top-0 bottom-0 w-1 bg-white/30 rounded-full blur-[0.5px]" />
                  
                  {/* Central Golden Diwali Badge */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border border-white flex items-center justify-center shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-black animate-spin" style={{ animationDuration: "6s" }} />
                  </div>

                  {/* Rocket Text / Decal */}
                  <span className="text-[7px] font-black text-amber-300 uppercase tracking-widest leading-none">
                    DEEPA
                  </span>

                  {/* Lower booster band */}
                  <div className="w-full h-1.5 bg-amber-400" />
                </div>

                {/* Left & Right Aerodynamic Wings / Stabilizers */}
                <div className="absolute top-10 -left-3.5 w-3.5 h-7 bg-gradient-to-bl from-red-700 to-amber-600 rounded-l-md transform -skew-y-12 border-l border-amber-400/60 shadow-md" />
                <div className="absolute top-10 -right-3.5 w-3.5 h-7 bg-gradient-to-br from-red-700 to-amber-600 rounded-r-md transform skew-y-12 border-r border-amber-400/60 shadow-md" />

                {/* Engine Exhaust Nozzle */}
                <div className="w-5 h-2.5 bg-neutral-800 rounded-b-md border-x border-b border-amber-500/40" />

                {/* Pulsing Animated Thruster Exhaust Flames */}
                <div className="relative flex flex-col items-center -mt-0.5">
                  <motion.div
                    className="w-3.5 h-7 bg-gradient-to-b from-amber-300 via-orange-500 to-transparent rounded-full blur-[1px]"
                    animate={{
                      scaleY: [0.9, 1.4, 0.9],
                      opacity: [0.85, 1, 0.85],
                      scaleX: [1, 0.85, 1],
                    }}
                    transition={{ duration: 0.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-2 h-4 bg-gradient-to-b from-white to-amber-400 rounded-full blur-[0.5px] -mt-6"
                    animate={{ opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 0.2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
              </motion.div>

              {/* Bouncing Pill */}
              <div className="mt-1 px-3 py-1 rounded-full bg-black border border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)] text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>Offers Inside</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Multi-Location Random Firework Explosions */}
      <AnimatePresence>{hasBursted && !showPromoCard && <MultiRandomFireworkBurst key="multi-burst" />}</AnimatePresence>

      {/* Compact Promocode Modal (Red / Black / White Scheme) */}
      <AnimatePresence>
        {showPromoCard && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
            onClick={() => (setIsOpen(false), setHasBursted(false), setShowPromoCard(false))}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 240, damping: 20 },
              }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl bg-black border-2 border-white p-4 sm:p-5 shadow-[0_0_50px_rgba(255,255,255,0.15)] text-white overflow-hidden"
            >
              {/* Clean red top accent */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-600" />

              {/* Close button */}
              <button
                onClick={() => (setIsOpen(false), setHasBursted(false), setShowPromoCard(false))}
                className="absolute top-3.5 right-3.5 text-neutral-400 hover:text-white p-1 rounded-full bg-neutral-900 border border-white/10 hover:border-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Compact Header */}
              <div className="flex items-center gap-2.5 mb-3.5 pr-8">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-md shrink-0">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide leading-tight">
                    Festival Promocodes
                  </h3>
                  <p className="text-[11px] text-neutral-400 leading-tight">
                    Instant wholesale discounts on your order
                  </p>
                </div>
              </div>

              {/* Promocode Cards List */}
              <div className="space-y-2.5 max-h-[58vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-700">
                {promoCodes.map((promo, i) => (
                  <motion.div
                    key={promo.id || i}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-white/15 hover:border-white transition-all duration-200 flex items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-black text-white text-sm tracking-wider">
                          {promo.code}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white uppercase tracking-wider">
                          {promo.discount}% OFF
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        {promo.min_amount && (
                          <span>Min: ₹{promo.min_amount}</span>
                        )}
                        {promo.end_date && (
                          <span>• Exp: {formatDate(promo.end_date)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(promo.code)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/15 text-white text-[11px] font-bold transition flex items-center gap-1"
                        title="Copy code"
                      >
                        {copied === promo.code ? (
                          <>
                            <Check className="w-3 h-3 text-red-500" />
                            <span className="text-red-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-neutral-300" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          handleCopy(promo.code);
                          setIsOpen(false);
                          setHasBursted(false);
                          setShowPromoCard(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-black shadow-md transition"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
