import { Guard } from "../models/gaurd.js";
import { Parking } from "../models/parking.js";
import bcrypt from 'bcrypt'
import mongoose from "mongoose";
const login = async (req, res) => {
  const { mail, password } = req.body;
console.log(mail, password);
  try {
    // Find the user with the provided email
    const findUser = await Guard.findOne({ mail });

    if (!findUser) {
      // If user not found, return 404 Not Found
      return res.status(404).json({ error: "User not found" });
    }
    // Check if the provided password matches the user's password
    const isPasswordMatched = await bcrypt.compare(password, findUser.password);

    if (!isPasswordMatched) {
      // Password doesn't match
      return res.status(401).json({ error: "Invalid email or password" });
    }
    console.log(findUser);

    // If email and password match, return the user data
    res.json({ data: findUser });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const sayHello = async (req, res) => {
  try {
    res.json({ msg: "hello world" });
  } catch (err) {
    res.json(err);
  }
};

const guardList = async (req, res) => {
  try {
    const session = await mongoose.startSession(); // Start a MongoDB session
    session.startTransaction(); // Begin a transaction

    try {
      const guards = await Guard.find().session(session); // Fetch the guards within the transaction

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({ data: guards });
    } catch (error) {
      await session.abortTransaction(); // Rollback the transaction if an error occurs
      session.endSession();
      throw error; // Rethrow the error for the outer catch block to handle
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getAGuard = async (req, res) => {
  const { guardId } = req.params;
  console.log(guardId)
  try {
    const guards = await Guard.findById(guardId);
    console.log(guards)
    res.json({ data: guards });
  } catch (error) {
    console.error("Error getting a guard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  const { guardId } = req.params;
  try {
    const updatedGuardData = req.body.data;
    console.log(guardId)
    console.log(req.body)
    const session = await mongoose.startSession(); // Start a MongoDB session
    session.startTransaction();
   
    const updatedGuard = await Guard.findByIdAndUpdate(guardId, updatedGuardData, {
      new: true,
    });

    try {
      // Update the guard document in the database within the transaction
      const updatedGuard = await Guard.findByIdAndUpdate(guardId, updatedGuardData, {
        new: true,
        session: session
      });

      if (!updatedGuard) {
        await session.abortTransaction(); // Rollback the transaction if guard not found
        session.endSession();
        return res.status(404).json({ message: "Guard not found" });
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json(updatedGuard);
    } catch (error) {
      await session.abortTransaction(); // Rollback the transaction if an error occurs
      session.endSession();
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const register = async (req, res) => {
  const { parkingid } = req.params;
  console.log(parkingid);
  console.log("Started registration process");
  try {
    const {
      name,
      mail,
      password,
      adhar,
      mob,
      add,
      image,
    } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const guards = await Guard.create(
        [
          {
            name,
            mail,
            password,
            adhar,
            parkingid: parkingid,
            mob,
            add,
            image,
          },
        ],
        { session }
      );

      console.log("Guard registration successful:", guards);

      const newGuardId = guards[0]._id;
      const updatedParkingDetail = await Parking.findOneAndUpdate(
        { _id: parkingid },
        { $set: { assg: newGuardId } },
        { new: true, session }
      );

      console.log("Parking detail updated:", updatedParkingDetail);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({ data: guards });
    } catch (error) {
      // Rollback the transaction in case of any error
      await session.abortTransaction();
      session.endSession();
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export { sayHello, register, getAGuard, update, guardList, login };
