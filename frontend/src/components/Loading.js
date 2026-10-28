import React from "react";
import "./Loadin.css";

const BikeRideGraphic = ({ size = "default" }) => {
  const isCompact = size === "compact";
  const scale = isCompact ? "scale-75" : "scale-100 sm:scale-110";

  return (
    <div className={`bike-loader-wrapper ${scale} transition-all`}>
      {/* Bike Container with Suspension Animation */}
      <div className="bike-cruiser">
        {/* Headlight Beam */}
        <div className="bike-headlight-cone" />

        {/* Speed / Exhaust Trail Lines */}
        <div className="bike-speed-trail">
          <div className="speed-line" />
          <div className="speed-line" />
          <div className="speed-line" />
        </div>

        {/* Realistic SVG Motorbike with Rider & Spinning Wheels */}
        <svg
          width="140"
          height="85"
          viewBox="0 0 140 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          {/* Exhaust Pipe & Muffler */}
          <path
            d="M52 64 L30 65 L20 62"
            stroke="#64748B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M32 64 L16 61"
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Rear Swingarm */}
          <path
            d="M26 60 L50 56 L58 48"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Engine & Lower Frame */}
          <rect
            x="45"
            y="48"
            width="22"
            height="15"
            rx="3"
            fill="#0F172A"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          {/* Engine fins */}
          <line x1="47" y1="52" x2="65" y2="52" stroke="#475569" strokeWidth="1.5" />
          <line x1="47" y1="56" x2="65" y2="56" stroke="#475569" strokeWidth="1.5" />
          <line x1="47" y1="60" x2="65" y2="60" stroke="#475569" strokeWidth="1.5" />

          {/* Main Chassis & Sport Tank (Emerald Accent) */}
          <path
            d="M40 44 L60 38 L84 40 L88 48 L65 52 L42 50 Z"
            fill="#10B981"
            stroke="#047857"
            strokeWidth="1.5"
          />
          {/* Tank Highlight */}
          <path
            d="M62 39 L78 40 L84 46"
            stroke="#6EE7B7"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Seat */}
          <path
            d="M36 44 Q44 42 54 44 Q48 48 38 48 Z"
            fill="#0F172A"
          />

          {/* Front Fork & Suspension */}
          <line
            x1="86"
            y1="40"
            x2="110"
            y2="60"
            stroke="#64748B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="88"
            y1="43"
            x2="108"
            y2="60"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Handlebars & Front Cowl */}
          <path
            d="M84 36 L88 38 L93 33"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M86 36 L94 36 L96 42 Z"
            fill="#10B981"
          />

          {/* Rider Silhouette (Sport Riding Stance) */}
          {/* Rider Back/Torso */}
          <path
            d="M48 42 C48 34 56 26 68 28 C74 29 80 34 85 36"
            stroke="#0F172A"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Rider Arm to Handlebars */}
          <path
            d="M66 31 L80 36 L86 36"
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Rider Helmet */}
          <circle cx="70" cy="21" r="7.5" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          {/* Helmet Visor */}
          <path
            d="M72 19 Q77 20 76 24 L72 24 Z"
            fill="#0F172A"
          />

          {/* ================= REAR WHEEL ================= */}
          <g>
            {/* Outer Tire */}
            <circle
              cx="26"
              cy="60"
              r="17"
              stroke="#0F172A"
              strokeWidth="4.5"
              fill="#F8FAFC"
            />
            {/* Rim */}
            <circle cx="26" cy="60" r="11" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
            <circle cx="26" cy="60" r="4" fill="#0F172A" />

            {/* Spinning Wheel Spokes Group */}
            <g className="bike-wheel-spin" style={{ transformOrigin: "26px 60px" }}>
              <line x1="26" y1="44" x2="26" y2="76" stroke="#10B981" strokeWidth="1.5" />
              <line x1="10" y1="60" x2="42" y2="60" stroke="#10B981" strokeWidth="1.5" />
              <line x1="15" y1="49" x2="37" y2="71" stroke="#64748B" strokeWidth="1.5" />
              <line x1="15" y1="71" x2="37" y2="49" stroke="#64748B" strokeWidth="1.5" />
            </g>
          </g>

          {/* ================= FRONT WHEEL ================= */}
          <g>
            {/* Outer Tire */}
            <circle
              cx="110"
              cy="60"
              r="17"
              stroke="#0F172A"
              strokeWidth="4.5"
              fill="#F8FAFC"
            />
            {/* Rim */}
            <circle cx="110" cy="60" r="11" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
            <circle cx="110" cy="60" r="4" fill="#0F172A" />

            {/* Spinning Wheel Spokes Group */}
            <g className="bike-wheel-spin" style={{ transformOrigin: "110px 60px" }}>
              <line x1="110" y1="44" x2="110" y2="76" stroke="#10B981" strokeWidth="1.5" />
              <line x1="94" y1="60" x2="126" y2="60" stroke="#10B981" strokeWidth="1.5" />
              <line x1="99" y1="49" x2="121" y2="71" stroke="#64748B" strokeWidth="1.5" />
              <line x1="99" y1="71" x2="121" y2="49" stroke="#64748B" strokeWidth="1.5" />
            </g>
          </g>
        </svg>
      </div>

      {/* Moving Road Track with Dashed Stripes */}
      <div className="bike-road-track">
        <div className="bike-road-stripes" />
      </div>

      {/* Ground Shadow */}
      <div className="bike-road-shadow" />
    </div>
  );
};

const Loading = ({
  message = "Preparing your ride...",
  fullScreen = true,
  size = "default",
  showLogo = true,
}) => {
  if (!fullScreen) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        {showLogo && (
          <img
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm mb-6"
            alt="RideEase"
            src="/images/BikeForRentFinalLogo.png?v=2"
          />
        )}
        <BikeRideGraphic size={size || "compact"} />
        {message && (
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-4 animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Prominent Logo */}
        {showLogo && (
          <img
            className="w-72 sm:w-80 md:w-96 max-w-sm h-auto object-contain drop-shadow-xl mb-10 transition-transform hover:scale-105 duration-300"
            alt="RideEase"
            src="/images/BikeForRentFinalLogo.png?v=2"
          />
        )}

        {/* Animated Cruising Bike on Road */}
        <BikeRideGraphic size={size} />

        {/* Status Message */}
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-600 mt-6 animate-pulse">
          {message}
        </p>
        <span className="text-[11px] font-medium text-slate-400 mt-1">
          Zero paperwork · Instant digital KYC
        </span>
      </div>
    </div>
  );
};

export default Loading;
