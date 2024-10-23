import { useEffect, useState } from "react";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from "./transactionService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch transactions and summary when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        setErrorMessage("Error fetching transactions.");
        console.error("Error fetching transactions:", error);
      }
    };

    const fetchSummary = async () => {
      try {
        const data = await getSummary();
        setSummary(data);
      } catch (error) {
        setErrorMessage("Error fetching summary.");
        console.error("Error fetching summary:", error);
      }
    };

    fetchTransactions();
    fetchSummary();
  }, []);

  // Refresh summary after transaction updates
  const refreshSummary = async () => {
    try {
      const data = await getSummary();
      setSummary(data);
    } catch (error) {
      setErrorMessage("Error refreshing summary.");
      console.error("Error refreshing summary:", error);
    }
  };

  // Add or update transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (amount <= 0) {
      setErrorMessage("Amount must be greater than zero.");
      return;
    }

    try {
      const transactionData = { type, category, amount, date, description };
      if (editId) {
        // Update existing transaction
        await updateTransaction(editId, transactionData);
        setSuccessMessage("Transaction updated successfully!");
      } else {
        // Add new transaction
        await addTransaction(transactionData);
        setSuccessMessage("Transaction added successfully!");
      }

      // Reset form fields
      resetForm();

      // Refresh the transactions list and summary
      const data = await getTransactions();
      setTransactions(data);
      await refreshSummary(); // Update summary after adding/updating
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred");
      setSuccessMessage("");
      console.error("Error saving transaction:", error);
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
      setSuccessMessage("Transaction deleted successfully!");
      await refreshSummary(); // Update summary after deletion
    } catch (error) {
      setErrorMessage("Error deleting transaction.");
      console.error("Error deleting transaction:", error);
    }
  };

  // Set form fields for editing
  const handleEdit = (transaction) => {
    setType(transaction.type);
    setCategory(transaction.category);
    setAmount(transaction.amount);
    setDate(transaction.date);
    setDescription(transaction.description);
    setEditId(transaction.id);
  };

  const resetForm = () => {
    setType("");
    setCategory("");
    setAmount(0);
    setDate("");
    setDescription("");
    setEditId(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div>
      <h2>Manage Transactions</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type (income/expense)"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">
          {editId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <h3>Transaction List</h3>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.type} - {transaction.category} - {transaction.amount} -{" "}
            {transaction.date} - {transaction.description}
            <button onClick={() => handleEdit(transaction)}>Edit</button>
            <button onClick={() => handleDelete(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Summary</h3>
      {summary && (
        <div>
          <p>Total Income: {summary.totalIncome}</p>
          <p>Total Expenses: {summary.totalExpenses}</p>
          <p>Balance: {summary.balance}</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
