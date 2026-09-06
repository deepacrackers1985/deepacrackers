import React from "react";
import { motion } from "framer-motion";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Flame, Droplets, Eye,
  Users, ShieldCheck, HeartPulse, Compass, Sparkles, FileText, Ban
} from "lucide-react";
import PageShell from "./PageShell";

/* ── Do Card ── */
function DoCard({ icon: Icon, title, description, num, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.06 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/20 hover:border-white/50 transition-all duration-300 flex flex-col justify-between"
      style={{
        boxShadow: "0 8px 30px rgba(0,0,0,0.8)",
      }}
    >
      <div className="h-1 w-full bg-red-600" />
      
      {/* Number stamp */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black bg-white/5 border border-white/15 text-white/70 font-mono">
        {num}
      </div>

      <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-600/15 border border-red-600/40 text-red-500">
              <Icon className="w-6 h-6" />
            </div>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white bg-red-600">
              ✓
            </div>
          </div>
          <h3 className="text-base font-black text-white mb-2 tracking-tight">{title}</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">{description}</p>
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-red-500">
          <CheckCircle className="w-3 h-3" /> Recommended Practice
        </div>
      </div>
    </motion.div>
  );
}

/* ── Don't Card ── */
function DontCard({ icon: Icon, title, description, num, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.06 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/20 hover:border-red-600/60 transition-all duration-300 flex flex-col justify-between"
      style={{
        boxShadow: "0 8px 30px rgba(0,0,0,0.8)",
      }}
    >
      <div className="h-1 w-full bg-red-600" />
      
      {/* Number stamp */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black bg-red-600/10 border border-red-600/30 text-red-400 font-mono">
        {num}
      </div>

      <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-600/15 border border-red-600/40 text-red-500">
              <Icon className="w-6 h-6" />
            </div>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white bg-red-600">
              ✕
            </div>
          </div>
          <h3 className="text-base font-black text-white mb-2 tracking-tight">{title}</h3>
          <p className="text-neutral-400 text-xs leading-relaxed">{description}</p>
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-red-500">
          <Ban className="w-3 h-3" /> Prohibited Action
        </div>
      </div>
    </motion.div>
  );
}

/* ── Trust Marquee (No emojis, clean Amazon/Flipkart safety standard) ── */
function TrustTicker() {
  const points = [
    "100% PESO COMPLIANT",
    "DIRECT SIVAKASI QUALITY",
    "CHILD SAFETY FIRST",
    "GREEN CRACKER CERTIFIED",
    "KEEP WATER BUCKET HANDY",
    "OUTDOOR OPEN AIR ONLY",
  ];
  return (
    <div className="relative py-4 overflow-hidden border-y border-white/15 bg-black">
      <div className="flex items-center justify-around gap-6 text-[11px] font-black tracking-widest text-white/80 overflow-x-auto no-scrollbar px-4">
        {points.map((pt, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Data ── */
const dosData = [
  { icon: CheckCircle, title: "Follow Instructions", description: "Display fireworks strictly as per the instructions printed clearly on each pack.", num: "01" },
  { icon: ShieldCheck, title: "Branded Fireworks", description: "Purchase fireworks exclusively from authorized direct Sivakasi outlets like Deepa Crackers.", num: "02" },
  { icon: Eye, title: "Outdoor Use Only", description: "Light fireworks exclusively in open, clear outdoor spaces away from buildings and dry vegetation.", num: "03" },
  { icon: Users, title: "Safe Viewing Distance", description: "Only one person ignites at a time. All viewers must observe from a safe distance.", num: "04" },
  { icon: Droplets, title: "Keep Water Handy", description: "Always keep two buckets of clean water and sand ready in case of unexpected embers or misfires.", num: "05" },
];

const dontsData = [
  { icon: Ban, title: "Never Alter Fireworks", description: "Never tamper with factory casings, combine powders, or attempt homemade modifications.", num: "01" },
  { icon: Flame, title: "Never Relight Duds", description: "Never attempt to re-ignite or immediately inspect a firework that did not discharge properly.", num: "02" },
  { icon: AlertTriangle, title: "Avoid Synthetic Clothes", description: "Never wear loose synthetic garments while lighting crackers. Wear snug cotton clothing.", num: "03" },
  { icon: XCircle, title: "Avoid Hot Debris", description: "Never pick up used casings or sparkler wires immediately after firing; allow them to cool.", num: "04" },
  { icon: Shield, title: "No Pockets or Bags", description: "Never carry fireworks, friction matches, or lighters inside shirt or pant pockets.", num: "05" },
];

export default function Safety() {
  return (
    <PageShell orbColor1="#dc2626" orbColor2="#000000" orbColor3="#ffffff">
      <div className="pt-24 pb-12 space-y-12">

        {/* ── HERO ── */}
        <section className="pt-6 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            {/* Header pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-red-600/10 border border-red-600/30 text-red-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sivakasi Safety Protocol &amp; Guidelines
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase text-white">
              Safety <span className="text-red-600">Manual</span>
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Essential precautions and safety directives for festive fireworks. Safe celebrations guarantee joyful memories for every family.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="h-px w-16 bg-white/20" />
              <div className="w-2 h-2 rounded-full bg-red-600" />
              <div className="h-px w-16 bg-white/20" />
            </div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <TrustTicker />

        {/* ── DO'S SECTION ── */}
        <section className="px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Essential Do's</h2>
                  <p className="text-xs text-neutral-400">Best practices for safe and responsible fireworks usage</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white/50 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                5 Directives
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dosData.map((item, idx) => (
                <DoCard key={idx} {...item} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ── DON'TS SECTION ── */}
        <section className="px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Crucial Don'ts</h2>
                  <p className="text-xs text-neutral-400">Prohibited actions to prevent accidents and mishaps</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white/50 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                5 Prohibitions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dontsData.map((item, idx) => (
                <DontCard key={idx} {...item} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ── STATUTORY WARNING BANNER ── */}
        <section className="px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div
              className="relative rounded-2xl overflow-hidden bg-black border-2 border-white/30 p-8 md:p-10 text-center"
              style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.9)" }}
            >
              <div className="h-1.5 w-full bg-red-600 absolute top-0 left-0 right-0" />

              <div className="inline-flex p-3 rounded-2xl bg-red-600/15 border border-red-600/40 text-red-500 mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide mb-3">
                Important Statutory Reminder
              </h3>

              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                Always prioritize family safety over celebrations. Children must always be supervised by an adult when handling sparklers or ground chakkars. Keep adequate cold water and a first-aid kit nearby at all times.
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "First Aid Kit", icon: HeartPulse },
                  { label: "Cold Water Buckets", icon: Droplets },
                  { label: "Adult Supervision", icon: Users },
                  { label: "Open Open Grounds", icon: Compass },
                ].map((t, i) => {
                  const SubIcon = t.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/5 border border-white/15 flex flex-col items-center justify-center gap-1.5 text-white"
                    >
                      <SubIcon className="w-4 h-4 text-red-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="h-1.5 w-full bg-red-600 absolute bottom-0 left-0 right-0" />
            </div>
          </div>
        </section>

      </div>
    </PageShell>
  );
}
