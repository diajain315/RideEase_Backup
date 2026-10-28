import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Select, InputNumber, message, Spin } from "antd";
import { UploadOutlined, ArrowLeftOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBike } from "../../../redux/features/Bikes/bikeAction";
import { clearFields } from "../../../redux/features/Bikes/bikeSlice";
import { CategoryAll } from "../../../redux/features/Category/categoryAction";
import Layout from "../../../components/Layout";

const { Option } = Select;

const AddBike = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    dispatch(CategoryAll());
  }, [dispatch]);

  const { categories = [] } = useSelector((state) => state.category);
  const { loading, success } = useSelector((state) => state.bike);

  useEffect(() => {
    if (success) {
      message.success("Bike added successfully!");
      dispatch(clearFields());
      navigate("/admin/bikes");
    }
  }, [success, dispatch, navigate]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    setImageFile(file);
    return false;
  };

  const onFinish = (values) => {
    if (!imageFile) {
      message.error("Please upload a bike image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("number", values.number);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("startType", values.startType);
    formData.append("year", values.year);
    formData.append("kilometers", values.kilometers);
    formData.append("petrolCapacity", values.petrolCapacity);
    formData.append("photo", imageFile);

    dispatch(addBike(formData));
  };

  return (
    <Layout title="Dashboard : Add Bike">
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)] flex justify-center">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/bikes')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                title="Back to Fleet"
              >
                <ArrowLeftOutlined />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ThunderboltOutlined className="text-emerald-600" />
                  Add New Fleet Vehicle
                </h1>
                <p className="text-xs text-slate-500">Register a new bike or scooter into the rental inventory</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Bike Model / Name</span>}
                  name="name"
                  rules={[{ required: true, message: "Please input bike name!" }]}
                >
                  <Input placeholder="e.g. Royal Enfield Classic 350" className="rounded-xl border-slate-200 py-2" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Registration Number</span>}
                  name="number"
                  rules={[
                    { required: true, message: "Please input registration number!" },
                    {
                      pattern: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
                      message: "Enter valid registration (e.g. RJ27AB1234)",
                    },
                  ]}
                >
                  <Input placeholder="e.g. RJ27AB1234" className="rounded-xl border-slate-200 py-2 font-mono" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Form.Item
                  label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Category</span>}
                  name="category"
                  rules={[{ required: true, message: "Please select a category!" }]}
                >
                  <Select placeholder="Select Category" className="rounded-xl">
                    {categories.map((cat) => (
                      <Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Daily Tariff (₹)</span>}
                  name="price"
                  rules={[{ required: true, message: "Please enter rental price" }]}
                >
                  <InputNumber min={50} max={10000} className="w-full rounded-xl" placeholder="500" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Start Mechanism</span>}
                  name="startType"
                  rules={[{ required: true, message: "Please select start type!" }]}
                >
                  <Select placeholder="Select Type">
                    <Option value="Self">Self Start</Option>
                    <Option value="Kick">Kick Start</Option>
                    <Option value="Both">Self & Kick</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Form.Item
                  label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Mfg Year</span>}
                  name="year"
                  rules={[
                    { required: true, message: "Enter manufacture year!" },
                    { pattern: /^(19|20)\d{2}$/, message: "Valid 4-digit year" },
                  ]}
                >
                  <Input placeholder="2023" className="rounded-xl border-slate-200 py-2" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Odometer (km)</span>}
                  name="kilometers"
                  rules={[{ required: true, message: "Enter current mileage" }]}
                >
                  <InputNumber min={0} className="w-full rounded-xl" placeholder="12500" />
                </Form.Item>

                <Form.Item
                  label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Fuel Tank (Liters)</span>}
                  name="petrolCapacity"
                  rules={[{ required: true, message: "Enter fuel capacity" }]}
                >
                  <InputNumber min={1} className="w-full rounded-xl" placeholder="13.5" />
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Vehicle Description & Features</span>}
                name="description"
                rules={[{ required: true, message: "Please enter vehicle description" }]}
              >
                <Input.TextArea rows={3} placeholder="Describe vehicle condition, features, helmets included..." className="rounded-xl border-slate-200" />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Vehicle Photo</span>}
                name="photo"
                rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <Upload beforeUpload={beforeUpload} listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />} className="rounded-xl">Choose Photo</Button>
                </Upload>
              </Form.Item>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button onClick={() => navigate('/admin/bikes')} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-600/20 border-none px-6"
                >
                  Add Vehicle
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddBike;
