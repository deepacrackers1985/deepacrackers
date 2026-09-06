import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Factory, Truck, Store, MapPin, Play, Pause } from 'lucide-react';

const processSteps = [
  {
    id: 1,
    stepNum: "படி 1 (Step 1)",
    badge: "1. நேரடி தொழிற்சாலை கொள்முதல்",
    title: "சிவகாசி தொழிற்சாலையிலிருந்து நேரடி உற்பத்தி",
    titleEng: "Direct Sourcing from Sivakasi Factory",
    icon: "🏭",
    tamilDesc: "சிவகாசியில் உள்ள முன்னணி மற்றும் அங்கீகரிக்கப்பட்ட தொழிற்சாலைகளில் இருந்து மிகக் குறைந்த விலையில் தரமான பட்டாசுகள் நேரடியாக கொள்முதல் செய்யப்படுகின்றன. இடைத்தரகர்கள் எவரும் இல்லை!",
    englishDesc: "Premium quality crackers sourced directly from certified Sivakasi manufacturers with 0% middlemen markup.",
    gradient: "from-amber-500 via-orange-500 to-red-600",
    glowColor: "rgba(245, 158, 11, 0.4)",
    stats: "80% நேரடி சேமிப்பு (80% Direct Savings)",
  },
  {
    id: 2,
    stepNum: "படி 2 (Step 2)",
    badge: "2. லாரிகள் மூலம் மொத்த போக்குவரத்து",
    title: "சட்டப்பூர்வ பாதுகாப்புடன் மொத்தமாக லாரிகளில் திருத்துறைப்பூண்டி வருகை",
    titleEng: "Bulk Legal Transport directly to Thiruthuraipoondi",
    icon: "🚛",
    tamilDesc: "ஒவ்வொரு வாடிக்கையாளருக்கும் தனித்தனியாக கூரியர் அனுப்பாமல், உரிய வெடிபொருள் உரிமம் மற்றும் அரசு அனுமதியுடன் மொத்தமாக லாரிகளில் திருத்துறைப்பூண்டிக்கு கொண்டு வரப்படுகிறது.",
    englishDesc: "Cracker consignments transported legally in bulk directly to our Thiruthuraipoondi hub in strict explosive act compliance.",
    gradient: "from-cyan-500 via-blue-600 to-indigo-600",
    glowColor: "rgba(6, 182, 212, 0.4)",
    stats: "100% சட்டப்பூர்வ அனுமதி (100% Legal Route)",
  },
  {
    id: 3,
    stepNum: "படி 3 (Step 3)",
    badge: "3. திருத்துறைப்பூண்டி சேமிப்பு & விநியோகம்",
    title: "திருத்துறைப்பூண்டி தீபா ஸ்டோரில் பாதுகாப்பான சேமிப்பு & சரிபார்ப்பு",
    titleEng: "Safe Storage & Inspection at Deepa Thiruthuraipoondi Hub",
    icon: "🏬",
    tamilDesc: "திருத்துறைப்பூண்டி மெயின் ரோட்டில் அமைந்துள்ள தீபா பட்டாஸ் கிடங்கில் ஒவ்வொரு பெட்டியும் சரிபார்க்கப்பட்டு, வாடிக்கையாளர்களின் ஆர்டரின்படி பாதுகாப்பாக பிரிக்கப்படுகிறது.",
    englishDesc: "Every order meticulously packed and inspected at our RS Road Thiruthuraipoondi outlet.",
    gradient: "from-emerald-500 via-teal-600 to-green-700",
    glowColor: "rgba(16, 185, 129, 0.4)",
    stats: "நேரடி கடையில் பெறலாம் (Direct Store Pickup Available)",
  },
  {
    id: 4,
    stepNum: "படி 4 (Step 4)",
    badge: "4. வாடிக்கையாளர் கைகளுக்கு நேரடி விநியோகம்",
    title: "உங்கள் இல்லத்திற்கே பாதுகாப்பான நேரடி விநியோகம்",
    titleEng: "Safe Doorstep Handover & Express Delivery across TN",
    icon: "🎁",
    tamilDesc: "திருத்துறைப்பூண்டி மற்றும் தமிழகத்தின் அனைத்து பகுதிகளுக்கும் பதிவு செய்யப்பட்ட நம்பகமான போக்குவரத்து மூலம் உங்கள் கைக்கு சேதம் அடையாமல் வந்து சேர்கிறது!",
    englishDesc: "Zero-damage delivery to your doorstep or direct collection from our Thiruthuraipoondi store counter.",
    gradient: "from-fuchsia-500 via-rose-600 to-red-600",
    glowColor: "rgba(217, 70, 239, 0.4)",
    stats: "மகிழ்ச்சியான தீபாவளி கொண்டாட்டம் (Safe & Joyous Celebration)",
  },
];

