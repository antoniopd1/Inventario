import React, { useState, useEffect } from 'react';

function Inventario(){
    const [productos, setProductos] = useState([]);

    const [filtroEstatus, setFiltroEstatus] = useState('activos');

    useEffect(() => {
        const datosEjemplo = [
            { id: 1, nombre: 'Laptop Gamer', cantidad: 15, activo: true },
            { id: 2, nombre: 'Teclado Mecánico', cantidad: 30, activo: true },
            { id: 3, nombre: 'Mouse Inalámbrico', cantidad: 50, activo: false }, 
            { id: 4, nombre: 'Monitor Curvo', cantidad: 10, activo: true },
            { id: 5, nombre: 'Webcam HD', cantidad: 0, activo: true },
            { id: 6, nombre: 'Impresora Multifuncional', cantidad: 5, activo: false }, 
            { id: 7, nombre: 'Auriculares Gaming', cantidad: 25, activo: true },
        ];
        setProductos(datosEjemplo);
    }, []); 

    const aumentarCantidad = (idProducto) => {
        setProductos(prevProductos =>
            prevProductos.map(producto =>
                producto.id === idProducto
                    ? { ...producto, cantidad: producto.cantidad + 1 }
                    : producto
            )
        );
    };

    const toggleEstatusProducto = (idProducto) => {
        setProductos(prevProductos =>
            prevProductos.map(producto =>
                producto.id === idProducto
                    ? { ...producto, activo: !producto.activo }
                    : producto
            )
        );
    };

    const productosFiltrados = productos.filter(producto => {
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
                                    <tr key={producto.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
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
                                                <button
                                                    onClick={() => aumentarCantidad(producto.id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                                    title="Aumentar Cantidad"
                                                >
                                                    + Cantidad
                                                </button>
                                                <button
                                                    onClick={() => toggleEstatusProducto(producto.id)}
                                                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                                                        producto.activo ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out`}
                                                    title={producto.activo ? 'Dar de Baja' : 'Reactivar'}
                                                >
                                                    {producto.activo ? 'Dar de Baja' : 'Reactivar'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No hay productos para mostrar con este filtro.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventario;