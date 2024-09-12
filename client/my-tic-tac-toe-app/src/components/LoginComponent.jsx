import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [identifier, setIdentifier] = useState(''); // This will handle both username and email
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Attempt to log in using either username or email
      const response = await axios.post('http://127.0.0.1:5000/login', { identifier, password });
      if (response.status === 200) {
        // Redirect to game page after successful login
        navigate('/game');
      }
    } catch (error) {
      setError('Invalid credentials or server error');
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
        />
      </label>
      <br />
      <label>
        Password:
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>
      <br />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LoginComponent;
