import { Vendor } from "../models/vendor.js";
import { Parking } from "../models/parking.js";
import mongoose from "mongoose";

const getParkingdetail = async (req, res) => {
  const { id } = req.params;
  try {
    const Parking = await Parking.findById(id).populate(
      "guard"
    );
    res.json({ data: Parking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAParking = async (req, res) => {
  const { parkingId } = req.params;
  console.log(parkingId);

  try {
    const vendor = await Parking.findById(parkingId)
    res.json({ parkings: vendor });
  } catch (error) {
    res.json(error);
  }
};



const deleteParking = async (req, res) => {
  const { parkingId } = req.params;
  console.log(parkingId);

  try {
    await Parking.findByIdAndDelete(parkingId);
    res.status(500).json({ message: "deleted" });
  } catch (error) {
    res.json(error);
  }
};


const update= async (req, res)=>{
  const { id } = req.params;
  const updatedData = req.body;
try{

  const parking = await Parking.findByIdAndUpdate(id, updatedData, { new: true });

  if (!parking) {
    return res.status(404).json({ message: 'Parking not found' });
  }

  res.json(parking);
} catch (error) {
  console.error('Error updating parking:', error);
  res.status(500).json({ message: 'Internal server error' });
}
}

const register = async (req, res) => {
  try {
    console.log(req.body)
    const {
      pn,
      pa,
      city,
      st,
      country,
      pc,
      ln,
      sc,
      price,
      ep,
      mt,
      met,
      sub,
      subc,
      subamt,
      lm,
      cc,
    
    lc,
      assg
    } = req.body;

    // Create a new ParkingDetail document
    const parking = await Parking.create({
      pn,
      pa,
      city,
      st,
      country,
      pc,
      ln,
      sc,
      price,
      ep,
      mt,
      met,
      sub,
      subc,
      subamt,
      lm,
      lc,
      cc,
      assg
    });

    // Get the newly created parking's ID
    const newParkingId = parking._id;

    // Find the user by ID and update its parkings array
    const updatedUser = await Vendor.findByIdAndUpdate(req.params.vendorId, {
      $push: { parkings: newParkingId }
    });

    if (!updatedUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Parking ID added to user parkings array:", newParkingId);

    // Send response
    res.status(201).json({ parking });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const parkingList = async (req, res) => {
  const { lat, long, radius } = req.params;
  const lati = parseFloat(lat);
  const lng = parseFloat(long);
  console.log(lat);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find parking spots within the specified radius
    const parkings = await Parking.find().session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.json({ data: parkings });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error fetching parking spots:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// const parkingListV = async (req, res) => {
//   const { lat, long, radius } = req.params;
//   const lati = parseFloat(lat);
//   const lng = parseFloat(long);
//   console.log(lat);
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Find parking spots within the specified radius
//     const parkings = await Parking.find({
//       find(vendorId);
//     }).session(session);

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     return res.json({ data: parkings });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error fetching parking spots:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export {
  parkingList,
  getAParking,
  register,
  deleteParking,
  update,
  getParkingdetail,
};
