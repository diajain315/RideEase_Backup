import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CategoryAll } from "../redux/features/Category/categoryAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faStar,
  faMotorcycle,
  faHelmetSafety,
  faClock,
  faShieldHalved,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CategoryAll());
  }, [dispatch]);

  const { categories = [] } = useSelector((state) => state.category);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (selectedCategory) {
      navigate(`/bikerentsection?category=${selectedCategory}`);
    } else {
      navigate("/bikerentsection");
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[640px] flex items-center border-b border-slate-800">
      {/* Background Image with Dark Atmospheric Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 opacity-35"
        style={{
          backgroundImage: "url('/images/udaipurimg.jpg')",
        }}
      />

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

      {/* Ambient Emerald & Cyan Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bold Typography & Single Search */}
          <div className="lg:col-span-7">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Udaipur's Trusted Rental Service</span>
            </div>

            {/* High-Impact Headline with Syne display font */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Explore Udaipur <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                On Two Wheels.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Ride along Fateh Sagar Lake, cruise past City Palace, and navigate the heritage streets with freedom. Honest daily pricing from ₹400/day.
            </p>

            {/* Concise Quick Search Form - Primary Action */}
            <form
              onSubmit={handleQuickSearch}
              className="mt-8 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-xl flex flex-col sm:flex-row gap-2.5 shadow-2xl"
            >
              <div className="flex-1 flex items-center px-4 py-3 bg-slate-900/80 rounded-xl border border-slate-700/80">
                <FontAwesomeIcon icon={faMotorcycle} className="text-emerald-400 mr-3 text-sm" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900 text-white">
                    Select Vehicle Category (All Fleet)
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-slate-900 text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <span>Find My Ride</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </form>

            {/* 3 Concise Trust Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
                <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                4.9/5 Rating (1,200+ Riders)
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
                <FontAwesomeIcon icon={faHelmetSafety} className="text-emerald-400" />
                Complimentary Helmet
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
                <FontAwesomeIcon icon={faClock} className="text-sky-400" />
                2-Minute Digital KYC
              </span>
            </div>
          </div>

          {/* Right Column: Sleek Frosted Showcase Card (Informational, No Duplicate CTA) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
                  Featured Model
                </span>
                <span className="text-xs font-bold text-slate-300">From ₹400/day</span>
              </div>

              {/* Vehicle Image Container */}
              <div className="relative h-48 w-full rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/80 p-4 flex items-center justify-center border border-white/5">
                <img
                  src="/images/bikemain1.png"
                  alt="Featured Rental Bike"
                  className="h-40 w-auto object-contain transition-transform duration-500 hover:scale-105 drop-shadow-2xl"
                />
              </div>

              {/* Clean Highlight Metrics */}
              <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Tariff</span>
                  <span className="text-xs font-extrabold text-white">₹400–₹1200</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Deposit</span>
                  <span className="text-xs font-extrabold text-emerald-400">Refundable</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Helmets</span>
                  <span className="text-xs font-extrabold text-white">Included</span>
                </div>
              </div>

              {/* Bullet highlights instead of a duplicate button */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span>Instant pickup near City Palace & lakes</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span>Sanitized ISI helmet & unlimited mileage</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
