const AppError = function (message, statusCode) {
  Error.call(this, message);
  this.statusCode = statusCode;
  this.message = message;
  this.status = `${this.statusCode}`.startsWith("4") ? "FAIL" : "ERROR";
  this.isOperational = true;
  Error.captureStackTrace(this, this.constructor);
};

// Export
module.exports = AppError;
