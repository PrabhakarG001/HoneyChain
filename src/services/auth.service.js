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

      const userPhoto = userResponse.data.avatar_url || null;
      return {
        user: {
          id: userResponse.data.id || userResponse.data.username,
          email: userResponse.data.username,
          username: userResponse.data.username,
          name: userResponse.data.name || userResponse.data.username,
          role: userResponse.data.role,
          avatarUrl: userPhoto,
          photoURL: userPhoto,
          avatar_url: userPhoto,
          profileImage: userPhoto,
          bio: userResponse.data.bio || ''
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

  updateProfile: async (updateData) => {
    try {
      const response = await api.put('/users/me', {
        name: updateData.name,
        username: updateData.username,
        avatar_url: updateData.avatarUrl !== undefined ? updateData.avatarUrl : updateData.avatar_url,
        bio: updateData.bio
      });
      const data = response.data;
      const userPhoto = data.avatar_url || null;
      return {
        id: data.id || data.username,
        email: data.username,
        username: data.username,
        name: data.name || data.username,
        role: data.role,
        avatarUrl: userPhoto,
        photoURL: userPhoto,
        avatar_url: userPhoto,
        profileImage: userPhoto,
        bio: data.bio || ''
      };
    } catch (err) {
      throw new Error(parseAuthError(err));
    }
  },

  googleAuth: async (googleData) => {
    try {
      const response = await api.post('/auth/google', {
        email: googleData.email,
        name: googleData.name,
        avatar_url: googleData.avatarUrl || googleData.photoURL || googleData.avatar_url,
        photo_url: googleData.photoURL || googleData.avatarUrl,
        role: googleData.role || 'CUSTOMER'
      });
      const data = response.data;
      const userPhoto = data.user.avatar_url || null;
      return {
        user: {
          id: data.user.id || data.user.username,
          email: data.user.username,
          username: data.user.username,
          name: data.user.name || data.user.username,
          role: data.user.role,
          avatarUrl: userPhoto,
          photoURL: userPhoto,
          avatar_url: userPhoto,
          profileImage: userPhoto,
          bio: data.user.bio || ''
        },
        accessToken: data.access_token
      };
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
        name: userData.name,
        avatar_url: userData.avatarUrl || userData.photoURL || userData.avatar_url
      });
      
      // Auto-login after registration
      return await authService.login(userData.email, userData.password);
    } catch (err) {
      throw new Error(parseAuthError(err));
    }
  }
};
