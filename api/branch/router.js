// Express
const express = require("express");

// Router
const router = express.Router();

// Branch Controller
const branchController = require("./controller");

router
  .route("/")
  .get(branchController.getAllBranches)
  .post(branchController.createBranch);

router
  .route("/:id")
  .get(branchController.getSingleBranch)
  .patch(branchController.updateBranch)
  .delete(branchController.deleteSingleBranch);

router.patch("/:id/branchcode", branchController.updateBranchCode);

// Export router
module.exports = router;
