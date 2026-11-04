import React, { useState } from "react";
import { Form, Input, message } from "antd";
import Http from "../Helper/Http";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faHeadset,
  faPaperPlane,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const trimmedName = (values.name || "").trim();
      const nameParts = trimmedName.split(" ");
      const firstname = nameParts[0] || trimmedName;
      const lastname = nameParts.slice(1).join(" ") || "";

      const payload = {
        name: trimmedName,
        firstname,
        lastname,
        email: (values.email || "").trim(),
        phone: values.phone,
        subject: values.subject,
        message: (values.message || "").trim(),
      };

      const res = await Http.post("/api/v1/contact", payload);
      message.success(res.data?.message || "Message sent successfully!");
      toast.success(res.data?.message || "Message sent successfully!");
      form.resetFields();
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "Something went wrong while sending the message.";
      message.error(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            <FontAwesomeIcon icon={faHeadset} />
            <span>Customer Support</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Get in Touch with Our Team
          </h1>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
            Have questions about bike availability, pricing, or doorstep pickup in Udaipur? We're available 24/7.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-500/40 transition">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Phone & WhatsApp</h2>
                <p className="text-xs text-slate-400 mt-0.5 mb-2">Instant assistance for road rentals</p>
                <div className="space-y-1 text-sm font-semibold text-emerald-600">
                  <a href="tel:+919829244434" className="block hover:underline">
                    +91 98292 44434
                  </a>
                  <a href="tel:+919334562344" className="block hover:underline">
                    +91 93345 62344
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-500/40 transition">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Email Inquiries</h2>
                <p className="text-xs text-slate-400 mt-0.5 mb-2">Corporate rentals & booking support</p>
                <a
                  href="mailto:bikerent29@gmail.com"
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:underline"
                >
                  bikerent29@gmail.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-500/40 transition">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Hub Location</h2>
                <p className="text-xs text-slate-400 mt-0.5 mb-1">Central Udaipur Hub</p>
                <p className="text-sm text-slate-700 font-medium">
                  Near City Palace & Fateh Sagar Lake, Udaipur, Rajasthan, 313001
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-sm flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Pickup Hours</h2>
                <p className="text-xs text-slate-400 mt-0.5 mb-1">Every day including holidays</p>
                <p className="text-sm font-semibold text-emerald-400">
                  7:00 AM – 10:00 PM (24/7 Roadside Support)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              Fill out the form below and our Udaipur travel team will respond promptly.
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Name</span>}
                  name="name"
                  rules={[{ required: true, message: "Please enter your full name" }]}
                >
                  <Input
                    size="large"
                    placeholder="e.g. John Doe"
                    className="rounded-xl border-slate-300"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</span>}
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="e.g. john@example.com"
                    className="rounded-xl border-slate-300"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number (Optional)</span>}
                  name="phone"
                >
                  <Input
                    size="large"
                    placeholder="e.g. +91 98292 44434"
                    className="rounded-xl border-slate-300"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Subject (Optional)</span>}
                  name="subject"
                >
                  <Input
                    size="large"
                    placeholder="e.g. Bullet rental inquiry"
                    className="rounded-xl border-slate-300"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="text-xs font-bold uppercase tracking-wider text-slate-700">Message</span>}
                name="message"
                rules={[{ required: true, message: "Please enter your message" }]}
              >
                <Input.TextArea
                  rows={5}
                  placeholder="Tell us about the dates, vehicle preference, or any questions you have..."
                  className="rounded-xl border-slate-300"
                />
              </Form.Item>

              <Form.Item className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                  <span>{submitting ? "Sending Message..." : "Send Message"}</span>
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
