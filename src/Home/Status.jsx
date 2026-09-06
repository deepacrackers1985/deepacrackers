import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Calendar,
  Download, ChevronDown, ChevronUp, ShieldCheck, Smartphone, FileText,
  CreditCard, AlertCircle
} from "lucide-react";
import PageShell from "./PageShell";
import { API_BASE_URL } from "../../Config";
import axios from "axios";

/* ── Status step config (booked -> paid -> packed -> dispatched -> delivered) ── */
const STATUS_STEPS = ["booked", "paid", "packed", "dispatched", "delivered"];
const STATUS_META = {
  booked:     { label: "Booked",     icon: Clock,       color: "#ffffff", border: "rgba(255,255,255,0.3)" },
  paid:       { label: "Paid",       icon: CreditCard,  color: "#ffffff", border: "rgba(255,255,255,0.5)" },
  packed:     { label: "Packed",     icon: Package,     color: "#ffffff", border: "rgba(255,255,255,0.7)" },
  dispatched: { label: "Dispatched", icon: Truck,       color: "#ef4444", border: "#dc2626" },
  delivered:  { label: "Delivered",  icon: CheckCircle, color: "#ef4444", border: "#dc2626" },
  // Backward compatibility & quotation support
  pending:    { label: "Booked",     icon: Clock,       color: "#ffffff", border: "rgba(255,255,255,0.3)" },
  confirmed:  { label: "Paid",       icon: CreditCard,  color: "#ffffff", border: "rgba(255,255,255,0.5)" },
  cancelled:  { label: "Cancelled",  icon: AlertCircle, color: "#ef4444", border: "#dc2626" },
};

function normalizeStatus(status) {
  const s = (status || "").toLowerCase().trim();
  if (s === "pending") return "booked";
  if (s === "confirmed") return "paid";
  return s || "booked";
}

