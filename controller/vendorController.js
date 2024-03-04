import { Vendor } from "../models/vendor.js";
import nodemailer from "nodemailer";
import { generateToken } from "../config/jwtTokens.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import crypto from "crypto";

const update = async (req, res) => {
  const { vendorId } = req.params;
  console.log(vendorId)
  try {
    const updated = req.body;

    const updatedvendor = await Vendor.findByIdAndUpdate(vendorId, updated, {
      new: true,
    });

    if (!updatedvendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.status(200).json({ data: updatedvendor });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const register = async (req, res) => {
  console.log("hres");
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
    console.log(verificationToken);
    const user = new Vendor({
      name,
      mail,
      password,
      mob,
      verificationToken,
      add,
    });
    await user.save();
    console.log(user);

    sendVerificationEmail(user);
    res.status(201).json({ message: "User created. Verification email sent." });
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res) => {
  const token = req.params.token;
  console.log(token);
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
  console.log(id);
  try {
    const deletebooking = await Vendor.findByIdAndDelete(id);

    res.json({ message: "deleted" });
  } catch (error) {
    console.error("Error getting booking by id :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Nodemailer configuration
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
  res.json(vendors);
};

const getparking = async (req, res) => {
  console.log("called")
  const { id } = req.params;
  const vendors = await Vendor.findById(id).select('parkings').populate('parkings');
  res.json({ data: vendors });
};

import bcrypt from "bcrypt";

const login = async (req, res) => {
  const { mail, password } = req.body;
  console.log(mail, password);
  try {
    // Find the vendor by email
    const vendor = await Vendor.findOne({ mail });
    console.log(vendor);

    // Check if password matches
    const isPasswordMatched = await bcrypt.compare(password, vendor.password);

    if (!isPasswordMatched) {
      // Password doesn't match
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Password matched, generate tokens and response
    const refreshToken = await generateRefreshToken(vendor._id);
    const updatedVendor = await Vendor.findOneAndUpdate(
      { _id: vendor._id },
      { refreshToken },
      { new: true }
    );

    // Set refreshToken cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    });

    // Prepare response data
    const data = {
      _id: vendor._id,
      name: vendor.name,
      mail: vendor.mail,
      mob: vendor.mob,
      add: vendor.add,
      token: generateToken(vendor._id),
    };

    // Send success response with user data
    res.status(200).json({ data });
  } catch (error) {
    // Internal server error
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default login;

export {
  login,
  register,
  getparking,
  verify,
  update,
  vendorList,
  DeleteVendor,
};
