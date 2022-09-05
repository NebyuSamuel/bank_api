// Account
const Account = require("./model");

// Branch
const Branch = require("../branch/model");

// User
const User = require("../user/model");

// App Error
const AppError = require("../../appError");

// Create account for a user
exports.createAccount = async (req, res, next) => {
  try {
    // Get body
    const { accountNumber, initialDepoist, branch, user } = req.body;

    // Check if all necessary fields exists
    if (!accountNumber || !initialDepoist || !branch || !user)
      return next(new AppError("Please fill all the necessary fields", 400));

    // Get the branch
    const getBranch = await Branch.findOne({ _id: branch });
    if (!getBranch)
      return next(
        new AppError("There is no branch with the specified id", 400)
      );

    // Get User
    const getUser = await User.findById(user);
    if (!getUser)
      return new AppError("There is no user with the specified id", 400);

    // Create new Account
    const newAccount = await Account.create({
      accountNumber,
      initialDepoist,
      balance: initialDepoist,
      user: getUser._id,
      branch: getBranch._id,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        account: newAccount,
      },
      message: `An account for ${getUser.firstName} ${getUser.lastName} has been created successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Get all accounts
exports.getAllAccounts = async (req, res, next) => {
  try {
    // Filter
    let filter = {};

    // Check if there is a query
    if (req.query.accountNumber) {
      filter = { accountNumber: req.query.accountNumber };
    }

    // Get all accounts
    const accounts = await Account.find(filter).sort("-createdAt").lean();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: accounts.length,
      data: {
        accounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all active accounts
exports.getAllActiveAccounts = async (req, res, next) => {
  try {
    // Get all active accounts
    const accounts = await Account.find({ status: "Active" })
      .sort("-createdAt")
      .lean();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: accounts.length,
      data: {
        accounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single account
exports.getSingleAccount = async (req, res, next) => {
  try {
    // Get a single account using id
    const account = await Account.findById(req.params.id);
    if (!account)
      return next(new AppError("There is no account with this id", 404));

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        account,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update account status
exports.updateAccountStatus = async (req, res, next) => {
  try {
    // Get a single account using id
    const getAccount = await Account.findById(req.params.id);
    if (!getAccount)
      return next(new AppError("There is no account with this id", 404));

    // Set status
    let status = "";
    if (getAccount.status === "Active") {
      status = "Inactive";
    } else if (getAccount.status === "Inactive") {
      status = "Active";
    }

    // Update account status
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status },
      { runValidators: true, new: true }
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        account,
      },
      message: `${account.user.firstName} ${account.user.lastName}'s account status changed from ${getAccount.status} to ${account.status}`,
    });
  } catch (error) {
    next(error);
  }
};

// Depoist
exports.depoist = async (req, res, next) => {
  try {
    // Get body
    const { accountNumber, amount } = req.body;

    // Check if all necessary fields exists
    if (!accountNumber || !amount)
      return next(new AppError("Please fill all the necessary fields", 400));

    // Check if there are other fields
    if (req.body.initialDepoist)
      return next(new AppError("Initial depoist can not be updated", 400));

    // Check if amount is greate than 0
    if (amount <= 0) {
      return next(
        new AppError("Amount can not be less than or equal to zero", 400)
      );
    }

    // Check if the account number exists
    const getAccount = await Account.findOne({ accountNumber });
    if (!getAccount)
      return next(
        new AppError(
          "There is no account with the specified account number",
          400
        )
      );

    // Check if account status
    if (getAccount.status !== "Active")
      return next(new AppError("Account is inactive", 400));

    // Get existing balance
    const currentBalance = getAccount.balance;

    // New balance
    const newBalance = currentBalance + amount;

    // Update balance
    const account = await Account.findByIdAndUpdate(
      getAccount._id,
      { balance: newBalance },
      { runValidator: true, new: true }
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        account,
      },
      message: `${account.user.firstName} ${account.user.lastName} has depoisted ${amount} ETB`,
    });
  } catch (error) {
    next(error);
  }
};

