
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Auth.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5301/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Sign up successful! Please sign in.');
        navigate('/'); // Redirect to sign-in page
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Credit Card Onboarding</h1>
        <h2>Sign Up</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit">Sign Up</button>
        </form>
        <Link to="/" className="auth-link">
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
