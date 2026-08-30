import { mockUsers } from '../mock/users';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const authService = {
  login: async (email, password) => {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: `mock_jwt_token_${user.id}_${Date.now()}`
    };
  },

  register: async (userData) => {
    await delay(1500);
    
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role
    };

    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      accessToken: `mock_jwt_token_${newUser.id}_${Date.now()}`
    };
  }
};
