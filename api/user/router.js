// Express
const express = require("express");

// Router
const router = express.Router();

// Controller
const userController = require("./controller");

router
  .route("/")
  .get(userController.getAllUserAccounts)
  .post(userController.createUserAccount)
  .delete(userController.deleteAllUsers);

router.get("/active", userController.getActiveAccounts);

router
  .route("/:id")
  .get(userController.getSingleUserAccount)
  .patch(userController.updateUserProfile)
  .delete(userController.deleteSingleUser);

router.patch("/:id/status", userController.updateUserAccountStatus);

// Export router
module.exports = router;
