// Express
const express = require("express");

// Router
const router = express.Router();

// Controller
const userController = require("./controller");

router
  .route("/")
  .get(userController.getAllUserAccounts)
  .post(userController.createUserAccount);

router
  .route("/:id")
  .get(userController.getSingleUserAccount)
  .patch(userController.updateUserProfile);

// Export router
module.exports = router;
