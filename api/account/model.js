// Mongoose
const mongoose = require("mongoose");

// Account Schema
const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      minlength: [10, "Account number can not be less than 10 characters"],
      max: [10, "Account number can not exceed 10 characters"],
      unique: true,
    },
    branch: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Branch of the company is required"],
    },
    initialDepoist: {
      type: Number,
      required: [true, "Initial Depoist is required"],
      min: [10, "Initial depoist can not be less than 10 birrs"],
    },
    balance: {
      type: Number,
      required: [true, "Balance of the user is required"],
      min: [1, "Balance can not be less than 1 birr"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "User account is required"],
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
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Account model
const Account = mongoose.model("Account", accountSchema);

// Export Account model
module.exports = Account;
