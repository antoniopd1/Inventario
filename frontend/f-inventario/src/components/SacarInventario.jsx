import React, { useState, useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import useAuthStore from '../store/useAuthStore';

function SacarInventario(){
  const [cantidadesASacar, setCantidadesASacar] = useState({});

  const { products, productMessage, fetchProducts, withdrawProduct, setProductMessage } = useProductStore();

  const { user, setMessage: setAuthMessage } = useAuthStore();

  useEffect(() => {
    fetchProducts();
    setProductMessage('');
    setAuthMessage('');
  }, [fetchProducts, setProductMessage, setAuthMessage]);

  const productosDisponibles = products.filter(producto => producto.activo && producto.cantidad > 0);

  const handleCantidadChange = (idProducto, value) => {
    const parsedValue = parseInt(value, 10);
    setCantidadesASacar(prev => ({
      ...prev,
      [idProducto]: isNaN(parsedValue) ? '' : parsedValue
    }));
    setProductMessage('');
    setAuthMessage('');
  };

const procesarSalida = async (e) => {
  e.preventDefault();
  setProductMessage('');
  setAuthMessage('');

  if (!user || (user.rol !== 'almacenista' && user.rol !== 'administrador')) {
    setAuthMessage('Acceso Denegado: Solo almacenistas y administradores pueden sacar inventario.');
    return;
  }

  let hayErrores = false;
  const productosParaRetirar = [];

  for (const producto of productosDisponibles) {
    const cantidadSolicitada = cantidadesASacar[producto.id_producto] || 0;

    if (cantidadSolicitada > 0) {
      if (cantidadSolicitada > producto.cantidad) {
        setAuthMessage(`Error: No se puede sacar ${cantidadSolicitada} de "${producto.nombre}". Solo hay ${producto.cantidad} en inventario.`);
        hayErrores = true;
        break;
      }
      productosParaRetirar.push({
        id: producto.id_producto,
        cantidad: cantidadSolicitada
      });
    }
  }

  if (hayErrores) {
    return;
  }

  if (productosParaRetirar.length === 0) {
    setAuthMessage('Por favor, ingresa al menos una cantidad para sacar.');
    return;
  }

  try {
    await Promise.all(
      productosParaRetirar.map(item =>
        withdrawProduct(item.id, item.cantidad)
      )
    );
    setAuthMessage('Inventario sacado exitosamente.');
    setCantidadesASacar({});
  } catch (error) {
    if (!productMessage.includes('Error')) {
      setProductMessage('Ocurrió un error al procesar la salida de inventario.');
    }
    console.error('Error al procesar salida de inventario:', error);
  }
};


  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sacar Inventario (Salida de Productos)</h2>

        <form onSubmit={procesarSalida}>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-red-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad Disponible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad a Sacar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productosDisponibles.length > 0 ? (
                  productosDisponibles.map(producto => (
                    <tr key={producto.id_producto} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {producto.id_producto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {producto.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {producto.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <input
                          type="number"
                          min="0"
                          max={producto.cantidad}
                          value={cantidadesASacar[producto.id_producto] || ''}
                          onChange={(e) => handleCantidadChange(producto.id_producto, e.target.value)}
                          className="w-24 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-center"
                          disabled={producto.cantidad === 0}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No hay productos activos disponibles para sacar inventario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Confirmar Salida de Inventario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SacarInventario;