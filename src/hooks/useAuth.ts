import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  class: string;
  balance: number;
  avatar?: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Mock data for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Алексей Иванов',
    email: 'alex@richelieu.edu',
    class: '10А',
    balance: 850,
    isAdmin: false,
  },
  {
    id: '2',
    name: 'Мария Петрова',
    email: 'maria@richelieu.edu',
    class: '11Б',
    balance: 1200,
    isAdmin: false,
  },
  {
    id: 'admin',
    name: 'Администратор',
    email: 'admin@richelieu.edu',
    class: 'Админ',
    balance: 0,
    isAdmin: true,
  },
];

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('richelieu_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('richelieu_user');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'demo123') {
      localStorage.setItem('richelieu_user', JSON.stringify(user));
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
      return { success: true };
    }

    setAuthState(prev => ({ ...prev, isLoading: false }));
    return { success: false, error: 'Неверный email или пароль' };
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    class: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      class: userData.class,
      balance: 0,
      isAdmin: false,
    };

    mockUsers.push(newUser);
    localStorage.setItem('richelieu_user', JSON.stringify(newUser));
    
    setAuthState({
      user: newUser,
      isLoading: false,
      isAuthenticated: true,
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('richelieu_user');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const updateBalance = (amount: number) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, balance: authState.user.balance + amount };
      localStorage.setItem('richelieu_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateBalance,
  };
};