import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BikeAll } from "../redux/features/Bikes/bikeAction";
import Categories from "./Categories";
import Testimonial from "./Testimonial";
import Main from "./Main";
import Layout from "./Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faGasPump,
  faGauge,
  faBolt,
  faArrowRight,
  faShieldHalved,
  faHelmetSafety,
  faClock,
  faMapLocationDot,
  faCheckCircle,
  faIdCard,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const dispatch = useDispatch();
  const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(BikeAll());
  }, [dispatch]);

  const { bikes = [] } = useSelector((state) => state.bike);
  // Show top 3 featured bikes on home
  const featuredBikes = bikes?.slice(0, 3) || [];

  return (
    <Layout title="RideEase : Bike & Scooter Rentals in Udaipur">
      <div className="bg-slate-50 min-h-screen">
        {/* 1. Clear & Concise Hero */}
        <Main />

        {/* 2. Key Trust Bar */}
        <section className="border-b border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Zero Hidden Charges</h4>
                <p className="text-[11px] text-slate-500">Transparent daily pricing</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                <FontAwesomeIcon icon={faHelmetSafety} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Complimentary Helmets</h4>
                <p className="text-[11px] text-slate-500">ISI certified safety gear</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">2-Minute Digital KYC</h4>
                <p className="text-[11px] text-slate-500">Fast license verification</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                <FontAwesomeIcon icon={faMapLocationDot} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Central Udaipur Hub</h4>
                <p className="text-[11px] text-slate-500">Convenient pickup points</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Bikes Showcase */}
        {featuredBikes.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Ready to Ride
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Popular Fleet Vehicles
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Top-rated scooters and bikes for city commutes and lake tours.
                </p>
              </div>

              <Link
                to="/bikerentsection"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <span>View All Fleet ({bikes.length})</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBikes.map((bike) => (
                <div
                  key={bike._id}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      alt={bike.name}
                      src={`${base_url}/api/v1/bike/bike-photo/${bike._id}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/b1fleet.jpg";
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {bike.category?.name || "Vehicle"}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                      {bike.number}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                        {bike.name}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {bike.petrolCapacity && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            <FontAwesomeIcon icon={faGasPump} className="text-emerald-600" />
                            {bike.petrolCapacity}L
                          </span>
                        )}
                        {bike.startType && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
                            {bike.startType}
                          </span>
                        )}
                        {bike.kilometers && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            <FontAwesomeIcon icon={faGauge} className="text-sky-500" />
                            {bike.kilometers} km
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Rate</span>
                        <span className="text-xl font-black text-slate-900">
                          ₹{bike.price}
                          <span className="text-xs font-normal text-slate-400">/day</span>
                        </span>
                      </div>

                      <Link
                        to={`/order/${bike.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95"
                      >
                        <span>Rent Now</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Fleet Categories */}
        <Categories />

        {/* 5. 3-Step Simple Process */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Simple Process
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                How It Works in 3 Steps
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Zero complex paperwork. On the road in under 5 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 relative">
                <span className="text-3xl font-black text-slate-300 absolute top-5 right-5">01</span>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-4">
                  <FontAwesomeIcon icon={faMotorcycle} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Choose Your Ride</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select your scooter or motorcycle and choose your rental pickup and return dates.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 relative">
                <span className="text-3xl font-black text-slate-300 absolute top-5 right-5">02</span>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-4">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Quick Digital KYC</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your driving license number and complete secure digital payment via Razorpay.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 relative">
                <span className="text-3xl font-black text-slate-300 absolute top-5 right-5">03</span>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-4">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Pick Up & Ride</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Collect your sanitized vehicle and free helmet at our central hub and explore Udaipur!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Rider Testimonials */}
        <Testimonial />
      </div>
    </Layout>
  );
};

export default Home;
