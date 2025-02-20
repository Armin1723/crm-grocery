require("dotenv").config();
const User = require("../models/user.model");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary");

const { sendMail } = require("../helpers");
const registerMailTemplate = require("../templates/email/registerMailTemplate");
const passwordResetMailTemplate = require("../templates/email/passwordResetMailTemplate");
const loginOtpMailTemplate = require("../templates/email/loginOtpMailTemplate");

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
    $or: [
      { email: email.toString() },
      { uuid: email.toString().toUpperCase() },
    ],
  })
    .select("+password +otp")
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
    return res.status(400).json({
      success: false,
      errors: {
        email: "Invalid Crendentials",
        password: "Invalid Credentials",
      },
    });
  }

  // Check if user is active
  if (user.status !== "active") {
    return res.status(400).json({
      success: false,
      errors: {
        email: "User is inactive.",
      },
    });
  }

  //Do not send OTP for no-company users
  if (!user.company) {
    user.password = undefined;
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        permissions: user.permissions,
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
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user,
    });
  }

  //Check for 2FA and send OTP
  if (user.preferences.twoFactorAuth) {
    if (user.otp) {
      return res.status(200).json({
        success: true,
        message: "OTP already sent to your email",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();
    sendMail(
      user.email,
      (subject = "Login OTP"),
      (message = loginOtpMailTemplate(otp, user?.name, user?.company))
    );
    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      permissions: user.permissions,
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
  res
    .status(200)
    .json({ success: true, user, message: "Logged in successfully" });
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      errors: {
        otp: "OTP is required",
      },
    });
  }

  const user = await User.findOne({
    otp,
  }).populate("company");

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      errors: {
        otp: "Invalid OTP",
      },
      success: false,
    });
  }

  // const subscriptionActive =
  //   !user.company || user?.company?.subscriptionEndDate > Date.now();
  // if (!subscriptionActive) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Subscription Expired",
  //     errors: { company: "Subscription Expired" },
  //   });
  // }

  // Delete OTP
  user.otp = undefined;
  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      permissions: user.permissions,
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
  res
    .status(200)
    .json({ success: true, user, message: "Logged in successfully" });
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

  const random = Math.floor(1000 + Math.random() * 9000);
  const password = user.name.split(" ")[0].toLowerCase() + "@" + random;
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;

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

  // Generate a new lead on the backend
  await fetch(`${process.env.SUPPORT_BACKEND_URL}/api/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      phone: user.phone,
      dob: user.dob,
      description: `Lead Generated organically through user signup form on ${new Date().toDateString()}`,
    }),
  });

  // Send email to user with password
  sendMail(
    user.email,
    (subject = "Welcome to CRM App"),
    (message = registerMailTemplate(user?.name, random))
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

  sendMail(
    user.email,
    (subject = "Password Reset Link"),
    passwordResetMailTemplate(user.name, resetPasswordToken)
  );
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
    sameSite: "None",
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
  verifyOtp,
  registerUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  validateUser,
};
