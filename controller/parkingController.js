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
  try {
    const data = await Parking.findById(parkingId)
    res.json({ data: data });
  } catch (error) {
    res.json(error);
  }
};



const deleteParking = async (req, res) => {
  const { id } = req.params;
  try {
    await Parking.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.json(error);
  }
};


const update= async (req, res)=>{
  const { id } = req.params;
  const updatedData = req.body.updatedData;
  console.log(updatedData)
try{

  const parking = await Parking.findByIdAndUpdate(id, updatedData, { new: true });
  if (!parking) {
    return res.status(404).json({ message: 'Parking not found' });
  }
  res.json({data:parking});
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
      location,
      assg
    } = req.body.ParkingData;

    // Create a new ParkingDetail document
    console.log(req.body)
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
      location,
      cc,
      assg
    });
   const {id}= req.user;
    const newParkingId = parking._id;
    const updatedUser = await Vendor.findByIdAndUpdate(id, {
      $push: { parkings: newParkingId }
    });

    if (!updatedUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    console.log(parking)
    res.status(201).json({ data:parking });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const parkingList = async (req, res) => {
  // const { lat, long, radius } = req.params;
  // const lati = parseFloat(lat);
  // const lng = parseFloat(long);
  // console.log(lat);

  try {
    const parkings = await Parking.find();
    return res.json({ parkings: parkings });
  } catch (error) {
    console.error("Error fetching parking spots:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  parkingList,
  getAParking,
  register,
  deleteParking,
  update,
  getParkingdetail,
};
