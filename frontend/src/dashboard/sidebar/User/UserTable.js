import React, { useEffect, useState } from "react";
import { Table, Tag, Tooltip, Button, Space, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAll, deleteUserById } from "../../../redux/features/User/authAction";
import Http from "../../../Helper/Http";
import {
  UserOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import moment from "moment";

const UserTable = ({ searchText = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingDocId, setLoadingDocId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(userAll());
  }, [dispatch]);

  const { users, loading, userInfo } = useSelector((state) => state.auth);

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
      message.error(err.response?.data?.message || "No license document found for this user.");
    } finally {
      setLoadingDocId(null);
    }
  };

  // Handle user deletion with confirmation
  const handleDelete = async (userId) => {
    try {
      const res = await dispatch(deleteUserById(userId));
      if (!res.error) {
        message.success("User deleted successfully from database!");
        dispatch(userAll());
      } else {
        message.error(res.payload || "Failed to delete user.");
      }
    } catch (e) {
      message.error("Failed to delete user.");
    }
  };

  // Filter users based on searchText (case-insensitive match on name or email)
  const filteredUsers = users?.filter((user) =>
    user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.phone?.includes(searchText)
  );

  const columns = [
    {
      title: "User",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
            {(record.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-xs sm:text-sm">
              {record.name || "—"}
            </div>
            <div className="text-slate-500 text-[11px] font-mono">
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => (
        <Tag
          color={role === 1 ? "emerald" : "blue"}
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
        >
          {role === 1 ? "Admin" : "Customer"}
        </Tag>
      ),
    },
    {
      title: "Bookings",
      key: "ordersCount",
      align: "center",
      render: (_, record) => {
        const count = record.ordersCount || 0;
        return count > 0 ? (
          <Tag color="purple" className="rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1 w-fit mx-auto">
            <ShoppingCartOutlined /> {count} {count === 1 ? "Rental" : "Rentals"}
          </Tag>
        ) : (
          <span className="text-xs text-slate-400">0 Rentals</span>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span className="text-xs text-slate-700 font-mono">{phone || "—"}</span>,
    },
    {
      title: "Driver License",
      key: "license",
      align: "center",
      render: (_, record) => {
        const hasLicense = record.hasLicense || Boolean(record.licenseNumber);
        if (hasLicense) {
          return (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleShowLicense(record._id)}
              loading={loadingDocId === record._id}
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
      title: "Registered Date",
      key: "createdAt",
      render: (_, record) => (
        record.createdAt ? (
          <div className="text-xs text-slate-600">
            <div className="font-medium text-slate-800">
              {moment(record.createdAt).format("DD MMM YYYY, hh:mm A")}
            </div>
            <div className="text-[10px] text-slate-400">
              {moment(record.createdAt).fromNow()}
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const isSelf = userInfo?._id && String(userInfo._id) === String(record._id);
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/users/edit/${record._id}`)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs cursor-pointer"
            >
              Edit
            </Button>
            {isSelf ? (
              <Tooltip title="You cannot delete your own admin account">
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  disabled
                  className="rounded-lg text-xs opacity-50"
                >
                  Delete
                </Button>
              </Tooltip>
            ) : (
              <Popconfirm
                title="Delete User Account"
                description={`Are you sure you want to permanently delete "${record.name}"? This will remove them from the database.`}
                onConfirm={() => handleDelete(record._id)}
                okText="Yes, Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  className="rounded-lg text-xs cursor-pointer"
                >
                  Delete
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const dataSource = filteredUsers?.map((user, index) => ({
    key: user._id || index,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    gender: user.gender,
    phone: user.phone,
    hasLicense: Boolean(user.hasLicense || (user.licenseFile && user.licenseFile.data) || user.licenseNumber),
    ordersCount: user.ordersCount || 0,
    createdAt: user.createdAt,
  }));

  return (
    <div>
      <div className="p-3.5 bg-slate-50/60 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <span>
          Total Users: <strong className="text-slate-800">{users?.length || 0}</strong> registered accounts
        </span>
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => dispatch(userAll())}
          loading={loading}
          className="rounded-lg text-xs"
        >
          Refresh Directory
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "20", "50", "100"],
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} users`,
          }}
          onChange={(newPagination) => {
            setPagination({
              current: newPagination.current,
              pageSize: newPagination.pageSize,
            });
          }}
          locale={{
            emptyText: <div className="py-8 text-slate-400 text-xs">No users found</div>,
          }}
        />
      </div>
    </div>
  );
};

export default UserTable;
