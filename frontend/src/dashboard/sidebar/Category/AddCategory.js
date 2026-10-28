import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined, ArrowLeftOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../redux/features/Category/categoryAction";
import { clearFields } from "../../../redux/features/Category/categorySlice";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";

const AddCategory = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const { loading, success } = useSelector((state) => state.category);

  useEffect(() => {
    if (success) {
      message.success("Category added successfully!");
      dispatch(clearFields());
      navigate("/admin/category");
    }
  }, [success, dispatch, navigate]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Only image files are allowed!");
      return Upload.LIST_IGNORE;
    }
    setImageFile(file);
    return false;
  };

  const onFinish = async (values) => {
    if (!imageFile) {
      message.error("Please upload a category image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("photo", imageFile);

    dispatch(addCategory(formData));
  };

  return (
    <Layout title="Dashboard : Add Category">
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)] flex justify-center">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/category')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                title="Back to Categories"
              >
                <ArrowLeftOutlined />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <AppstoreOutlined className="text-emerald-600" />
                  Create Category
                </h1>
                <p className="text-xs text-slate-500">Add a new classification for your fleet vehicles</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
              <Form.Item
                label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Category Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input category name!" }]}
              >
                <Input placeholder="e.g. Electric Scooters, Cruisers, Sport Bikes" className="rounded-xl border-slate-200 py-2.5" />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Category Cover Photo</span>}
                name="photo"
                rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <Upload beforeUpload={beforeUpload} listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />} className="rounded-xl">Select Photo</Button>
                </Upload>
              </Form.Item>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button onClick={() => navigate('/admin/category')} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-600/20 border-none px-6"
                >
                  Create Category
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
