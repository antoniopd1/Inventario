import { create } from 'zustand';
import api from '../utils/api';

const useProductStore = create((set, get) => ({
  products: [],
  movements: [],
  productMessage: '',

  fetchProducts: async () => {
    set({ productMessage: '' });
    try {
      const response = await api.get('/products');
      set({ products: response.data, productMessage: 'Productos cargados exitosamente.' });
      console.log('Productos obtenidos:', response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al obtener productos.';
      set({ productMessage: `Error al obtener productos: ${errorMessage}` });
      console.error('Error al obtener productos:', error.response?.data || error);
    }
  },

  addProduct: async (productData) => {
    set({ productMessage: '' });
    try {
      const response = await api.post('/products', productData);
      set({ productMessage: `Producto "${productData.nombre}" agregado exitosamente.` });
      console.log('Producto agregado:', response.data);
      await get().fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al agregar producto.';
      set({ productMessage: `Error al agregar producto: ${errorMessage}` });
      console.error('Error al agregar producto:', error.response?.data || error);
    }
  },

  toggleProductStatus: async (productId, newStatus) => {
    set({ productMessage: '' });
    try {
      const response = await api.patch(`/products/${productId}/status`, { activo: newStatus });
      set({ productMessage: response.data.message });
      console.log('Estatus de producto actualizado:', response.data);
      await get().fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar estatus.';
      set({ productMessage: `Error al actualizar estatus: ${errorMessage}` });
      console.error('Error al actualizar estatus:', error.response?.data || error);
    }
  },

  deleteProduct: async (productId) => {
    set({ productMessage: '' });
    try {
      const response = await api.delete(`/products/${productId}`);
      set({ productMessage: response.data.message });
      console.log('Producto eliminado:', response.data);
      await get().fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar producto.';
      set({ productMessage: `Error al eliminar producto: ${errorMessage}` });
      console.error('Error al eliminar producto:', error.response?.data || error);
    }
  },

  updateProductQuantity: async (productId, newQuantity) => {
    set({ productMessage: '' });
    try {
      const response = await api.put(`/products/${productId}`, { cantidad: newQuantity });
      set({ productMessage: response.data.message || `Cantidad de producto ${productId} actualizada.` });
      console.log('Cantidad de producto actualizada:', response.data);
      await get().fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar cantidad del producto.';
      set({ productMessage: `Error al actualizar cantidad: ${errorMessage}` });
      console.error('Error al actualizar cantidad:', error.response?.data || error);
    }
  },
  withdrawProduct: async (productId, cantidadASacar) => {
    set({ productMessage: '' });
    try {
      const response = await api.patch(`/products/${productId}/withdraw`, { cantidad: cantidadASacar });
      set({ productMessage: response.data.message });
      console.log('Retiro de producto exitoso:', response.data);
      await get().fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al retirar producto.';
      set({ productMessage: `Error al retirar producto: ${errorMessage}` });
      console.error('Error al retirar producto:', error.response?.data || error);
    }
  },

  fetchMovementHistory: async (type = '') => {
    console.log('DEBUG: useProductStore - Intentando obtener historial de movimientos con filtro:', type || 'Todos');
    set({ productMessage: '' });
    try {
      const params = type ? { tipo_movimiento: type } : {};
      const response = await api.get('/products/history', { params });
      set({ movements: response.data, productMessage: 'Historial de movimientos cargado exitosamente.' });
      console.log('DEBUG: useProductStore - Historial de movimientos obtenido:', response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al obtener historial de movimientos.';
      set({ productMessage: `Error al obtener historial de movimientos: ${errorMessage}` });
      console.error('DEBUG: useProductStore - Error al obtener historial de movimientos:', error.response?.data || error);
    }
  },

  setProductMessage: (msg) => {
    set({ productMessage: msg });
  },
}));

export default useProductStore;