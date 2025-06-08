import React, { useState, useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import useAuthStore from '../store/useAuthStore';

function Inventario(){
  const [filtroEstatus, setFiltroEstatus] = useState('activos');

  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [productToEditQuantity, setProductToEditQuantity] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState('');

  const { products, productMessage, fetchProducts, toggleProductStatus, deleteProduct, updateProductQuantity, setProductMessage } = useProductStore();
  const { user, setMessage: setAuthMessage } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenQuantityModal = (product) => {
    if (!user || user.rol !== 'administrador' ) {
      setAuthMessage('Acceso Denegado: Solo administradores pueden modificar la cantidad de productos.');
      return;
    }
    setProductToEditQuantity(product);
    setQuantityToAdd('');
    setShowQuantityModal(true);
    setProductMessage('');
    setAuthMessage('');
  };

  const handleCloseQuantityModal = () => {
    setShowQuantityModal(false);
    setProductToEditQuantity(null);
    setQuantityToAdd('');
  };

  const handleConfirmQuantityUpdate = async () => {
    const parsedQuantityToAdd = parseInt(quantityToAdd);

    if (isNaN(parsedQuantityToAdd) || parsedQuantityToAdd <= 0) {
      setProductMessage('La cantidad a añadir debe ser un número positivo.');
      return;
    }
    if (!productToEditQuantity) {
      setProductMessage('Error: No hay producto seleccionado para actualizar.');
      return;
    }
    if (!user || user.rol !== 'administrador' ) {
        setAuthMessage('Acceso Denegado: Permisos insuficientes para modificar la cantidad.');
        return;
    }

    const currentProductInStore = products.find(p => p.id_producto === productToEditQuantity.id_producto);
    const finalNewQuantity = (currentProductInStore ? currentProductInStore.cantidad : 0) + parsedQuantityToAdd;

    try {
      await updateProductQuantity(productToEditQuantity.id_producto, finalNewQuantity);
      handleCloseQuantityModal();
    } catch (error) {
      console.error("Error al actualizar cantidad desde el modal:", error);
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    if (!user || user.rol !== 'administrador') {
      setAuthMessage('Acceso Denegado: Solo los administradores pueden cambiar el estatus de productos.');
      return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.')) {
      await toggleProductStatus(productId, !currentStatus);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!user || user.rol !== 'administrador') {
      setAuthMessage('Acceso Denegado: Solo los administradores pueden eliminar productos.');
      return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.')) {
      await deleteProduct(productId);
    }
  };

  const productosFiltrados = products.filter(producto => {
    if (filtroEstatus === 'activos') {
      return producto.activo;
    }
    if (filtroEstatus === 'inactivos') {
      return !producto.activo;
    }
    return true;
  });

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestión de Inventario</h2>

        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => setFiltroEstatus('todos')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filtroEstatus === 'todos'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroEstatus('activos')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filtroEstatus === 'activos'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setFiltroEstatus('inactivos')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filtroEstatus === 'inactivos'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Inactivos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map(producto => (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        {user && (user.rol === 'administrador') && (
                          <button
                            onClick={() => handleOpenQuantityModal(producto)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            title="Aumentar Cantidad"
                          >
                            + Cantidad
                          </button>
                        )}

                        {user && user.rol === 'administrador' && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(producto.id_producto, producto.activo)}
                              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                                producto.activo ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out`}
                              title={producto.activo ? 'Dar de Baja' : 'Reactivar'}
                            >
                              {producto.activo ? 'Dar de Baja' : 'Reactivar'}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(producto.id_producto)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                              title="Eliminar Producto"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                        {(!user || user.rol === 'almacenista') && user?.rol !== 'administrador' && (
                          <span className="text-gray-500 text-xs italic">Acciones solo para Admin</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No hay productos para mostrar con este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showQuantityModal && productToEditQuantity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Añadir Cantidad a {productToEditQuantity.nombre}
            </h3>

            {productMessage && (
                <p className={`text-center p-3 rounded-lg mb-4 ${productMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {productMessage}
                </p>
            )}

            <div className="mb-6">
              <label htmlFor="quantityToAddInput" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad a Añadir
              </label>
              <input
                type="number"
                id="quantityToAddInput"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-400 text-gray-800"
                placeholder="Ingresa la cantidad a sumar"
                min="1"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseQuantityModal}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmQuantityUpdate}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Añadir Cantidad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventario;