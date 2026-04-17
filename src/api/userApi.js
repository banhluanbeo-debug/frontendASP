// userApi.js - Handles user-related requests to ASP.NET Backend

const API_BASE_URL = '/api/users'; // Update with your actual backend URL or use environment variables

// Helper to get auth header
const getHeaders = () => {
  const token = localStorage.getItem('token'); // or however you store your token
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const userApi = {
  getProfile: async () => {
    /*
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await response.json();
    */
    console.log('getProfile called');
    return Promise.resolve({ id: 1, name: 'John Doe', role: 'Admin' });
  },

  getAllUsers: async () => {
    /*
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await response.json();
    */
    console.log('getAllUsers called');
    return Promise.resolve([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' }
    ]);
  }
};
