const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    dob: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["new", "open", "contacted", "converted", "lost"],
      default: "new",
    },
    timeline: [
      {
        description: {
          type: String,
        },
        on: {
          type: Date,
        },
      }
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
