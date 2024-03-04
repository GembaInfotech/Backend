import nodemailer from "nodemailer";
import { BusinessQueries } from "../models/query.js";

const sayHello = async (req, res) => {
  try {
    res.json({ data: "fgvhbjn" });
  } catch (err) {
    res.json(err);
  }
};

const handleQuery = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    const newQuery = new BusinessQueries({ name, email, mobile, message });
    await newQuery.save();

    const emailMessage = `Hello ${name},\n\nThank you for your message regarding "${message}". Our team will contact you very soon.\n\nBest regards,\nThe Team`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ayushguptass14@gmail.com",
        pass: "uvzmczkdrlbhqqak",
      },
    });

    await transporter.sendMail({
      from: "ayushguptass14@gmail.com",
      to: email,
      subject: "Response to Your Query",
      text: emailMessage,
    });

    res
      .status(200)
      .json({ message: "User details saved and email sent successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { handleQuery, sayHello };
