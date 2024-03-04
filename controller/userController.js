import { User } from "../models/user.js";
import nodemailer from "nodemailer";
import { generateToken } from "../config/jwtTokens.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import crypto from "crypto";


const addvehicle = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { name, num, type } = req.body;

  try {
    const endUser = await User.findById(id);
    console.log(endUser);

    if (!endUser) {
      return res.status(404).json({ message: "End user not found" });
    }

    endUser.vehicle.push({
      name,
      num,
      type,
    });

    await endUser.save();

    res.status(201).json({ message: "Vehicle added successfully", endUser });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVehiclesById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the end user by ID
    const endUser = await User.findById(id);

    if (!endUser) {
      return res.status(404).json({ message: "End user not found" });
    }

    // Get the vehicles associated with the end user
    const vehicles = endUser.vehicle;

    res.status(200).json({ vehicles });
  } catch (error) {
    console.error("Error getting vehicles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllEndUsers = async (req, res) => {
  try {
    // Find all end users
    const endUsers = await User.find();

    if (!endUsers || endUsers.length === 0) {
      return res.status(404).json({ message: "No end users found" });
    }

    res.status(200).json({ endUsers });
  } catch (error) {
    console.error("Error getting end users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createEndUser = async (req, res) => {
  console.log("hres");
  try {
    const { name, mail, password, mob, add } = req.body;

    console.log(req.body);

    const existedUser = await EndUser.findOne({
      $or: [{ Name }, { email }],
    });

    if (existedUser) {
      res.status(205).json({ message: "Email Already Exists" });
      return;
    }
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const user = new EndUser({
      Name,
      email,
      password,
      phone,
      verificationToken,
      address,
    });
    await user.save();
    console.log("here");

    sendVerificationEmail(user);
    res.status(201).json({ message: "User created. Verification email sent." });
  } catch (error) {
    console.log(error);
  }
};

const updateEndUserEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEmail } = req.body;
    const user = await EndUser.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUserWithEmail = await EndUser.findOne({ email: newEmail });

    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== id) {
      return res.status(400).json({ message: "Email already exists" });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: "Email updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const { newEmail } = req.body;
    const user = await EndUser.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email === newEmail) {
      return res
        .status(400)
        .json({ message: "New email is the same as the current email" });
    }

    const existingUserWithEmail = await EndUser.findOne({ email: newEmail });
    if (existingUserWithEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = generateOTP();

    user.verificationToken = otp;
    await user.save();

    sendOTPEmail(user.email, otp);
    console.log(otp);
    return res.status(200).json({ message: "OTP sent for email verification" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

function generateOTP() {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

async function sendOTPEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: "Gmail",
      auth: {
        user: "ayushguptass14@gmail.com",
        pass: "uvzmczkdrlbhqqak",
      },
    });

    const mailOptions = {
      from: "ayushguptass14@gmail.com",
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}

const verifyOTP = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const user = await EndUser.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationToken !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // If OTP is correct, update the user's email

    user.verificationToken = null; // Clear the verification token
    await user.save();

    return res.status(200).json({ message: "OTP verfied successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verify = async (req, res) => {
  const token = req.params.token;
  const user = await EndUser.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  user.verified = true;
  user.save();

  res.redirect("http://localhost:5173/login/auth/vendor"); // Redirect to login page
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
  const mailOptions = {
    from: "ayushguptass14@gmail.com",
    to: user.email,
    subject: "Parkar-Verify Your Email",
    html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title> Account Verification </title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      
      <body class="bg-gray-100">
          <div class="max-w-screen-lg mx-auto mt-8">
              <!-- Dummy Image Section -->
              <div className="flex justify-center ">
                  <img src="https://via.placeholder.com/300" alt="Dummy Image" class="mx-auto" width="50" height = "50"  >
              </div>
      
              <!-- Content Section -->
              <div class="bg-white shadow-md rounded-lg px-8 py-6 mt-8">
                  <h1 class="text-gray-800 text-lg font-semibold">Welcome ${user.Name}</h1>
                  <p class="text-gray-700 mt-2">Thank you for creating an account with Parkar. </p>
                  <p>Please click the link below to activate your account.</p>
                  <a href="http://localhost:7001/v1/api/vendor/verify/${user.verificationToken}" class="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Activate Account</a>
              </div>
          </div>
      </body>
      
      </html>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

const DeleteUser = async (req, res) => {
  try {
    const deletebooking = await EndUser.deleteMany();

    res.json({ message: "deleted" });
  } catch (error) {
    console.error("Error getting booking by id :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);

    const findUser = await EndUser.findOne({ email });

    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!(await findUser.isPassWordMatched(password))) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const refreshToken = await generateRefreshToken(findUser._id);

    const updateUser = await EndUser.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    if (!updateUser) {
      return res.status(500).json({ error: "Failed to update user" });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    const data = {
      _id: findUser._id,
      Name: findUser.Name,
      email: findUser.email,
      phone: findUser.phone,
      address: findUser.address,
      vehicle_info: findUser.vehicle_info,
      token: generateToken(findUser._id),
    };

    res.json({ data });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  createEndUser,
  login,
  getVehiclesById,
  addvehicle,
  updateEndUserEmail,
  getAllEndUsers,
  verifyOTP,
  sendOtp,
};
