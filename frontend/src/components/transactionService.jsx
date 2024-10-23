// src/services/transactionService.js
import axios from "axios";
import { API_URLS } from "../config/api";

const getToken = () => {
  return localStorage.getItem("token"); // Retrieve token from local storage
};

// Fetch all transactions for the logged-in user
const getTransactions = async () => {
  const token = getToken();
  const response = await axios.get(API_URLS.transactions, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch a specific transaction by ID
const getTransactionById = async (id) => {
  const token = getToken();
  const response = await axios.get(`${API_URLS.transactions}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Add a new transaction
const addTransaction = async (transactionData) => {
  const token = getToken();
  const response = await axios.post(API_URLS.transactions, transactionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update an existing transaction
const updateTransaction = async (id, transactionData) => {
  const token = getToken();
  const response = await axios.put(
    `${API_URLS.transactions}/${id}`,
    transactionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Delete a transaction by ID
const deleteTransaction = async (id) => {
  const token = getToken();
  await axios.delete(`${API_URLS.transactions}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get summary of transactions (e.g., total income, total expenses, balance)
const getSummary = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URLS.summary}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export {
  getTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
