
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Chatbot from './components/Chatbot/Chatbot';
import ApplicationForm from './components/ApplicationForm/ApplicationForm';
import CategoryInfo from './components/CategoryInfo/CategoryInfo';
import Navbar from './components/Navbar/Navbar';

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/signup';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/category-info/:categoryName" element={<CategoryInfo />} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
