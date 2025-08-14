
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Paper } from '@mui/material';
import './SignUp.css';
const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Sign up button clicked. Sending data:', { name, email, password });
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
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} className="signup-paper">
        <Typography component="h1" variant="h5">
          Credit Card Onboarding Portal
        </Typography>
        <Typography component="h2" variant="h6">
          Sign Up
        </Typography>
        <form className="signup-form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="signup-submit"
          >
            Sign Up
          </Button>
          <Link to="/" className="signin-link">
            {"Already have? Sign In"}
          </Link>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
