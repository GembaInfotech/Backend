import { User } from "../models/user.js";
import nodemailer from "nodemailer";
import { generateToken } from "../config/jwtTokens.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import crypto from "crypto";
import { request } from "http";
import { log } from "console";




const userData = async(req,res)=>{
  const {id} = req.user
  
  try {
    console.log("34567");
    const user = await User.findOne({ _id:id }); 
    console.log(user);
    res.json({"user":user})
  } catch (error) {
    console.log("error");
    res.status(401).json({"error":error})
  }
    
}

const addvehicle = async (req, res) => {
  const { id } = req.user;

  const { name, num, type } = req.body.formData;
  try {
    // console.log(name, num, type, id )
    const data = await User.findById(id);
    console.log(data);

    if (!data) {
      return res.status(404).json({ message: "End user not found" });
    }
   data.vehicle.push({
      name,
      num,
      type,
    });
    await data.save();
    res.status(201).json({ message: "Vehicle added successfully", data:data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const setDefaultVehicle = async (req, res) => {
 const {vehicleId, def}=req.body;
  try {
    console.log(req.body  )
    const { id } = req.user;
    const user = await User.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (def) {
      const hasDefaultVehicle = user.vehicle.some(vehicle => vehicle.def);
      if (hasDefaultVehicle) {
        // Clear the default status from the existing default vehicle
        const existingDefaultVehicle = user.vehicle.find(vehicle => vehicle.def);
        existingDefaultVehicle.def = false;
      }
    }
    
    const vehicle = user.vehicle.id(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    
    vehicle.def = def;
    
    await user.save();
    res.status(200).json({ message: "Vehicle status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const deletevehicle = async (req, res) => {
  const { id } = req.user; 
  const{ vid } =req.params;
  try {
    const data = await User.findByIdAndUpdate(
      {_id: id }, 
      { $pull: { vehicle: { _id: vid } } }, 
      { new: true } 
    );
    if (!data) {
      
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getVehiclesById = async (req, res) => {
  const { id } = req.user;
  // console.log(req.user)
  try {
    const data = await User.findById(id);
    if (!data) {
      return res.status(404).json({ message: "End user not found" });
    }
    const vehicles = data.vehicle;
    res.status(200).json({ data:vehicles });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllEndUsers = async (req, res) => {
  try {
    const data = await User.find();
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No end users found" });
    }
    res.status(200).json({ data:data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createEndUser = async (req, res) => {
  try {
    console.log("check............");
    console.log(req.body);
    const { name, mail, password, mob } = req.body;
    console.log(name);
    const existedUser = await User.findOne({
        mail }
    );
    console.log("testing.....1");
    if (existedUser) {
      console.log("testing.....3");
      res.status(205).json({ message: "Email Already Exists" });
      return;
    }
    console.log("testing....2");
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const data = new User({
      name,
      mail,
      password,
      mob,
      verificationToken,
    });
    console.log("data", data);
    await data.save();
    console.log("dfghjk");
    sendVerificationEmail(data);
    console.log("dsfghjjhgf");
    res.status(201).json({ message: "User created. Verification email sent." });
  } catch (error) {
    res.status(401).json({error:error})  }
};

const updateEndUserEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEmail } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingUserWithEmail = await User.findOne({ mail: newEmail });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== id) {
      return res.status(400).json({ message: "Email already exists" });
    }
    user.mail = newEmail;
    await user.save();
    res.status(200).json({ message: "Email updated successfully", data:user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEmail } = req.body;
    const data = await User.findById(id);
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    if (data.mail === newEmail) {
      return res
        .status(400)
        .json({ message: "New email is the same as the current email" });
    }

    const existingUserWithEmail = await User.findOne({ mail: newEmail });
    if (existingUserWithEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = generateOTP();

    data.verificationToken = otp;
    await data.save();

    sendOTPEmail(data.mail, otp);
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

async function sendOTPEmail(mail, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ayushguptass14@gmail.com",
        pass: "uvzmczkdrlbhqqak",
      },
    });

    const mailOptions = {
      from: "ayushguptass14@gmail.com",
      to: mail,
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
    const data = await User.findById(id);
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }
    if (data.verificationToken !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    data.verificationToken = null; // Clear the verification token
    await data.save();
    return res.status(200).json({ message: "OTP verfied successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verify = async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
  user.verified = true;
  user.save();
  res.redirect("https://backend-2-v1ta.onrender.com/login");
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "prashantrana9516@gmail.com",
    pass: "qqjsatrjwvbynknu",
  },
});
function sendVerificationEmail(user) {
  console.log("", user )
  const mailOptions = {
    from: "prashantrana9516@gmail.com",
    to: user.mail,
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
                  <h1 class="text-gray-800 text-lg font-semibold">Welcome ${user.name}</h1>
                  <p class="text-gray-700 mt-2">Thank you for creating an account with Parkar. </p>
                  <p>Please click the link below to activate your account.</p>
                  <a href="https://backend-2-v1ta.onrender.com/v1/api/User/token/${user.verificationToken}" class="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Activate Account</a>
              </div>
          </div>
      </body>
      
      </html>
      `,

      
  };

  console.log("email testing");

  transporter.sendMail(mailOptions, (error, info) => {
    console.log("testing....");
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}


const login = async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!(await user.isPassWordMatched(password))) {
      return res.status(401).json({ error: "Invalid password" });
    }
    if(!user.verified){
      return res.status(405).json({ error: "Please, Verify Your email" });
    }

    const refreshToken = await generateRefreshToken(user._id);

    const updateUser = await User.findByIdAndUpdate(
      user._id,
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
    
      token: generateToken(user._id, user.mail),
    };

    res.status(200).json({ token:data });
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
  deletevehicle,
  verify, 
  updateEndUserEmail,
  getAllEndUsers,
  verifyOTP,
  sendOtp,
  setDefaultVehicle,
  userData
};
