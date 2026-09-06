import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, MessageSquare, Clock, FileText } from "lucide-react";
import PageShell from "./PageShell";

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: "Store Location",
    content: [
      "Deepa Firecracker Shop",
      "RS Road, Thiruthuraipoondi",
      "Tamil Nadu — 614713",
      { text: "View on Google Maps →", href: "https://maps.google.com/?q=Thiruthuraipoondi+Tamil+Nadu", target: "_blank" },
    ],
  },
  {
    icon: Phone,
    title: "Phone Support",
    content: [
      { text: "+91 8072 897 834", href: "tel:+918072897834" },
      "Mon–Sat: 9 AM – 8 PM",
      "Diwali Season: Open All Days",
    ],
  },
  {
    icon: Mail,
    title: "Email Address",
    content: [
      { text: "deepatraders1985@gmail.com", href: "mailto:deepatraders1985@gmail.com" },
      "Direct wholesale inquiries answered promptly",
    ],
  },
];

const QUICK_ACTIONS = [
  { icon: Phone, label: "Call Now", href: "tel:+918072897834" },
  { icon: MessageSquare, label: "WhatsApp", href: "https://wa.me/918072897834" },
  { icon: Mail, label: "Email", href: "mailto:deepatraders1985@gmail.com" },
  { icon: MapPin, label: "Directions", href: "https://maps.google.com/?q=Thiruthuraipoondi+Tamil+Nadu" },
];

export default function Contact() {
  return (
    <PageShell>
      <div className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12">

        {/* ── HERO ── */}
        <section className="text-center space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-3.5 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-red-600 text-white border border-red-500 shadow-md shadow-red-600/20">
              Customer Support
            </span>
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-neutral-900 text-neutral-300 border border-white/20">
              Thiruthuraipoondi Hub
            </span>
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-neutral-900 text-neutral-300 border border-white/20">
              Direct Inquiries
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
              CONTACT <span className="text-red-600">US</span>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
              Get in touch with Deepa Firecracker Shop for wholesale catalogs, festive parcel bookings, and bulk direct pricing.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto pt-2">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-red-600" />
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-red-600" />
          </div>
        </section>

        {/* ── QUICK ACTION BUTTONS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
          {QUICK_ACTIONS.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <a
                key={i}
                href={qa.href}
                target={qa.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-black border border-white/20 hover:border-red-600 hover:bg-neutral-900 transition-all cursor-pointer shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                  {qa.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* ── CONTACT CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CONTACT_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden bg-black border border-white/20 p-6 space-y-4 shadow-xl"
              >
                <div className="h-1 w-full bg-red-600 absolute top-0 left-0" />
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-red-500">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    {card.title}
                  </h3>
                  <div className="h-[1px] w-8 bg-red-600 mt-2" />
                </div>
                <div className="space-y-1 text-xs text-neutral-300">
                  {card.content.map((item, idx) =>
                    typeof item === "string" ? (
                      <p key={idx} className="text-neutral-400 leading-relaxed">{item}</p>
                    ) : (
                      <a
                        key={idx}
                        href={item.href}
                        target={item.target}
                        rel={item.target ? "noopener noreferrer" : undefined}
                        className="font-bold text-white hover:text-red-500 transition-colors block pt-1"
                      >
                        {item.text}
                      </a>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MAP SECTION ── */}
        <div className="relative rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl p-6 sm:p-8 space-y-4">
          <div className="h-[3px] w-full bg-red-600 absolute top-0 left-0" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-red-500 shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">Find Deepa Crackers</h2>
              <p className="text-xs text-neutral-400">RS Road, Thiruthuraipoondi, Tamil Nadu — 614713</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15694.0254217144!2d79.638421!3d10.528431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a554ff015555555%3A0x123456789abcdef!2sThiruthuraipoondi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="360"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              title="Deepa Crackers Location"
            />
          </div>
        </div>

        {/* ── HOURS + NOTE ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl overflow-hidden bg-black border border-white/20 shadow-xl">
            <div className="h-1 w-full bg-red-600" />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Store Hours</h3>
              </div>
              <div className="space-y-2">
                {[
                  ["Monday – Saturday", "9:00 AM – 8:00 PM"],
                  ["Sunday", "10:00 AM – 6:00 PM"],
                  ["Diwali Season", "Open All Day & Night"],
                  ["Other Festivals", "Extended Hours"],
                ].map(([day, hours], i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.08] last:border-0 text-xs">
                    <span className="text-neutral-400">{day}</span>
                    <span className="font-bold text-white">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-black border border-white/20 shadow-xl">
            <div className="h-1 w-full bg-red-600" />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Ordering Information</h3>
              </div>
              <div className="space-y-2">
                {[
                  ["Minimum Order", "No minimum order requirement"],
                  ["Wholesale Inquiries", "Call / WhatsApp for bulk volume discount"],
                  ["Transport Dispatch", "Safely delivered across Tamil Nadu"],
                  ["Direct Sourcing", "100% Genuine Sivakasi Factory Direct"],
                ].map(([title, desc], i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.08] last:border-0 text-xs">
                    <span className="text-neutral-400">{title}</span>
                    <span className="font-bold text-white text-right ml-2">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
}
