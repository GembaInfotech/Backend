

// // import { Cart } from "../models/cartModel.js";
// import {Check} from "../models/checkModel.js";
// import asyncHandler from "express-async-handler";
// import { generateToken } from "../config/jwtTokens.js";
// import { validateId } from "../utils/validateMongoDbId.js";
// import { generateRefreshToken } from "../config/refreshToken.js";
// import { sendMail } from "./emailController.js";
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import { ppid } from "process";

// const createUser = async (req, res) => {
//   try {
//     const { name, email, password, phone, role } = req.body;

//     const existedUser = await User.findOne({
//       $or: [{ name }, { email }],
//     });

//     if (existedUser) {
//       res.json({ error1: "error already registerd user " });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       phone,
//       role,
//     });

//     if (user) res.json({ user: user });
//   } catch (error) {
//     console.log("error");
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   const findUser = await User.findOne({ email });
//   if (findUser && (await findUser.isPassWordMatched(password))) {
//     const refreshToken =await generateRefreshToken(findUser?._id);
//      const updateuser =await User.findOneAndUpdate(findUser?._id,{
//       refreshToken:refreshToken,
//      },
//      {
//       new :true
//      }
//      );
//      res.cookie('refreshToken', refreshToken,{
//       httpOnly:true,
//       maxAge :72*60*60*1000,
//      })

//     res.json({
//       _id: findUser?._id,
//       name: findUser?.name,
//       phone: findUser?.phone,
//       email: findUser?.email,
//       token: generateToken(findUser?._id),
//     });
//   } else {
//     res.json({ error: "credentials error" });
//   }
// };

// const logout = async (req, res) => {

//   const cookie =req.cookies;
//   if(!cookie?.refreshToken)
// {
// res.json({"error":"no refresh token"})
// }
// const refreshToken=cookie.refreshToken;
// const user =await User.findOne({
//   refreshToken
// });
// if(!user)
// {
//   res.clearCookie('refreshToken', {
//     httpOnly:true,
//     secure:true,
//   });
//   return res.sendStatus(204); //forbidden

// }


// await User.findOneAndUpdate({refreshToken}, {
//   refreshToken : "",
// },{
//   new :true
// });

// res.clearCookie('refreshToken', {
//   httpOnly:true,
//   secure:true,
// });
// return res.sendStatus(204);

// };


// const handleRefreshToken =async(req, res)=>{

// const cookie =req.cookies;
// if(!cookie?.refreshToken)
// {
// res.json({"error":"no refresh token"})
// }
// const refreshToken=cookie.refreshToken;

// const user =await User.findOne({
//   refreshToken
// });

// if(!user)
// {res.json({'error':"no refresh token presnet in DB or not matched "});
// }
// jwt.verify(refreshToken, "mysecret",(err, decoded) =>{
//   if(err || user.id !== decoded.id)
//   {
//     res.json({"error":"there is something wrong with refresh token"})

//   }
//   const accessToken =generateToken(user?._id);
//   res.json({accessToken});
   
// }
// )



// }


// const getAllUsers = async (req, res) => {
//   try {
//     const getUsers = await User.find();
//     res.json(getUsers);
//   } catch (error) {
//     res.json("error of getAllUser");
//   }
// };

// const getUser = async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   try {
//     const aUser = await User.findById(id).populate("bookings");
//     res.json({
//       aUser,
//     });
//   } catch (error) {
// throw new Error(error)  }
// };
// const deleteUser = async (req, res) => {
//   const { id } = req.params;
//   validateId(id);
//   try {
//     const aUser = await User.findByIdAndDelete(id);
//     res.json({
//       aUser,
//     });
//   } catch (error) {
//     res.json("error of deleteUser");
//   }
// };

// const updateUser = async (req, res) => {
//   const { id } = req.user;
//   validateId(id);
//   try {
//     const aUser = await User.findByIdAndUpdate(
//       id,
//       {
//         name: req.body?.name,
//         email: req.body?.email,
//         phone: req.body?.phone,
//         role:req.body?.role
//       },
//       {
//         new: true,
//       }
//     );

//     res.json({
//       aUser,
//     });
//   } catch (error) {
//     res.json("error of deleteUser");
//   }
// };




