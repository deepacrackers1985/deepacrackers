import React from "react";

export default function Card3D({ children, className = "" }) {
  return (
    <div
      className={`w-full transform-gpu transition-transform duration-200 hover:-translate-y-1.5 ${className}`}
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {children}
    </div>
  );
}
