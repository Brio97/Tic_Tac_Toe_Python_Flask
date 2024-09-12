import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../api/fetchUserData';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return <div>User: {user.name}</div>;
}

export default UserProfile;