import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:5000/api/LoginPage', { email, password });
        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
        navigate("/InstructorProfile");
    } catch (error) {
        alert(error.response.data.error);
    }
};

  return (
    <div className="login-wholecontainer">
      <div className="login-two-container">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

         
          <div className="form-group">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
      <div className="login-image"></div>
      </div>
    </div>
  );
};

export default LoginPage;