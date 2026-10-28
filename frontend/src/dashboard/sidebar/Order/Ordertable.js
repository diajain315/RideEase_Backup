import React, { useState, useEffect, useMemo } from "react";
import { Table, Select, Tag, Spin, Empty } from "antd";
import { DownloadOutlined, ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AllOrder, updateStatus } from "../../../redux/features/Order/orderAction";
import toast from "react-hot-toast";
import moment from "moment";
import Layout from "../../../components/Layout";

const { Option } = Select;

const statusColors = {
  "Not Processed": "orange",
  Processing: "blue",
  Shipped: "cyan",
  Delivered: "emerald",
  Cancelled: "red",
};

const Ordertable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState([]);
  const { loading, error } = useSelector((state) => state.order);

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbyc91E-hYf1VqP-5911uE7-YxJ5e1j2i3V-q-2h4j-1b3-4x5/exec";

  const sendOrdersToGoogleSheet = async (orders) => {
    for (const order of orders) {
      const formData = new FormData();
      formData.append("Bikename", order.bikes?.name || "N/A");
      formData.append("Bike_number", order.bikes?.number || "N/A");
      formData.append("Renter_name", order.renter?.name || "N/A");
      formData.append("Total_Amount", order.totalAmt);
      formData.append("Start_Date", order.startDate);
      formData.append("End_Date", order.endDate);
      formData.append("Status", order.status);
      formData.append("object_id", order.orderId);

      try {
        await fetch(scriptURL, {
          method: "POST",
          body: formData,
        });
      } catch (err) {
        console.error("Error sending order to Google Sheet:", err);
      }
    }
  };

  useEffect(() => {
    dispatch(AllOrder()).then((res) => {
      const allOrders = Array.isArray(res?.payload)
        ? res.payload
        : Array.isArray(res?.payload?.orders)
        ? res.payload.orders
        : [];
      
      const sentOrderIds = JSON.parse(localStorage.getItem("sent_order_ids")) || [];
      const newOrders = allOrders.filter((order) => !sentOrderIds.includes(order._id));

      if (newOrders.length > 0) {
        sendOrdersToGoogleSheet(newOrders);
        const updatedSentIds = [...sentOrderIds, ...newOrders.map((order) => order._id)];
        localStorage.setItem("sent_order_ids", JSON.stringify(updatedSentIds));
      }

      setLocalOrders(allOrders);
    });
  }, [dispatch]);

  const statusOptions = useMemo(
    () => ["Not Processed", "Processing", "Cancelled"],
    []
  );

  const handleChange = (orderId, value) => {
    setLocalOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: value } : order
      )
    );
    dispatch(updateStatus({ orderId, status: value }));
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
      "Total Amount",
      "Start Date",
      "End Date",
      "Status"
    ];

    const rows = localOrders.map((order, index) => {
      const startDate = order?.startDate ? moment(order.startDate).format("YYYY-MM-DD") : "";
      const endDate = order?.endDate ? moment(order.endDate).format("YYYY-MM-DD") : "";

      return [
        index + 1,
        order?.bikes?.name || "",
        order?.bikes?.number || "",
        order?.renter?.name || "",
        order?.totalAmt || "",
        startDate,
        endDate,
        order?.status || ""
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => {
              let text = String(cell).replace(/"/g, '""');
              if (text.includes(",") || text.includes('"')) {
                text = `"${text}"`;
              }
              return text;
            })
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RideEase_Orders_${moment().format("YYYYMMDD")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          value={status}
          className="w-36 text-xs"
          onChange={(value) => handleChange(record._id, value)}
        >
          {statusOptions.map((option) => (
            <Option key={option} value={option}>
              <Tag color={statusColors[option] || "default"} className="rounded-full px-2 py-0 text-[11px] font-semibold">
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
