import React, { useState, useEffect, useMemo } from "react";
import { Table, Select, Tag, Spin, Empty, Button } from "antd";
import { DownloadOutlined, ArrowLeftOutlined, ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AllOrder, updateStatus } from "../../../redux/features/Order/orderAction";
import toast from "react-hot-toast";
import moment from "moment";
import Layout from "../../../components/Layout";
import Http from "../../../Helper/Http";
import {
  RENTAL_STATUS_OPTIONS,
  RENTAL_STATUS_COLORS,
  normalizeRentalStatus,
} from "../../../common/rentalStatuses";

const { Option } = Select;

const Ordertable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState([]);
  const [loadingDocId, setLoadingDocId] = useState(null);
  const { loading, error } = useSelector((state) => state.order);

  // Handle viewing a specific user's license document
  const handleShowLicense = async (userId) => {
    if (!userId) return;
    try {
      setLoadingDocId(userId);
      const res = await Http.get(`/api/v1/auth/user-license/${userId}`, {
        responseType: "blob",
      });
      const contentType = res.headers["content-type"] || "application/pdf";
      const blob = new Blob([res.data], { type: contentType });
      const docUrl = window.URL.createObjectURL(blob);
      window.open(docUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err.response?.data?.message || "No license document found for this user.");
    } finally {
      setLoadingDocId(null);
    }
  };

  useEffect(() => {
    dispatch(AllOrder()).then((res) => {
      const allOrders = Array.isArray(res?.payload)
        ? res.payload
        : Array.isArray(res?.payload?.orders)
        ? res.payload.orders
        : [];
      
      setLocalOrders(allOrders);
    });
  }, [dispatch]);

  const statusOptions = useMemo(() => RENTAL_STATUS_OPTIONS, []);

  const handleChange = async (orderId, value) => {
    const previousOrders = localOrders;
    setLocalOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: value } : order
      )
    );
    try {
      await dispatch(updateStatus({ orderId, status: value })).unwrap();
      toast.success(`Booking status updated to "${value}"`);
    } catch (err) {
      setLocalOrders(previousOrders);
      toast.error(typeof err === "string" ? err : "Failed to update booking status");
    }
  };

  const downloadCSV = () => {
    if (!localOrders?.length) {
      toast.error("No orders available to export");
      return;
    }

    const headers = [
      "SN",
      "Bike Name",
      "Bike Number",
      "Rented User",
      "Driver License",
      "Total Amount",
      "Start Date",
      "End Date",
      "Status"
    ];

    const rows = localOrders.map((order, index) => {
      const formattedStartDate =
        order?.startDate && moment(order.startDate).isValid()
          ? moment(order.startDate).format("DD/MM/YYYY")
          : (order?.startDate || "");
      const formattedEndDate =
        order?.endDate && moment(order.endDate).isValid()
          ? moment(order.endDate).format("DD/MM/YYYY")
          : (order?.endDate || "");

      // Force Excel text evaluation so narrow columns never trigger the Date '########' overflow
      const startDate = formattedStartDate ? `="${formattedStartDate}"` : "";
      const endDate = formattedEndDate ? `="${formattedEndDate}"` : "";

      return [
        index + 1,
        order?.bikes?.name || "",
        order?.bikes?.number || "",
        order?.renter?.name || "N/A",
        order?.renter ? (order?.renter?.hasLicense ? "Verified" : "Not Uploaded") : "N/A",
        order?.totalAmt || "",
        startDate,
        endDate,
        normalizeRentalStatus(order?.status)
      ];
    });

    const csvString = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const str = cell === null || cell === undefined ? "" : String(cell);
            if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvString], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `RideEase_Orders_${moment().format("YYYYMMDD")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "S.N.",
      key: "sn",
      render: (_, __, index) => <span className="text-xs text-slate-400 font-semibold">{index + 1}</span>,
      width: 60,
      align: "center",
    },
    {
      title: "Vehicle",
      key: "vehicle",
      render: (_, record) => (
        <div>
          <div className="font-bold text-slate-900 text-xs sm:text-sm">{record?.bikes?.name || "N/A"}</div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            {record?.bikes?.number || "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Renter",
      dataIndex: ["renter", "name"],
      key: "renter",
      render: (name) => <span className="font-medium text-slate-800 text-xs sm:text-sm">{name || "N/A"}</span>,
    },
    {
      title: "Driver License",
      key: "license",
      align: "center",
      render: (_, record) => {
        const renter = record?.renter;
        const renterId = renter?._id || (typeof renter === "string" ? renter : null);
        if (!renter || !renterId || !renter?.name) {
          return <span className="text-xs text-slate-400 font-medium">N/A</span>;
        }

        const hasLicense = renter.hasLicense || Boolean(renter.licenseNumber);
        if (hasLicense) {
          return (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleShowLicense(renterId)}
              loading={loadingDocId === renterId}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              Show
            </Button>
          );
        }

        return (
          <span className="text-xs text-slate-400 font-medium">Not Uploaded</span>
        );
      },
    },
    {
      title: "Tariff Total",
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
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => <span className="text-xs text-slate-600 font-medium">{date ? moment(date).format("DD/MM/YYYY") : "—"}</span>,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => <span className="text-xs text-slate-600 font-medium">{date ? moment(date).format("DD/MM/YYYY") : "—"}</span>,
    },
    {
      title: "Rental Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => (
        <Select
          value={normalizeRentalStatus(status)}
          className="w-52 text-xs"
          onChange={(value) => handleChange(record._id, value)}
        >
          {statusOptions.map((option) => (
            <Option key={option} value={option}>
              <Tag color={RENTAL_STATUS_COLORS[option] || "default"} className="rounded-full px-2 py-0 text-[11px] font-semibold">
                {option}
              </Tag>
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Layout title="Dashboard : Rental Orders">
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
              title="Back to Dashboard"
            >
              <ArrowLeftOutlined />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShoppingCartOutlined className="text-emerald-600" />
                Customer Booking Ledger
              </h1>
              <p className="text-xs text-slate-500">Track all reservations, payments, and rental lifecycles</p>
            </div>
          </div>

          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <DownloadOutlined />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <Spin size="large" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                dataSource={Array.isArray(localOrders) ? localOrders : []}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 10, showSizeChanger: true }}
                locale={{
                  emptyText: <div className="py-8 text-slate-400 text-xs">No rental bookings found</div>,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Ordertable;
