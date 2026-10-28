import React, { useState } from "react";
import { Form, Input, Rate, message } from "antd";
import Http from "../Helper/Http";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function AddReviewForm() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await Http.post("/api/v1/review/add", values);
      message.success("Thank you! Review submitted successfully.");
      form.resetFields();
      navigate("/");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
          label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Rating</span>}
          name="rating"
          rules={[{ required: true, message: "Please provide a star rating" }]}
        >
          <Rate
            style={{ fontSize: 26, color: "#F59E0B" }}
            onChange={(value) => form.setFieldsValue({ rating: value })}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Feedback</span>}
          name="message"
          rules={[{ required: true, message: "Please share a few words about your ride" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="How was the bike performance, pickup, and experience?"
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
            <span>{submitting ? "Submitting Review..." : "Submit Review"}</span>
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}