export default function DirectSourcingPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const scrollContainerRef = useRef(null);

  // Auto progression every 5 seconds if enabled
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Center active step item in horizontal scroll container
  useEffect(() => {
    if (scrollContainerRef.current) {
      const stepEl = scrollContainerRef.current.children[activeStep];
      if (stepEl) {
        stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeStep]);

  const current = processSteps[activeStep];

  return (
    <section className="w-full rounded-3xl bg-neutral-900/90 backdrop-blur-md border border-white/15 shadow-2xl p-4 sm:p-8 space-y-6 overflow-hidden my-6 text-white relative">

      {/* Top rainbow line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-emerald-400 via-cyan-400 to-rose-500" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dashed border-neutral-700 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>எங்கள் விநியோக செயல்முறை • OUR SOURCING PROCESS</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-white via-amber-200 to-rose-200 bg-clip-text text-transparent tracking-tight">
            தீபா பட்டாஸ் இயங்கும் முறை (Click Next / Scroll to View) 🚚
          </h2>
          <p className="text-xs text-neutral-300 mt-1">
            தொழிற்சாலையிலிருந்து உங்கள் கைக்கு பட்டாசு எப்படி வருகிறது என்று அடுத்தடுத்த படிகளில் கிளிக் செய்து பாருங்கள்!
          </p>
        </div>

        {/* Auto Play & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold shadow-md flex items-center gap-1.5 transition-all ${isAutoPlaying ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 font-black" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700"
              }`}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
            <span>{isAutoPlaying ? "நிறுத்து (Pause)" : "தானாக இயக்கு (Auto Play)"}</span>
          </button>
        </div>
      </div>

      {/* Stepper Tabs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {processSteps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveStep(idx);
              setIsAutoPlaying(false);
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 text-center ${activeStep === idx
                ? `bg-gradient-to-r ${s.gradient} text-white border-white/40 font-black shadow-lg scale-102`
                : "bg-neutral-800/80 border-neutral-700/80 text-neutral-300 hover:border-amber-400/40 hover:bg-neutral-700"
              }`}
            style={{
              boxShadow: activeStep === idx ? `0 0 20px ${s.glowColor}` : 'none'
            }}
          >
            <span className="text-base">{s.icon}</span>
            <span className="text-[11px] font-bold line-clamp-1">{s.badge}</span>
          </button>
        ))}
      </div>

      {/* Main Process Card Viewer */}
      <div className="relative bg-black rounded-2xl border border-neutral-800 shadow-xl p-5 sm:p-8 overflow-hidden">

        {/* Step Progress Line Bar */}
        <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-6 border border-neutral-700">
          <motion.div
            className={`h-full bg-gradient-to-r ${current.gradient} transition-all duration-300`}
            style={{ width: `${((activeStep + 1) / processSteps.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            {/* Left Icon Display */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center shadow-inner">
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr ${current.gradient} flex items-center justify-center text-5xl shadow-xl mb-3 animate-bounce`}
                style={{ boxShadow: `0 0 30px ${current.glowColor}` }}
              >
                {current.icon}
              </div>
              <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white font-black text-xs">
                {current.stepNum}
              </span>
            </div>

            {/* Right Details Text */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${current.gradient} text-white font-black text-xs shadow-sm`}>
                  {current.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
                  {current.title}
                </h3>
                <p className="text-xs font-bold text-amber-300 italic">
                  En: {current.titleEng}
                </p>
              </div>

              {/* Tamil Explanation Box */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 shadow-inner">
                <p className="text-xs sm:text-sm font-semibold text-neutral-200 leading-relaxed">
                  "{current.tamilDesc}"
                </p>
              </div>

              {/* English Subtitle Box */}
              <p className="text-xs text-neutral-400 italic border-l-2 border-amber-400 pl-3">
                "{current.englishDesc}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-dashed border-neutral-800 pt-5 mt-6 gap-3">
          <button
            onClick={() => {
              setActiveStep((prev) => (prev === 0 ? processSteps.length - 1 : prev - 1));
              setIsAutoPlaying(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>முந்தையது (Previous)</span>
          </button>

          <span className="text-xs font-black bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
            {activeStep + 1} / {processSteps.length}
          </span>

          <button
            onClick={() => {
              setActiveStep((prev) => (prev + 1) % processSteps.length);
              setIsAutoPlaying(false);
            }}
            className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${current.gradient} hover:scale-105 text-white font-black text-xs shadow-lg flex items-center gap-2 transition-all border border-white/30`}
          >
            <span>அடுத்தது (Click Next)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Horizontal Scrollable Step Cards */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-neutral-400">
          👇 அல்லது கிடைமட்டமாக ஸ்க்ரோல் செய்து பார்க்கவும் (Or Scroll Horizontally to View All):
        </p>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin snap-x snap-mandatory"
        >
          {processSteps.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setActiveStep(idx);
                setIsAutoPlaying(false);
              }}
              className={`min-w-[260px] sm:min-w-[300px] p-4 rounded-2xl border cursor-pointer snap-center transition-all ${activeStep === idx ? `bg-neutral-800 border-amber-400 shadow-lg scale-102` : "bg-black border-neutral-800 hover:border-neutral-700"
                }`}
              style={{
                boxShadow: activeStep === idx ? `0 0 20px ${s.glowColor}` : 'none'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{s.icon}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-gradient-to-r ${s.gradient} text-white`}>
                  {s.stepNum}
                </span>
              </div>
              <h4 className="text-xs font-black text-white line-clamp-1">{s.badge}</h4>
              <p className="text-[11px] font-medium text-neutral-400 line-clamp-2 mt-1">
                {s.tamilDesc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Key Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-amber-500/20 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center text-xl shrink-0 shadow-sm font-bold">
            🚫
          </div>
          <div>
            <h4 className="text-xs font-black text-white">0% இடைத்தரகர் கமிஷன்</h4>
            <p className="text-[10px] text-amber-300">0% Middlemen Commission</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-emerald-500/20 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center text-xl shrink-0 shadow-sm font-bold">
            ⚖️
          </div>
          <div>
            <h4 className="text-xs font-black text-white">100% சட்டப்பூர்வ பாதுகாப்பு</h4>
            <p className="text-[10px] text-emerald-300">100% Supreme Court Legal Compliance</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-rose-500/20 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-fuchsia-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm font-bold">
            💰
          </div>
          <div>
            <h4 className="text-xs font-black text-white">80% நேரடி தொழிற்சாலை சேமிப்பு</h4>
            <p className="text-[10px] text-rose-300">80% Factory Direct Savings</p>
          </div>
        </div>
      </div>

    </section>
  );
}
