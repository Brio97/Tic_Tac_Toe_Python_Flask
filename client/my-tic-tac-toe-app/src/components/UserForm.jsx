import React, { useState } from 'react';
import { updateUserData } from '../api/updateUserData';

function UserForm({ userId }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateUserData(userId, { name });
      alert('User updated successfully!');
      // Optionally reset form or redirect user
    } catch (error) {
      setError('Failed to update user');
      console.error('Update error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button type="submit">Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default UserForm;
