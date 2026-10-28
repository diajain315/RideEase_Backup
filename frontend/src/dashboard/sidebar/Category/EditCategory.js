import React, { useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import { ValidateCategoryAdd } from "../../../common/Validation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../Helper/Spinner";
import toast from "react-hot-toast";
import {
  getCategoryById,
  editCategoryById,
} from "../../../redux/features/Category/categoryAction";
import { clearFields } from "../../../redux/features/Category/categorySlice";
import { ArrowLeftOutlined, AppstoreOutlined } from "@ant-design/icons";
import Layout from "../../../components/Layout";
import Loading from "../../../components/Loading";

const base_url = process.env.REACT_APP_API_URL || "http://localhost:5001";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoryById(id));
  }, [id, dispatch]);

  const { loading, categoryById } = useSelector(
    (state) => state.category
  );

  const handleBack = () => {
    dispatch(clearFields());
    navigate("/admin/category");
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
    <Layout title={`Dashboard : Edit ${categoryById?.name || 'Category'}`}>
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
                <p className="text-xs text-slate-500">Update category naming and parameters</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={`${base_url}/api/v1/category/category-photo/${id}?timestamp=${Date.now()}`}
                alt={categoryById.name}
                className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                onError={(e) => { e.target.src = "/images/scooter.jpg"; }}
              />
              <div>
                <span className="text-xs font-bold text-slate-800">{categoryById.name}</span>
                <p className="text-[11px] text-slate-400">Current Category</p>
              </div>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                name: categoryById.name || "",
              }}
              validationSchema={ValidateCategoryAdd}
              onSubmit={async (values) => {
                const datas = {
                  _id: categoryById._id,
                  name: values.name,
                };
                const data = await dispatch(editCategoryById(datas));
                if (!data.error) {
                  toast.success("Category updated successfully");
                  dispatch(clearFields());
                  navigate("/admin/category");
                } else {
                  toast.error(data.payload || "Failed to update");
                  dispatch(clearFields());
                }
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} className="space-y-4">
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
