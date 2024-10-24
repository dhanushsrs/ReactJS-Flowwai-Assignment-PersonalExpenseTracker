# Personal Expense Tracker

A personal expense tracker built with React for the frontend, Node.js and Express.js for the backend, and SQLite as the database. This application allows users to manage their transactions efficiently and provides a summary of their financial status.

## Table of Contents

- Setup and Run Instructions
- API Documentation

## Setup and Run Instructions

### Prerequisites

- Node.js (v14 or higher)
- SQLite
- npm (Node Package Manager)

### Backend Setup

1. **Clone the repository**:
   git clone <repository-url>
   cd <repository-directory>

2. **Install dependencies**:
   cd backend
   npm install
   
3. **Set up the database**:
   Ensure you have SQLite installed.

4. **Start the backend server**:
   npm start

### Frontend Setup
1. **Navigate to the frontend directory**:
   cd ../frontend

2. **Install dependencies**:
   npm install

3. **Start the frontend application**:
   npm start

### API Documentation
## Base URL
   http://localhost:8000

### Endpoints
## Transactions
   1. POST /transactions
      
      Description: Adds a new transaction (income or expense).
      Request Body:
        {
          "title": "Transaction Title",
          "amount": 100.00,
          "type": "income", // or "expense"
          "category": "Category Name",
          "date": "2024-10-01"
        }

  3. GET /transactions
     
     Description: Retrieves all transactions.
     Response:
        [
          {
            "id": 1,
            "title": "Transaction Title",
            "amount": 100.00,
            "type": "income",
            "category": "Category Name",
            "date": "2024-10-01"
          }
        ]

  4. GET /transactions/
     
     Description: Retrieves a transaction by ID.
     Response:
      {
        "id": 1,
        "title": "Transaction Title",
        "amount": 100.00,
        "type": "income",
        "category": "Category Name",
        "date": "2024-10-01"
      }

 5. PUT /transactions/
    
    Description: Updates a transaction by ID.
    Request Body:
      {
        "title": "Updated Title",
        "amount": 150.00,
        "type": "expense",
        "category": "New Category",
        "date": "2024-10-02"
      }

6. DELETE /transactions/

    Description: Deletes a transaction by ID.
    Response: 204 No Content on successful deletion.

**Summary**
1. GET /summary
   Description: Retrieves a summary of transactions (total income, total expenses, balance).
   Response:
    {
      "totalIncome": 500.00,
      "totalExpenses": 300.00,
      "balance": 200.00
    }     
   
