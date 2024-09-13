import axios from 'axios';

export async function checkAuth() {
    try {
        const response = await axios.get('http://127.0.0.1:5000/check-auth', { withCredentials: true });
        if (response.status === 200) {
            return response.data; // Return the entire response with user info
        }
        return null; // Not authenticated
    } catch (error) {
        console.error('Authentication check error:', error);
        return null; // Not authenticated
    }
}

