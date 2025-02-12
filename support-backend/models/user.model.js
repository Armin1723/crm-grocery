const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone:{
        type: String,
        required: true,
        unique: true,
    },
    role: {
      type: String,
      default: "support",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },
    preferences: {
      twoFactorAuth: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

//Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get signed token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Generate two factor auth otp
userSchema.methods.getTwoFactorAuthOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000);
  this.otp = otp;
  return otp;
};

// Generate reset password otp
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = Math.floor(100000 + Math.random() * 900000);

  this.resetPasswordToken = resetToken;

  return resetToken;
};

// Save password as hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
