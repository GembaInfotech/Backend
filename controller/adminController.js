// import asyncHandler from "express-async-handler";
// import { Gaurd } from "../models/gaurdModel.js";

// const addGaurd = asyncHandler(async(req, res)=>{

//     const {id} =req.params;
//    try{
//     const gaurd = await Gaurd.create(req.body);
//     const parking = await Parking.findByIdAndUpdate(id,
//         {
//             gaurd:gaurd?._id

//         },
//         {
//             new:true
//         });
//         res.json(parking);
//    }
//    catch(error)
//    {
//     throw new Error(error);
//    }

// })

// export {addGaurd};
