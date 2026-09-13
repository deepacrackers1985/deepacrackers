import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Gift,
} from "lucide-react";

export default function AmazonDiscountBanner({
  banners = [],
  onSelectCombo = () => {},
  onSelectCategory = () => {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolledAway, setIsScrolledAway] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef(null);

  // Responsive dimensions for Mobile (1 card) vs Laptop/Desktop (3 cards)
  const [dimensions, setDimensions] = useState({
    cardWidth: 380,
    cardHeight: 550,
    gap: 20,
    isMobile: false,
  });

  // Dynamically calculate sizing based on container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateDimensions = () => {
      const w = el.offsetWidth || window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);

      let cardW = 380;
      let gap = 20;

      if (w < 400) {
        cardW = Math.round(w * 0.92);
        gap = 0;
      } else if (w < 640) {
        cardW = Math.round(w * 0.88);
        gap = 0;
      } else if (w < 768) {
        cardW = Math.min(390, Math.round(w * 0.85));
        gap = 0;
      } else if (w < 1024) {
        // Laptop / Tablet: 3 cards visible
        cardW = 340;
        gap = 18;
      } else {
        // Desktop: 3 cards visible
        cardW = 370;
        gap = 22;
      }

      // Portrait height ~ 1.46 ratio (matching portrait combo artwork)
      const cardH = Math.round(cardW * 1.46);

      setDimensions({
        cardWidth: cardW,
        cardHeight: cardH,
        gap,
        isMobile: mobile,
      });
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(el);
    window.addEventListener("resize", updateDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Pause banner slides whenever user scrolls away from the banner
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        setIsScrolledAway(!visible);
      },
      { threshold: [0, 0.35, 0.7, 1] }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Filtered banners list
  const originalList = useMemo(() => {
    if (!banners || banners.length === 0) return [];
    return banners;
  }, [banners]);

  const total = originalList.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => prev + 1);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => prev - 1);
  }, [total]);

  const goToSlide = (idx) => {
    if (total <= 1) return;
    const currentModulo = ((currentIndex % total) + total) % total;
    let diff = idx - currentModulo;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    setCurrentIndex((prev) => prev + diff);
  };

  // Auto-play timer: Smoothly auto-slides unless paused, hovered, or scrolled away
  useEffect(() => {
    if (!isPlaying || isHovered || isScrolledAway || total <= 1 || isDragging) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isScrolledAway, total, isDragging]);

  // Touch handlers for horizontal swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - touchStartX.current;
    const diffY = e.touches[0].clientY - touchStartY.current;

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipe.current) {
      if (e.cancelable) e.preventDefault();
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (isHorizontalSwipe.current) {
      setIsPlaying(false);

      if (dragOffset < -45) {
        nextSlide();
      } else if (dragOffset > 45) {
        prevSlide();
      }
    }
    setDragOffset(0);
    isHorizontalSwipe.current = null;
  };

  if (total === 0) return null;

  // Handle banner action (Book combo or open category)
  const handleBannerAction = (banner) => {
    if (!banner) return;
    if (banner.isDefaultCombo) {
      onSelectCombo(banner);
    } else if (banner.targetCategory) {
      onSelectCategory(banner.targetCategory);
      const el = document.getElementById("product-catalog-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (banner.link_url) {
      window.location.href = banner.link_url;
    } else {
      const el = document.getElementById("product-catalog-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Compute active dot index
  const activeDotIndex = ((currentIndex % total) + total) % total;

  // Offsets: [-1, 0, 1] for smooth sliding in and out
  const offsets = total === 1 ? [0] : [-1, 0, 1];

  // Reusable card inner renderer
  const renderCardInner = (banner) => (
    <div className="relative w-full h-full overflow-hidden bg-[#09090d] flex items-center justify-center">
      {banner?.image_url ? (
        <>
          {/* Subtle atmospheric blurred glow behind image */}
          <img
            src={banner.image_url}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
          />

          {/* Main High-Quality Portrait Banner Graphic */}
          <img
            src={banner.image_url}
            alt={banner.title || "Festive Diwali Combo Box"}
            className="relative z-10 w-full h-full object-contain drop-shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/logo.png";
            }}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Gift className="w-16 h-16 text-amber-500 mb-3" />
          <span className="text-sm font-bold text-white">Festive Diwali Combo</span>
        </div>
      )}

      {/* ── CARD BOTTOM CONTROLS (Pause/Play on left, Combo CTA on right) ── */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Amazon-style Play/Pause Toggle Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying((prev) => !prev);
          }}
          aria-label={isPlaying ? "Pause auto-slide" : "Play auto-slide"}
          title={isPlaying ? "Pause auto-slide" : "Play auto-slide"}
          className="pointer-events-auto w-8 h-8 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Instant Combo Booking Button (Only for combo boxes) */}
        {banner.isDefaultCombo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleBannerAction(banner);
            }}
            className="pointer-events-auto px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-xl border border-amber-300/40 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{banner.cta || "Book Combo"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden select-none py-2 sm:py-4 flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Portrait Promotional Banner Slider"
    >
      {/* ── CARD STAGE: DYNAMIC RESPONSIVE (1 card on Mobile, All 3 cards on Laptop/Desktop) ── */}
      {isMobile ? (
        /* ── MOBILE: STRICTLY 1 CARD VISIBLE (Zero side banners peeking) ── */
        <div className="relative flex items-center justify-center">
          <div
            className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/15 bg-[#0e0e14]"
            style={{
              width: `${dimensions.cardWidth}px`,
              height: `${dimensions.cardHeight}px`,
            }}
          >
            {offsets.map((offset) => {
              const virtualIndex = currentIndex + offset;
              const bannerIndex = ((virtualIndex % total) + total) % total;
              const banner = originalList[bannerIndex];
              const isCenter = offset === 0;
              const targetX = offset * dimensions.cardWidth + (isDragging ? dragOffset : 0);

              return (
                <motion.div
                  key={virtualIndex}
                  initial={false}
                  animate={{
                    x: targetX,
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={
                    isDragging
                      ? { type: "tween", duration: 0 }
                      : { type: "spring", stiffness: 220, damping: 28, mass: 0.85 }
                  }
                  onClick={() => {
                    if (Math.abs(dragOffset) > 10) return;
                    setIsPlaying(false);
                    if (isCenter) {
                      handleBannerAction(banner);
                    }
                  }}
                  style={{
                    width: `${dimensions.cardWidth}px`,
                    height: `${dimensions.cardHeight}px`,
                  }}
                  className="absolute inset-0 w-full h-full flex flex-col justify-between cursor-pointer"
                >
                  {renderCardInner(banner)}
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── LAPTOP / DESKTOP: ALL THREE CARDS VISIBLE SIDE-BY-SIDE ── */
        <div
          className="relative w-full max-w-5xl mx-auto flex items-center justify-center overflow-hidden"
          style={{ height: `${dimensions.cardHeight + 20}px` }}
        >
          {offsets.map((offset) => {
            const virtualIndex = currentIndex + offset;
            const bannerIndex = ((virtualIndex % total) + total) % total;
            const banner = originalList[bannerIndex];
            const isCenter = offset === 0;
            const stride = dimensions.cardWidth + dimensions.gap;
            const targetX = offset * stride + (isDragging ? dragOffset : 0);

            return (
              <motion.div
                key={virtualIndex}
                initial={false}
                animate={{
                  x: targetX,
                  scale: isCenter ? 1 : 0.95,
                  opacity: isCenter ? 1 : 0.85,
                }}
                transition={
                  isDragging
                    ? { type: "tween", duration: 0 }
                    : { type: "spring", stiffness: 220, damping: 28, mass: 0.85 }
                }
                onClick={() => {
                  if (Math.abs(dragOffset) > 10) return;
                  setIsPlaying(false);
                  if (isCenter) {
                    handleBannerAction(banner);
                  } else if (offset === -1) {
                    prevSlide();
                  } else if (offset === 1) {
                    nextSlide();
                  }
                }}
                style={{
                  width: `${dimensions.cardWidth}px`,
                  height: `${dimensions.cardHeight}px`,
                }}
                className={`absolute top-0 bottom-0 my-auto rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-[#0e0e14] flex flex-col justify-between cursor-pointer transition-shadow duration-300 ${
                  isCenter
                    ? "shadow-[0_12px_36px_rgba(0,0,0,0.6)] z-20"
                    : "shadow-md z-10 hover:opacity-100"
                }`}
              >
                {renderCardInner(banner)}
              </motion.div>
            );
          })}

          {/* Desktop Prev / Next Buttons */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(false);
                  prevSlide();
                }}
                aria-label="Previous slide"
                className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/80 hover:bg-red-600 text-white items-center justify-center transition-all cursor-pointer shadow-xl border border-white/20 hover:scale-110 active:scale-90 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(false);
                  nextSlide();
                }}
                aria-label="Next slide"
                className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/80 hover:bg-red-600 text-white items-center justify-center transition-all cursor-pointer shadow-xl border border-white/20 hover:scale-110 active:scale-90 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* ── BOTTOM DOTS / PILL INDICATORS ── */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 z-30">
          {originalList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                goToSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeDotIndex
                  ? "w-7 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                  : "w-2 bg-white/30 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
