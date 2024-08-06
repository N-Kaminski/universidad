const mysql = require("mysql2");
const db = mysql.createConnection({
  //   host: "localhost",
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "universidad",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Conectado a la base de datos :)");
  }
});

module.exports = db;
