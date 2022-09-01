// Configs
const AppError = require("./appError");
const configs = require("./configs");

const geh = function (err, req, res, next) {
  err.status = err.status || "ERROR";
  err.statusCode = err.statusCode || 500;

  // Check the environment
  if (configs.env === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      errorStack: err.stack,
    });
  } else if (configs.env === "production") {
    // Handle different error types
    if (err.code === 11000) {
      err = new AppError("Data already exists", 400);
    } else if (err.name === "CastError") {
      err = new AppError("Invalid ID", 400);
    }

    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: "ERROR",
        message: "Opps!! Unknown error. Try again please.",
      });
    }
  }
};

// Export geh
module.exports = geh;
