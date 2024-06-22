const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  HOST: Config.get("databaseHost"),
  USER: Config.get("databaseUser"),
  PASSWORD: Config.get("databasePassword"),
  DB: Config.get("databaseName"),
  dialect: Config.get("dialect"),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

