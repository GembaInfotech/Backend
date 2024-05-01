import nodemailer from "nodemailer";
import express from "express";
import { Booking } from "../models/booking.js";
import mongoose from "mongoose";
import razorpay from "../config/razorpayClient.js"

const updationOfStatus = async (req, res) => {
  const { status , tp=0} = req.body;
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === status)  return res
        .status(400)
        .json({ error: "Booking status is already completed" });
    booking.status = status;
    booking.tp=tp;
    await booking.save();
    res
      .status(200)
      .json({ message: "Booking status updated successfully",data: booking });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchingOnQuery = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.find(req.query).session(session);

    if (!booking || booking.length === 0) 
    {  await session.abortTransaction();
      session.endSession();
      return res.json({ data:[]});}
    await session.commitTransaction();
    session.endSession();
    res.json({ data: booking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getBooking = async (req, res) => {
  const {id} = req.user;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.find({userid:id}).session(session);

    if (!booking || booking.length === 0) 
    {  await session.abortTransaction();
      session.endSession();
      return res.json({ data:[]});}
    await session.commitTransaction();
    session.endSession();
    res.json({ data: booking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const cancelBooking = await Booking
        .findOneAndDelete({ _id: bookingId })
        .session(session);
      await session.commitTransaction();
      session.endSession();
      if (!cancelBooking)  return res.status(404).json({ error: "Booking not found" });
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updationOfTime = async (req, res) => {
  const { time } = req.body;
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.time(404).json({ error: "Booking not found" });
    if (booking.time === time) return res
        .time(400)
        .json({ error: "Booking time is already completed" });
    booking.time = time;
    await booking.save();
    res
      .time(200)

      .json({ message: "Booking time updated successfully",  data: booking });
  } catch (error) {
    console.error("Error updating booking time:", error);
    res.time(500).json({ error: "Internal Server Error" });
  }
};
const createABooking = async (req, res) => {
  try {
    console.log(req.body.bookingData);
    const {mail , id } = req.user;
    const userid=id

    const {
      parkingid,
      In,
      out,
      status,
      num,
      pn,
      price,
      cgst,
      sgst,
      tp,
    } = req.body.bookingData;

    if (!mail || !validateEmail(mail)) return res.status(400).json({ error: "Invalid email address" });
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newBooking = new Booking({
        userid,
        parkingid,
        In,
        out,
        pn,
        num,
        status,
        price,
        cgst,
        sgst,
        tp
      });
      console.log(newBooking);
      const savedBooking = await newBooking.save({ session });
      sendConfirmationEmail(mail, newBooking)
      await session.commitTransaction();
      session.endSession();
       console.log("done ere")
      res.status(201).json({ "booking":savedBooking});
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error; 
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const sendConfirmationEmail = (email, booking) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: "prashantrana9516@gmail.com", 
      pass: "qqjsatrjwvbynknu", 
    },
  });
  const mailOptions = {
    from: "prashantrana9516@gmail.com",
    to: email,
    subject: "Booking Confirmation",
    html: ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Parking Spot Booking Confirmation</title>
    </head>
    <body>
        <h3>Parking Spot Booking Confirmation</h3>
        
        <p>Dear User, </p>
        <p>Your parking spot booking details:</p>
        <ul>
            <li>Parking Name ${booking.pn}</li>
            <li> Date: ${new Date(
              booking.out
            ).toLocaleDateString()}</li>
            <li>Arrival Time: ${new Date(
              booking.In
            ).toLocaleTimeString()}</li>
            <li>Checkout Time: ${new Date(
              booking.out
            ).toLocaleTimeString()}</li>
            <li>Price: ${booking.price}</li>
        </ul>
        <p>Thank you for booking with us.</p>
    </body>
    </html>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    }
    console.log("Email sent:", info.response);
  });
};
function validateEmail(mail) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(mail).toLowerCase());
}

 
const createPaymentLink = async (req, res) => {
     console.log(req.params.id)
  
    console.log("created")
  try {
    console.log("dsfffffffffffffffffffffffffffff")
      
      const order = await Booking.findById(req.params.id);
      const paymentLinkRequest = {
        amount:  2400,
        currency: 'INR',
       
       
        reminder_enable: true,
        // callback_url: `http://localhost:5174/profile/bookings`,
        callback_method: 'get',
      };

      const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
  
      const paymentLinkId = paymentLink.id;
      const payment_link_url = paymentLink.short_url;
  
      console.log("orders")

      const resData = {
        paymentLinkId: paymentLinkId,
        payment_link_url,
      };
      res.json({data:resData})
    } catch (error) {
      console.error('Error creating payment link:', error);
res.json(error)
    }


}




export {
  createABooking,
  fetchingOnQuery,
  updationOfStatus,
  cancelBooking,
  updationOfTime,
  getBooking,
  createPaymentLink
};
