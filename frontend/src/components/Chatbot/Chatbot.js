
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="container">
      <div className="chatbot-container">
        <div className="chatbot-sidebar">
          <h2>Welcome!</h2>
          <p>Select a rewards category to find the best credit card for you.</p>
          <div className="category-select-container">
            <label htmlFor="category-select">Rewards Category</label>
            <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">-- Select a Category --</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button className="proceed-button" onClick={handleProceed} disabled={!selectedCategory}>
            Proceed to Application
          </button>
        </div>
        <div className="chatbot-main">
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.sender}`}>
                <div className="avatar">{chat.sender === 'user' ? 'U' : 'B'}</div>
                <div className="message-content">
                  <p>{chat.text}</p>
                </div>
              </div>
            ))}
            {loading && <div className="loading-spinner">Loading...</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
