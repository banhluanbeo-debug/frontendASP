// authApi.js - Handles authentication requests to ASP.NET Backend

const API_BASE_URL = '/api/auth'; // Update with your actual backend URL or use environment variables

export const authApi = {
  login: async (credentials) => {
    /* 
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return await response.json();
    */
    console.log('Login called', credentials);
    return Promise.resolve({ success: true, token: 'fake-jwt-token' });
  },

  register: async (userData) => {
    /*
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
    */
    console.log('Register called', userData);
    return Promise.resolve({ success: true });
  },
  
  logout: () => {
    // Logic for clearing token
    console.log('Logout called');
  }
};
