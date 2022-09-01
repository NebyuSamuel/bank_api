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

router.get("/active", userController.getActiveAccounts);

router
  .route("/:id")
  .get(userController.getSingleUserAccount)
  .patch(userController.updateUserProfile);

router.patch("/:id/status", userController.updateUserAccountStatus);

// Export router
module.exports = router;
