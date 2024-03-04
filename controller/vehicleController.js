import asyncHandler from "express-async-handler";

const addVehicle = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    // Start a MongoDB session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the vehicle document within the transaction
      const vehicle = await Vehicle.create(req.body, { session });

      // Update the vehicle document with the owner information within the transaction
      const newVehicle = await Vehicle.findByIdAndUpdate(
        vehicle?._id,
        { owner: _id },
        { new: true, session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({ data: newVehicle });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const updateVehicle = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Start a MongoDB session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update the vehicle document within the transaction
      const vehicle = await Vehicle.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        session,
      });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({ data: vehicle });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const deleteVehicle = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Start a MongoDB session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find and delete the vehicle document within the transaction
      const vehicle = await Vehicle.findOneAndDelete({ _id: id }).session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({ data: vehicle });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const getVehicle = asyncHandler(async (req, res) => {
  try {
    // Start a MongoDB session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      // Find the vehicle document within the transaction
      const vehicle = await Vehicle.findById(id).session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      if (!vehicle) {
        // If vehicle not found, return 404 Not Found
        return res.status(404).json({ error: "Vehicle not found" });
      }

      res.json({ data: vehicle });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const getAllVehicle = asyncHandler(async (req, res) => {
  try {
    // Start a MongoDB session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find all vehicles belonging to the user within the transaction
      const vehicles = await Vehicle.find({ owner: req.user._id }).session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.json({ data: vehicles });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const makePermanent = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        permanent: true,
      },
      {
        new: true,
      }
    );
    res.json({ data: vehicle });
  } catch (error) {
    throw new Error(error);
  }
});

export {
  getAllVehicle,
  getVehicle,
  updateVehicle,
  addVehicle,
  makePermanent,
  deleteVehicle,
};
