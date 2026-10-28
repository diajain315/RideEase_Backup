import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import { ValidateBikeAdd } from "../../../common/Validation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Error from "../../../Helper/Error";
import Spinner from "../../../Helper/Spinner";
import toast from "react-hot-toast";
import {
  getBikeById,
  editBikeById,
} from "../../../redux/features/Bikes/bikeAction";
import { clearFields } from "../../../redux/features/Bikes/bikeSlice";
import { CategoryAll } from "../../../redux/features/Category/categoryAction";
import { ArrowLeftOutlined, ThunderboltOutlined, UploadOutlined } from "@ant-design/icons";
import Layout from "../../../components/Layout";
import Loading from "../../../components/Loading";

const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

const EditBike = () => {
  const [selectedImage, setSelectedImage] = useState();
  const [errors, setErrors] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onImageChange = (event, setFieldValue) => {
    if (event.target.files && event.target.files[0]) {
      setFieldValue("photo", event.target.files[0]);
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  useEffect(() => {
    dispatch(getBikeById(id));
    dispatch(CategoryAll());
  }, [id, dispatch]);

  const { loading, success, bikeById } = useSelector((state) => state.bike);
  const { categories = [] } = useSelector((state) => state.category);
  const startType = ['Self', 'Kick', 'Both'];

  useEffect(() => {
    if (success) {
      toast.success("Bike updated successfully");
      dispatch(clearFields());
      navigate("/admin/bikes");
    }
  }, [success, dispatch, navigate]);

  const handleBack = () => {
    dispatch(clearFields());
    navigate("/admin/bikes");
  };

  if (!bikeById) {
    return (
      <Layout title="Dashboard : Loading Bike">
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-slate-50">
          <Loading fullScreen={false} message="Loading bike details..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Dashboard : Edit ${bikeById?.name || 'Bike'}`}>
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)] flex justify-center">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                title="Back to Fleet"
              >
                <ArrowLeftOutlined />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ThunderboltOutlined className="text-emerald-600" />
                  Edit Vehicle Details
                </h1>
                <p className="text-xs text-slate-500">Update pricing, technical specifications, or image</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <Formik
              enableReinitialize
              initialValues={{
                name: bikeById?.name || "",
                number: bikeById?.number || "",
                price: bikeById?.price || "",
                description: bikeById?.description || "",
                category: bikeById?.category?._id || bikeById?.category || "",
                kilometers: bikeById?.kilometers || "",
                petrolCapacity: bikeById?.petrolCapacity || "",
                startType: bikeById?.startType || "Self",
                year: bikeById?.year || "",
                photo: null,
              }}
              validationSchema={ValidateBikeAdd}
              onSubmit={async (values) => {
                let formdata = new FormData();
                formdata.append("name", values.name);
                formdata.append("number", values.number);
                if (values.photo) {
                  formdata.append("photo", values.photo);
                }
                formdata.append("category", values.category);
                formdata.append("description", values.description);
                formdata.append("price", parseInt(values.price, 10));
                formdata.append("kilometers", parseInt(values.kilometers, 10));
                formdata.append("startType", values.startType);
                formdata.append("petrolCapacity", parseInt(values.petrolCapacity, 10));
                formdata.append("year", parseInt(values.year, 10));

                let data = {
                  id: bikeById._id,
                  formdata: formdata,
                };
                const datas = await dispatch(editBikeById(data));
                if (datas.error) {
                  setErrors(datas.payload);
                  dispatch(clearFields());
                }
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Bike Model / Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.name}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                      />
                      <span className="text-red-500 text-xs mt-1 block">
                        <ErrorMessage name="name" />
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="number"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.number}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono font-medium"
                      />
                      <span className="text-red-500 text-xs mt-1 block">
                        <ErrorMessage name="number" />
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.category}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <span className="text-red-500 text-xs mt-1 block">
                        <ErrorMessage name="category" />
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Daily Tariff (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.price}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                      />
                      <span className="text-red-500 text-xs mt-1 block">
                        <ErrorMessage name="price" />
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Start Mechanism
                      </label>
                      <select
                        name="startType"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.startType}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        {startType.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Mfg Year
                      </label>
                      <input
                        type="text"
                        name="year"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.year}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                      <span className="text-red-500 text-xs mt-1 block">
                        <ErrorMessage name="year" />
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Odometer (km)
                      </label>
                      <input
                        type="number"
                        name="kilometers"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.kilometers}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                      <span className="text-red-500 text-xs mt-1 block">
                        <ErrorMessage name="kilometers" />
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Fuel Tank (Liters)
                      </label>
                      <input
                        type="number"
                        name="petrolCapacity"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.petrolCapacity}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                      <span className="text-red-500 text-xs mt-1 block">
                        <ErrorMessage name="petrolCapacity" />
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.description}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                    <span className="text-red-500 text-xs mt-1 block">
                      <ErrorMessage name="description" />
                    </span>
                  </div>

                  {/* Photo Section */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="shrink-0">
                      <img
                        src={selectedImage || `${base_url}/api/v1/bike/bike-photo/${id}?timestamp=${Date.now()}`}
                        alt="Vehicle preview"
                        className="w-24 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Update Vehicle Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onImageChange(e, props.setFieldValue)}
                        className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </div>
                  </div>

                  {errors && <Error>{errors}</Error>}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                      {loading ? <Spinner /> : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditBike;
