import React from 'react';
import { motion } from 'framer-motion';

export default function WhatsAppButton({ hasActiveCart = false }) {
  const phoneNumber = "918072897834";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  const instagramUrl = "https://www.instagram.com/deepa_crackers/";

  return (
    <motion.aside
      aria-label="Social Quick Connect"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`fixed z-50 flex flex-col items-center gap-2.5 sm:gap-3.5 transition-all duration-300 ${
        hasActiveCart ? 'bottom-24 right-3.5 sm:bottom-28 sm:right-6' : 'bottom-5 right-3.5 sm:bottom-6 sm:right-6'
      }`}
    >
      {/* Instagram Button */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Deepa Crackers on Instagram @deepa_crackers"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-black text-white hover:bg-red-600 shadow-[0_4px_20px_rgba(0,0,0,0.8)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 transition-all border-2 border-white"
      >
        {/* Official Instagram SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-6 sm:h-6 fill-current z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>

        {/* Hover Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none hidden sm:flex items-center gap-1.5 border border-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          <span>Follow @deepa_crackers on Instagram</span>
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Deepa Crackers on WhatsApp"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_20px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 transition-all border-2 border-white"
      >
        {/* Official WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-6 sm:h-6 fill-current z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 2C6.505 2 2.016 6.49 2.016 12.016c0 1.94.558 3.754 1.523 5.295L2.001 22.016l4.887-1.493a9.98 9.98 0 0 0 5.143 1.493c5.525 0 10.015-4.49 10.015-10.016C22.046 6.49 17.556 2 12.031 2zm5.79 14.28c-.24.67-1.39 1.3-1.92 1.38-.5.08-1.14.12-3.7-0.94-3.14-1.3-5.16-4.51-5.32-4.72-.16-.21-1.27-1.69-1.27-3.23 0-1.54.81-2.3 1.09-2.61.28-.31.62-.39.83-.39.21 0 .42 0 .6.01.19.01.44-.07.69.53.25.6.86 2.09.93 2.24.07.16.12.34.02.54-.1.21-.15.34-.3.51-.15.18-.32.4-.46.54-.15.15-.31.32-.13.63.18.31.8 1.32 1.72 2.14 1.18 1.05 2.17 1.37 2.48 1.53.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.16.29.1 1.82.86 2.13 1.01.31.16.52.23.6.36.08.14.08.79-.16 1.46z" />
        </svg>

        {/* Hover Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none hidden sm:flex items-center gap-1.5 border border-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          <span>Chat on WhatsApp (+91 8072 897 834)</span>
        </span>
      </a>
    </motion.aside>
  );
}
