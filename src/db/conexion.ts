import mysql from "mysql2/promise";
import dbConfig from "./configDB";

/*
const mysql = require("mysql2/promise");
const dbConfig = require("./configDB");

const poolDB = mysql.createPool(dbConfig);
*/

export const poolDB = mysql.createPool(dbConfig);
