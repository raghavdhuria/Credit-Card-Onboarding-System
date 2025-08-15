
import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container, Paper, Input } from '@mui/material';
import { useLocation } from 'react-router-dom';
import './ApplicationForm.css';

const ApplicationForm = () => {
  const location = useLocation();
  const { cardName } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    dob: '',
    pan: '',
    aadhaar: '',
    document: null,
    cardName: cardName || '',
  });

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, cardName: cardName || '' }));
  }, [cardName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, document: event.target.files[0] });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to apply.');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:5301/api/apply', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setVerificationResult(result.application);
      } else {
        alert('Error submitting application: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('An error occurred while submitting the application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} className="application-paper">
        <Typography component="h1" variant="h5">
          Credit Card Application
        </Typography>
        {cardName && (
          <Typography component="h2" variant="h6">
            Applying for: {cardName}
          </Typography>
        )}
        <form className="application-form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="cardName"
            label="Card Name"
            name="cardName"
            value={formData.cardName}
            InputProps={{
              readOnly: true,
            }}
          />
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
        {isLoading && <p>Loading...</p>}
        {verificationResult && (
          <div className="verification-results">
            <h3>Verification Results</h3>
            {verificationResult.verificationResults && (
              <div>
                <h4>Matched Fields:</h4>
                <ul>
                  {Object.entries(verificationResult.verificationResults)
                    .filter(([, value]) => value)
                    .map(([key]) => (
                      <li key={key}>{key}</li>
                    ))}
                </ul>
                <h4>Unmatched Fields:</h4>
                <ul>
                  {Object.entries(verificationResult.verificationResults)
                    .filter(([, value]) => !value)
                    .map(([key]) => (
                      <li key={key}>{key}</li>
                    ))}
                </ul>
              </div>
            )}
             
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default ApplicationForm;
