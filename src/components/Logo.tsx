import React from "react";
import { motion } from "motion/react";

export default function Logo({ size = "md", showSlogan = true }: { size?: "sm" | "md" | "lg"; showSlogan?: boolean }) {
  const dimensions = {
    sm: { width: "160px", height: "45px", eyeSize: 32 },
    md: { width: "280px", height: "80px", eyeSize: 52 },
    lg: { width: "420px", height: "120px", eyeSize: 84 },
  }[size];

  return (
    <div className="flex flex-col items-start select-none">
      <div className="flex items-center gap-3">
        {/* Animated Emerald & Gold Eye Logo */}
        <div className="relative flex items-center justify-center">
          <svg
            width={dimensions.eyeSize}
            height={dimensions.eyeSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          >
            {/* Outer Eye Shape - Emerald Green */}
            <path
              d="M10 50C25 25 75 25 90 50C75 75 25 75 10 50Z"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 50C25 30 75 30 90 50"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />

            {/* Iris - Golden Globe/World Map */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
              {/* Golden Iris Boundary */}
              <circle cx="50" cy="50" r="22" stroke="#fbbf24" strokeWidth="2.5" fill="#022c22" />
              
              {/* Stylized Continents / Latitude & Longitude lines of Globe inside iris */}
              <path
                d="M32 50H68M50 32V68M34.5 40C40 43 60 43 65.5 40M34.5 60C40 57 60 57 65.5 60"
                stroke="#e2b83c"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M42 34C45 42 45 58 42 66M58 34C55 42 55 58 58 66"
                stroke="#e2b83c"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Landmass silhouettes simplified in gold */}
              <path
                d="M36 44C38 43 40 46 39 48C37 49 35 46 36 44ZM58 41C61 40 63 43 62 45C60 46 58 43 58 41ZM46 56C47 54 51 55 52 58C50 61 47 59 46 56Z"
                fill="#fbbf24"
              />
            </motion.g>

            {/* Pupil - Glowing Core */}
            <circle cx="50" cy="50" r="7" fill="#fbbf24" className="animate-pulse" />
            <circle cx="47" cy="47" r="2" fill="#ffffff" />
          </svg>
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl -z-10 animate-pulse" />
        </div>

        {/* Brand Name */}
        <div className="flex flex-col">
          <span className="font-display font-bold tracking-wider text-xl md:text-2xl text-white flex items-center gap-1">
            NOVA <span className="text-gold-premium tracking-wide">VISÃO</span>
            <span className="text-xs bg-gold-premium text-emerald-darkest font-mono font-bold px-1.5 py-0.5 rounded ml-1">
              PRO
            </span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-emerald-accent font-mono">
            GLOBAL LUXURY REAL ESTATE
          </span>
        </div>
      </div>

      {/* Slogan */}
      {showSlogan && (
        <motion.p 
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] md:text-xs text-gold-premium italic font-light tracking-wide mt-1.5 pl-1 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 bg-emerald-accent rounded-full animate-ping" />
          "Enxergando oportunidade e unindo destinos"
        </motion.p>
      )}
    </div>
  );
}
