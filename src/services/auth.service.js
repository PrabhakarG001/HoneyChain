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
    
    // Fetch profile after login using the fresh token
    const token = response.data.access_token;
    const userResponse = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      user: {
        id: userResponse.data.id || userResponse.data.username,
        email: userResponse.data.username,
        username: userResponse.data.username,
        name: userResponse.data.name || userResponse.data.username,
        role: userResponse.data.role,
        avatarUrl: userResponse.data.avatar_url || null
      },
      accessToken: token
    };
  },

  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
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
