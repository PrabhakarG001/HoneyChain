import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      username: email, // FastAPI OAuth2PasswordRequestForm uses 'username'
      password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // FastAPI returns { access_token: "...", token_type: "bearer" }
    // We will decode user info in the store or fetch a /users/me endpoint if needed.
    // For now, map it to the expected return type
    return {
      user: { email }, // Will fetch real user profile separately if needed
      accessToken: response.data.access_token
    };
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', {
      username: userData.email,
      password: userData.password,
      role: userData.role || 'BEEKEEPER',
      name: userData.name
    });
    
    // Auto-login after registration
    return authService.login(userData.email, userData.password);
  }
};