// const updatePassword =asyncHandler( async(req, res) =>{
   
//   const {_id} =req.user;
//   const {password}=req.body;
//   validateId(_id);

//   const findUser = await User.findById(_id);
//   if(password){
//     findUser.password=password;
//     const updatedPassword =await findUser.save();
//     res.json(updatedPassword);
//     }
//     else{
//       res.json(findUser);
//     }



// })




// const forgotPasswordToken =asyncHandler (async(req,res)=>{

//   const {email} =req.body;
//   const user = await User.findOne({email});
//   if(!user) throw new Error ('user not found with this email');
//   try{
//     const token =await user.createPasswordResetToken();
//     await user.save();
//     const resetURL = `Hi, Please follow this link to reset your Password.This link valid only for 10 minutes.<a href='http://localhost:3002/api/user/resetPassword/${token}'>click here </a>`
//     const data ={
//       to:email,
//       text: "Hey User",
//       subject: "Forgot Password Link",
//       htm:resetURL

//     }
//     sendMail(data);
//     res.json(token);
//   }
//   catch(error)
//   {
//     throw new Error (error);
//   }



// })



// const resetPassword =asyncHandler (async(req, res) =>{
//  const {password }=req.body;
//  const {token} =req.params;
//  const hashedToken =crypto.createHash('sha256').update(token).digest('hex');
//  const user = await User.findOne({
//   passwordResetToken:hashedToken,
//   passwordResetExpires : {$gt :Date.now()},
//  });

//   if(!user) throw new Error( "token expired, try Again later");

//    user.password =password;
//    user.passwordResetToken=undefined;
//    user.passwordResetExpires =undefined;
//    await user.save();
//    res.json(user);


// })


// const getCart = asyncHandler(async(req,res)=>{

// try{
//   const {_id}= req.user;
//   const user=await User.findById(_id); 
//   const cart =await Cart.findOne({ bookedBy :user._id}).populate('parkings');
// res.json(cart);
// }
// catch(err)
// {
//   throw new Error(err);
// }


// })

// const addtoCart = asyncHandler(async(req, res)=>{

//   const {pid} =req.body;
//   console.log(pid);
//   const {_id} =req.user;
//   validateId(_id);
// try{

//   const user=await User.findById(_id); 
//   const cart =await Cart.findOne({ bookedBy :user._id});
//   const parkingss=[];
//   parkingss.push(pid);
// if(cart)
// {
//   let newcart = await Cart.findOne({bookedBy:user._id})

//   // Use $push to add a parking to the parkings array
//   const updated =await Cart.findByIdAndUpdate(
//     newcart._id,
//     // Filter by the newly created cart's ID
//     { $push:  { parkings: pid } }
//     ,
//     {new:true}
//   ).populate("parkings");
//   console.log(updated);

// res.json({"suc":"true",
//      "name" :user.name,
//         "Cart": updated})
// }else{

//     let newcart = await Cart.create({
//      parkings:pid,
//      $push:  { parkings: pid } ,
//      bookedBy : user._id
  
//     });
  
    
//     console.log(newcart.populate("parkings"));
  
//   res.json({"suc":"true",
//        "name" :user.name,
//           "Cart": newcart})
  
  
  
  
// }




  
// }
// catch(err)
// {
//   throw new Error(err);
// } 



  
// })





  
//   // Example request body with multiple checks
//   // {
//   //   "checks": [
//   //     { "tcode": "GS10020", "name": "a1", "new": true, "read": true, "edit": true, "delete": true },
//   //     { "tcode": "GS10021", "name": "a2", "new": true, "read": true, "edit": false, "delete": true }
//   //   ]
//   // }
  
 
//   // try{
//   //   const {id} = req.params;
//   //   const chckmodel = await Check.create(req.body);
//   //   const update1=  await Side.findByIdAndUpdate( id, {
         
//   //     $push:{ checks : chckmodel._id }

//   //   },
//   //   {
//   //     new:true
//   //   })
//   //   console.log(update1);
    
//   //   res.json({model:chckmodel});
//   // }
//   // catch(error)
//   // {
//   //   throw new Error(error);
//   // }

