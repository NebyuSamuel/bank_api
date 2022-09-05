// Express
const express = require("express");

// Router
const router = express.Router();

// Account Controller
const accountController = require("./controller");

router
  .route("/")
  .get(accountController.getAllAccounts)
  .post(accountController.createAccount);

router.get("/active", accountController.getAllActiveAccounts);

router.route("/:id").get(accountController.getSingleAccount);

router.patch("/:id/status", accountController.updateAccountStatus);

router.patch("/depoist", accountController.depoist);

router.patch("/withdrawal", accountController.withdrawal);

router.patch("/transfer", accountController.transfer);

// Export Router
module.exports = router;
