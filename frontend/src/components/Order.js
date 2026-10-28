import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBikeBySlug } from "../redux/features/Bikes/bikeAction";
import { AddOrder } from "../redux/features/Order/orderAction";
import { clearFields } from "../redux/features/Order/orderSlice";
import { DatePicker, Button, Modal, Tag, message as antMessage } from "antd";
import { LockOutlined, CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import Spinner from "../Helper/Spinner";
import Loading from "./Loading";
import Error from "../Helper/Error";
import Http from "../Helper/Http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faCalendarAlt,
  faGasPump,
  faCalendarCheck,
  faMoneyBillWave,
  faRoad,
  faCog,
  faCalendarTimes,
  faShieldHalved,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const { RangePicker } = DatePicker;

export default function Order() {
  const [error, setError] = useState("");
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [days, setDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // 🔒 Booked / Locked date ranges for this bike
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const { bikeBySlug } = useSelector((state) => state.bike);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    dispatch(getBikeBySlug(slug));
  }, [dispatch, slug]);

  // Fetch booked slots whenever bikeBySlug is loaded
  const fetchBookedSlots = useCallback(async (bikeId) => {
    if (!bikeId) return;
    try {
      setLoadingSlots(true);
      const res = await Http.get(`/api/v1/order/bike-booked-slots/${bikeId}`);
      if (res.data?.bookedSlots) {
        setBookedSlots(res.data.bookedSlots);
      }
    } catch (e) {
      console.warn("Could not fetch bike booked slots:", e?.message);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (bikeBySlug?._id) {
      fetchBookedSlots(bikeBySlug._id);
    }
  }, [bikeBySlug?._id, fetchBookedSlots]);

  useEffect(() => {
    if (bikeBySlug) {
      setTotalAmount(days * bikeBySlug.price);
    }
  }, [days, bikeBySlug]);

  // 🛑 Strict check to disable past dates AND any dates already booked by others
  const disabledDate = (current) => {
    if (!current) return false;
    // 1. Disable past dates
    if (current < moment().startOf("day")) return true;

    // 2. Disable dates where this vehicle is already booked and locked
    const currentStr = current.format("YYYY-MM-DD");
    const isBooked = bookedSlots.some(
      (slot) => currentStr >= slot.startDate && currentStr <= slot.endDate
    );
    return isBooked;
  };

  const selectTimeSlots = (values) => {
    if (!values || values.length === 0) {
      setFrom(null);
      setTo(null);
      setDays(0);
      return;
    }
    const [start, end] = values;
    const startStr = start.format("YYYY-MM-DD");
    const endStr = end.format("YYYY-MM-DD");

    // 🛑 Concurrency check: Ensure no booked dates fall inside the selected range
    const conflict = bookedSlots.find(
      (slot) => startStr <= slot.endDate && endStr >= slot.startDate
    );

    if (conflict) {
      antMessage.error(
        `Selected dates overlap with an existing booking (${moment(conflict.startDate).format("DD MMM")} – ${moment(conflict.endDate).format("DD MMM")}). Please select available dates.`
      );
      setFrom(null);
      setTo(null);
      setDays(0);
      return;
    }

    const duration = moment.duration(end.diff(start));
    const calculatedDays = Math.max(1, Math.round(duration.asDays()));

    setFrom(startStr);
    setTo(endStr);
    setDays(calculatedDays);
    setError("");
  };

  const showModal = () => setOpen(true);
  const hideModal = () => setOpen(false);

  const submitModal = async () => {
    setOpen(false);

    const currentUser =
      userInfo ||
      (localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null);

    if (!currentUser) {
      navigate("/login", {
        state: {
          from: `/order/${slug}`,
          orderData: { from, to, totalAmount, bikeId: bikeBySlug?._id },
        },
      });
      return;
    }

    try {
      setSubmittingOrder(true);
      const formData = {
        totalAmt: totalAmount,
        startDate: from,
        endDate: to,
        bikeId: bikeBySlug?._id,
      };

      const data = await dispatch(AddOrder(formData));

      // 🛑 Concurrency / date conflict protection check:
      if (data.error) {
        const errorMsg =
          data.payload ||
          "This vehicle was just booked by another user for these dates! Please choose different dates.";
        setError(errorMsg);
        antMessage.error(errorMsg);
        dispatch(clearFields());
        // Refresh booked slots to reflect the newly locked dates
        if (bikeBySlug?._id) {
          fetchBookedSlots(bikeBySlug._id);
        }
        return; // 🛑 DO NOT NAVIGATE ON ERROR
      }

      const orderId = data?.payload?._id;
      navigate("/Terms", {
        state: { from, to, totalAmount, bikeId: bikeBySlug?._id, orderId },
      });
    } catch (err) {
      console.error("Order submission failed", err);
      antMessage.error("Could not place order. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {bikeBySlug ? (
        <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Bike Visual Column */}
            <div className="relative bg-slate-900 p-8 flex flex-col justify-between overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  Verified Fleet
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md">
                  {bikeBySlug.number || "Available"}
                </span>
              </div>

              <div className="relative z-10 my-8 flex items-center justify-center">
                <img
                  alt={bikeBySlug.name}
                  className="max-h-72 w-full object-contain rounded-2xl drop-shadow-2xl transition-transform hover:scale-105 duration-300"
                  src={`${base_url}/api/v1/bike/bike-photo/${bikeBySlug._id}`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/b1fleet.jpg";
                  }}
                />
              </div>

              {/* Highlights below image */}
              <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4 text-center">
                <div className="rounded-xl bg-slate-800/60 p-2.5">
                  <p className="text-xs text-slate-400 font-medium">Category</p>
                  <p className="text-sm font-bold text-white mt-0.5">{bikeBySlug.category?.name || "Motorcycle"}</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-2.5">
                  <p className="text-xs text-slate-400 font-medium">Engine</p>
                  <p className="text-sm font-bold text-white mt-0.5">{bikeBySlug.cc || 350} CC</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-2.5">
                  <p className="text-xs text-slate-400 font-medium">Daily Rate</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">₹{bikeBySlug.price}</p>
                </div>
              </div>
            </div>

            {/* Rental Configurator Column */}
            <div className="p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {bikeBySlug.name}
                  </h1>
                  <span className="text-lg font-bold text-emerald-600">
                    ₹{bikeBySlug.price} <span className="text-xs text-slate-500 font-normal">/ day</span>
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {bikeBySlug.description ||
                    "Top-tier motorcycle with smooth suspension, verified disc brakes, and complete legal documentation for hassle-free rides."}
                </p>

                {/* Specs Pill List */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <FontAwesomeIcon icon={faCog} className="text-sm" />
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase">Start Type</p>
                      <p className="text-sm font-bold text-slate-800">{bikeBySlug.startType || "Self Start"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-sm" />
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase">Model Year</p>
                      <p className="text-sm font-bold text-slate-800">{bikeBySlug.year || "2023"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <FontAwesomeIcon icon={faGasPump} className="text-sm" />
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase">Fuel Capacity</p>
                      <p className="text-sm font-bold text-slate-800">{bikeBySlug.petrolCapacity || 10} Litres</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                      <FontAwesomeIcon icon={faRoad} className="text-sm" />
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase">Odometer</p>
                      <p className="text-sm font-bold text-slate-800">{bikeBySlug.kilometers || 5000} km used</p>
                    </div>
                  </div>
                </div>

                {/* 🔒 Live Availability & Locked Dates Notice */}
                {bookedSlots.length > 0 ? (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5 mb-1.5 text-amber-800 text-xs uppercase tracking-wider">
                      <LockOutlined className="text-amber-600 text-sm" />
                      Locked Dates for this Vehicle ({bookedSlots.length} active booking{bookedSlots.length > 1 ? "s" : ""})
                    </div>
                    <p className="text-[11px] text-amber-700 mb-2 leading-relaxed">
                      This vehicle is already rented on the dates below. These dates are <strong>locked on the calendar</strong> and cannot be booked by any other user:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bookedSlots.map((slot, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-amber-900 font-semibold text-xs border border-amber-300 shadow-xs"
                        >
                          <LockOutlined className="text-amber-600 text-[10px]" />
                          {moment(slot.startDate).format("DD MMM YYYY")} – {moment(slot.endDate).format("DD MMM YYYY")}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircleOutlined className="text-emerald-600 text-sm shrink-0" />
                    <span>
                      <strong>100% Available:</strong> No active bookings on this vehicle. Select any dates to reserve!
                    </span>
                  </div>
                )}

                {/* Rental Calculator Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-emerald-600 text-sm" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Select Rental Duration
                    </h2>
                  </div>

                  <RangePicker
                    format="DD MMMM YYYY"
                    disabledDate={disabledDate}
                    onChange={selectTimeSlots}
                    value={from && to ? [moment(from, "YYYY-MM-DD"), moment(to, "YYYY-MM-DD")] : null}
                    className="w-full py-2.5 rounded-xl border-slate-300 shadow-sm"
                  />

                  {days > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Duration:</span>
                        <span className="font-semibold text-slate-800">{days} day(s)</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Daily Rate:</span>
                        <span className="font-semibold text-slate-800">₹{bikeBySlug.price}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                        <span className="font-bold text-slate-900">Total Payable:</span>
                        <span className="text-2xl font-black text-emerald-600">₹{totalAmount}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={showModal}
                  disabled={!to || !from || submittingOrder}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    to && from && !submittingOrder
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <FontAwesomeIcon icon={faMotorcycle} />
                  <span>
                    {submittingOrder
                      ? "Securing Booking..."
                      : to && from
                      ? `Proceed to Book · ₹${totalAmount}`
                      : "Select Available Dates"}
                  </span>
                </button>
              </div>

              {/* Confirmation Modal */}
              <Modal
                title={
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <FontAwesomeIcon icon={faCalendarCheck} className="text-emerald-600" />
                    <span>Confirm Rental Booking</span>
                  </div>
                }
                open={open}
                onOk={submitModal}
                confirmLoading={submittingOrder}
                onCancel={hideModal}
                okText="Proceed to Terms & Payment"
                okButtonProps={{
                  className: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold border-none",
                }}
              >
                <div className="py-3 space-y-3 text-slate-700">
                  <p>
                    You are booking <strong>{bikeBySlug.name}</strong> for <strong>{days} day(s)</strong>:
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div><strong>Start Date:</strong> {moment(from).format("DD MMMM YYYY")}</div>
                    <div><strong>End Date:</strong> {moment(to).format("DD MMMM YYYY")}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 flex justify-between items-center">
                    <span className="text-sm font-semibold">Total Amount:</span>
                    <span className="text-xl font-extrabold text-emerald-600">₹{totalAmount}</span>
                  </div>
                </div>
              </Modal>

              {error && (
                <div className="mt-4">
                  <Error>{error}</Error>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-20">
          <Loading fullScreen={false} message="Loading vehicle specifications..." />
        </div>
      )}
    </div>
  );
}
