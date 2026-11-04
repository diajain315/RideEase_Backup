import Contact from "../models/contactModel.js";
import nodemailer from "nodemailer";

export const contactFormController = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    const newContact = new Contact({ firstName, lastName, email, message });
    await newContact.save();

    // Optional: Send email to the user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Thanks for contacting us",
      text: `Dear ${firstName},\n\nThank you for reaching out! We’ll get back to you shortly.\n\nRegards,\nTeam BikeForRent`,
    };

    transporter.sendMail(mailOptions);

    res.status(201).send({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};
