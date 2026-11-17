const Database = require("better-sqlite3");
const db = new Database("task.db");

module.exports = db