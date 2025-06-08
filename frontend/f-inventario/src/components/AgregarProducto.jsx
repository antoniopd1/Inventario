import React, { useState } from 'react';
import useProductStore from '../store/useProductStore';
import useAuthStore from '../store/useAuthStore';

function AgregarProducto () {
  const [nombreProducto, setNombreProducto] = useState('');
  const [cantidadProducto, setCantidadProducto] = useState(0);

  const { addProduct } = useProductStore();
  const { user, setMessage: setAuthMessage } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAuthMessage('');

    if (!nombreProducto.trim()) {
      setAuthMessage('El nombre del producto no puede estar vacío.');
      return;
    }
    if (cantidadProducto < 0 || isNaN(cantidadProducto)) {
      setAuthMessage('La cantidad inicial debe ser un número no negativo.');
      return;
    }

    if (!user || user.rol !== 'administrador') {
      setAuthMessage('Acceso Denegado: Solo los administradores pueden agregar productos.');
      return;
    }

    try {
      await addProduct({ nombre: nombreProducto.trim(), cantidad: parseInt(cantidadProducto) });

      setNombreProducto('');
      setCantidadProducto(0);
    } catch (error) {
      console.error("Error inesperado al agregar producto desde el componente:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Agregar Nuevo Producto</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="nombreProducto" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="nombreProducto"
              name="nombreProducto"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-400 text-gray-800"
              placeholder="Ej. Teclado Mecánico RGB"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="cantidadProducto" className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad Inicial
            </label>
            <input
              type="number"
              id="cantidadProducto"
              name="cantidadProducto"
              value={cantidadProducto}
              onChange={(e) => setCantidadProducto(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-400 text-gray-800"
              placeholder="Ej. 100"
              disabled
              required
              min="0"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Agregar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarProducto;