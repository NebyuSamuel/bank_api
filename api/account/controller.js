// Account
const Account = require("./model");

// App Error
const AppError = require("../../appError");

// Create account for a user
exports.createAccount = async (req, res, next) => {
  try {
    // Get body
    const { accountNumber, initialDepoist, branch, user } = req.body;

    // Check if all necessary fields exists
    if (!accountNumber || !initialDepoist || !branch || !user)
      return next(new AppError("Please fill all the necessary fields", 400));
  } catch (error) {
    next(error);
  }
};
