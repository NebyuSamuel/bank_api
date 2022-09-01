// User Model
const User = require("./model");

// App Error
const AppError = require("../../appError");

// Create user account
exports.createUserAccount = async (req, res, next) => {
  try {
    // Get body
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Check if all necessary inputs exists
    if (!firstName || !lastName || !phoneNumber)
      return next(new AppError("Please fill all the necessary fields", 400));

    // Create new user account
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        user: newUser,
      },
      message: "New user acccount successfully created",
    });
  } catch (error) {
    next(error);
  }
};

// Get all user accounts
exports.getAllUserAccounts = async (req, res, next) => {
  try {
    // Filter
    let filter = {};
    if (req.query.phoneNumber) {
      filter = { phoneNumber: "+" + `${req.query.phoneNumber}`.trim() };
    }

    // Get all users
    const users = await User.find(filter).sort("firstName");

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single user account
exports.getSingleUserAccount = async (req, res, next) => {
  try {
    // Get a single user account using id
    const user = await User.findById(req.params.id);

    // Check if there is a user using this id
    if (!user) return next(new AppError("There is no user with this id", 404));

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};