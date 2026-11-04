import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BikeAll, FilterBikes } from "../redux/features/Bikes/bikeAction";
import { CategoryAll } from "../redux/features/Category/categoryAction";
import { Checkbox, Radio, Input } from "antd";
import Layout from "./Layout";
import Loading from "./Loading";
import { Prices } from "../Helper/Prices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faFilter,
  faTimes,
  faListCheck,
  faMoneyBillWave,
  faBroom,
  faBolt,
  faGasPump,
  faGauge,
  faArrowRight,
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

export default function BikeRentSection() {
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();
  const hasMounted = useRef(false);
  const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(CategoryAll());

    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get("category");

    if (categoryId) {
      setChecked([categoryId]);
      dispatch(FilterBikes({ radio: [], checked: [categoryId] }));
    } else {
      dispatch(BikeAll());
    }
  }, [dispatch, location.search]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (!radio.length && !checked.length) {
      dispatch(BikeAll());
    } else {
      dispatch(FilterBikes({ radio, checked }));
    }
  }, [radio, checked, dispatch]);

  const { bikes, loading } = useSelector((state) => state.bike);
  const { categories } = useSelector((state) => state.category);

  const handleFilter = (isChecked, id) => {
    setChecked((prevChecked) =>
      isChecked ? [...prevChecked, id] : prevChecked.filter((c) => c !== id)
    );
  };

  const handleCategoryPill = (id) => {
    if (checked.includes(id)) {
      setChecked(checked.filter((c) => c !== id));
    } else {
      setChecked([id]);
    }
  };

  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    setSearchQuery("");
  };

  // Filter by search query on top of backend filtered results
  const displayedBikes = bikes?.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Layout title="RideEase : Fleet & Rentals">
      <div className="bg-slate-50 min-h-screen">
        {/* Sub-header Banner */}
        <div className="bg-slate-900 border-b border-slate-800 text-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                <FontAwesomeIcon icon={faMotorcycle} />
                <span>Verified Udaipur Fleet</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                Explore Available Two-Wheelers
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Filter by price tariff, category, or search model for immediate pickup.
              </p>
            </div>

            {/* Real-time search bar */}
            <div className="w-full md:w-80">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-3.5 text-slate-400 text-sm"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by model or brand..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Strip */}
        {categories && categories.length > 0 && (
          <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-16 sm:top-18 z-30 shadow-xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChecked([])}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    checked.length === 0
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All Fleet
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => handleCategoryPill(c._id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      checked.includes(c._id)
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0"
              >
                <FontAwesomeIcon icon={faSliders} className="text-emerald-400" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row py-8 px-4 sm:px-6 lg:px-8 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 p-6 rounded-3xl border border-slate-200/80 bg-white h-fit shadow-sm sticky top-36">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-emerald-600 text-xs" />
                Filter Catalog
              </h2>
              {(checked.length > 0 || radio.length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faListCheck} className="text-emerald-500" />
                  Vehicle Category
                </h3>
                <div className="space-y-2">
                  {categories?.map((c) => (
                    <div key={c._id} className="flex items-center">
                      <Checkbox
                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                        checked={checked.includes(c._id)}
                      >
                        <span className="text-xs font-semibold text-slate-700">
                          {c.name}
                        </span>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-emerald-500" />
                  Daily Tariff Range
                </h3>
                <Radio.Group
                  onChange={(e) => setRadio(e.target.value)}
                  value={radio}
                  className="flex flex-col space-y-2.5"
                >
                  {Prices?.map((p) => (
                    <Radio key={p.array} value={p.array}>
                      <span className="text-xs font-semibold text-slate-700">
                        {p.name}
                      </span>
                    </Radio>
                  ))}
                </Radio.Group>
              </div>

              {/* Clear button */}
              <button
                onClick={clearFilters}
                className="w-full mt-4 py-2.5 px-4 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <FontAwesomeIcon icon={faBroom} className="text-slate-400 text-xs" />
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Mobile Filter Modal */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden">
              <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white p-6 overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilter} className="text-emerald-600 text-xs" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Categories
                    </h3>
                    <div className="space-y-2.5">
                      {categories?.map((c) => (
                        <div key={c._id} className="flex items-center">
                          <Checkbox
                            onChange={(e) => handleFilter(e.target.checked, c._id)}
                            checked={checked.includes(c._id)}
                          >
                            <span className="text-xs font-semibold text-slate-700">
                              {c.name}
                            </span>
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Price Range
                    </h3>
                    <Radio.Group
                      onChange={(e) => setRadio(e.target.value)}
                      value={radio}
                      className="flex flex-col space-y-2.5"
                    >
                      {Prices?.map((p) => (
                        <Radio key={p.array} value={p.array}>
                          <span className="text-xs font-semibold text-slate-700">
                            {p.name}
                          </span>
                        </Radio>
                      ))}
                    </Radio.Group>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="flex-1 py-2.5 px-4 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bike Listings Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing {displayedBikes.length} available {displayedBikes.length === 1 ? 'vehicle' : 'vehicles'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-center">
                <Loading fullScreen={false} message="Scanning fleet availability..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBikes.length > 0 ? (
                displayedBikes.map((bike) => (
                  <div
                    key={bike._id}
                    className="group flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <img
                        alt={bike.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={`${base_url}/api/v1/bike/bike-photo/${bike._id}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/b1fleet.jpg";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faMotorcycle} className="text-[10px]" />
                        <span>{bike.category?.name || "Vehicle"}</span>
                      </div>
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                        {bike.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                          {bike.name}
                        </h2>

                        {/* Specs Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {bike.petrolCapacity && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                              <FontAwesomeIcon icon={faGasPump} className="text-emerald-600" />
                              {bike.petrolCapacity}L Tank
                            </span>
                          )}
                          {bike.startType && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
                              {bike.startType}
                            </span>
                          )}
                          {bike.kilometers && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                              <FontAwesomeIcon icon={faGauge} className="text-sky-500" />
                              {bike.kilometers} km
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Per Day</p>
                          <p className="text-2xl font-black text-slate-900">
                            ₹{bike.price}
                          </p>
                        </div>
                        <Link
                          to={`/order/${bike.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-bold text-slate-950 uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                        >
                          <span>Rent Now</span>
                          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-200">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-2xl mb-4">
                    <FontAwesomeIcon icon={faMotorcycle} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    No Matching Vehicles Found
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your category filter, price range, or clearing the search keyword.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                  >
                    <FontAwesomeIcon icon={faBroom} />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}
            </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
