const User = require("../models/user.model");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { sendMail } = require("../helpers");
const passwordResetMailTemplate = require("../templates/email/passwordResetMailTemplate");

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
      { email: email }, 
      { uuid: { $regex: new RegExp(email, "i") } }
      ]
    }).select("+password");
    

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        errors: { email: "Email/Emp Id not found." },
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
        role: user.role,
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
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (user.resetPasswordToken && user.resetPasswordExpires > Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Password reset link already sent" });
    }

    // const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    sendMail(user.email, (subject = "Password Reset Link"), message = passwordResetMailTemplate(user.name, resetPasswordToken));
    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
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
        .json({ success: false, errors:{
          otp: "Invalid OTP"
        }, message: "Invalid token sent" });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ success: false, errors:{
        otp: "OTP expired"
      } ,message: "Token expired" });
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

const validateUser = async ( req, res ) => {
  if(req.user){
    res.status(200).json({
      message: "Validation Successfull"
    })
  }else{
    res.status(400).json({
      message: "Validation Unsuccessfull, Kindly login again."
    })
  }
}

module.exports = {
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  validateUser
};
