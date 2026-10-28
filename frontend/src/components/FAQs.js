import React, { useEffect, useState } from "react";
import { Collapse, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonCircleQuestion,
  faInfoCircle,
  faFileContract,
  faWallet,
  faMapMarkedAlt,
  faUserShield,
  faGift,
  faBell,
  faCogs,
  faMapSigns,
} from "@fortawesome/free-solid-svg-icons";

const { Panel } = Collapse;
const { Search } = Input;

const FAQS = () => {
  const [animate, setAnimate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategoriesWithIcons = [
    {
      category: "General",
      icon: faInfoCircle,
      questions: [
        {
          question: "What is RideEase?",
          answer:
            "RideEase is a premier two-wheeler rental platform offering high-quality bikes and scooters with instant digital verification across the city.",
        },
        {
          question: "What makes us special?",
          answer:
            "We offer 100% certified quality bikes, competitive rates, doorstep pickup/drop options, and transparent rental agreements with zero hidden costs.",
        },
        {
          question: "How does RideEase work?",
          answer:
            "Simply choose your preferred bike, select pickup and drop dates, upload your driver's license, complete secure online payment, and pick up your bike.",
        },
      ],
    },
    {
      category: "Rental Policy",
      icon: faFileContract,
      questions: [
        {
          question: "What documents need to be uploaded?",
          answer: "A valid original driver's license (motorcycle/scooter) and a government-issued ID proof (Aadhaar or Passport).",
        },
        {
          question: "Is fuel included in the rental tariff?",
          answer: "No, fuel charges are not included. The vehicle is provided with adequate fuel to reach the nearest fuel station, and should be returned with a similar level.",
        },
        {
          question: "Is there any limit on the kilometers ridden?",
          answer:
            "Standard rentals come with unlimited kilometers within the defined district limits unless stated otherwise.",
        },
        {
          question: "Do I have to pay a security deposit?",
          answer: "Yes, a nominal refundable security deposit is collected, which is automatically refunded within 24-48 hours after vehicle return.",
        },
        {
          question: "What happens if I return the bike late?",
          answer:
            "A standard grace period of 30 minutes is provided. Delays beyond that are charged per hour as specified in the rental agreement.",
        },
      ],
    },
    {
      category: "Booking & Cancellation",
      icon: faWallet,
      questions: [
        {
          question: "How do I cancel my booking?",
          answer:
            "You can cancel via your dashboard under My Bookings or reach out directly to customer support.",
        },
        {
          question: "What is the cancellation policy?",
          answer:
            "Cancellations requested at least 24 hours prior to pickup are eligible for a full refund of any advance security deposits.",
        },
      ],
    },
    {
      category: "Pickup & Drop",
      icon: faMapMarkedAlt,
      questions: [
        {
          question: "Where and how do I pick up the vehicle?",
          answer:
            "Detailed pickup location, navigation pins, and host contact numbers are provided immediately after booking confirmation.",
        },
        {
          question: "Can I drop off the vehicle at a different hub?",
          answer:
            "Yes, one-way drops are available across select hubs within Udaipur with nominal cross-drop fees.",
        },
      ],
    },
    {
      category: "Eligibility & Safety",
      icon: faUserShield,
      questions: [
        {
          question: "What is the minimum age to rent a bike?",
          answer:
            "The rider must be at least 18 years old and possess an active, valid driving license.",
        },
        {
          question: "Is a helmet provided?",
          answer:
            "Yes, one complimentary ISI-certified safety helmet is provided with each rental. A pillion helmet can also be requested.",
        },
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const filteredFaqs = faqCategoriesWithIcons
    .map((section) => ({
      ...section,
      questions: section.questions.filter((q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.questions.length > 0);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`text-center max-w-3xl mx-auto mb-10 transform transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-3">
            <FontAwesomeIcon icon={faPersonCircleQuestion} className="text-emerald-500" />
            Support Center
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Have questions about booking, policies, or safety? We've got answers.
          </p>
          
          <div className="w-full max-w-lg mx-auto mt-6">
            <Search
              placeholder="Search by topic or question (e.g. deposit, fuel, license)..."
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              enterButton={<SearchOutlined />}
              className="shadow-sm rounded-xl"
            />
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main FAQ Content */}
          <div className="lg:col-span-2 space-y-8">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-sm">No matching questions found for "{searchTerm}".</p>
              </div>
            ) : (
              filteredFaqs.map((section, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                      <FontAwesomeIcon icon={section.icon} />
                    </span>
                    {section.category}
                  </h3>
                  <Collapse
                    accordion
                    bordered={false}
                    className="bg-transparent"
                    expandIconPosition="end"
                  >
                    {section.questions.map((item, qIdx) => (
                      <Panel
                        header={<span className="font-semibold text-slate-800 text-sm sm:text-base">{item.question}</span>}
                        key={qIdx}
                        className="border-b border-slate-100 last:border-b-0 py-1"
                      >
                        <p className="text-slate-600 text-sm leading-relaxed">{item.answer}</p>
                      </Panel>
                    ))}
                  </Collapse>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faGift} className="text-emerald-500" />
                Current Offers
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                  <span><strong>Weekend Specials:</strong> 15% discount on 3-day continuous rentals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                  <span><strong>First Ride:</strong> Enjoy ₹100 instant waiver on your initial booking.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faCogs} className="text-emerald-500" />
                How Rental Works
              </h3>
              <ol className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                  <span>Choose your ride and set dates.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                  <span>Upload original driver's license.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                  <span>Pay securely through Razorpay.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
                  <span>Pick up key & helmet at the hub!</span>
                </li>
              </ol>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapSigns} className="text-emerald-500" />
                Rider Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>• Always strap on your helmet securely.</li>
                <li>• Adhere strictly to local speed limits & signals.</li>
                <li>• Keep your digital booking receipt accessible.</li>
                <li>• Call our hub helpline in case of any flat tires.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FAQS;
