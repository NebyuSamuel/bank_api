// http
const http = require("http");

// Express
const express = require("express");

// Global application
const app = express();

// Mongoose
const mongoose = require("mongoose");

// Create server
const server = http.createServer(app);

// Port
const port = process.env.PORT || 3000;

// Configs
const configs = require("./configs");

// geh
const geh = require("./geh");

// App Error
const AppError = require("./appError");

// User Router
const userRouter = require("./api/user/router");

// Listen on the server
server.listen(port, () => {
  console.log(`Listening on ${port}...`);
});

// Connect to DB
mongoose
  .connect(configs.db.remote)
  .then(() => {
    console.log(`Connected successfully`);
  })
  .catch((err) => {
    console.log(err);
  });

// db connection
const db_connection = mongoose.connection;

// Handle error
db_connection.on("disconnected", () => {
  console.log("DB disconnceted");
});

db_connection.on("error", (err) => {
  console.log("--- ERROR ---");
  console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/users", userRouter);

// Handle urls which don't exist
app.use("*", (req, res, next) => {
  return next(
    new AppError(
      `Unknown URL - ${req.protocol}://${req.get("host")}${req.originalUrl}`,
      404
    )
  );
});

// Use my geh
app.use(geh);
