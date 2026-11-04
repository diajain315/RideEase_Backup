import React, { useState } from "react";
import { Form, Input, Rate, message } from "antd";
import Http from "../Helper/Http";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faShieldCheck } from "@fortawesome/free-solid-svg-icons";

export default function AddReviewForm({ onSuccess }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const initialUserName =
    userInfo?.name ||
    (localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo")).name
      : "");

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const res = await Http.post("/api/v1/review/add", values);
      message.success(res.data?.message || "Thank you! Review submitted successfully.");
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to submit review. Please try again.";
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
        <span className="font-semibold text-emerald-900">
          Posting as: <strong className="font-bold">{initialUserName || "Verified Rider"}</strong>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full">
          Verified Renter
        </span>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: initialUserName,
          rating: 5,
        }}
        className="space-y-4 text-left"
      >
        <Form.Item
          label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Full Name</span>}
          name="name"
          rules={[
            { required: true, message: "Please enter your name" },
            {
              pattern: /^[A-Za-z\s]{2,40}$/,
              message: "Name should be 2-40 letters only.",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="e.g. Rahul Sharma"
            className="rounded-xl border-slate-300"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Rating</span>}
          name="rating"
          rules={[{ required: true, message: "Please provide a star rating" }]}
        >
          <Rate
            style={{ fontSize: 26, color: "#F59E0B" }}
            onChange={(value) => form.setFieldsValue({ rating: value })}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Review / Experience</span>}
          name="message"
          rules={[
            { required: true, message: "Please share a few words about your ride" },
            { min: 5, message: "Review must be at least 5 characters long." },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="How was the bike performance, helmet quality, pickup, and overall experience in Udaipur?"
            className="rounded-xl border-slate-300"
          />
        </Form.Item>

        <Form.Item className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
            <span>{submitting ? "Submitting Review..." : "Submit Verified Review"}</span>
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}
