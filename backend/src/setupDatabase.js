const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./financial_records.db");

db.serialize(() => {
  // Drop existing tables if necessary
  // db.run(`DROP TABLE IF EXISTS transactions`);
  // db.run(`DROP TABLE IF EXISTS categories`);
  // db.run(`DROP TABLE IF EXISTS users`);

  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);

  // Create categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
    )`);

  // Create transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

db.close();
