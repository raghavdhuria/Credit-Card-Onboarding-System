
import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Paper, Input } from '@mui/material';
import { useLocation } from 'react-router-dom';
import './ApplicationForm.css';

const ApplicationForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    dob: '',
    pan: '',
    aadhaar: '',
    document: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, document: event.target.files[0] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} className="application-paper">
        <Typography component="h1" variant="h5">
          Credit Card Application
        </Typography>
        <Typography component="h2" variant="h6">
          Selected Category: {selectedCategory}
        </Typography>
        <form className="application-form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="contact"
            label="Contact Number"
            name="contact"
            autoComplete="tel"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="dob"
            label="Date of Birth"
            name="dob"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="pan"
            label="PAN Card Number"
            name="pan"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="aadhaar"
            label="Aadhaar Card Number"
            name="aadhaar"
            onChange={handleChange}
          />
          <Input
            type="file"
            id="document"
            name="document"
            onChange={handleFileChange}
            fullWidth
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit-button"
          >
            Submit Application
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ApplicationForm;
