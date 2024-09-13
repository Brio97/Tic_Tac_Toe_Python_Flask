import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '/utils/auth'; // Adjust path if needed
import { useUser } from '../UserContext'; // Import the useUser hook

const LoginComponent = () => {
  const [identifier, setIdentifier] = useState(''); // Handles both username and email
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setCurrentUser } = useUser(); // Correct usage of useUser
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh on form submit
    try {
      // Attempt to log in using either username or email
      const response = await axios.post('/login', { identifier, password }, { withCredentials: true });
      
      if (response.status === 200) {
        console.log('Login successful, navigating to /game');
        // Clear any previous errors
        setError(null);

        // Optionally, wait a moment to ensure the session is set
        await new Promise((resolve) => setTimeout(resolve, 200)); // slight delay

        // Re-check authentication before navigating
        const authData = await checkAuth();
        if (authData) {
          console.log('User authenticated, navigating to /game');
          setCurrentUser(authData); // Set the user in context
          navigate('/game');
        } else {
          setError('Authentication failed after login.');
        }
      }
    } catch (error) {
      // Set a clear error message for the user
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        Username or Email:
        <input 
          type="text" 
          value={identifier} 
          onChange={(e) => setIdentifier(e.target.value)} 
          required 
        />
      </label>
      <br />
      <label>
        Password:
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </label>
      <br />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if login fails */}
    </form>
  );
};

export default LoginComponent;
