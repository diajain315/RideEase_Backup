import React, { useEffect, useState, useRef } from "react";
import { Formik, ErrorMessage } from "formik";
import { ValidateCategoryEdit } from "../../../common/Validation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../Helper/Spinner";
import toast from "react-hot-toast";
import {
  getCategoryById,
  editCategoryById,
} from "../../../redux/features/Category/categoryAction";
import { clearFields } from "../../../redux/features/Category/categorySlice";
import {
  ArrowLeftOutlined,
  AppstoreOutlined,
  EditOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import Layout from "../../../components/Layout";
import Loading from "../../../components/Loading";

const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    dispatch(getCategoryById(id));
  }, [id, dispatch]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const { loading, categoryById } = useSelector((state) => state.category);

  const handleBack = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    dispatch(clearFields());
    navigate("/admin/category");
  };

  const handleImageChange = (event, setFieldValue) => {
    setImageError("");
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5 MB.");
      return;
    }

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    setFieldValue("photo", file);
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleRemoveSelectedImage = (setFieldValue) => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setFieldValue("photo", null);
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!categoryById) {
    return (
      <Layout title="Dashboard : Loading Category">
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-slate-50">
          <Loading fullScreen={false} message="Loading category details..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Dashboard : Edit ${categoryById?.name || "Category"}`}>
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)] flex justify-center">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                title="Back to Categories"
              >
                <ArrowLeftOutlined />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <AppstoreOutlined className="text-emerald-600" />
                  Edit Category
                </h1>
                <p className="text-xs text-slate-500">
                  Update category name and cover photo
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <Formik
              enableReinitialize
              initialValues={{
                name: categoryById.name || "",
                photo: null,
              }}
              validationSchema={ValidateCategoryEdit}
              onSubmit={async (values) => {
                const categoryName = (values.name || categoryById?.name || "").trim();
                const categoryId = id || categoryById?._id;

                let data;
                if (values.photo) {
                  // If a new photo is selected, send multipart FormData
                  const formData = new FormData();
                  formData.append("name", categoryName);
                  formData.append("photo", values.photo);
                  data = await dispatch(
                    editCategoryById({ _id: categoryId, formData })
                  );
                } else {
                  // If keeping existing photo, send clean JSON payload
                  data = await dispatch(
                    editCategoryById({ _id: categoryId, name: categoryName })
                  );
                }

                if (!data.error) {
                  toast.success("Category updated successfully!");
                  dispatch(clearFields());
                  navigate("/admin/category");
                } else {
                  toast.error(data.payload || "Failed to update category");
                }
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} className="space-y-6">
                  {/* Category Image Box with Hover Edit Icon */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                      Category Cover Photo
                    </label>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      id="category-photo-input"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={(e) => handleImageChange(e, props.setFieldValue)}
                      className="hidden"
                    />

                    {/* Clickable Image Card */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90">
                      {/* Image Preview with Hover Pen/Edit Overlay */}
                      <label
                        htmlFor="category-photo-input"
                        className="relative group w-40 h-28 sm:w-44 sm:h-30 rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-emerald-500 shadow-sm cursor-pointer transition-all duration-200 bg-slate-100 shrink-0 block"
                        title="Click to change photo"
                      >
                        <img
                          src={
                            selectedImage ||
                            `${base_url}/api/v1/category/category-photo/${id}?timestamp=${Date.now()}`
                          }
                          alt={categoryById.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "/images/scooter.jpg";
                          }}
                        />

                        {/* Hover Overlay with Edit/Pen Icon */}
                        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center">
                          <div className="w-9 h-9 rounded-full bg-emerald-500/90 text-white flex items-center justify-center text-base mb-1 shadow-md">
                            <EditOutlined />
                          </div>
                          <span className="text-[11px] font-bold tracking-wide">
                            Change Photo
                          </span>
                        </div>

                        {/* Static Badge on bottom-right corner */}
                        <div className="absolute bottom-2 right-2 bg-slate-900/80 group-hover:opacity-0 transition-opacity backdrop-blur text-white px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 shadow-sm">
                          <CameraOutlined />
                          <span>Edit</span>
                        </div>
                      </label>

                      {/* Image Info & Revert Button */}
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <span className="text-sm font-bold text-slate-800 truncate">
                            {props.values.name || categoryById.name}
                          </span>
                          {selectedImage ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircleOutlined /> New Photo Selected
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                              Current Photo
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {selectedImage
                            ? "New photo previewed. Click 'Save Changes' below to update database."
                            : "Click on the image above to choose a new photo from your device (PNG, JPG, WEBP up to 5MB)."}
                        </p>

                        {/* Revert Button if new photo is picked */}
                        {selectedImage && (
                          <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectedImage(props.setFieldValue)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-xs"
                            >
                              <UndoOutlined />
                              <span>Revert to Original Photo</span>
                            </button>
                          </div>
                        )}

                        {imageError && (
                          <p className="text-red-500 text-xs mt-2 font-medium">
                            {imageError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category Name Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Category Name
                    </label>
                    <input
                      name="name"
                      placeholder="Enter category name"
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                    />
                    <span className="text-red-500 text-xs mt-1 block">
                      <ErrorMessage name="name" />
                    </span>
                  </div>

                  {/* Actions */}
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

export default EditCategory;
