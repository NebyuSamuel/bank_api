// http
const http = require("http");

// Express
const express = require("express");

// Global application
const app = express();

// Dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Mongoose
const mongoose = require("mongoose");

// Create server
const server = http.createServer(app);

// Port
const port = process.env.PORT || 3000;

// Listen on the server
server.listen(port, () => {
  console.log(`Listening on ${port}...`);
});

// Connect to DB
mongoose
  .connect(process.env.DATABASE_REMOTE)
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
