import { useState } from 'react';
import { authService } from '../services/api';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      const user = response.data.user;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);

      setLoading(false);
      return { success: true, user }; // ← Solo retorna, no redirijas
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en el login';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      const user = response.data.user;

      setLoading(false);
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en el registro';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const isAdmin = () => {
    const role = localStorage.getItem('userRole');
    return role === 'admin';
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isAdmin,
    loading,
    error,
    clearError: () => setError(null)
  };
};


export default useAuth;