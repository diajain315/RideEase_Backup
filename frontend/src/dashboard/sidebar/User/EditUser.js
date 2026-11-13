import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  LoadingOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Popconfirm, message, Tag } from "antd";
import { editUserById, getUserById, deleteUserById, userAll } from "../../../redux/features/User/authAction";
import Http from "../../../Helper/Http";
import Layout from "../../../components/Layout";
import Loading from "../../../components/Loading";

const ValidateAdminEditUser = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^[a-zA-Z\s.]+$/,
      "Name can only contain alphabetical characters, spaces, and periods."
    )
    .min(3, "Name must be at least 3 characters long.")
    .max(50, "Name cannot be longer than 50 characters.")
    .required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .required("Phone number is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Select a valid gender")
    .required("Gender is required"),
  role: Yup.number()
    .oneOf([0, 1], "Select a valid role")
    .required("Role is required"),
});

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [viewingDoc, setViewingDoc] = useState(false);
  const [serverError, setServerError] = useState("");

  // Fetch target user details
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const res = await Http.get(`/api/v1/auth/user/${id}`);
        if (isMounted) {
          const user = res.data?.user || res.data;
          setUserData(user);
        }
      } catch (err) {
        if (isMounted) {
          const msg = err.response?.data?.message || "Could not load user data.";
          setServerError(msg);
          message.error(msg);
        }
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    };

    if (id) {
      fetchUser();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle viewing license document in a new tab
  const handleViewLicense = async () => {
    if (!id) return;
    try {
      setViewingDoc(true);
      const res = await Http.get(`/api/v1/auth/user-license/${id}`, {
        responseType: "blob",
      });
      const contentType = res.headers["content-type"] || "application/pdf";
      const blob = new Blob([res.data], { type: contentType });
      const docUrl = window.URL.createObjectURL(blob);
      window.open(docUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      message.error(err.response?.data?.message || "No license document found for this user.");
    } finally {
      setViewingDoc(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values, actions) => {
    try {
      setServerError("");
      const updateData = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        gender: values.gender,
        role: Number(values.role),
      };

      const result = await dispatch(
        editUserById({
          id: id,
          formdata: updateData,
        })
      );

      if (result.error) {
        const errorMsg = result.payload || "Failed to update user.";
        setServerError(errorMsg);
        message.error(errorMsg);
        return;
      }

      message.success("User profile updated successfully!");
      dispatch(userAll());
      navigate("/admin/users");
    } catch (error) {
      const msg = error?.message || "Update failed. Please try again.";
      setServerError(msg);
      message.error(msg);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Handle delete user
  const handleDelete = async () => {
    try {
      const res = await dispatch(deleteUserById(id));
      if (!res.error) {
        message.success("User deleted successfully from database!");
        dispatch(userAll());
        navigate("/admin/users");
      } else {
        message.error(res.payload || "Failed to delete user.");
      }
    } catch (e) {
      message.error("Failed to delete user.");
    }
  };

  if (loadingUser) {
    return (
      <Layout title="Dashboard : Loading User Details">
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-slate-50">
          <Loading fullScreen={false} message="Loading user account details..." />
        </div>
      </Layout>
    );
  }

  if (!userData) {
    return (
      <Layout title="Dashboard : User Not Found">
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
            <h2 className="text-lg font-bold text-slate-800 mb-2">User Not Found</h2>
            <p className="text-xs text-slate-500 mb-4">
              {serverError || "The requested user account does not exist or has already been deleted."}
            </p>
            <button
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              ← Back to Users Directory
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const isSelf = userInfo?._id && String(userInfo._id) === String(id);

  return (
    <Layout title={`Dashboard : Edit ${userData.name || "User"}`}>
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/users")}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm cursor-pointer"
            title="Back to User Directory"
          >
            <ArrowLeftOutlined />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UserOutlined className="text-emerald-600" />
              Edit User Profile
            </h1>
            <p className="text-xs text-slate-500">
              Admin control over user account credentials, permissions, and status
            </p>
          </div>
        </div>

        {/* Center Edit Card Styled like My Profile */}
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
          {/* Header Avatar and Name */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl font-bold shadow-sm mb-3">
              {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {userData.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{userData.email}</p>
            <div className="mt-2">
              <Tag color={userData.role === 1 ? "emerald" : "blue"} className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                {userData.role === 1 ? "Administrator" : "Customer"}
              </Tag>
            </div>
          </div>

          {serverError && (
            <div className="mb-5 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {serverError}
            </div>
          )}

          <Formik
            enableReinitialize={true}
            initialValues={{
              name: userData.name || "",
              email: userData.email || "",
              phone: userData.phone || "",
              gender: userData.gender || "male",
              role: typeof userData.role === "number" ? userData.role : 0,
            }}
            validationSchema={ValidateAdminEditUser}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserOutlined className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.name}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium"
                      placeholder="User's Full Name"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="name" />
                  </span>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <MailOutlined className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="email" />
                  </span>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneOutlined className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.phone}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-all font-medium"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="phone" />
                  </span>
                </div>

                {/* Gender Radio Buttons */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Gender *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["male", "female", "other"].map((g) => (
                      <label
                        key={g}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold capitalize cursor-pointer transition-all ${
                          props.values.gender === g
                            ? "border-emerald-500 bg-emerald-50/60 text-emerald-800 ring-1 ring-emerald-500"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          checked={props.values.gender === g}
                          className="accent-emerald-600"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="gender" />
                  </span>
                </div>

                {/* User Role (Customer vs Admin) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Account Role *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        Number(props.values.role) === 0
                          ? "border-blue-500 bg-blue-50/60 text-blue-800 ring-1 ring-blue-500"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={0}
                        onChange={() => props.setFieldValue("role", 0)}
                        checked={Number(props.values.role) === 0}
                        className="accent-blue-600"
                      />
                      Customer
                    </label>

                    <label
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        Number(props.values.role) === 1
                          ? "border-emerald-500 bg-emerald-50/60 text-emerald-800 ring-1 ring-emerald-500"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={1}
                        onChange={() => props.setFieldValue("role", 1)}
                        checked={Number(props.values.role) === 1}
                        className="accent-emerald-600"
                      />
                      Administrator
                    </label>
                  </div>
                  <span className="text-red-500 text-xs mt-1 block">
                    <ErrorMessage name="role" />
                  </span>
                </div>

                {/* Driving License KYC Status Card */}
                <div className="mt-6 pt-5 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IdcardOutlined className="text-emerald-600 text-base" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Driving License KYC
                      </span>
                    </div>
                    {userData.hasLicense ? (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircleOutlined /> Verified
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Not Uploaded
                      </span>
                    )}
                  </div>

                  {userData.hasLicense ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-emerald-950 block">
                          Verified Driving License document on record
                        </span>
                        <span className="text-[11px] font-mono text-emerald-800">
                          {userData.licenseNumber || "VERIFIED-DL"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleViewLicense}
                        disabled={viewingDoc}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-60 shrink-0"
                      >
                        {viewingDoc ? (
                          <>
                            <LoadingOutlined className="text-xs" />
                            <span>Opening...</span>
                          </>
                        ) : (
                          <>
                            <EyeOutlined className="text-xs" />
                            <span>View Document</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      This user has not uploaded any driving license document yet.
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={props.isSubmitting}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    <SaveOutlined />
                    {props.isSubmitting ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/users")}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!isSelf && (
                    <Popconfirm
                      title="Delete User Account"
                      description={`Are you sure you want to permanently delete "${userData.name}" from the database? This cannot be undone.`}
                      onConfirm={handleDelete}
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <button
                        type="button"
                        className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <DeleteOutlined />
                        Delete
                      </button>
                    </Popconfirm>
                  )}
                </div>
              </form>
            )}
          </Formik>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link
              to="/admin/users"
              className="text-xs text-slate-500 hover:text-emerald-600 font-medium transition-colors"
            >
              ← Back to Users Directory
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditUser;
