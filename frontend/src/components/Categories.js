import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBiking, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { CategoryAll } from "../redux/features/Category/categoryAction";

export default function Categories() {
  const dispatch = useDispatch();
  const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    dispatch(CategoryAll());
  }, [dispatch]);

  const { categories } = useSelector((state) => state.category);

  const fallbackCategories = [
    {
      _id: "scooters",
      name: "Scooters",
      images: "/images/b1fleet.jpg",
      description: "Easy handling, lightweight, and perfect for bustling Old City streets and narrow lanes.",
      href: "/bikerentsection",
    },
    {
      _id: "street-bikes",
      name: "Street Bikes",
      images: "/images/b2fleet.jpg",
      description: "Fuel efficient, reliable, and comfortable for daily commuting across town.",
      href: "/bikerentsection",
    },
    {
      _id: "cruisers",
      name: "Cruisers & Sports",
      images: "/images/b3fleet.jpg",
      description: "Powerful engines, ergonomic stance, and built for lakefront highway cruises.",
      href: "/bikerentsection",
    },
  ];

  const fleetCategories = categories?.length ? categories : fallbackCategories;

  return (
    <section className="bg-slate-50 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Browse By Type
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Explore Fleet Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose the right ride designed for your route and style.
          </p>
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetCategories.map((item) => (
            <div
              key={item._id}
              className="group flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={
                    item.images ||
                    `${base_url}/api/v1/category/category-photo/${item._id}`
                  }
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/b1fleet.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute bottom-3 left-4 text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-slate-950/70 backdrop-blur px-2.5 py-0.5 rounded-md">
                  Verified Fleet
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.description || "Multi-point inspection completed. Ready for immediate pickup across Udaipur."}
                  </p>
                </div>

                {/* CTA link */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    From ₹400/day
                  </span>
                  <Link
                    to={item.href || `/bikerentsection?category=${item._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors"
                  >
                    <span>View Models</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
