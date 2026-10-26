import React from "react";

interface AfyawareLogoIconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AfyawareLogoIcon({ className = "", size = "md" }: AfyawareLogoIconProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 p-0.5 shadow-md flex items-center justify-center shrink-0 ${selectedSize} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logoCrossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0fdfa" />
          </linearGradient>
        </defs>

        {/* Outer subtle glow rim */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="22"
          stroke="#99f6e4"
          strokeWidth="2.5"
          strokeOpacity="0.4"
        />

        {/* Medical Cross */}
        <path
          d="M42 22 C42 19 45 17 48 17 L52 17 C55 17 58 19 58 22 L58 42 L78 42 C81 42 83 45 83 48 L83 52 C83 55 81 58 78 58 L58 58 L58 78 C58 81 55 83 52 83 L48 83 C45 83 42 81 42 78 L42 58 L22 58 C19 58 17 55 17 52 L17 48 C17 45 19 42 22 42 L42 42 Z"
          fill="url(#logoCrossGrad)"
        />

        {/* Distinctive ECG Pulse Heartbeat Wave */}
        <path
          d="M24 50 L35 50 L40 40 L45 61 L51 34 L56 58 L61 50 L76 50"
          stroke="#0f766e"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
