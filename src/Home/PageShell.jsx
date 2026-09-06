import React from "react";
import Navbar from "../Component/Navbar";
import BackgroundFireworks from "../Component/BackgroundFireworks";
import WhatsAppButton from "../Component/WhatsAppButton";
import { Phone, Mail, MapPin } from "lucide-react";

// ── Shared Page Layout Shell (Red / Black / White Scheme) ─────
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Track Order", href: "/status" },
  { label: "Safety Tips", href: "/safety-tips" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

function Footer() {
  return (
    <footer
      className="relative mx-3 sm:mx-4 mb-6 mt-8 rounded-3xl overflow-hidden bg-black border border-white/15"
      style={{
        boxShadow: "0 -4px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Clean Red top bar */}
      <div
        className="h-[3px] w-full bg-red-600"
        style={{ boxShadow: "0 0 16px rgba(220,38,38,0.6)" }}
      />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white p-1 border border-white/40 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="Deepa Firecracker Shop"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base font-black text-white block leading-none">
                DEEPA CRACKERS
              </span>
              <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase mt-1 block leading-none">
                Since 1984 • Sivakasi
              </span>
            </div>
          </div>
          <div className="h-[2px] w-16 mb-3 bg-red-600" />
          <p className="text-neutral-400 text-xs leading-relaxed mb-2">
            Direct Sivakasi wholesale fireworks for every festive occasion.
          </p>
          <p className="text-neutral-300 text-xs font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>RS Road, Thiruthuraipoondi, Tamil Nadu</span>
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-black text-white mb-1 uppercase tracking-widest">Contact Us</h3>
          <div className="h-[2px] w-12 mb-3 bg-red-600" />
          <p className="text-xs text-neutral-400">RS Road, Thiruthuraipoondi,</p>
          <p className="text-xs text-neutral-400">Tamil Nadu, India</p>
          <a
            href="tel:+918072897834"
            className="text-xs font-bold text-white hover:text-red-500 flex items-center gap-1.5 mt-3 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-red-500" />
            <span>+91 8072 897 834</span>
          </a>
          <a
            href="mailto:deepatraders1985@gmail.com"
            className="text-xs font-medium text-neutral-300 hover:text-white flex items-center gap-1.5 mt-2 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-red-500" />
            <span>deepatraders1985@gmail.com</span>
          </a>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-black text-white mb-1 uppercase tracking-widest">Quick Navigation</h3>
          <div className="h-[2px] w-12 mb-3 bg-red-600" />
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-xs text-neutral-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 transition-colors group-hover:bg-white" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom copyright and legal notice */}
      <div
        className="border-t py-5 text-center text-xs text-neutral-400 space-y-2"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <p className="max-w-4xl mx-auto leading-relaxed text-[11px] sm:text-xs text-neutral-400 px-4">
          As per 2018 Supreme Court order, online sale of firecrackers are not permitted! We value our customers and respect jurisdiction. Please add your products to cart and submit enquiries. We will contact you within 24 hrs.
        </p>
        <p className="text-neutral-500 text-[11px]">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold text-white">Deepa Firecracker Shop</span>
          {" "}— Thiruthuraipoondi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-hidden relative selection:bg-red-600 selection:text-white">
      {/* Background Fireworks (Red & White) */}
      <BackgroundFireworks />

      {/* Subtle Red Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-0 -right-32 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>

      <WhatsAppButton />
    </div>
  );
}

