
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Auth.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5301/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/chatbot');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Credit Card Onboarding</h1>
        <h2>Sign In</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <Link to="/signup" className="auth-link">
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
