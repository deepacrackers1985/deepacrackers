import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Truck, 
  Navigation, 
  ShieldCheck, 
  Percent, 
  Clock 
} from "lucide-react";

export default function WhyDeepaCrackersModal({ onClose }) {
  // Stages: 'traditional' (plays 2 trips) -> 'deepa' (shows direct model)
  const [activeStage, setActiveStage] = useState("traditional");
  const [redLoopCount, setRedLoopCount] = useState(1);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Checkpoints threshold states (updated only on state transition to avoid re-render thrashing)
  const [activeCheckpoint, setActiveCheckpoint] = useState("factory"); // 'factory' | 'agent' | 'distributor' | 'customer'
  const [deepaCheckpoint, setDeepaCheckpoint] = useState("sivakasi"); // 'sivakasi' | 'hub' | 'customer'
  const [countdown, setCountdown] = useState(5);

  const redPathRef = useRef(null);
  const redTruckRef = useRef(null);
  const greenPathRef = useRef(null);
  const greenTruckRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const showT = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(showT);
  }, []);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose && onClose(), 300);
  }, [onClose]);

  // ── Ultra-Smooth 60FPS RAF Engine for Traditional Lorry (2 Trips) ──
  useEffect(() => {
    if (activeStage !== "traditional") return;

    const RED_CYCLE_MS = 3200;
    const TOTAL_CYCLES = 2;
    const totalDuration = RED_CYCLE_MS * TOTAL_CYCLES;
    const startTime = performance.now();

    let lastCheckpoint = "";
    let lastCycle = 1;

    const animateRed = (now) => {
      const elapsed = now - startTime;
      if (elapsed >= totalDuration) {
        setActiveStage("deepa");
        return;
      }

      const currentCycle = Math.min(Math.floor(elapsed / RED_CYCLE_MS) + 1, TOTAL_CYCLES);
      if (currentCycle !== lastCycle) {
        lastCycle = currentCycle;
        setRedLoopCount(currentCycle);
      }

      const cycleProgress = (elapsed % RED_CYCLE_MS) / RED_CYCLE_MS;

      // Update checkpoint state only when threshold crossed
      let cp = "factory";
      if (cycleProgress >= 0.76) cp = "customer";
      else if (cycleProgress >= 0.46) cp = "distributor";
      else if (cycleProgress >= 0.18) cp = "agent";

      if (cp !== lastCheckpoint) {
        lastCheckpoint = cp;
        setActiveCheckpoint(cp);
      }

      // Smoothly update lorry position along SVG Path without React re-rendering
      if (redPathRef.current && redTruckRef.current) {
        const path = redPathRef.current;
        const len = path.getTotalLength ? path.getTotalLength() : 800;
        const currentDist = cycleProgress * len;
        
        const pt = path.getPointAtLength(currentDist);
        const nextDist = Math.min(currentDist + 4, len);
        const nextPt = path.getPointAtLength(nextDist);

        const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);
        redTruckRef.current.setAttribute(
          "transform",
          `translate(${pt.x}, ${pt.y}) rotate(${angle})`
        );
      }

      animFrameRef.current = requestAnimationFrame(animateRed);
    };

    animFrameRef.current = requestAnimationFrame(animateRed);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeStage]);

  // ── Ultra-Smooth 60FPS RAF Engine for Deepa Express Lorry & Countdown ──
  useEffect(() => {
    if (activeStage !== "deepa") return;

    const GREEN_DURATION_MS = 5500;
    const TRUCK_TRIP_MS = 3000;
    const startTime = performance.now();

    let lastDeepaCp = "";
    let lastSec = 5;

    const animateGreen = (now) => {
      const elapsed = now - startTime;
      if (elapsed >= GREEN_DURATION_MS) {
        handleClose();
        return;
      }

      // Countdown tick
      const remainingSec = Math.max(0, Math.ceil((GREEN_DURATION_MS - elapsed) / 1000));
      if (remainingSec !== lastSec) {
        lastSec = remainingSec;
        setCountdown(remainingSec);
      }

      // Truck progress (loops smoothly)
      const truckProgress = Math.min(elapsed / TRUCK_TRIP_MS, 1);
      
      let cp = "sivakasi";
      if (truckProgress >= 0.72) cp = "customer";
      else if (truckProgress >= 0.36) cp = "hub";

      if (cp !== lastDeepaCp) {
        lastDeepaCp = cp;
        setDeepaCheckpoint(cp);
      }

      // Smooth SVG transform
      if (greenPathRef.current && greenTruckRef.current) {
        const path = greenPathRef.current;
        const len = path.getTotalLength ? path.getTotalLength() : 750;
        const currentDist = (truckProgress % 1) * len;
        
        const pt = path.getPointAtLength(currentDist);
        const nextDist = Math.min(currentDist + 4, len);
        const nextPt = path.getPointAtLength(nextDist);

        const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);
        greenTruckRef.current.setAttribute(
          "transform",
          `translate(${pt.x}, ${pt.y}) rotate(${angle})`
        );
      }

      animFrameRef.current = requestAnimationFrame(animateGreen);
    };

    animFrameRef.current = requestAnimationFrame(animateGreen);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeStage, handleClose]);

  const isRedAgentActive = activeCheckpoint === "agent" || activeCheckpoint === "distributor" || activeCheckpoint === "customer";
  const isRedDistributorActive = activeCheckpoint === "distributor" || activeCheckpoint === "customer";
  const isRedCustomerActive = activeCheckpoint === "customer";

  const isGreenHubActive = deepaCheckpoint === "hub" || deepaCheckpoint === "customer";
  const isGreenCustomerActive = deepaCheckpoint === "customer";

  return (
    <div
      className={`fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${
        visible && !exiting ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* Modal Main Container */}
      <div className="w-full max-w-3xl max-h-[94vh] bg-[#0a0a0a] border border-neutral-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative text-white">
        
        {/* Top Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-neutral-800 flex items-center justify-between bg-black/90 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md bg-red-600 shadow-red-600/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black tracking-tight text-white">
                  WHY CHOOSE DEEPA CRACKERS?
                </h3>
                <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider border ${
                  activeStage === "traditional"
                    ? "bg-neutral-900 border-red-800 text-red-400"
                    : "bg-red-600 border-red-500 text-white"
                }`}>
                  {activeStage === "traditional"
                    ? `1. Middleman Trap (Trip ${redLoopCount}/2)`
                    : "2. Deepa Direct Wholesale"}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-medium line-clamp-1">
                {activeStage === "traditional"
                  ? "Watching how middleman commissions inflate cracker prices..."
                  : "Discover genuine Sivakasi wholesale rates at RS Road, Thiruthuraipoondi"}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X size={16} />
          </button>
        </div>

        {/* Stage Content */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 flex flex-col justify-between space-y-3">
          <AnimatePresence mode="wait">
            
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 1. TRADITIONAL: 2-Trip Middlemen Road Animation (Red/Black)      */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeStage === "traditional" && (
              <motion.div
                key="traditional-2-trips"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0a0a0a] border-2 border-red-600/80 rounded-2xl p-2.5 sm:p-4 flex flex-col space-y-2.5 sm:space-y-3 shadow-[0_10px_35px_rgba(220,38,38,0.2)]"
              >
                {/* Live GPS Status Bar */}
                <div className="px-3 py-1.5 sm:py-2 rounded-xl bg-neutral-900 border border-red-800/80 flex items-center justify-between text-[11px] sm:text-xs font-bold text-red-200">
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate pr-2">
                    <Navigation className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="truncate">
                      <strong className="text-white">STATUS:</strong>{" "}
                      {activeCheckpoint === "factory" && "Origin 1: Factory Base Cost"}
                      {activeCheckpoint === "agent" && "Checkpoint 2: Broker Agent (+20% Commission)"}
                      {activeCheckpoint === "distributor" && "Checkpoint 3: Regional Distributor (+25% Markup)"}
                      {activeCheckpoint === "customer" && "Destination 4: Customer Inflated MRP (+400%)"}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase shrink-0">
                    Trip {redLoopCount}/2
                  </span>
                </div>

                {/* SVG Winding Road with Hardware Accelerated Lorry */}
                <div className="relative w-full h-[200px] sm:h-[260px] bg-black rounded-2xl border border-white/20 p-1 sm:p-2 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 740 320" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    {/* Path definition */}
                    <path
                      ref={redPathRef}
                      id="redRoadPath"
                      d="M 60,80 C 180,30 220,50 280,100 C 340,150 370,220 460,180 C 540,140 600,240 680,240"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="38"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Road Styling Layers */}
                    <path
                      d="M 60,80 C 180,30 220,50 280,100 C 340,150 370,220 460,180 C 540,140 600,240 680,240"
                      fill="none"
                      stroke="#7f1d1d"
                      strokeWidth="42"
                      opacity="0.3"
                    />
                    <path
                      d="M 60,80 C 180,30 220,50 280,100 C 340,150 370,220 460,180 C 540,140 600,240 680,240"
                      fill="none"
                      stroke="#0a0a0a"
                      strokeWidth="30"
                    />
                    <path
                      d="M 60,80 C 180,30 220,50 280,100 C 340,150 370,220 460,180 C 540,140 600,240 680,240"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="3"
                      strokeDasharray="8,9"
                      opacity="0.9"
                    />

                    {/* Checkpoint 1: Factory */}
                    <g transform="translate(60, 80)">
                      <circle r="24" fill="#171717" stroke="#dc2626" strokeWidth="2.5" />
                      <text textAnchor="middle" dy="4" fontSize="10" fontWeight="900" fill="#ffffff">FAC</text>
                      <text x="-32" y="42" fontSize="13" fontWeight="900" fill="#ffffff">1. Factory</text>
                      <text x="-32" y="56" fontSize="10" fontWeight="bold" fill="#fca5a5">Base Cost</text>
                    </g>

                    {/* Checkpoint 2: Agent */}
                    <g transform="translate(280, 100)">
                      <circle
                        r={isRedAgentActive ? "30" : "22"}
                        fill={isRedAgentActive ? "#7f1d1d" : "#171717"}
                        stroke={isRedAgentActive ? "#f87171" : "#404040"}
                        strokeWidth={isRedAgentActive ? "4" : "2"}
                        className="transition-all duration-200"
                      />
                      <text textAnchor="middle" dy="4" fontSize="10" fontWeight="900" fill="#ffffff">AGT</text>
                      
                      <g transform="translate(-75, -42)">
                        <rect
                          width="150"
                          height="30"
                          rx="8"
                          fill={isRedAgentActive ? "#dc2626" : "#171717"}
                          stroke={isRedAgentActive ? "#ffffff" : "#404040"}
                          strokeWidth="2"
                        />
                        <text x="75" y="19" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          2. AGENT (+20%)
                        </text>
                      </g>
                    </g>

                    {/* Checkpoint 3: Distributor */}
                    <g transform="translate(460, 180)">
                      <circle
                        r={isRedDistributorActive ? "30" : "22"}
                        fill={isRedDistributorActive ? "#7f1d1d" : "#171717"}
                        stroke={isRedDistributorActive ? "#f87171" : "#404040"}
                        strokeWidth={isRedDistributorActive ? "4" : "2"}
                        className="transition-all duration-200"
                      />
                      <text textAnchor="middle" dy="4" fontSize="10" fontWeight="900" fill="#ffffff">DIST</text>
                      
                      <g transform="translate(-90, -42)">
                        <rect
                          width="180"
                          height="30"
                          rx="8"
                          fill={isRedDistributorActive ? "#dc2626" : "#171717"}
                          stroke={isRedDistributorActive ? "#ffffff" : "#404040"}
                          strokeWidth="2"
                        />
                        <text x="90" y="19" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          3. DISTRIBUTOR (+25%)
                        </text>
                      </g>
                    </g>

                    {/* Checkpoint 4: Customer End */}
                    <g transform="translate(680, 240)">
                      <circle
                        r={isRedCustomerActive ? "32" : "24"}
                        fill={isRedCustomerActive ? "#dc2626" : "#171717"}
                        stroke={isRedCustomerActive ? "#ffffff" : "#404040"}
                        strokeWidth={isRedCustomerActive ? "4.5" : "2"}
                        className="transition-all duration-200"
                      />
                      <text textAnchor="middle" dy="4" fontSize="10" fontWeight="900" fill="#ffffff">MRP</text>
                      
                      <g transform="translate(-105, -44)">
                        <rect
                          width="210"
                          height="32"
                          rx="8"
                          fill={isRedCustomerActive ? "#991b1b" : "#171717"}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text x="105" y="21" fontSize="13" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          4. FAKE 90% MRP TRAP
                        </text>
                      </g>
                    </g>

                    {/* Ultra-Smooth 60FPS Red Lorry Group */}
                    <g ref={redTruckRef} transform="translate(60, 80)">
                      {/* Truck Body */}
                      <rect x="-22" y="-12" width="34" height="24" rx="4" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                      {/* Truck Cabin */}
                      <rect x="12" y="-10" width="14" height="20" rx="3" fill="#991b1b" stroke="#ffffff" strokeWidth="0.8" />
                      {/* Cargo Label */}
                      <text x="-5" y="4" fontSize="8" fontWeight="900" fill="#ffffff" textAnchor="middle">TRAP</text>
                      {/* Wheels */}
                      <circle cx="-14" cy="-13" r="4" fill="#000000" stroke="#7f1d1d" strokeWidth="1" />
                      <circle cx="10" cy="-13" r="4" fill="#000000" stroke="#7f1d1d" strokeWidth="1" />
                      <circle cx="-14" cy="13" r="4" fill="#000000" stroke="#7f1d1d" strokeWidth="1" />
                      <circle cx="10" cy="13" r="4" fill="#000000" stroke="#7f1d1d" strokeWidth="1" />
                      {/* Headlights */}
                      <circle cx="26" cy="-5" r="2.2" fill="#ffffff" />
                      <circle cx="26" cy="5" r="2.2" fill="#ffffff" />
                    </g>
                  </svg>
                </div>

                {/* Footer status notice */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-900 border border-white/20 text-center text-[10px] sm:text-xs font-bold text-neutral-200">
                  Standard stores inflate rates via middlemen. Switching to Deepa Direct Wholesale...
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 2. DEEPA: Direct Sivakasi Highway & Reasons (Red/White/Black)    */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeStage === "deepa" && (
              <motion.div
                key="deepa-reasons-solution"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="bg-black border-2 border-white rounded-2xl p-3 sm:p-4 flex flex-col space-y-3 shadow-[0_10px_35px_rgba(255,255,255,0.1)]"
              >
                {/* Header Status & Countdown */}
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-red-600 border border-red-500 text-[10px] sm:text-xs font-black text-white uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    THE DEEPA CRACKERS ADVANTAGE
                  </span>
                  <div className="text-[10px] sm:text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    <span>Entering Catalog in <strong className="text-white font-bold">{countdown}s</strong></span>
                  </div>
                </div>

                {/* Direct Express Highway SVG Animation */}
                <div className="relative w-full h-[180px] sm:h-[220px] bg-neutral-950 rounded-2xl border border-white/20 p-1 sm:p-2 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 740 260" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    {/* Express Road Path */}
                    <path
                      ref={greenPathRef}
                      id="greenExpressRoadPath"
                      d="M 70,130 C 220,50 280,50 370,130 C 460,210 520,210 670,130"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="38"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Road Styling Layers */}
                    <path
                      d="M 70,130 C 220,50 280,50 370,130 C 460,210 520,210 670,130"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="42"
                      opacity="0.3"
                    />
                    <path
                      d="M 70,130 C 220,50 280,50 370,130 C 460,210 520,210 670,130"
                      fill="none"
                      stroke="#0a0a0a"
                      strokeWidth="30"
                    />
                    <path
                      d="M 70,130 C 220,50 280,50 370,130 C 460,210 520,210 670,130"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeDasharray="8,9"
                      opacity="0.95"
                    />

                    {/* Node 1: Sivakasi Direct Factory */}
                    <g transform="translate(70, 130)">
                      <circle r="26" fill="#171717" stroke="#dc2626" strokeWidth="3" />
                      <text textAnchor="middle" dy="4" fontSize="10" fontWeight="900" fill="#ffffff">FAC</text>
                      <text x="-35" y="42" fontSize="13" fontWeight="900" fill="#ffffff">1. Sivakasi</text>
                      <text x="-35" y="56" fontSize="10" fontWeight="bold" fill="#fca5a5">Direct Factory</text>
                    </g>

                    {/* Node 2: Deepa Central Hub */}
                    <g transform="translate(370, 130)">
                      <circle
                        r={isGreenHubActive ? "32" : "24"}
                        fill={isGreenHubActive ? "#dc2626" : "#171717"}
                        stroke={isGreenHubActive ? "#ffffff" : "#dc2626"}
                        strokeWidth={isGreenHubActive ? "4.5" : "2"}
                        className="transition-all duration-200"
                      />
                      <text textAnchor="middle" dy="4" fontSize="10" fontWeight="900" fill="#ffffff">HUB</text>
                      
                      <g transform="translate(-125, -44)">
                        <rect
                          width="250"
                          height="32"
                          rx="8"
                          fill={isGreenHubActive ? "#dc2626" : "#171717"}
                          stroke={isGreenHubActive ? "#ffffff" : "#404040"}
                          strokeWidth="2"
                        />
                        <text x="125" y="21" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          2. DEEPA CENTRAL HUB (0% MARKUP)
                        </text>
                      </g>
                    </g>

                    {/* Node 3: Direct Customer */}
                    <g transform="translate(670, 130)">
                      <circle
                        r={isGreenCustomerActive ? "34" : "24"}
                        fill={isGreenCustomerActive ? "#ffffff" : "#171717"}
                        stroke={isGreenCustomerActive ? "#dc2626" : "#404040"}
                        strokeWidth={isGreenCustomerActive ? "5" : "2"}
                        className="transition-all duration-200"
                      />
                      <text textAnchor="middle" dy="4" fontSize="10" fontWeight="900" fill={isGreenCustomerActive ? "#000000" : "#ffffff"}>YOU</text>
                      
                      <g transform="translate(-135, -44)">
                        <rect
                          width="270"
                          height="32"
                          rx="8"
                          fill={isGreenCustomerActive ? "#000000" : "#171717"}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text x="135" y="21" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          3. WHOLESALE SAVINGS DELIVERED
                        </text>
                      </g>
                    </g>

                    {/* Ultra-Smooth 60FPS Express Lorry */}
                    <g ref={greenTruckRef} transform="translate(70, 130)">
                      <rect x="-24" y="-13" width="38" height="26" rx="5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.8" />
                      <rect x="14" y="-11" width="15" height="22" rx="3" fill="#991b1b" stroke="#ffffff" strokeWidth="0.8" />
                      <text x="-5" y="4" fontSize="8.5" fontWeight="900" fill="#ffffff" textAnchor="middle">DEEPA</text>
                      <circle cx="-15" cy="-14" r="4.5" fill="#000000" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="11" cy="-14" r="4.5" fill="#000000" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="-15" cy="14" r="4.5" fill="#000000" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="11" cy="14" r="4.5" fill="#000000" stroke="#ffffff" strokeWidth="1" />
                      <circle cx="29" cy="-5" r="2.5" fill="#ffffff" />
                      <circle cx="29" cy="5" r="2.5" fill="#ffffff" />
                    </g>
                  </svg>
                </div>

                {/* 3 Key Trust & Sourcing Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900 border border-white/20 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600 border border-red-500 flex items-center justify-center text-white shrink-0">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-black text-white">0% Agent Commission</h4>
                      <p className="text-[9px] sm:text-[10px] text-neutral-300 mt-0.5">Direct Sivakasi wholesale rates.</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900 border border-white/20 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600 border border-red-500 flex items-center justify-center text-white shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-black text-white">40 Years of Trust</h4>
                      <p className="text-[9px] sm:text-[10px] text-neutral-300 mt-0.5">Shop at RS Road, Thiruthuraipoondi.</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-900 border border-white/20 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600 border border-red-500 flex items-center justify-center text-white shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-black text-white">100% Genuine Quality</h4>
                      <p className="text-[9px] sm:text-[10px] text-neutral-300 mt-0.5">Certified fresh direct factory stock.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-neutral-800 bg-black flex items-center justify-between gap-2 flex-wrap shrink-0">
          <div className="text-[11px] sm:text-xs text-neutral-400 font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="line-clamp-1">{activeStage === "traditional" ? "Showing price inflation trap..." : "Ready to explore Deepa Crackers"}</span>
          </div>

          <button
            onClick={handleClose}
            className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30"
          >
            <span>Explore Products Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
