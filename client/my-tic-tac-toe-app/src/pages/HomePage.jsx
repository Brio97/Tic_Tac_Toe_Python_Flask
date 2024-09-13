import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/check-login');
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleStartGameClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  return (
    <div>
      <h1>Welcome to Tic-Tac-Toe</h1>
      <nav>
        <button onClick={handleStartGameClick}>Start Game</button>
        <br />
        <Link to="/login">Login</Link>
        <br />
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
};

export default HomePage;

