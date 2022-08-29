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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const names = ["Nebyu", "Gizaw", "Adane"];

// Our first endpoint
app.get("/names", (req, res, next) => {
  res.json({
    names: names,
  });
});

const check = (req, res, next) => {
  const id = req.params.id;
  if (!names[id]) {
    return res.json({
      message: "User does not exists",
    });
  }
  next();
};

const getSingleUser = (req, res, next) => {
  res.json({
    user: names[req.params.id],
  });
};

app.get("/names/:id", check, getSingleUser);

// Add names to the array
app.post("/names", (req, res, next) => {
  const name = req.body.name;

  names.push(name);

  res.json({
    names: names,
  });
});

app.patch("/names/:id", (req, res, next) => {
  const name = req.body.name;
  const id = req.params.id;
  names[id] = name;
  res.json({
    names: names,
  });
});

app.delete("/names/:id", (req, res, next) => {
  const id = req.params.id;
  names.splice(id, 1);
  res.json({
    names: names,
  });
});

// Handle urls which don't exist
app.use("*", (req, res, next) => {
  res.json({
    status: "FAIL",
    message: `Unknown URL - ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }`,
  });
});
