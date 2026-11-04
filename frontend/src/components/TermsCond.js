import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faLock,
  faClock,
  faGasPump,
  faTools,
  faFileContract,
  faCalendarAlt,
  faHelmetSafety,
  faRoad,
  faGavel,
  faShieldAlt,
  faMoneyBillWave,
  faUsers,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

const TermsCond = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const terms = [
    {
      icon: faUserShield,
      title: "User Eligibility",
      description:
        "Renters must be at least 18 years old and possess an original valid driving license and a government-issued photo ID.",
    },
    {
      icon: faLock,
      title: "Security Deposit",
      description:
        "A refundable security deposit is collected prior to rental handover. The deposit is refunded automatically within 24-48 hours upon return in original condition.",
    },
    {
      icon: faClock,
      title: "Rental Duration & Punctuality",
      description:
        "Bikes must be returned promptly at the agreed drop-off time. Grace period is 30 minutes, after which hourly overtime charges apply.",
    },
    {
      icon: faGasPump,
      title: "Fuel Policy",
      description:
        "Vehicles are provided with adequate fuel to reach the nearest fuel station. Renters are responsible for refueling during their trip.",
    },
    {
      icon: faTools,
      title: "Vehicle Care & Damages",
      description:
        "Renters are expected to operate vehicles responsibly. Any accidental or negligent physical damages will be assessed and deducted from the deposit.",
    },
    {
      icon: faFileContract,
      title: "Bookings & Payments",
      description:
        "Bookings are verified and confirmed only upon successful Razorpay transaction. All payment sessions are encrypted with industry-standard 256-bit TLS.",
    },
    {
      icon: faCalendarAlt,
      title: "Cancellation & Rescheduling",
      description:
        "Cancellations made 24 hours prior to scheduled pickup are eligible for full deposit refunds. Last-minute cancellations are subject to standard slot reservation deductions.",
    },
    {
      icon: faHelmetSafety,
      title: "Mandatory Safety Helmets",
      description:
        "Wearing a helmet is mandatory by law. One sanitized, ISI-certified rider helmet is provided complimentary with every rental.",
    },
    {
      icon: faRoad,
      title: "Operational Boundaries",
      description:
        "Vehicles are permitted throughout Udaipur and surrounding tourist corridors. Prior written authorization is required for outstation interstate travel.",
    },
    {
      icon: faGavel,
      title: "Legal & Traffic Compliance",
      description:
        "The renter is strictly liable for any traffic violations, speeding penalties, or improper parking fines incurred during the rental tenure.",
    },
    {
      icon: faShieldAlt,
      title: "Privacy & Data Protection",
      description:
        "All uploaded driving license credentials and personal identification are securely stored and strictly utilized for identity verification.",
    },
    {
      icon: faUsers,
      title: "Roadside Assistance",
      description:
        "We maintain a 24/7 dedicated fleet support team to assist with mechanical breakdowns, flat tires, or emergency situations.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 transform transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-3">
            <FontAwesomeIcon icon={faHandshake} className="text-emerald-500" />
            Terms of Service
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Rental Terms & Conditions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Please review our clear policies designed to ensure a safe, fair, and reliable riding experience.
          </p>
        </div>

        {/* Terms Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transform transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                <FontAwesomeIcon icon={term.icon} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {term.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {term.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-2xl border border-slate-200/80 text-center shadow-sm">
          <p className="text-xs sm:text-sm text-slate-500">
            By proceeding with a vehicle booking on RideEase, you confirm that you have read, understood, and agreed to adhere to the terms and rental guidelines outlined above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsCond;
