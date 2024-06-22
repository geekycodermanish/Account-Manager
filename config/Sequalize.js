const { Sequelize } = require('sequelize');
require('dotenv').config();


  const sequelize = new Sequelize(process.env.DATABASENAME, process.env.DATABASEUSER, process.env.DATABASEPASSWORD, {
  port:process.env.DATABASEPORT,
  host: process.env.DATABASEHOST,
  dialect: process.env.DIALECT,
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    timestamps: false
  },
  // operatorsAliases: false,
  pool: {
    max: parseInt(process.env.MAX),
    min: parseInt(process.env.MIN),
    acquire: parseInt(process.env.ACQUIRE),
    idle: parseInt(process.env.IDLE)
  },
//   dialectOptions: {
//     socketPath: "/var/run/mysqld/mysqld.sock"
// },
timezone: '+05:30',
logging: false
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Account = require("../models/accountModel")(sequelize, Sequelize);
// db.UserRoleMaster = require("../api/models/userRoleMaster")(sequelize, Sequelize);


// db.users.hasOne(db.UserRoleMaster, {foreignKey: 'user_id', sourceKey: 'user_id', as: 'roleMaster'});
// db.RewardHeader.hasMany(db.RewardDetails, {foreignKey: 'reward_header_id', sourceKey: 'reward_header_id', as: 'rewardDetails'});



module.exports = db;
