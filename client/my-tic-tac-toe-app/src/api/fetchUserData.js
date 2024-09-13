// fetchUserData.js

export async function fetchUserData(userId) {
  try {
    const response = await fetch(`/users/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Function to fetch available users
export async function fetchAvailableUsers() {
  try {
    const response = await fetch('/available-users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error('Unexpected data format');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Function to fetch previous incomplete games
export async function fetchPreviousGames() {
  try {
    const response = await fetch('/user/incomplete-games');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}
