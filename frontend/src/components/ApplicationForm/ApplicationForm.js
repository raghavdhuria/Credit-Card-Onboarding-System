
import React, { useState, useEffect } from 'react';
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
    aadharFile: null,
    panFile: null,
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
    const { name, files } = event.target;
    setFormData({ ...formData, [name]: files[0] });
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
      if (key === 'aadharFile' || key === 'panFile') {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      } else {
        data.append(key, formData[key]);
      }
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
      if (error.response && error.response.data && error.response.data.error) {
        alert('Error submitting application: ' + error.response.data.error);
      } else if (error.response && error.response.data && error.response.data.message) {
        alert('Error submitting application: ' + error.response.data.message);
      } else {
        alert('An error occurred while submitting the application.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="application-container">
        <div className="application-form-container">
          <h2>Credit Card Application</h2>
          {cardName && <p>Applying for: {cardName}</p>}
          <form className="application-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name <span style={{ color: 'red' }}>*</span></label>
              <input type="text" id="name" name="name" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address <span style={{ color: 'red' }}>*</span></label>
              <input type="text" id="address" name="address" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Contact Number <span style={{ color: 'red' }}>*</span></label>
              <input type="text" id="contact" name="contact" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth <span style={{ color: 'red' }}>*</span></label>
              <input type="date" id="dob" name="dob" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="pan">PAN Card Number <span style={{ color: 'red' }}>*</span></label>
              <input type="text" id="pan" name="pan" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="aadhaar">Aadhaar Card Number <span style={{ color: 'red' }}>*</span></label>
              <input type="text" id="aadhaar" name="aadhaar" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="aadharFile">Upload Document (Aadhar) <span style={{ color: 'red' }}>*</span></label>
              <input type="file" id="aadharFile" name="aadharFile" onChange={handleFileChange} accept="image/*" required />
            </div>
            <div className="form-group">
              <label htmlFor="panFile">Upload Document (PAN) <span style={{ color: 'red' }}>*</span></label>
              <input type="file" id="panFile" name="panFile" onChange={handleFileChange} accept="image/*" required />
            </div>
            <button type="submit">Submit Application</button>
          </form>
        </div>
        <div className="verification-results-container">
          <h3>Verification Results</h3>
          {isLoading && <div className="loading-indicator">Loading...</div>}
          {verificationResult && (
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
              <h4>Extracted Text from Document:</h4>
              <p>{verificationResult.ocrText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
