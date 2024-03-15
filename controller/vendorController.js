import { Vendor } from "../models/vendor.js";
import nodemailer from "nodemailer";
import { generateToken } from "../config/jwtTokens.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import crypto from "crypto";
import bcrypt from "bcrypt";




const vendorData = async(req,res)=>{
  const {id} = req.user
  
  try {
    console.log("34567");
    const vendor = await Vendor.findOne({ _id:id }); 
    console.log(vendor);
    res.json({"vendor":vendor})
  } catch (error) {
    console.log("error");
    res.status(401).json({"error":error})
  }
    
}
const update = async (req, res) => {
  const { vendorId } = req.ser;
  try {
    const body = req.body;
    const data = await Vendor.findByIdAndUpdate(vendorId, body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    return res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


const register = async (req, res) => {
  try {
    const { name, mail, password, mob, add } = req.body;
    const existedUser = await Vendor.findOne({
      $or: [{ name }, { mail }],
    });
    if (existedUser) {
      res.status(205).json({ message: "Email Already Exists" });
      return;
    }
    const verificationToken = await crypto.randomBytes(20).toString("hex");
    const data = new Vendor({
      name,
      mail,
      password,
      mob,
      verificationToken,
      add,
    });
    await data.save();
    sendVerificationEmail(user);
    res.status(201).json({ message: "User created. Verification email sent." });
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res) => {
  const token = req.params.token;
  const user = await Vendor.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
  user.verified = true;
  user.save();
  res.redirect("http://localhost:5173/login/auth/vendor"); // Redirect to login page
};

const DeleteVendor = async (req, res) => {
  const { id } = req.params;
  try {
    await Vendor.findByIdAndDelete(id);
    res.json({ message: "deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ayushguptass14@gmail.com",
    pass: "uvzmczkdrlbhqqak",
  },
});

function sendVerificationEmail(user) {
  console.log(user.verificationToken);
  const mailOptions = {
    from: "ayushguptass14@gmail.com",
    to: user.mail,
    subject: "Verify Your Email",
    html: `<p>Click <a href="http://localhost:7001/v1/api/vendor/verify/${user.verificationToken}">here</a> to verify your email.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

const vendorList = async (req, res) => {
  const vendors = await Vendor.find();
  res.json({data: vendors});
};

const getparking = async (req, res) => {
  const { id } = req.user;
  const vendors = await Vendor.findById(id).select('parkings').populate('parkings');
  res.json({ data: vendors });
};

const login = async (req, res) => {
  const { mail, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ mail:mail });
    const isPasswordMatched = await bcrypt.compare(password, vendor.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
   
    const refreshToken = await generateRefreshToken(vendor._id);
    await Vendor.findOneAndUpdate(
      { _id: vendor._id },
      { refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    });
    const data = {
      
      token: generateToken(vendor._id),
    };
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default login;

export {
  vendorData,
  login,
  register,
  getparking,
  verify,
  update,
  vendorList,
  DeleteVendor,
};
