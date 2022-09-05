// Mongoose
const mongoose = require("mongoose");

// Branch Schema
const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Branch name is required"],
      maxlength: [100, "Branch name can not exceed 100 characters"],
      minlength: [2, "Branch name can not be less than 2 characters"],
      unique: true,
    },
    branchCode: {
      type: String,
      required: [true, "Branch code is required"],
      maxlength: [4, "Branch code can not exceed 4 characters"],
      minlength: [4, "Branch code can not be less than 4 characters"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Addres is required"],
      maxlength: [100, "Address can not exceed 100 characters"],
      minlength: [2, "Address can not be less than 2 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Branch model
const Branch = mongoose.model("Branch", branchSchema);

// Export Branch model
module.exports = Branch;
