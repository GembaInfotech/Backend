import { Guard } from "../models/gaurd.js";
import { Parking } from "../models/parking.js";
import bcrypt from 'bcrypt'
import mongoose from "mongoose";
const login = async (req, res) => {
  const { mail, password } = req.body;
console.log(mail, password);
  try {
    const data = await Guard.findOne({ mail });
    if (!data)  return res.status(404).json({ error: "User not found" });
    
    const isPasswordMatched = await bcrypt.compare(password, data.password);

    if (!isPasswordMatched) return res.status(401).json({ error: "Invalid email or password" });
    
    res.json({ data: data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const guardList = async (req, res) => {
  
    const session = await mongoose.startSession(); 
    session.startTransaction();
    try {
      const data = await Guard.find().session(session); 
      await session.commitTransaction();
      session.endSession();

      res.json({ data: data });
    } catch (error) {
      await session.abortTransaction(); 
      session.endSession();
      res.status(500).json({ error: "Internal Server Error" });
    }
  
};


const getAGuard = async (req, res) => {
  const { guardId } = req.params;
  try {
    const data = await Guard.findById(guardId);
    res.json({ data: data });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  const { guardId } = req.params;
 
    const body = req.body;
    const session = await mongoose.startSession(); // Start a MongoDB session
    session.startTransaction();
    try {
      const data = await Guard.findByIdAndUpdate(guardId, body, {
        new: true,
        session: session
      });

      if (!data) {
        await session.abortTransaction(); // Rollback the transaction if guard not found
        session.endSession();
        return res.status(404).json({ message: "Guard not found" });
      }

      await session.commitTransaction();
      session.endSession();
      res.json({data:data});

    } catch (error) {
      await session.abortTransaction(); // Rollback the transaction if an error occurs
      session.endSession();
      res.status(500).json({ message: "Internal server error" });
    }

};



const register = async (req, res) => {
  const { parkingid } = req.params;
   console.log(parkingid);
    const {
      name,
      mail,
      password,
      adhar,
      mob,
      add,
      image,
    } = req.body;
    console.log(req.body);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const guard = await Guard.create(
        
          {
            name,
            mail,
            password,
            adhar,
            parkingid,
            mob,
            add,
            image,
          }
        
       
      );
      console.log(guard._id);

      const newGuardId = guard._id;
      console.log(newGuardId)
      const updatedParkingDetail = await Parking.findOneAndUpdate(
        { _id: parkingid },
        { $set: { assg: newGuardId } },
        { new: true, session }
      );
      await session.commitTransaction();
      session.endSession();
      console.log(updatedParkingDetail)
      res.json({ data: guard });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: "Internal Server Error" });
    }
 
};


export {  register, getAGuard, update, guardList, login };