// Withdrawal
exports.withdrawal = async (req, res, next) => {
  try {
    // Get body
    const { amount, accountNumber } = req.body;

    // Check if all necessary fields exists
    if (!accountNumber || !amount)
      return next(new AppError("Please fill all the necessary fields", 400));

    // Check if there are other fields
    if (req.body.initialDepoist)
      return next(new AppError("Initial depoist can not be updated", 400));

    // Check if amount is greate than 0
    if (amount <= 0) {
      return next(
        new AppError("Amount can not be less than or equal to zero", 400)
      );
    }

    // Check if the account number exists
    const getAccount = await Account.findOne({ accountNumber });
    if (!getAccount)
      return next(
        new AppError(
          "There is no account with the specified account number",
          400
        )
      );

    // Check if account status
    if (getAccount.status !== "Active")
      return next(new AppError("Account is inactive", 400));

    // Get the current balance
    const currentBalance = getAccount.balance;

    // Check if the balance is greater than amount birr
    if (currentBalance < amount) {
      return next(new AppError("Insufficient balance", 400));
    }

    // Check if the minimum balance is greater than 10
    const minimumBalance = currentBalance - amount;
    if (minimumBalance < 10)
      return next(new AppError("Below minimum balance", 400));

    // New balance
    const newBalance = currentBalance - amount;

    // Update balance
    const account = await Account.findByIdAndUpdate(
      getAccount._id,
      { balance: newBalance },
      { runValidators: true, new: true }
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        account,
      },
      message: `${account.user.firstName} ${account.user.lastName} has withdrwan ${amount} ETB. Your current balance is ${account.balance} ETB`,
    });
  } catch (error) {
    next(error);
  }
};

// Transfer money
exports.transfer = async (req, res, next) => {
  try {
    // Get body
    const { sender, receiver, amount } = req.body;

    // Check if all necessary fields exists
    if (!sender || !receiver || !amount)
      return next(
        new AppError("Please fill all the necessary input fields", 400)
      );

    // Check if there are other fields
    if (req.body.initialDepoist)
      return next(new AppError("Initial depoist can not be updated", 400));

    // Check if amount is greate than 0
    if (amount <= 0) {
      return next(
        new AppError("Amount can not be less than or equal to zero", 400)
      );
    }

    // Check sender account number
    const senderAccount = await Account.findOne({ accountNumber: sender });
    if (!senderAccount)
      return next(
        new AppError(
          "There is no account with the specified account number",
          400
        )
      );

    // Check receiver account number
    const receiverAccount = await Account.findOne({ accountNumber: receiver });
    if (!receiverAccount)
      return next(
        new AppError(
          "There is no account with the specified account number",
          400
        )
      );

    // Check if sender account status
    if (senderAccount.status !== "Active")
      return next(new AppError("Your account is inactive", 400));

    // Check if receiver account status
    if (receiverAccount.status !== "Active")
      return next(new AppError("Recipent account is Inactive", 400));

    // Get the current balance of the sender
    const senderCurrentBalance = senderAccount.balance;

    // Check if the balance is greater than amount birr
    if (senderCurrentBalance < amount) {
      return next(new AppError("Insufficient balance", 400));
    }

    // Check if the minimum balance is greater than 10
    const minimumBalance = senderCurrentBalance - amount;
    if (minimumBalance < 10)
      return next(new AppError("Below minimum balance", 400));

    // Sender New balance
    const senderNewBalance = senderCurrentBalance - amount;

    // Receiver current balance
    const receiverNewBalance = receiverAccount.balance + +amount;

    // Update sender balance
    const saccount = await Account.findByIdAndUpdate(
      senderAccount._id,
      {
        balance: senderNewBalance,
      },
      { runValidators: true, new: true }
    );

    // Update receiver balance
    const raccount = await Account.findByIdAndUpdate(
      receiverAccount._id,
      {
        balance: receiverNewBalance,
      },
      { runValidators: true, new: true }
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        account: saccount,
      },
      message: `${amount} ETB has been transferred to ${raccount.accountNumber} from ${saccount.accountNumber}. Your current balance is ${saccount.balance} ETB`,
    });
  } catch (error) {
    next(error);
  }
};
