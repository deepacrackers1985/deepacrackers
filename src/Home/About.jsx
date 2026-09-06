import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Package, Users, ShieldCheck, Shield, Eye, Target, ArrowRight, Phone, MapPin, CheckCircle2 } from "lucide-react";
import PageShell from "./PageShell";

/* ── Counter component ── */
function Counter({ to, suffix = "", duration = 2 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Value Cards Data (Red/Black/White) ── */
const VALUES = [
  {
    title: "Our Motto",
    icon: Shield,
    num: "01",
    content: "SAFETY FIRST. Deepa Crackers adheres to stringent quality testing measures and strict safety standards defined by the Indian Explosives Act.",
  },
  {
    title: "Our Vision",
    icon: Eye,
    num: "02",
    content: "To make authentic, factory-direct Sivakasi fireworks easily accessible across Thiruthuraipoondi and all parts of Tamil Nadu with total price transparency.",
  },
  {
    title: "Our Mission",
    icon: Target,
    num: "03",
    content: "Respect customer benefit, maximum safety, superior firework quality, reliable dispatch, and fair wholesale/retail pricing 365 days a year.",
  },
];

/* ── Stats Data (Red/Black/White) ── */
const STATS = [
  { value: 40, suffix: "+", label: "Years of Trust", icon: Award },
  { value: 500, suffix: "+", label: "Products in Stock", icon: Package },
  { value: 10000, suffix: "+", label: "Happy Customers", icon: Users },
  { value: 100, suffix: "%", label: "Direct Sourced", icon: ShieldCheck },
];

const TAG_PILLS = [
  "Legal Certified",
  "Direct Sivakasi Factory",
  "Wholesale Pricing",
  "Quality Tested",
  "365 Days Available",
];

export default function About() {
  return (
    <PageShell>
      <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-16">

        {/* ── HERO ── */}
        <section className="text-center space-y-5 pt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-red-600 text-white border border-red-500 shadow-md shadow-red-600/20">
              Since 1984
            </span>
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-neutral-900 text-neutral-300 border border-white/20">
              Thiruthuraipoondi
            </span>
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-neutral-900 text-neutral-300 border border-white/20">
              Sivakasi Direct
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
              ABOUT <span className="text-red-600">DEEPA CRACKERS</span>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
              Direct factory sourcing from the firework capital of Sivakasi straight to families and businesses across Tamil Nadu.
            </p>
          </div>

          {/* Clean Red Divider */}
          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto pt-2">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-red-600" />
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-red-600" />
          </div>
        </section>

        {/* ── BANNER IMAGE (desktop) ── */}
        <div className="hidden md:block w-full h-64 overflow-hidden rounded-3xl relative border border-white/20 bg-black shadow-2xl">
          <div className="h-[3px] w-full bg-red-600 absolute top-0 z-10" />
          <img src="/aboutbanner.png" alt="About Deepa Firecracker Shop" className="w-full h-full object-cover opacity-90" />
        </div>

        {/* ── STORY / ABOUT SECTION ── */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/20 bg-neutral-950 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 z-10" />
            <img src="/aboutimage.jpg" alt="Deepa Firecracker Shop" className="w-full h-full object-cover" />
          </div>

          {/* Text card */}
          <div className="relative rounded-3xl overflow-hidden bg-black border border-white/20 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="h-[3px] w-full bg-red-600 absolute top-0 left-0" />

            <div>
              <span className="text-[11px] font-black uppercase text-red-500 tracking-widest">
                Factory Direct Sourcing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                40 Years of Explosive Trust
              </h2>
              <p className="text-xs font-semibold text-neutral-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>RS Road, Thiruthuraipoondi, Tamil Nadu</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Deepa Firecracker Shop is a landmark destination for certified fireworks, ground chakkars, sparklers, and multi-color sky shots in Thiruthuraipoondi. For four decades, we have removed middlemen and brokers to bring authentic Sivakasi factory wholesale rates directly to customers.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Every batch undergoes strict quality verification for reliable fuses, vivid aerial bursts, and full statutory safety compliance.
            </p>

            {/* Tag pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {TAG_PILLS.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white border border-white/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-red-500" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="tel:+918072897834"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md shadow-red-600/30"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us: +91 8072 897 834</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── STATS GRID ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-red-600" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
              By The Numbers
            </h2>
            <div className="h-[2px] flex-1 bg-neutral-800" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden bg-black border border-white/20 p-5 text-center space-y-2 shadow-lg"
                >
                  <div className="h-1 w-full bg-red-600 absolute top-0 left-0" />
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-red-500 mx-auto">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── VALUES (Motto / Vision / Mission) ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-red-600" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
              Our Core Principles
            </h2>
            <div className="h-[2px] flex-1 bg-neutral-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden bg-black border border-white/20 p-6 space-y-3 shadow-lg"
                >
                  <div className="h-1 w-full bg-red-600 absolute top-0 left-0" />
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-red-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-black text-neutral-500">
                      {v.num}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    {v.title}
                  </h3>
                  <div className="h-[1px] w-12 bg-red-600" />
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {v.content}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA / FESTIVE BANNER ── */}
      </div>

      <style>{`
        @keyframes blast {
          0% { transform: scale(0.3); opacity: 1; }
          60% { transform: scale(1.8); opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glowPulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; box-shadow: inherit; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
        }
      `}</style>
    </PageShell>
  );
}