import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Supply chain explanation steps in Tamil + English
const EXPLAIN_STEPS = [
  {
    id: 0,
    tamilTitle: "வணக்கம்! நான் தீபா! 🙏",
    tamilText: "வணக்கம் நண்பர்களே! நான் உங்களுக்கு தீபா பட்டாஸ் எப்படி வேலை செய்கிறது என்று விளக்குகிறேன்!",
    englishText: "Hello friends! I'm Deepa! Let me explain how Deepa Crackers works for you!",
    highlight: null,
    avatarAnimation: "idle",
    emoji: "👋"
  },
  {
    id: 1,
    tamilTitle: "மற்ற கடைகள் — அதிக விலை! 😟",
    tamilText: "மற்ற கடைகளில் தொழிற்சாலை ➜ ஏஜென்ட் ➜ மொத்த வியாபாரி ➜ கடை என்று நிறைய இடைத்தரகர்கள் உள்ளனர். இதனால் விலை மிகவும் அதிகமாகிறது!",
    englishText: "In other shops: Factory → Agent → Distributor → Retailer → Customer. Many middlemen = HIGH final price!",
    highlight: "other",
    avatarAnimation: "talking",
    emoji: "📦"
  },
  {
    id: 2,
    tamilTitle: "தீபா பட்டாஸ் — நேரடி மாதிரி! ✅",
    tamilText: "தீபா பட்டாஸில் தொழிற்சாலை ➜ தீபா பட்டாஸ் ➜ வாடிக்கையாளர். இடைத்தரகர்கள் இல்லாததால் 80% வரை சேமிக்கலாம்!",
    englishText: "Deepa Crackers: Factory → Deepa → Customer directly! 80% savings guaranteed!",
    highlight: "deepa",
    avatarAnimation: "wave",
    emoji: "🏭"
  },
  {
    id: 3,
    tamilTitle: "80% வரை சேமிப்பு! 💰",
    tamilText: "இடைத்தரகர்கள் இல்லாததால், திருத்துறைப்பூண்டி தொழிற்சாலையிலிருந்து நேரடியாக 80% சேமிப்புடன் பட்டாசு வாங்கலாம்!",
    englishText: "Save up to 80% because we source directly from Thiruthuraipoondi factory with zero agent commissions!",
    highlight: "savings",
    avatarAnimation: "happy",
    emoji: "💰"
  }
];

const TOUR_STEPS = [
  {
    id: 0,
    tamilTitle: "படி 1: தேடுங்கள் 🔍",
    tamilText: "பக்கத்தில் தேடல் பெட்டியில் உங்களுக்கு வேண்டிய பட்டாசை தமிழிலோ ஆங்கிலத்திலோ தேடுங்கள்!",
    englishText: "Use the search box to find the crackers you want in Tamil or English!",
    emoji: "🔍",
    targetHint: "Search Bar"
  },
  {
    id: 1,
    tamilTitle: "படி 2: அளவை தேர்வு செய்யுங்கள் ➕",
    tamilText: "உங்கள் விருப்பமான பட்டாசு கார்டில் + பட்டன் அழுத்தி அளவை கூட்டுங்கள்!",
    englishText: "Press the + button on any product card to add quantities to your order!",
    emoji: "➕",
    targetHint: "Product + Button"
  },
  {
    id: 2,
    tamilTitle: "படி 3: விலை கணக்கீடு 🧮",
    tamilText: "தள்ளுபடி பெட்டியில் உங்கள் தள்ளுபடி குறியீட்டை (இருந்தால்) உள்ளிட்டு மொத்த தொகையை பாருங்கள்!",
    englishText: "Enter your discount code (if any) and see the total estimated price with savings!",
    emoji: "🧮",
    targetHint: "Price Calculator"
  },
  {
    id: 3,
    tamilTitle: "படி 4: ஆர்டர் செய்யுங்கள் ✅",
    tamilText: "'ஆர்டர் சமர்ப்பிக்கவும்' பட்டனை அழுத்தி உங்கள் பெயர், மொபைல் மற்றும் முகவரி கொடுங்கள். PDF பில் உடனே கிடைக்கும்!",
    englishText: "Click 'Submit Order', fill your name, mobile & address. Instant PDF bill download!",
    emoji: "✅",
    targetHint: "Submit Order Button"
  }
];

