const { sendMail } = require("../helpers");
const User = require("../models/user.model");
const forgotPasswordMailTemplate = require("../template/email/forgotPasswordMailTemplate");
const registrationMailTemplate = require("../template/email/registrationMailTemplate");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email and password",
    });
  }

  // Check if the user exists in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
      errors: {
        email: "Invalid credentials",
        password: "Invalid credentials",
      },
    });
  }

  if (!user.isVerified) {
    return res.status(401).json({
      success: false,
      message: "Please verify your email",
      errors: {
        email: "Please verify your email",
        password: "Please verify your email",
      },
    });
  }

  // Check if the password is correct
  const isPasswordCorrect = await user.matchPassword(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
      errors: {
        email: "Invalid credentials",
        password: "Invalid credentials",
      },
    });
  }

  // Generate token
  const token = user.getSignedJwtToken();

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

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide a name, email and password",
    });
  }

  // Check if the user already exists
  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  // Create a new user
  const newUser = await User.create(req.body);

  // Send OTP to the user's email
  const otp = newUser.getTwoFactorAuthOTP();
  newUser.otp = otp;
  await newUser.save();

  res.status(200).json({
    success: true,
    message: "OTP sent to email",
  });

  process.nextTick(async () => {
    await sendMail(
      newUser.email,
      "Two Factor Authentication OTP",
      registrationMailTemplate(newUser.name, newUser.email, otp)
    );
  });
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email and OTP",
    });
  }

  const user = await User.findOne({
    email,
    otp,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  user.otp = undefined;
  user.isVerified = true;
  await user.save();

  // Generate token
  const token = user.getSignedJwtToken();

  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  user.password = undefined;
  res.status(201).json({
    success: true,
    user,
    message: "User created successfully",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email",
    });
  }

  const user = await User.findOne({ email }).select(
    "+password +resetPasswordToken +resetPasswordExpire"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.resetPasswordToken && user.resetPasswordExpire > Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Password reset token already sent",
    });
  }

  const resetToken = user.getResetPasswordToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  sendMail(
    email,
    "Password Reset OTP",
    forgotPasswordMailTemplate(user.name, user.email, resetToken)
  );

  await user.save();

  res.status(200).json({
    success: true,
    message: "OTP sent to email",
  });
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email, resetPasswordToken: otp });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};

module.exports = { login, register, logout, verifyOTP, forgotPassword, resetPassword };
