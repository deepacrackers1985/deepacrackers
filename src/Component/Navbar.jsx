import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Phone, Home, ShieldCheck, Truck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Clean unified professional navigation links (Red / Black / White theme)
const NAV_LINKS = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "About Us",
    path: "/about-us",
    icon: Sparkles,
  },
  {
    name: "Track Order",
    path: "/status",
    icon: Truck,
  },
  {
    name: "Safety Tips",
    path: "/safety-tips",
    icon: ShieldCheck,
  },
  {
    name: "Contact Us",
    path: "/contact-us",
    icon: Phone,
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-3 left-3 right-3 z-50 rounded-2xl md:rounded-3xl px-4 md:px-6 py-2.5 mx-auto max-w-7xl w-[calc(100%-1.5rem)] backdrop-blur-2xl transition-all duration-300"
      style={{
        background: "rgba(10, 10, 10, 0.96)",
        border: "1.5px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 15px 45px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* 3-Column Professional Header Layout */}
      <div className="flex items-center justify-between w-full gap-3">
        {/* Left Side: Brand Logo with clearly readable image text + restored previous text */}
        <div className="flex-1 flex items-center justify-start">
          <div
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            {/* Real Logo Image — square and focused on lettering */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl bg-white p-1 flex items-center justify-center border border-white/40 shadow-md group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.35)] transition-all shrink-0 overflow-hidden">
              <img
                src="/logo.png"
                alt="Deepa Firecracker Shop"
                className="w-full h-full object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            {/* Restored Previous Brand Text */}
            <div className="flex flex-col justify-center whitespace-nowrap">
              <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white group-hover:text-red-500 transition-colors leading-none">
                DEEPA CRACKERS
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-red-500 tracking-wider uppercase mt-1 leading-none">
                Since 1984 • Sivakasi
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Links (Red / White / Black Theme) */}
        <div className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2 shrink-0">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => handleNavigate(link.path)}
                className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500 scale-105"
                    : "text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent"
                  }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white stroke-[2.5]" : "text-neutral-400"}`} />
                <span>{link.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Quick Action Call & Mobile Hamburger */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <a
            href="tel:+918072897834"
            className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-md shadow-red-600/25"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px] font-bold">+91 8072 897 834</span>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl border transition-all active:scale-95 cursor-pointer"
            style={{
              background: menuOpen ? "rgba(220, 38, 38, 0.2)" : "rgba(255, 255, 255, 0.05)",
              borderColor: menuOpen ? "rgba(220, 38, 38, 0.6)" : "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              boxShadow: menuOpen ? "0 0 15px rgba(220, 38, 38, 0.3)" : "none",
            }}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="h-5 w-5 text-red-400" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden pt-3 mt-3 border-t border-white/10 space-y-2"
          >
            <div className="grid grid-cols-1 gap-1.5">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavigate(link.path)}
                    className={`w-full py-2.5 px-4 text-left text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-between ${isActive
                        ? "bg-red-600 text-white border border-red-500 shadow-md shadow-red-600/25"
                        : "bg-neutral-900 text-neutral-200 border border-white/10 hover:border-white/30"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                      <span>{link.name}</span>
                    </div>
                    {isActive ? (
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black text-white border border-white/20">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-neutral-500">→</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Direct Call & Genuine Sivakasi Assurance in Mobile Drawer */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:+918072897834"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-md shadow-red-600/20"
              >
                <Phone className="h-4 w-4" />
                <span>Call Us: +91 8072 897 834</span>
              </a>

              <div className="text-center py-1 flex items-center justify-center gap-1.5 text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-semibold tracking-wide text-neutral-300">
                  100% Genuine Sivakasi Crackers • Factory Direct Sourcing
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}