import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if a user is authenticated on component mount
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/check-auth', { withCredentials: true });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error checking authentication: ", error);
      }
    };    

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

