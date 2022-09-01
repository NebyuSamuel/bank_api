// Mongoose
const mongoose = require("mongoose");

// Validator
const validator = require("validator");

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      maxlength: [255, "First name can not exceed 255 characters"],
      minlength: [2, "First name can not be less than 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is requried"],
      maxlength: [255, "First name can not exceed 255 characters"],
      minlength: [2, "First name can not be less than 2 characters"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    status: {
      type: String,
      default: "Active",
      enum: {
        values: ["Active", "Inactive"],
        message: "Unknown or Invalid user account status",
      },
    },
  },
  {
    timestamps: true,
  }
);

// User Model
const User = mongoose.model("User", userSchema);

// Export User Model
module.exports = User;