export default function TamilAvatarExplainer({ onClose }) {
  const [phase, setPhase] = useState("explain"); // "explain" | "tour"
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const autoTimer = useRef(null);

  const steps = phase === "explain" ? EXPLAIN_STEPS : TOUR_STEPS;
  const currentStep = steps[step];

  // Auto-advance steps
  useEffect(() => {
    if (isPlaying) {
      autoTimer.current = setInterval(() => {
        setStep(prev => {
          if (prev + 1 >= steps.length) {
            if (phase === "explain") {
              setPhase("tour");
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, 6000);
    }
    return () => clearInterval(autoTimer.current);
  }, [isPlaying, phase, steps.length]);

  const goNext = () => {
    clearInterval(autoTimer.current);
    if (step + 1 >= steps.length) {
      if (phase === "explain") {
        setPhase("tour");
        setStep(0);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const goPrev = () => {
    clearInterval(autoTimer.current);
    if (step > 0) setStep(s => s - 1);
    else if (phase === "tour") {
      setPhase("explain");
      setStep(EXPLAIN_STEPS.length - 1);
    }
  };

  const totalSteps = EXPLAIN_STEPS.length + TOUR_STEPS.length;
  const globalStep = phase === "explain" ? step : EXPLAIN_STEPS.length + step;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-3">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        className="w-full max-w-2xl bg-neutral-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-black border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎭</span>
            <div>
              <h3 className="text-sm font-black text-white">
                {phase === "explain" ? "தீபா பட்டாஸ் விளக்கம் (Deepa Explains)" : "🛒 புக்கிங் வழிகாட்டி (Booking Tour)"}
              </h3>
              <p className="text-[10px] font-bold text-red-500">
                {phase === "explain" ? "ஏன் தீபா பட்டாஸ் தேர்வு செய்ய வேண்டும்?" : "எப்படி ஆர்டர் செய்வது? Step-by-step"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 shadow-sm"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-neutral-300" /> : <Volume2 className="w-4 h-4 text-red-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-red-900/60 shadow-sm"
            >
              <X className="w-4 h-4 text-neutral-300" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-800 h-2 border-b border-neutral-700">
          <motion.div
            className="h-full bg-red-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((globalStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row items-center gap-0 min-h-[300px]">

          {/* Avatar Section */}
          <div className="w-full sm:w-[220px] shrink-0 bg-black border-r-0 sm:border-r border-b sm:border-b-0 border-neutral-800 relative flex items-center justify-center" style={{ minHeight: 240 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={phase + step}
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-full h-60"
              >
                <div className="w-full h-full flex flex-col items-center justify-end pb-2">
                  {/* Head */}
                  <motion.div
                    animate={isPlaying ? { rotate: [-3, 3, -3] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="relative"
                  >
                    {/* Body */}
                    <motion.div
                      animate={isPlaying ? { y: [0, -4, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      className="flex flex-col items-center"
                    >
                      {/* Face */}
                      <div className="w-20 h-20 rounded-full bg-red-600 border-2 border-white/40 shadow-md flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-700" />
                        <div className="relative z-10 text-4xl select-none">
                          {phase === "explain" 
                            ? (step === 0 ? "👩🏽" : step === 1 ? "😟" : step === 2 ? "😊" : "🤩")
                            : (step === 0 ? "🔍" : step === 1 ? "😊" : step === 2 ? "🧮" : "✅")
                          }
                        </div>
                      </div>
                      {/* Body */}
                      <div className="w-16 h-20 rounded-b-2xl bg-gradient-to-b from-neutral-900 to-black border-2 border-t-0 border-white/20 shadow-md flex items-center justify-center relative overflow-hidden mt-[-4px]">
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-red-600 border-t border-white/30" />
                        <span className="text-2xl relative z-10">👐</span>
                      </div>
                      {/* Legs */}
                      <div className="flex gap-2 mt-1">
                        <motion.div
                          animate={isPlaying ? { y: [0, -5, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                          className="w-6 h-8 rounded-b-xl bg-neutral-800 border border-neutral-700 shadow-sm"
                        />
                        <motion.div
                          animate={isPlaying ? { y: [0, -5, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                          className="w-6 h-8 rounded-b-xl bg-neutral-800 border border-neutral-700 shadow-sm"
                        />
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Phase badge */}
                  <span className="mt-2 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                    {phase === "explain" ? "தீபா 👩🏽" : "வழிகாட்டி 🧭"}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Speech Bubble / Text Area */}
          <div className="flex-1 p-5 space-y-4">
            {/* Phase Toggle Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => { setPhase("explain"); setStep(0); clearInterval(autoTimer.current); }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all shadow-md ${
                  phase === "explain" ? "bg-red-600 text-white border-red-500" : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700"
                }`}
              >
                🎭 ஏன் தீபா? (Why Deepa?)
              </button>
              <button
                onClick={() => { setPhase("tour"); setStep(0); clearInterval(autoTimer.current); }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all shadow-md ${
                  phase === "tour" ? "bg-white text-black border-white" : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700"
                }`}
              >
                🛒 எப்படி புக்? (How to Book?)
              </button>
            </div>

            {/* Speech Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phase + "-" + step}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <div className="p-4 rounded-2xl bg-black border border-neutral-800 shadow-inner">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{currentStep.emoji}</span>
                    <h4 className="text-sm font-black text-red-500">{currentStep.tamilTitle}</h4>
                  </div>

                  {/* Tamil text */}
                  <p className="text-sm font-bold text-white leading-relaxed mb-2">
                    {currentStep.tamilText}
                  </p>

                  {/* English subtitle */}
                  <p className="text-[11px] text-neutral-400 italic border-l-2 border-red-500 pl-2">
                    EN: {currentStep.englishText}
                  </p>

                  {/* Supply chain visual for explain steps */}
                  {phase === "explain" && currentStep.highlight === "other" && (
                    <div className="mt-3 flex items-center gap-1 flex-wrap text-[11px] font-black bg-neutral-900 border border-red-800/60 rounded-xl p-2 text-red-300">
                      <span>🏭</span><span className="text-red-500">→</span>
                      <span>👨‍💼 Agent</span><span className="text-red-500">→</span>
                      <span>🏬 Distributor</span><span className="text-red-500">→</span>
                      <span>🛒 Retailer</span><span className="text-red-500">→</span>
                      <span>👨‍👩‍👧‍👦</span>
                      <span className="ml-auto text-red-500 font-black">= HIGH PRICE! 📈</span>
                    </div>
                  )}
                  {phase === "explain" && currentStep.highlight === "deepa" && (
                    <div className="mt-3 flex items-center gap-1 flex-wrap text-[11px] font-black bg-neutral-900 border border-white/20 rounded-xl p-2 text-white">
                      <span>🏭</span><span className="text-red-500">→</span>
                      <span className="text-white font-black bg-red-600 px-1.5 py-0.5 rounded border border-red-500">🏬 DEEPA CRACKERS</span>
                      <span className="text-red-500">→</span>
                      <span>👨‍👩‍👧‍👦</span>
                      <span className="ml-auto text-white font-black">= 80% SAVINGS! 💚</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setStep(i); clearInterval(autoTimer.current); }}
                  className={`h-2 rounded-full transition-all ${
                    i === step ? "w-6 bg-red-600" : "w-2 bg-neutral-700"
                  }`}
                />
              ))}
              <span className="ml-auto text-[10px] font-black text-neutral-400">
                {step + 1}/{steps.length}
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => { setIsPlaying(!isPlaying); clearInterval(autoTimer.current); }}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold shadow-md flex items-center gap-1.5 text-neutral-200"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-red-500" />}
                {isPlaying ? "நிறுத்து" : "இயக்கு"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  disabled={phase === "explain" && step === 0}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold shadow-md flex items-center gap-1 text-neutral-200 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  முந்தையது
                </button>
                <button
                  onClick={goNext}
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-1 ${
                    phase === "explain" && step === EXPLAIN_STEPS.length - 1
                      ? "bg-white text-black border border-white"
                      : "bg-gradient-to-r from-red-600 to-red-700 text-white border border-red-500"
                  }`}
                >
                  {phase === "explain" && step === EXPLAIN_STEPS.length - 1
                    ? "📖 புக்கிங் வழிகாட்டி"
                    : "அடுத்தது"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
