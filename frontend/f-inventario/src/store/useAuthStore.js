import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  message: '',

  login: async (correo, password) => {
    set({ message: '' });
    try {
      const response = await api.post('/auth/login', { correo, password });
      const data = response.data;

      set({
        token: data.token,
        user: data.user,
        message: `¡Inicio de sesión exitoso! Bienvenido, ${data.user.nombre}.`,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login exitoso:', data);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      set({ message: `Error al iniciar sesión: ${errorMessage}` });
      console.error('Error de login:', error.response?.data || error);
      return false;
    }
  },

  logout: () => {
    set({ token: null, user: null, message: 'Has cerrado sesión.' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Sesión cerrada.');
  },

  setMessage: (msg) => {
    set({ message: msg });
  },
}));

export default useAuthStore;