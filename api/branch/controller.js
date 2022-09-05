// Branch
const Branch = require("./model");

// Account
const Account = require("../account/model");

// App Error
const AppError = require("../../appError");

// Create branch
exports.createBranch = async (req, res, next) => {
  try {
    // Get body
    const { name, branchCode, address } = req.body;

    // Check if all the necessary fields exists
    if (!name || !branchCode || !address)
      return next(new AppError("Please fill all the necessary fields", 400));

    // Create new branch
    const newBranch = await Branch.create({ name, branchCode, address });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        branch: newBranch,
      },
      message: "New branch successfully created",
    });
  } catch (error) {
    next(error);
  }
};

// Get all branches
exports.getAllBranches = async (req, res, next) => {
  try {
    // Filter
    let filter = {};

    // Check if there is a query
    if (req.query.branchCode) {
      filter = { branchCode: req.query.branchCode };
    }

    // Get all branches
    const branches = await Branch.find(filter).sort("name branchCode").lean();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: branches.length,
      data: {
        branches,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single branch
exports.getSingleBranch = async (req, res, next) => {
  try {
    // Get a single branch using the id
    const branch = await Branch.findById(req.params.id);

    // Check if there is a branch with the specified id
    if (!branch)
      return next(new AppError("There is no branch with this id", 400));

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        branch,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update branch
exports.updateBranch = async (req, res, next) => {
  try {
    // Get a single branch using the id
    const getBranch = await Branch.findById(req.params.id);

    // Check if there is a branch with the specified id
    if (!getBranch)
      return next(new AppError("There is no branch with this id", 400));

    // Get body
    const { name, address } = req.body;

    // Check if there is a branch code
    if (req.body.branchCode)
      return next(
        new AppError("You can not update branch code using this endpoint", 400)
      );

    // Update the branch
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
      },
      { runValidators: true, new: true }
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        branch,
      },
      message: "Branch successfully created",
    });
  } catch (error) {
    next(error);
  }
};

// Update branch code
exports.updateBranchCode = async (req, res, next) => {
  try {
    // Get body
    const branchCode = req.body.branchCode;

    // Check if there is a name or an address
    if (req.body.name || req.body.address)
      return next(
        new AppError(
          "You can not update a name or an address of a branch using this endpoint",
          400
        )
      );

    // Update the branch
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      {
        branchCode,
      },
      { runValidators: true, new: true }
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        branch,
      },
      message: "Branch code successfully created",
    });
  } catch (error) {
    next(error);
  }
};

// Delete a single branch
exports.deleteSingleBranch = async (req, res, next) => {
  try {
    // Get a single branch using the id
    const getBranch = await Branch.findById(req.params.id);

    // Check if there is a branch with the specified id
    if (!getBranch)
      return next(new AppError("There is no branch with this id", 400));

    // Get body
    const { replacementBranch } = req.body;

    // Message
    let message = "Branch successfully deleted";

    // Check if there is a transfer or replacement branch
    const accounts = await Account.find({ branch: getBranch._id });
    if (accounts.length !== 0) {
      if (!replacementBranch)
        return next(
          new AppError(
            "You should provide a replacement branch for the accounts that are using this branch",
            400
          )
        );
      // Update branch
      await Account.updateMany(
        { branch: getBranch._id },
        { branch: replacementBranch }
      );

      // Delete branch
      await Branch.findByIdAndDelete(req.params.id);

      // Message
      message =
        "Branch successfully deleted. Accounts using this branch are also successfully transferred.";
    } else {
      // Delete branch for accounts which do not have this branch
      await Branch.findByIdAndDelete(req.params.id);
    }

    // Respond
    res.status(200).json({
      status: "SUCCES",
      message,
    });
  } catch (error) {
    next(error);
  }
};
