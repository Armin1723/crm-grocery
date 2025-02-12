const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      set: (value) => sanitizeHtml(value),
    },
    address: {
      type: String,
      set: (value) => sanitizeHtml(value),
    },
    role: {
      type: String,
      enum: ["admin", "employee", "support"],
      default: "employee",
    },
    uuid: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    identityProof: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
      validate: [validator.isDate, "Please provide a valid date"],
    },
    phone: {
      type: String,
      required: true,
      validate: [validator.isMobilePhone, "Please provide a valid phone"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      index: true,
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

const User = mongoose.model("User", userSchema);

module.exports = User;
