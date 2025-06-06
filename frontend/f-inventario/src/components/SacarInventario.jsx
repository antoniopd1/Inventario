import React, { useState, useEffect } from 'react';

function SacarInventario(){
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [cantidadesASacar, setCantidadesASacar] = useState({});
    const [mensajeError, setMensajeError] = useState('');
    const [usuarioActual] = useState('Almacenista 1');
    useEffect(() => {
       const datosEjemplo = [
            { id: 1, nombre: 'Laptop Gamer', cantidad: 15 },
            { id: 2, nombre: 'Teclado Mecánico', cantidad: 30 },
            { id: 4, nombre: 'Monitor Curvo', cantidad: 10 },
            { id: 5, nombre: 'Webcam HD', cantidad: 0 }, 
            { id: 7, nombre: 'Auriculares Gaming', cantidad: 25 },
        ];
        setProductosDisponibles(datosEjemplo);

        const initialCantidades = {};
        datosEjemplo.forEach(producto => {
            initialCantidades[producto.id] = 0;
        });
        setCantidadesASacar(initialCantidades);
    }, []);

    const handleCantidadChange = (idProducto, value) => {
        const parsedValue = parseInt(value, 10);
        setCantidadesASacar(prev => ({
            ...prev,
            [idProducto]: isNaN(parsedValue) ? '' : parsedValue 
        }));
        setMensajeError(''); 
    };

    const procesarSalida = (e) => {
        e.preventDefault();
        setMensajeError(''); 

        let hayErrores = false;
        const movimientosARealizar = [];

        productosDisponibles.forEach(producto => {
            const cantidadSolicitada = cantidadesASacar[producto.id] || 0;

            if (cantidadSolicitada > 0) {
                if (cantidadSolicitada > producto.cantidad) {
                    setMensajeError(`Error: No se puede sacar ${cantidadSolicitada} de "${producto.nombre}". Solo hay ${producto.cantidad} en inventario.`);
                    hayErrores = true;
                    return; 
                }
                movimientosARealizar.push({
                    idProducto: producto.id,
                    nombreProducto: producto.nombre,
                    cantidad: cantidadSolicitada,
                    tipo: 'Salida',
                    realizadoPor: usuarioActual, 
                    fechaHora: new Date().toLocaleString() 
                });
            }
        });

        if (hayErrores) {
            return; 
        }

        if (movimientosARealizar.length === 0) {
            setMensajeError('Por favor, ingresa al menos una cantidad para sacar.');
            return;
        }

        setProductosDisponibles(prevProductos =>
            prevProductos.map(prod => {
                const movimiento = movimientosARealizar.find(m => m.idProducto === prod.id);
                return movimiento ? { ...prod, cantidad: prod.cantidad - movimiento.cantidad } : prod;
            })
        );

        const resetCantidades = {};
        productosDisponibles.forEach(producto => {
            resetCantidades[producto.id] = 0;
        });
        setCantidadesASacar(resetCantidades);

        alert('Inventario sacado exitosamente. Revisa la consola para los detalles.');
    };

    return (
        <div className="min-h-screen p-4 bg-red-50"> 
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sacar Inventario (Salida de Productos)</h2>

                {mensajeError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p className="font-bold">Error:</p>
                        <p>{mensajeError}</p>
                    </div>
                )}

                <form onSubmit={procesarSalida}>
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-red-50 border-b border-gray-200">
                                <tr>
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
                                        <tr key={producto.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
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
                                                    value={cantidadesASacar[producto.id]}
                                                    onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                                                    className="w-24 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-center"
                                                    disabled={producto.cantidad === 0}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
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
};

export default SacarInventario;