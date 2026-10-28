import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faUsers,
  faCheckCircle,
  faTags,
  faStore,
  faHandshake,
  faThumbsUp,
  faShieldAlt,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";

const AboutUs = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="py-12 bg-slate-50 min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div
        className={`max-w-4xl mx-auto text-center transform transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } mb-12`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-3">
          <FontAwesomeIcon icon={faUsersGear} className="text-emerald-500" />
          Who We Are
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Empowering Your City Exploration
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          At RideEase, we provide seamless, transparent, and exhilarating two-wheeler rental experiences engineered for tourists and locals alike.
        </p>
      </div>

      {/* Mission & Story Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
        {/* Left Section - Image */}
        <div
          className={`${
            animate ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          } transform transition-all duration-700 ease-out flex justify-center`}
        >
          <div className="relative group w-full max-w-md">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <img
              src="/images/aboutus.jpg"
              alt="RideEase Experience"
              className="relative rounded-2xl shadow-xl w-full object-cover h-80 sm:h-96 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Right Section - Content */}
        <div
          className={`${
            animate ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          } transform transition-all duration-700 ease-out space-y-6`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Our Purpose & Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            Reliable, Well-Maintained Rides at Honest Prices
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Whether you are discovering heritage spots in Udaipur, commuting across town, or embarking on a weekend scenic getaway, RideEase ensures top-tier vehicle hygiene, swift paperwork, and reliable on-road assistance.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faBicycle} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">50+</h3>
                <p className="text-xs text-slate-500 font-medium">Bikes in Fleet</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">10,000+</h3>
                <p className="text-xs text-slate-500 font-medium">Happy Riders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div
        className={`${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } transform transition-all duration-700 ease-out max-w-6xl mx-auto`}
      >
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The RideEase Advantage</span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Why Hundreds of Travelers Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: faStore, title: "One-Stop Solution", desc: "Scooters, commuter bikes, and touring cruisers ready on demand." },
            { icon: faTags, title: "Transparent Pricing", desc: "Zero hidden charges, upfront tariffs, and flexible hourly or daily packages." },
            { icon: faCheckCircle, title: "100% Certified Bikes", desc: "Multi-point safety check before every pickup so you can ride worry-free." },
            { icon: faHandshake, title: "Instant Verification", desc: "Quick digital document check so you are on the road in under 5 minutes." },
            { icon: faThumbsUp, title: "Dedicated Support", desc: "Friendly customer assistance and roadside guidance ready whenever you need." },
            { icon: faShieldAlt, title: "Safe & Insured", desc: "All fleet vehicles carry up-to-date insurance and valid state permits." },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
