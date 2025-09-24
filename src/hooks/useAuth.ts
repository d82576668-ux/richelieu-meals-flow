import { useState, useEffect } from 'react';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

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

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('richelieu_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          // Проверяем, существует ли пользователь в базе
          const { rows } = await query('SELECT * FROM users WHERE id = $1', [user.id]);
          if (rows.length > 0) {
            setAuthState({
              user: {
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                class: rows[0].class,
                balance: parseFloat(rows[0].balance),
                isAdmin: rows[0].is_admin,
                avatar: rows[0].avatar,
              },
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            localStorage.removeItem('richelieu_user');
            setAuthState({ user: null, isLoading: false, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Error checking session:', error);
          localStorage.removeItem('richelieu_user');
          setAuthState({ user: null, isLoading: false, isAuthenticated: false });
        }
      } else {
        setAuthState({ user: null, isLoading: false, isAuthenticated: false });
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (rows.length === 0) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Пользователь не найден' };
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Неверный пароль' };
      }

      const userData: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        class: user.class,
        balance: parseFloat(user.balance),
        isAdmin: user.is_admin,
        avatar: user.avatar,
      };

      localStorage.setItem('richelieu_user', JSON.stringify(userData));
      setAuthState({ user: userData, isLoading: false, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Ошибка входа' };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    class: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { rows: existingUsers } = await query('SELECT * FROM users WHERE email = $1', [userData.email]);
      if (existingUsers.length > 0) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Пользователь с таким email уже существует' };
      }

      const passwordHash = await bcrypt.hash(userData.password, 10);
      const { rows } = await query(
        'INSERT INTO users (name, email, password_hash, class, balance, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userData.name, userData.email, passwordHash, userData.class, 0, false]
      );

      const newUser: User = {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        class: rows[0].class,
        balance: parseFloat(rows[0].balance),
        isAdmin: rows[0].is_admin,
        avatar: rows[0].avatar,
      };

      localStorage.setItem('richelieu_user', JSON.stringify(newUser));
      setAuthState({ user: newUser, isLoading: false, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

  const logout = () => {
    localStorage.removeItem('richelieu_user');
    setAuthState({ user: null, isLoading: false, isAuthenticated: false });
  };

  const updateBalance = async (amount: number, description: string = 'Пополнение баланса') => {
    if (!authState.user) return;

    try {
      const { rows } = await query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance',
        [amount, authState.user.id]
      );

      await query(
        'INSERT INTO balance_transactions (user_id, amount, transaction_type, description) VALUES ($1, $2, $3, $4)',
        [authState.user.id, amount, 'deposit', description]
      );

      const updatedUser = { ...authState.user, balance: parseFloat(rows[0].balance) };
      localStorage.setItem('richelieu_user', JSON.stringify(updatedUser));
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.error('Update balance error:', error);
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
