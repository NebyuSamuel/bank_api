// Mongoose
const mongoose = require("mongoose");

// Validator
const validator = require("validator");

// User Backup Schema
const backupSchema = new mongoose.Schema(
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
      unique: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
    },
  },
  {
    timestamps: true,
    writeConcern: {
      w: "majority",
      j: true,
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// UserBackup Model
const Backup = mongoose.model("Backup", backupSchema);

// Export User Backup Model
module.exports = Backup;
