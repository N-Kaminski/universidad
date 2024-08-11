const mysql = require("mysql2/promise");
const dbConfig = require("../config/configDB");

const poolDB = mysql.createPool(dbConfig);

module.exports = poolDB;
