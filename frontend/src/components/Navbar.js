import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoggedInUser } from "../redux/features/User/authAction";
import { logout } from "../redux/features/User/authSlice";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Navbar({ scrolled }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      dispatch(LoggedInUser());
    }
  }, [dispatch]);

  const { userInfo } = useSelector((state) => state.auth);

  const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const displayUserInfo = userInfo || userInfoFromStorage;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userId");
    localStorage.removeItem("serverInstanceId");
    sessionStorage.clear();
    navigate("/");
    setMenuOpen(false);
  };

  const navItems = [
    { title: "Home", path: "/" },
    { title: "Our Fleet", path: "/bikerentsection" },
    { title: "Attractions", path: "/attractions" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
    { title: "FAQs", path: "/faqs" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-slate-200/90 shadow-sm"
          : "bg-white/90 backdrop-blur-sm border-slate-200/70"
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Balanced & Sleek */}
        <Link
          to="/"
          className="flex items-center transition-transform hover:scale-105"
          onClick={() => setMenuOpen(false)}
        >
          <img
            className="h-9 sm:h-10 w-auto object-contain"
            src="/images/BikeForRentFinalLogo.png?v=2"
            alt="RideEase Logo"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center space-x-1 lg:space-x-2 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-xl px-3.5 py-2 text-xs lg:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.title}
              </Link>
            );
          })}

          {/* User Account / Login */}
          <div className="ml-3 pl-3 border-l border-slate-200">
            {displayUserInfo ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1.5 pr-3 text-xs font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none">
                  <img
                    src={
                      displayUserInfo.gender === "female"
                        ? "/avatarfemale.jpeg"
                        : "/avatarmale.png"
                    }
                    alt="avatar"
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <span className="max-w-[100px] truncate text-slate-800">
                    {displayUserInfo.name}
                  </span>
                  <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-100"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl bg-white border border-slate-200 p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[11px] text-slate-400 font-medium">Signed in as</p>
                      <p className="truncate text-xs font-bold text-slate-900">
                        {displayUserInfo.email || displayUserInfo.name}
                      </p>
                    </div>

                    {/* Profile */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/userProfile"
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            active
                              ? "bg-slate-50 text-emerald-600"
                              : "text-slate-700"
                          }`}
                        >
                          <UserCircleIcon className="h-4 w-4 text-slate-400" />
                          My Profile
                        </Link>
                      )}
                    </Menu.Item>

                    {/* My Bookings */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/orderdropdown"
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            active
                              ? "bg-slate-50 text-emerald-600"
                              : "text-slate-700"
                          }`}
                        >
                          <ClipboardDocumentListIcon className="h-4 w-4 text-slate-400" />
                          My Bookings
                        </Link>
                      )}
                    </Menu.Item>

                    {/* Admin Dashboard */}
                    {displayUserInfo?.role === 1 && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin"
                            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                              active
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-emerald-600"
                            }`}
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                            Admin Portal
                          </Link>
                        )}
                      </Menu.Item>
                    )}

                    <div className="my-1 border-t border-slate-100"></div>

                    {/* Logout */}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                            active
                              ? "bg-rose-50 text-rose-600"
                              : "text-slate-600"
                          }`}
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 px-4 pb-6 pt-3 backdrop-blur-xl">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            {displayUserInfo ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl mb-2">
                  <img
                    src={
                      displayUserInfo.gender === "female"
                        ? "/avatarfemale.jpeg"
                        : "/avatarmale.png"
                    }
                    alt="avatar"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      {displayUserInfo.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {displayUserInfo.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/userProfile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                >
                  <UserCircleIcon className="h-5 w-5 text-slate-400" />
                  My Profile
                </Link>

                <Link
                  to="/orderdropdown"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 text-slate-400" />
                  My Bookings
                </Link>

                {displayUserInfo?.role === 1 && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
                  >
                    <ShieldCheckIcon className="h-5 w-5" />
                    Admin Portal
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  Sign In to Book
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Create New Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