//   const createcheck= asyncHandler(async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { checks } = req.body;
  
//       // Ensure checks is an array
//       if (!Array.isArray(checks)) {
//         return res.status(400).json({ error: 'Checks must be an array' });
//       }
  
//       // Create an array to store the created check models
//       const createdChecks = [];
  
//       // Loop through the checks array and create each check
//       for (const checkData of checks) {
//         const chckModel = await Check.create(checkData);
  
//         // Update the Side document with the new check ID
//         const update1 = await Side.findByIdAndUpdate(
//           id,
//           {
//             $push: { checks: chckModel._id },
//           },
//           {
//             new: true,
//           }
//         );
  
//         console.log(update1);
//         createdChecks.push(chckModel);
//       }
  
//       res.json({ models: createdChecks });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: error });
//     }
//   });


// const getCheck = asyncHandler (async(req, res)=>{
 
//   try{
//     const {id}=req.params
//     const chckmodel = await Check.findById(id).select(
//       { createdAt: 0 ,
//          updatedAt:0,
//         __v :0,
//       _id:0}
//     );
//     res.json(chckmodel);
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }

// })
// const updateCheck = asyncHandler (async(req, res)=>{
 
//   try{
//     const {id}=req.params
//     const chckmodel = await Check.findByIdAndUpdate(id, 
//       req.body,
//     {
//       new:true
//     }).select(
//       { createdAt: 0 ,
//          updatedAt:0,
//         __v :0,
//       _id:0}
//     );
//     res.json(chckmodel);
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }

// })



// const createSide = asyncHandler (async(req, res)=>{
 
//   try{
//     const side = await Side.create(req.body);
//     res.json(side);
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }

// })

// const deleteSide = asyncHandler (async(req, res)=>{
 
//   try{
//     const {id}=req.params;
//     const side = await Side.findByIdAndDelete(id);
//     res.json(side);
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }

// })

// const getSide = asyncHandler (async(req, res)=>{
 
//   try{
//     const {id}=req.params
//     const sideModel = await Side.findById(id).select(
//       { createdAt: 0 ,
//          updatedAt:0,
//         __v :0,
//       _id:0}
//     ).populate("checks");
//     res.json(sideModel);
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }

// })

// const getAllSide = asyncHandler (async(req, res)=>{
 
//   try{
//     const sideModel = await Side.find().select(
//       { createdAt: 0 ,
//          updatedAt:0,
//         __v :0,
//     }
//     ).populate("checks");
//     res.json({side:sideModel});
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }

// })
// const getAllCheck = asyncHandler (async(req, res)=>{
 
//   try{
//     const checkModel = await Check.find().select(
//       { createdAt: 0 ,
//          updatedAt:0,
//         __v :0,
//     }
//     )
//     res.json({check:checkModel});
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }

// })




// const createDefine = asyncHandler (async(req, res)=>{
 
//   try{

//     const {id} =req.params;
//     const defined = await Define.create({tcode:id});
//     const updated = await Define.findOneAndUpdate(
//       { _id: defined._id },
//       {
//         $set: {
//           form: req.body,
//         },
//       },
//       {
//         new: true,
//       }
//     );
  
    

//     res.json(updated);
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }

// })



// const getAllDefine = asyncHandler (async(req, res)=>{
 
//   try{
//     const {id} =req.params;
//     const alldata= await Define.find(
//       {tcode:id}
//       );

    
//     res.json(alldata);
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }
// })

// const getform = asyncHandler (async(req, res)=>{
 
//   try{
//    const {id} = req.params;
//     const data= await Define.findOne(
//      {
//       _id: id
//      }
//       ).select("form");

    
//     res.json({form:data});
//   }
//   catch(error)
//   {
//     throw new Error(error);
//   }
// })




// export { createUser, login, logout,
//    getAllUsers, getUser, deleteUser,
//     updateUser , handleRefreshToken,
//    updatePassword, forgotPasswordToken, 
//    resetPassword, addtoCart,getform, 
//    createcheck, getCheck,getCart,getSide,
//    updateCheck, getAllSide, deleteSide,getAllCheck,
//    createSide, createDefine, getAllDefine
//     };
