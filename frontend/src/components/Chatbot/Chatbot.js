
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, MenuItem, FormControl, InputLabel, Typography, Container, Paper, TextField, CircularProgress } from '@mui/material';
import './Chatbot.css';

const Chatbot = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5301/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleProceed = () => {
    if (selectedCategory) {
      navigate(`/category-info/${selectedCategory}`);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { sender: 'user', text: message };
    setChatHistory([...chatHistory, newMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5301/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setChatHistory(prevChatHistory => [...prevChatHistory, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }

    setMessage('');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} className="chatbot-paper">
        <Typography component="h1" variant="h5">
          Welcome to the Credit Card Onboarding Portal
        </Typography>
        <Typography component="p" variant="body1" className="chatbot-text">
          Please select a rewards category to find the best credit card for you.
        </Typography>
        <FormControl fullWidth className="category-select">
          <InputLabel id="category-select-label">Rewards Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Rewards Category"
            onChange={handleCategoryChange}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={!selectedCategory}
          className="proceed-button"
          onClick={handleProceed}
        >
          Proceed to Application
        </Button>

        <div className="chat-container">
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.sender}`}>
                <p>{chat.text}</p>
              </div>
            ))}
            {loading && <div className="loading-spinner"><CircularProgress /></div>}
          </div>
          <div className="chat-input">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>Send</Button>
          </div>
        </div>
      </Paper>
    </Container>
  );
};

export default Chatbot;
