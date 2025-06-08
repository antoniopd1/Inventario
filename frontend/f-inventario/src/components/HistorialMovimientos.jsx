import React, { useState, useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import useAuthStore from '../store/useAuthStore';

function HistorialMovimientos() {
  const [filtroTipoMovimiento, setFiltroTipoMovimiento] = useState('');

  const { movements, productMessage, fetchMovementHistory, setProductMessage } = useProductStore();
  const { user, message: authMessage, setMessage: setAuthMessage } = useAuthStore();

  useEffect(() => {
    if (!user || (!['administrador', 'almacenista', 'visualizador'].includes(user.rol))) {
      setAuthMessage('Acceso Denegado: Solo administradores, almacenistas y visualizadores pueden ver el historial de movimientos.');
      setProductMessage('');
      return;
    }

    fetchMovementHistory(filtroTipoMovimiento);
    setProductMessage('');
    setAuthMessage('');
  }, [fetchMovementHistory, filtroTipoMovimiento, user, setProductMessage, setAuthMessage]);

  const handleFilterClick = (type) => {
    setFiltroTipoMovimiento(type);
  };

  if (!user || (!['administrador', 'almacenista', 'visualizador'].includes(user.rol))) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para ver el historial de movimientos.</p>
          {authMessage && (
            <p className="p-3 rounded-md bg-yellow-100 border border-yellow-400 text-yellow-700">
              {authMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Historial de Movimientos de Inventario</h2>

        {productMessage && (
          <p className={`text-center p-3 rounded-lg mb-4 ${productMessage.includes('Error') ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
            {productMessage}
          </p>
        )}
        {authMessage && (
            <p className="text-center p-3 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 mb-4">
                {authMessage}
            </p>
        )}

        <div className="mb-6 flex flex-wrap justify-center space-x-4">
          <button
            onClick={() => handleFilterClick('')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filtroTipoMovimiento === ''
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos los Tipos
          </button>
          <button
            onClick={() => handleFilterClick('Entrada')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filtroTipoMovimiento === 'Entrada'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => handleFilterClick('Salida')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filtroTipoMovimiento === 'Salida'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Salidas
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Movimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Realizado Por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.length > 0 ? (
                movements.map(movimiento => (
                  <tr key={movimiento.id_movimiento} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {movimiento.id_movimiento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {movimiento.nombre_producto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        movimiento.tipo_movimiento === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {movimiento.tipo_movimiento}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {movimiento.cantidad_movida}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {movimiento.nombre_usuario_movimiento || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(movimiento.fecha_movimiento).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No hay movimientos registrados para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistorialMovimientos;