// routes/contactRoutes.js
import express from "express";
import Contact from "../models/contactModel.js";
import nodemailer from "nodemailer";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

// 🌟 POST: User contacts
router.post("/", async (req, res) => {
  try {
    const { name, firstname, lastname, email, message, phone, subject } = req.body;
    const resolvedName = (name || `${firstname || ''} ${lastname || ''}`).trim();

    if (!resolvedName || !email || !message) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const newContact = new Contact({
      name: resolvedName,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      status: 'pending',
    });

    await newContact.save();

    // Safely attempt email notifications in background without delaying user response
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      try {
        const transporter = getTransporter();

        // Notify admin
        transporter.sendMail({
          from: `"${resolvedName}" <${process.env.MAIL_USER}>`,
          to: process.env.MAIL_USER,
          replyTo: email,
          subject: `New Inquiry: ${subject || 'Customer Message'}`,
          html: `
            <h3>New Contact Request</h3>
            <p><strong>Name:</strong> ${resolvedName}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
            <p><strong>Message:</strong><br/>${message}</p>
          `,
        }).catch((err) => console.warn("Admin email notice:", err.message));

        // Auto-reply to user
        transporter.sendMail({
          from: `"RideEase App" <${process.env.MAIL_USER}>`,
          to: email,
          subject: "Thanks for contacting RideEase",
          text: `Dear ${resolvedName || 'Customer'},\n\nThank you for reaching out! We have received your inquiry and our team will get back to you shortly.\n\nRegards,\nTeam RideEase`,
        }).catch((err) => console.warn("User auto-reply notice:", err.message));
      } catch (mailErr) {
        console.warn("⚠️ Nodemailer setup notice:", mailErr.message);
      }
    }

    return res.status(201).json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, message: "Failed to send contact message", error: error.message });
  }
});

// 🌟 GET: Admin fetch all messages
router.get("/admin/messages", requireSignIn, isAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
});

// 🌟 POST: Admin replies to a message
router.post("/admin/reply/:id", requireSignIn, isAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply message cannot be empty" });
    }

    const messageDoc = await Contact.findById(req.params.id);

    if (!messageDoc) {
      return res.status(404).json({ message: "Message not found" });
    }

    // 🛑 STRICT RULE: Stop continuous chatting in a loop.
    // Each inquiry can ONLY receive one official response. Once replied, it is locked.
    if (messageDoc.adminReply && messageDoc.adminReply.trim()) {
      return res.status(400).json({
        success: false,
        alreadyReplied: true,
        message: "This inquiry has already been answered and closed. Re-editing and loop replies are strictly disabled.",
      });
    }

    messageDoc.adminReply = reply.trim();
    messageDoc.repliedAt = new Date();
    messageDoc.status = "replied";
    await messageDoc.save();

    // Safely attempt sending email to user
    try {
      if (process.env.MAIL_USER && process.env.MAIL_PASS) {
        const transporter = getTransporter();
        await transporter.sendMail({
          from: `"RideEase Support" <${process.env.MAIL_USER}>`,
          to: messageDoc.email,
          subject: `Re: ${messageDoc.subject || 'Your Inquiry to RideEase'}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
              <div style="border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
                <h2 style="color: #0f172a; margin: 0; font-size: 20px;">RideEase Customer Support</h2>
              </div>
              <p>Hi <strong>${messageDoc.name}</strong>,</p>
              <p>Thank you for contacting us. Here is our official response to your inquiry:</p>
              <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 14px 18px; margin: 18px 0; border-radius: 6px; font-size: 15px; color: #0f172a;">
                ${reply.trim().replace(/\n/g, '<br/>')}
              </div>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
                <p style="margin: 0 0 6px 0;"><strong>Original Inquiry Message:</strong></p>
                <blockquote style="margin: 0; padding-left: 10px; border-left: 2px solid #cbd5e1; font-style: italic; color: #475569;">
                  "${messageDoc.message}"
                </blockquote>
                <p style="margin-top: 16px;">This inquiry ticket is now closed. If you require further assistance or wish to book a bike, please submit a new inquiry via our website.</p>
                <p style="margin: 0;">Warm regards,<br/><strong>RideEase Team</strong></p>
              </div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.warn("Notice: Email notification could not be delivered:", emailErr.message);
    }

    res.json({ success: true, message: "Reply sent and recorded successfully." });

  } catch (error) {
    res.status(500).json({ message: "Failed to reply", error: error.message });
  }
});

export default router;
