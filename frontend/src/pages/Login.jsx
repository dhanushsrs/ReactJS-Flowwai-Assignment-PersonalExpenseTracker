import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { API_URLS } from "../config/api";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URLS.login, {
        username,
        password,
      });
      const token = response.data.token;
      setToken(token); // Set the token in the parent component state
      localStorage.setItem("token", token);
      navigate("/transaction");
      setUsername("");
      setPassword("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
