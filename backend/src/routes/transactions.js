const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// User Registration
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, username });
    }
  );
});

// User Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({ auth: true, token });
  });
});

// Add a Transaction
router.post("/transactions", authenticateJWT, (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const userId = req.user.id;

  const sql = `INSERT INTO transactions (type, category, amount, date, description, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(
    sql,
    [type, category, amount, date, description, userId],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res
        .status(201)
        .json({ id: this.lastID, type, category, amount, date, description });
    }
  );
});

// Get All Transactions
router.get("/transactions", authenticateJWT, (req, res) => {
  const userId = req.user.id;

  const sql = `SELECT * FROM transactions WHERE user_id = ?`;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get Transaction by ID
router.get("/transactions/:id", authenticateJWT, (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const sql = `SELECT * FROM transactions WHERE id = ? AND user_id = ?`;
  db.get(sql, [id, userId], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(row);
  });
});

// Update Transaction by ID
router.put("/transactions/:id", authenticateJWT, (req, res) => {
  const id = req.params.id;
  const { type, category, amount, date, description } = req.body;
  const userId = req.user.id;

  const sql = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ? AND user_id = ?`;
  db.run(
    sql,
    [type, category, amount, date, description, id, userId],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ message: "Transaction updated successfully" });
    }
  );
});

// Delete Transaction by ID
router.delete("/transactions/:id", authenticateJWT, (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const sql = `DELETE FROM transactions WHERE id = ? AND user_id = ?`;
  db.run(sql, [id, userId], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  });
});

// Get Transaction Summary

router.get("/summary", authenticateJWT, (req, res) => {
  const userId = req.user.id;

  const sqlIncome = `SELECT SUM(amount) AS total_income FROM transactions WHERE type = 'income' AND user_id = ?`;
  const sqlExpense = `SELECT SUM(amount) AS total_expense FROM transactions WHERE type = 'expense' AND user_id = ?`;

  db.get(sqlIncome, [userId], (err, incomeRow) => {
    if (err) {
      return res.status(400).json({ error: "Error retrieving income data." });
    }

    db.get(sqlExpense, [userId], (err, expenseRow) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Error retrieving expense data." });
      }

      const totalIncome = incomeRow.total_income || 0;
      const totalExpense = expenseRow.total_expense || 0;
      const balance = totalIncome - totalExpense;

      console.log(
        `Total Income: ${totalIncome}, Total Expenses: ${totalExpense}, Balance: ${balance}`
      );

      res.json({
        totalIncome,
        totalExpenses: totalExpense,
        balance,
      });
    });
  });
});

module.exports = router;
