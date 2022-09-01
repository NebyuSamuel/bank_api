// Dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Export my configs
module.exports = {
  env: process.env.NODE_ENV,
  db: {
    remote: process.env.DATABASE_REMOTE,
    local: process.env.DATABASE_LOCAL,
  },
};
