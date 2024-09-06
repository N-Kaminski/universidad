"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const configDB_1 = __importDefault(require("./configDB"));
/*
const mysql = require("mysql2/promise");
const dbConfig = require("./configDB");

const poolDB = mysql.createPool(dbConfig);
*/
exports.poolDB = promise_1.default.createPool(configDB_1.default);
