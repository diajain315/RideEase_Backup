import React, { useState } from "react";
import { Card, Form, Input, Button, message, Typography } from "antd";
import { MailOutlined, LockOutlined, NumberOutlined, CheckCircleFilled } from "@ant-design/icons";
import Http from "../Helper/Http";
import { useNavigate, Link } from "react-router-dom";
import Layout from "./Layout";

const { Title, Text } = Typography;

const SendOtp = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1); // 1: send OTP, 2: verify OTP, 3: reset password
  const [email, setEmail] = useState(() => localStorage.getItem("resetEmail") || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (values) => {
    setLoading(true);
    try {
      const res = await Http.post("/api/v1/auth/send-otp", { email: values.email.trim().toLowerCase() });
      if (res.data.success) {
        message.success("OTP sent successfully!");
        setEmail(values.email);
        localStorage.setItem("resetEmail", values.email);
        setStep(2);
      } else {
        message.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      message.error("Something went wrong while sending OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values) => {
    setLoading(true);
    try {
      const res = await Http.post("/api/v1/auth/verify-otp", {
        email,
        otp: values.otp,
      });
      if (res.data.success) {
        message.success("OTP verified!");
        setStep(3);
      } else {
        message.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      message.error("Something went wrong while verifying OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    if (values.password !== values.confirmPassword) {
      return message.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const res = await Http.post("/api/v1/auth/reset-Password", {
        newPassword: values.password,
        email: email
      });
      if (res.data.success) {
        message.success("Password reset successfully! Please log in.");
        localStorage.removeItem("resetEmail");
        setStep(1);
        form.resetFields();
        navigate("/login");
      } else {
        message.error(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong while resetting password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="RideEase : Verify & Reset">
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
          
          <div className="flex flex-col items-center mb-6">
            {/* Step Indicators */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                      : step > s
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-900 tracking-tight">
              {step === 1 && "Send Verification OTP"}
              {step === 2 && "Enter Security OTP"}
              {step === 3 && "Create New Password"}
            </h2>
            <p className="text-xs text-slate-500 mt-1 text-center">
              {step === 1 && "Enter your registered email address to receive an OTP code"}
              {step === 2 && `Enter the 6-digit OTP code sent to ${email || "your email"}`}
              {step === 3 && "Enter your new strong password to complete account recovery"}
            </p>
          </div>

          {step === 1 && (
            <Form layout="vertical" onFinish={handleSendOtp} initialValues={{ email }}>
              <Form.Item
                name="email"
                label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Email Address</span>}
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Enter a valid email!" },
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="text-slate-400 mr-1" />} 
                  placeholder="name@example.com" 
                  size="large" 
                  className="rounded-xl border-slate-200"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large" 
                  loading={loading} 
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-600/20 border-none h-11"
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          )}

          {step === 2 && (
            <Form layout="vertical" onFinish={handleVerifyOtp}>
              <Form.Item
                name="otp"
                label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Verification OTP Code</span>}
                rules={[{ required: true, message: "Please enter the OTP sent to your email!" }]}
              >
                <Input 
                  prefix={<NumberOutlined className="text-slate-400 mr-1" />} 
                  placeholder="Enter 6-digit OTP" 
                  size="large" 
                  className="rounded-xl border-slate-200 text-center tracking-widest font-mono text-lg"
                />
              </Form.Item>
              <Form.Item className="mb-2">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large" 
                  loading={loading} 
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-600/20 border-none h-11"
                >
                  Verify OTP
                </Button>
              </Form.Item>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Change email address
                </button>
              </div>
            </Form>
          )}

          {step === 3 && (
            <Form layout="vertical" onFinish={handleResetPassword}>
              <Form.Item
                name="password"
                label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">New Password</span>}
                rules={[{ required: true, message: "Please enter a new password" }]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-slate-400 mr-1" />} 
                  placeholder="Enter new password" 
                  size="large" 
                  className="rounded-xl border-slate-200"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label={<span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Confirm New Password</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match!"));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="text-slate-400 mr-1" />} 
                  placeholder="Confirm new password" 
                  size="large" 
                  className="rounded-xl border-slate-200"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large" 
                  loading={loading} 
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-600/20 border-none h-11"
                >
                  Reset Password & Sign In
                </Button>
              </Form.Item>
            </Form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/login" className="text-xs text-slate-500 hover:text-emerald-600 font-medium transition-colors">
              ← Return to Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SendOtp;
