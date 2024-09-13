import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserData } from '../api/updateUserData';

function UserForm({ userId }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Use for redirect

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    try {
      await updateUserData(userId, { name });
      alert('User updated successfully!');
      navigate('/login');  // Redirect after success
    } catch (error) {
      setError('Failed to update user');
      console.error('Update error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"  // Add name attribute for browser autofill
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default UserForm;

