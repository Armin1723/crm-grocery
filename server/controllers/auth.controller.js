const User = require("../models/user.model");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { sendMail } = require("../helpers");

const loginUser = async (req, res) => {
  try {
    const { email, password, role = "employee" } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        errors: {
          email: "Email is required",
          password: "Password is required",
        },
      });
    }

    const user = await User.findOne({ email, role }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        errors: { email: "Email not found." },
        success: false,
      });
    }

    if (user.role !== role) {
      return res.status(400).json({
        message: "Not Authorized.",
        errors: { role: "Mismatched Role." },
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, errors: { password: "Invalid password" } });
    }

    const token = jwt.sign(
      {
        id: user._id,
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
  } catch (error) {
    console.error(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
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
      return res
        .status(400)
        .json({ message: "User not found", success: false });
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
    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const resetPassword = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "Strict",
      secure: process.env.ENVIRONMENT === "prod",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
};
