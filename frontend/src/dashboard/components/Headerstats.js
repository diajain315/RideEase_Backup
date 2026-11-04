import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBicycle,
  faTags,
  faCalendarCheck,
  faPlus,
  faArrowRight,
  faMessage,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { BikeAll } from "../../redux/features/Bikes/bikeAction";
import { userAll } from "../../redux/features/User/authAction";
import { CategoryAll } from "../../redux/features/Category/categoryAction";
import { AllOrder } from "../../redux/features/Order/orderAction";

const DashboardOverview = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(BikeAll());
    dispatch(userAll());
    dispatch(CategoryAll());
    dispatch(AllOrder());
  }, [dispatch]);

  const { bikes } = useSelector((state) => state.bike);
  const { users } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const { orders } = useSelector((state) => state.order);

  const totalUsers = users ? users.length : 0;
  const totalBikes = bikes ? bikes.length : 0;
  const totalCategories = categories ? categories.length : 0;
  const totalOrders = orders ? orders.length : 0;

  const statCards = [
    {
      title: "Total Registered Users",
      value: totalUsers,
      icon: faUsers,
      bg: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      link: "/admin/users",
      linkText: "Manage Users",
    },
    {
      title: "Fleet Vehicles",
      value: totalBikes,
      icon: faBicycle,
      bg: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      link: "/admin/bikes",
      linkText: "View Fleet",
    },
    {
      title: "Vehicle Categories",
      value: totalCategories,
      icon: faTags,
      bg: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-100",
      link: "/admin/category",
      linkText: "View Categories",
    },
    {
      title: "Completed Bookings",
      value: totalOrders,
      icon: faCalendarCheck,
      bg: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-100",
      link: "/admin/orders",
      linkText: "View Bookings",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <FontAwesomeIcon icon={faShieldHalved} />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            System Overview & Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time fleet metrics, customer activity, and quick actions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/bikes/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Add New Bike</span>
          </Link>
          <Link
            to="/admin/category/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {stat.title}
                </span>
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.textColor} flex items-center justify-center text-xl shrink-0`}>
                <FontAwesomeIcon icon={stat.icon} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={stat.link}
                className={`text-xs font-bold ${stat.textColor} hover:underline inline-flex items-center gap-1.5`}
              >
                <span>{stat.linkText}</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faBicycle} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Fleet Operations</h3>
              <p className="text-xs text-slate-400">Inventory & tariffs</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Update pricing, maintain specifications, or upload new vehicles to the fleet catalog.
          </p>
          <Link
            to="/admin/bikes"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Open Fleet Manager</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rental Bookings</h3>
              <p className="text-xs text-slate-400">Reservations & schedules</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Inspect customer booking dates, payment statuses, and vehicle assignments.
          </p>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Open Orders Ledger</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faMessage} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Customer Messages</h3>
              <p className="text-xs text-slate-400">Direct inquiries & support</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Respond to visitor questions, corporate booking inquiries, and tourist requests.
          </p>
          <Link
            to="/admin/messages"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <span>View All Messages</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
