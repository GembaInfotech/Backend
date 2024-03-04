import nodemailer from "nodemailer";
import express from "express";
import { Booking } from "../models/booking.js";
import mongoose from "mongoose";


const updationOfStatus = async (req, res) => {
  console.log("call");
  const { status } = req.body;
  console.log(status);
  try {
    const { bookingId } = req.params;
console.log(bookingId);
    const booking = await Booking.findById(bookingId);

    // Check if the booking exists
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the booking status is already "Completed"
    if (booking.status === status) {
      return res
        .status(400)
        .json({ error: "Booking status is already completed" });
    }

    // Update the booking status to "Completed"
    booking.status = status;

    // Save the updated booking
    await booking.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    // Handle errors
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchingOnQuery = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const Booking = await Booking.find(req.query).session(session);

    if (!Booking || Booking.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.json({ data:[]});
    }

    console.log('Found booking:', Booking);

    await session.commitTransaction();
    session.endSession();

    res.json({ data: Booking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error getting booking by id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getbookingByparkingid = async (req, res) => {
  const { parkingid } = req.params;
  console.log(parkingid);

  try {
    // Start a MongoDB session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find booking details by parkingid within the transaction
      const Booking = await Booking.find({ parkingid: parkingid }).session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({ data: Booking });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();

      console.error("Error getting booking by id :", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getbookingByendUsergId = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    // Start a MongoDB session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find booking details by endUserId within the transaction
      const Booking = await Booking.find({ enserId: id }).session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({ data: Booking });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();

      console.error("Error getting booking by endUser id :", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const cancelBooking = async (req, res) => {

  const { bookingId } = req.params; // Assuming bookingId is part of the request parameters
  
  console.log('Booking ID:', bookingId);
  try {
    // Start a MongoDB session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the specific booking details within the transaction
      const cancelBooking = await Booking
        .findOneAndDelete({ _id: bookingId })
        .session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      if (!cancelBooking) {
        console.error("Booking not found");
        return res.status(404).json({ error: "Booking not found" });
      }

      console.log("Booking deleted successfully");
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();

      console.error("Error deleting booking:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error starting session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const updationOfTime = async (req, res) => {
  console.log("call");
  const { time } = req.body;
  console.log(time);
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    // Check if the booking exists
    if (!booking) {
      return res.time(404).json({ error: "Booking not found" });
    }

    // Check if the booking time is already "Completed"
    if (booking.time === time) {
      return res
        .time(400)
        .json({ error: "Booking time is already completed" });
    }

    // Update the booking time to "Completed"
    booking.time = time;

    // Save the updated booking
    await booking.save();

    // Send a success response
    res
      .time(200)
      .json({ message: "Booking time updated successfully", booking });
  } catch (error) {
    // Handle errors
    console.error("Error updating booking time:", error);
    res.time(500).json({ error: "Internal Server Error" });
  }
};

const createABooking = async (req, res) => {
  try {
    console.log(req.body);
    const {
      userid,
      parkingid,
      In,
      out,
      status,
      num,
      pn,
      bp,
      mail,
    } = req.body;

    // Input validation
    if (!mail || !validateEmail(mail)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Begin a database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create a new booking object
      const newBooking = new Booking({
        userid,
        parkingid,
        In,
        out,
        pn,
        num,
        status,
        bp,
      });

      // Save the booking to the database within the transaction
      const savedBooking = await newBooking.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Send confirmation email to the user
      sendConfirmationEmail(mail, savedBooking);

      // Send a success response with the saved booking
      res.status(201).json({ message: "Booking created successfully", data: savedBooking });
    } catch (error) {
      // If any error occurs during the transaction, rollback changes
      await session.abortTransaction();
      session.endSession();
      throw error; // Rethrow the error for the outer catch block to handle
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendConfirmationEmail = (email, booking) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Update with your email service
    auth: {
      user: "ayushguptass14@gmail.com", // Update with your email address
      pass: "uvzmczkdrlbhqqak", // Update with your email password
    },
  });

  const mailOptions = {
    from: "ayushguptass14@gmail.com",
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
            <li>Price: ${booking.bp}</li>
        </ul>
        <p>Thank you for booking with us.</p>
    </body>
    </html>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      // Handle email sending failure gracefully
    }
    console.log("Email sent:", info.response);
  });
};


// Function to validate email format
function validateEmail(mail) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(mail).toLowerCase());
}

export {
 
  createABooking,
  fetchingOnQuery,
  getbookingByparkingid,
  updationOfStatus,
  cancelBooking,
  updationOfTime
};