function StatusBadge({ status }) {
  const key = normalizeStatus(status);
  const meta = STATUS_META[key] || STATUS_META["booked"];
  const Icon = meta.icon;
  const isRed = key === "dispatched" || key === "delivered";
  const isCancelled = key === "cancelled";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
        isCancelled
          ? "bg-red-950 text-red-400 border border-red-800"
          : isRed
            ? "bg-red-600 text-white"
            : "bg-white/10 text-white border border-white/20"
      }`}
    >
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

function ProgressStepper({ status, type = "booking" }) {
  const key = normalizeStatus(status);

  if (key === "cancelled") {
    return (
      <div className="py-2.5 px-3.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-red-400 text-xs font-bold">
        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
        <span>This {type} has been cancelled.</span>
      </div>
    );
  }

  const current = STATUS_STEPS.indexOf(key);

  return (
    <div className="flex items-center w-full py-3 px-1">
      {STATUS_STEPS.map((step, i) => {
        const meta = STATUS_META[step];
        const done = current !== -1 && i <= current;
        const Icon = meta.icon;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                  done
                    ? "bg-red-600 text-white border-2 border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                    : "bg-black text-neutral-500 border border-white/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center leading-tight ${
                  done ? "text-white" : "text-neutral-500"
                }`}
              >
                {meta.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-1 rounded-full transition-all duration-500 ${
                  current !== -1 && i < current ? "bg-red-600" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function Status() {
  const [searchForm, setSearchForm] = useState({ mobile_number: "" });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedTimelines, setExpandedTimelines] = useState({});

  const handleInputChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(-10);
    setSearchForm((prev) => ({ ...prev, mobile_number: cleaned }));
  };

  const toggleTimeline = (orderId) => {
    setExpandedTimelines((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const fetchTransportDetails = async (orderId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tracking/filtered-bookings`, {
        params: { status: "dispatched,delivered" },
      });
      const booking = res.data.find((b) => b.order_id === orderId || b.id === orderId);
      return booking
        ? {
            transport_name: booking.transport_name,
            lr_number: booking.lr_number,
            transport_contact: booking.transport_contact,
          }
        : null;
    } catch {
      return null;
    }
  };

  const searchOrders = async () => {
    if (!searchForm.mobile_number.trim() || searchForm.mobile_number.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    try {
      const [bookingsRes, quotationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/direct/bookings/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: searchForm.mobile_number }),
        }),
        fetch(`${API_BASE_URL}/api/direct/quotations/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: searchForm.mobile_number }),
        }),
      ]);
      const [bookingsData, quotationsData] = await Promise.all([
        bookingsRes.json(),
        quotationsRes.json(),
      ]);

      let allOrders = [
        ...(Array.isArray(bookingsData) ? bookingsData.map((o) => ({ ...o, type: "booking" })) : []),
        ...(Array.isArray(quotationsData) ? quotationsData.map((o) => ({ ...o, type: "quotation" })) : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      allOrders = await Promise.all(
        allOrders.map(async (order) => {
          const st = (order.status || "").toLowerCase().trim();
          if ((st === "dispatched" || st === "delivered") && order.type === "booking") {
            const transport = await fetchTransportDetails(order.order_id);
            if (transport) return { ...order, ...transport };
          }
          return order;
        })
      );

      setOrders(allOrders);
      setHasSearched(true);
    } catch {
      alert("Error searching orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (order) => {
    try {
      const endpoint =
        order.type === "booking"
          ? `/api/direct/invoice/${order.order_id}`
          : `/api/direct/quotation/${order.quotation_id}`;
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Deepa_Crackers_${order.customer_name || "customer"}-${order.order_id || order.quotation_id}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Error downloading invoice. Please try again.");
    }
  };

  const formatPrice = (price) => {
    const num = Number.parseFloat(price);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <PageShell orbColor1="#dc2626" orbColor2="#000000" orbColor3="#ffffff">
      <div className="pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-10">

        {/* ── HERO ── */}
        <section className="text-center space-y-5 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full bg-red-600/10 border border-red-600/30 text-red-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            Live Tracking &amp; Invoice Portal
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none uppercase text-white">
            Track <span className="text-red-600">Order</span>
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Enter your registered 10-digit mobile number to view dispatch status, consignment lorry details, and instant PDF bills.
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <div className="h-px w-16 bg-white/20" />
          </div>
        </section>

        {/* ── SEARCH CARD ── */}
        <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/20 p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
          <div className="h-1 w-full bg-red-600 absolute top-0 left-0 right-0" />

          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-red-500" />
            <span className="text-xs font-black uppercase tracking-wider text-white">Search Your Booking</span>
          </div>

          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="tel"
              name="mobile_number"
              placeholder="Enter 10-digit mobile number"
              value={searchForm.mobile_number}
              onChange={handleInputChange}
              maxLength={10}
              onKeyDown={(e) => e.key === "Enter" && searchOrders()}
              className="w-full pl-10 pr-16 py-3 rounded-xl bg-black border border-white/20 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-red-600 transition-all font-mono"
            />
            {searchForm.mobile_number.length > 0 && (
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black font-mono ${
                  searchForm.mobile_number.length === 10 ? "text-white" : "text-neutral-500"
                }`}
              >
                {searchForm.mobile_number.length}/10
              </span>
            )}
          </div>

          <button
            onClick={searchOrders}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-[0_4px_20px_rgba(220,38,38,0.35)]"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching Orders...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Booking Status</span>
              </>
            )}
          </button>
        </div>

        {/* ── RESULTS ── */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-12 px-6 space-y-3 rounded-2xl bg-[#0a0a0a] border border-white/20">
                  <Package className="h-12 w-12 text-neutral-500 mx-auto" />
                  <h3 className="text-base font-black text-white">No Orders Found</h3>
                  <p className="text-xs text-neutral-400">
                    No booking records found for mobile ending in {searchForm.mobile_number.slice(-4)}.
                  </p>
                  <p className="text-xs text-neutral-500">
                    Need help? Contact support on{" "}
                    <a href="tel:+918072897834" className="text-red-500 font-bold hover:underline">
                      +91 8072 897 834
                    </a>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <h2 className="text-lg font-black uppercase tracking-wide text-white">
                      Found {orders.length} Order{orders.length !== 1 ? "s" : ""}
                    </h2>
                    <span className="text-xs font-mono text-neutral-400">
                      Mobile: {searchForm.mobile_number}
                    </span>
                  </div>

                  {orders.map((order) => {
                    const key = `${order.type}-${order.id}`;
                    const isExpanded = expandedTimelines[key];

                    return (
                      <div
                        key={key}
                        className="rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/20 p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                      >
                        <div className="h-1 w-full bg-red-600 -mx-5 -mt-5 mb-3" />

                        {/* Top row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-white font-mono">
                                {order.type === "booking" ? `Order #${order.order_id}` : `Quote #${order.quotation_id}`}
                              </span>
                              <StatusBadge status={order.status} />
                              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-white/5 border border-white/15 text-neutral-400 font-mono">
                                {order.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1.5 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-red-500" />
                                {formatDate(order.created_at)}
                              </span>
                              {order.district && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-red-500" />
                                  {order.district}, {order.state}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                            <span className="text-xl font-black text-white">
                              ₹{formatPrice(order.total)}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => downloadInvoice(order)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Invoice
                              </button>
                              <button
                                onClick={() => toggleTimeline(key)}
                                className="p-1.5 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Stepper */}
                        <ProgressStepper status={order.status || "booked"} type={order.type} />

                        {/* Transport info */}
                        {order.transport_name && (
                          <div className="p-4 rounded-xl bg-black border border-white/15 text-xs space-y-1.5">
                            <p className="font-black flex items-center gap-1.5 text-white">
                              <Truck className="h-4 w-4 text-red-500" />
                              Transport Consignment Details
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-neutral-400 pt-1">
                              <div>Transport: <strong className="text-white">{order.transport_name}</strong></div>
                              {order.lr_number && <div>LR No: <strong className="text-white font-mono">{order.lr_number}</strong></div>}
                              {order.transport_contact && <div>Phone: <strong className="text-white font-mono">{order.transport_contact}</strong></div>}
                            </div>
                          </div>
                        )}

                        {/* Expandable items */}
                        <AnimatePresence>
                          {isExpanded && order.items?.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
                                  Items Included in Order
                                </p>
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0"
                                  >
                                    <span className="text-xs text-neutral-300">{item.product_name || item.name}</span>
                                    <span className="text-xs font-mono font-black text-white">
                                      ×{item.quantity} — ₹{formatPrice(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HOW IT WORKS ── */}
        {!hasSearched && (
          <div className="space-y-5 pt-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                How Order Tracking Works
              </h2>
              <span className="text-xs font-mono text-neutral-400">3 Easy Steps</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  icon: Smartphone,
                  title: "Enter Mobile Number",
                  desc: "Input your 10-digit registered WhatsApp / contact number used during checkout.",
                },
                {
                  step: "02",
                  icon: Search,
                  title: "Instant Live Status",
                  desc: "Direct access to order packing, verification, lorry dispatch, and LR numbers.",
                },
                {
                  step: "03",
                  icon: FileText,
                  title: "Download Invoice",
                  desc: "Download official GST invoice PDFs directly with a single click.",
                },
              ].map((s, i) => {
                const StepIcon = s.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#0a0a0a] border border-white/20 p-5 space-y-3 relative overflow-hidden"
                  >
                    <div className="h-1 w-full bg-red-600 absolute top-0 left-0 right-0" />
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/40 flex items-center justify-center text-red-500">
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-black text-white/40">STEP {s.step}</span>
                    </div>
                    <h3 className="text-sm font-black text-white">{s.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
}