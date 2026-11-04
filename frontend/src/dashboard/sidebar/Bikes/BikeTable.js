import React, { useEffect } from "react";
import { Table, Tag, Space, Button, Image, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BikeAll, deleteBike } from "../../../redux/features/Bikes/bikeAction";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const BikeTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    dispatch(BikeAll());
  }, [dispatch]);

  const { bikes, loading } = useSelector((state) => state.bike);

  const handleEdit = (id) => {
    navigate(`/admin/bikes/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteBike(id));
    if (!result.error) {
      message.success("Bike deleted successfully!");
      dispatch(BikeAll());
    } else {
      message.error("Failed to delete bike.");
    }
  };

  const columns = [
    {
      title: "S.N.",
      key: "index",
      render: (_, __, index) => <span className="text-xs text-slate-400 font-semibold">{index + 1}</span>,
      width: 60,
      align: "center",
    },
    {
      title: "Vehicle",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <Image
            width={54}
            height={42}
            src={`${base_url}/api/v1/bike/bike-photo/${record._id}?timestamp=${Date.now()}`}
            alt={name}
            style={{ objectFit: "cover", borderRadius: "8px" }}
            className="border border-slate-200"
          />
          <div>
            <div className="font-bold text-slate-900 text-xs sm:text-sm">{name}</div>
            <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {record.number}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => (
        <Tag color="cyan" className="rounded-full text-[11px] font-semibold uppercase px-2.5">
          {cat?.name || "General"}
        </Tag>
      ),
    },
    {
      title: "Rate / Day",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-bold text-emerald-600 text-xs sm:text-sm">
          ₹{price}
        </span>
      ),
    },
    {
      title: "Specs",
      key: "specs",
      render: (_, record) => (
        <div className="text-[11px] text-slate-600 space-y-0.5">
          <div><span className="text-slate-400">Tank:</span> {record.petrolCapacity || "—"} L</div>
          <div><span className="text-slate-400">Odo:</span> {record.kilometers || 0} km</div>
        </div>
      ),
    },
    {
      title: "Model Year",
      dataIndex: "year",
      key: "year",
      align: "center",
      render: (year) => <span className="text-xs text-slate-600 font-medium">{year || "—"}</span>,
    },
    {
      title: "Start Type",
      dataIndex: "startType",
      key: "startType",
      align: "center",
      render: (type) => (
        <span className="text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
          {type || "Self"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Vehicle"
            description="Are you sure you want to remove this bike from the catalog?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              className="rounded-lg text-xs"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={bikes}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: true }}
        locale={{
          emptyText: <div className="py-8 text-slate-400 text-xs">No vehicles in fleet catalog</div>,
        }}
      />
    </div>
  );
};

export default BikeTable;
