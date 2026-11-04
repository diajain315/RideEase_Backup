import React, { useEffect } from "react";
import { Table, Space, Button, Image, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CategoryAll, deleteCategory } from "../../../redux/features/Category/categoryAction";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    dispatch(CategoryAll());
  }, [dispatch]);

  const { loading, categories = [] } = useSelector((state) => state.category);

  const handleEdit = (id) => {
    navigate(`/admin/category/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteCategory(id));
    if (!result.error) {
      message.success("Category deleted successfully!");
      dispatch(CategoryAll());
    } else {
      message.error(result.payload || "Failed to delete category.");
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
      title: "Category Image",
      dataIndex: "_id",
      key: "photo",
      width: 100,
      align: "center",
      render: (id) => (
        <Image
          width={56}
          height={42}
          src={`${base_url}/api/v1/category/category-photo/${id}?timestamp=${Date.now()}`}
          alt="Category"
          style={{ objectFit: "cover", borderRadius: "8px" }}
          className="border border-slate-200"
          fallback="/images/scooter.jpg"
        />
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="font-bold text-slate-900 text-xs sm:text-sm">
          {name}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 180,
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
            title="Delete Category"
            description="Are you sure you want to delete this category?"
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
        dataSource={categories}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: true }}
        locale={{
          emptyText: <div className="py-8 text-slate-400 text-xs">No categories created yet</div>,
        }}
      />
    </div>
  );
};

export default CategoryTable;
