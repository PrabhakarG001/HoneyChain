import api from './api';

export const parseAuthError = (err) => {
  if (!err) return 'An unexpected error occurred. Please try again.';
  if (err.response && err.response.data) {
    const detail = err.response.data.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => d.msg || d.detail || JSON.stringify(d)).join(', ');
    }
    if (err.response.data.message) return err.response.data.message;
  }
  return err.message || 'Authentication request failed. Please check network connection.';
};

export const authService = {
  login: async (emailOrUsername, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', emailOrUsername);
      params.append('password', password);

      const response = await api.post('/auth/login', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
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
    } catch (err) {
      throw new Error(parseAuthError(err));
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (err) {
      throw new Error(parseAuthError(err));
    }
  },

  register: async (userData) => {
    try {
      await api.post('/auth/register', {
        username: userData.email,
        password: userData.password,
        role: userData.role || 'BEEKEEPER',
        name: userData.name
      });
      
      // Auto-login after registration
      return await authService.login(userData.email, userData.password);
    } catch (err) {
      throw new Error(parseAuthError(err));
    }
  }
};
