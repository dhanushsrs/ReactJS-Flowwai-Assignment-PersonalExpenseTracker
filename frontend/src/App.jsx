import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TransactionForm from "./components/TransactionForm";

const App = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <h1>Personal Expense Tracker</h1>
      {!token ? (
        <div>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      ) : (
        <div>
          <h2>Welcome!</h2>
          <button onClick={handleLogout}>Logout</button>
          <Routes>
            <Route
              path="/transaction"
              element={<TransactionForm token={token} />}
            />
            <Route path="/" element={<Navigate to="/transaction" />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
