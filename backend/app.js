const express = require("express");
const cors = require("cors");
require("dotenv").config();
const transactionRoutes = require("./src/routes/transactions");

const app = express();

app.use(cors());
app.use(express.json());

// Use the transactions routes
app.use("/", transactionRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
