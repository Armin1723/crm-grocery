require("dotenv").config();
const User = require("../models/user.model");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary");

const { sendMail } = require("../helpers");
const registerMailTemplate = require("../templates/email/registerMailTemplate");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      errors: {
        email: "Email / Employee ID is required",
        password: "Password is required",
      },
    });
  }

  const user = await User.findOne({
    $or: [{ email: email }, { uuid: { $regex: new RegExp(email, "i") } }],
  })
    .select("+password")
    .populate("company");

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      errors: {
        email: "Invalid Crendentials",
        password: "Invalid Credentials",
      },
      success: false,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({
        success: false,
        errors: {
          email: "Invalid Crendentials",
          password: "Invalid Credentials",
        },
      });
  }

  const subscriptionActive =
    !user.company || user?.company?.subscriptionEndDate > Date.now();
  if (!subscriptionActive) {
    return res.status(400).json({
      success: false,
      message: "Subscription Expired",
      errors: { company: "Subscription Expired" },
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      company: user?.company?._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  user.password = undefined;
  res.status(200).json({ success: true, user });
};

const registerUser = async (req, res) => {
  const { email, name, phone, dob, address } = req.body;
  if (!email || !name || !phone || !dob) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const existingUser = await User.findOne({
    $and: [{ $or: [{ email }, { phone }] }, { role: "admin" }],
  });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const user = new User({
    email,
    name,
    phone,
    dob,
    address,
    role: "admin",
  });

  const password =
    user.name.split(" ")[0].toLowerCase() + "@" + user.phone.slice(-4);
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;

  //generate UUID
  const generateUUID = async () => {
    let uuid = "EMP" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const existingUser = await User.findOne({ uuid });
    if (existingUser) {
      return generateUUID();
    } else {
      return uuid;
    }
  };

  user.uuid = await generateUUID();

  // Upload avatar
  if (req.files) {
    const { avatar } = req.files;
    if (avatar) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          avatar[0].path,
          { folder: "clients" }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload avatar to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        user.avatar = cloudinaryResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload avatar to cloud.",
          error: error.message,
        });
      }
    }
  }

  await user.save();

  // Send email to user with password
  sendMail(
    user.email,
    (subject = "Welcome to CRM App"),
    (message = registerMailTemplate(user?.name))
  );
  res.status(200).json({ success: true, message: "User created successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required.", success: false });
  }
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(400).json({ message: "User not found", success: false });
  }

  if (user.resetPasswordToken && user.resetPasswordExpires > Date.now()) {
    return res
      .status(400)
      .json({ success: false, message: "Password reset link already sent" });
  }

  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  await user.save();

  const message = `<p>Hi ${user.name} . Kindly use this link to reset your password. <a href="${process.env.FRONTEND_URL}/auth/reset-password?token=${resetPasswordToken}">here</a>`;
  sendMail(user.email, (subject = "Password Reset Link"), message);
  res.status(200).json({ success: true, message: "Password reset email sent" });
};

const resetPassword = async (req, res) => {
  const { resetPasswordToken, newPassword } = req.body;
  const user = await User.findOne(
    {
      resetPasswordToken,
    },
    {
      password: 1,
    }
  );

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid token sent" });
  }

  if (user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ success: false, message: "Token expired" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
};

const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Strict",
    secure: process.env.ENVIRONMENT === "prod",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const validateUser = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "Validation Successfull",
    });
  } else {
    res.status(400).json({
      message: "Validation Unsuccessfull, Kindly login again.",
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  validateUser,
};
