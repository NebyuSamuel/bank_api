// Mongoose
const mongoose = require("mongoose");

// Account Schema
const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      minlength: [14, "Account number can not be less than 14 characters"],
      maxlength: [14, "Account number can not exceed 14 characters"],
      unique: true,
    },
    branch: {
      type: mongoose.Schema.ObjectId,
      ref: "Branch",
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
      ref: "User",
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

// Populate branch and user
accountSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName email phoneNumber status",
  }).populate({ path: "branch", select: "name" });
  next();
});

// // Post hook
// accountSchema.post(/^find/, function () {
//   console.log("After populating");
// });

// Account model
const Account = mongoose.model("Account", accountSchema);

// Export Account model
module.exports = Account;
