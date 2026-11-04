import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetOrder } from "../redux/features/Order/orderAction";
import { Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMotorcycle, faCalendarAlt, faListCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Layout from "./Layout";
import moment from "moment";

const statusColors = {
  "Not Processed": "orange",
  Processing: "blue",
  Shipped: "cyan",
  Delivered: "emerald",
  Cancelled: "red",
};

const OrderDropdown = () => {
  const dispatch = useDispatch();
  const { userOrders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(GetOrder());
  }, [dispatch]);

  const columns = [
    {
      title: "S.N.",
      key: "sn",
      render: (_, __, index) => <span className="text-xs text-slate-400 font-semibold">{index + 1}</span>,
      width: 60,
      align: "center",
    },
    {
      title: "Rented Vehicle",
      key: "bike",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shrink-0">
            <FontAwesomeIcon icon={faMotorcycle} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs sm:text-sm">
              {record.bikes?.name || "Vehicle"}
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {record.bikes?.number || "—"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Rental Duration",
      key: "duration",
      render: (_, record) => (
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-semibold text-slate-400">From:</span>
            <span className="font-medium text-slate-700">
              {record.startDate ? moment(record.startDate).format("DD MMM YYYY") : "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-semibold text-slate-400">To:</span>
            <span className="font-medium text-slate-700">
              {record.endDate ? moment(record.endDate).format("DD MMM YYYY") : "—"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Tariff Paid",
      dataIndex: "totalAmt",
      key: "totalAmt",
      align: "center",
      render: (amt) => (
        <span className="font-bold text-emerald-600 text-xs sm:text-sm">
          ₹{amt || 0}
        </span>
      ),
    },
    {
      title: "Booking Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={statusColors[status] || "default"} className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
          {status || "Confirmed"}
        </Tag>
      ),
    },
  ];

  return (
    <Layout title="RideEase : My Bookings">
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-2">
                <FontAwesomeIcon icon={faListCheck} className="text-emerald-500" />
                Booking Ledger
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                My Rental Bookings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                View your confirmed ride history, active rentals, and receipts
              </p>
            </div>

            <Link
              to="/bikerentsection"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Explore Fleet</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {userOrders && userOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table
                  dataSource={userOrders}
                  columns={columns}
                  rowKey="_id"
                  loading={loading}
                  pagination={{ pageSize: 8, showSizeChanger: true }}
                />
              </div>
            ) : (
              <div className="py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl mb-4">
                  <FontAwesomeIcon icon={faMotorcycle} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Rental Bookings Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                  You haven't rented any two-wheelers yet. Find your ride and hit the open road today!
                </p>
                <Link
                  to="/bikerentsection"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
                >
                  Browse Available Bikes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDropdown;
