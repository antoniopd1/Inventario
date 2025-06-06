import React, { useState } from 'react';

function AgregarProducto ({ onProductoAgregado })  {
    const [nombreProducto, setNombreProducto] = useState('');
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' }); 

    const handleSubmit = (e) => {
        e.preventDefault();
        setMensaje({ tipo: '', texto: '' }); 

        if (!nombreProducto.trim()) {
            setMensaje({ tipo: 'error', texto: 'El nombre del producto no puede estar vacío.' });
            return;
        }

        const nuevoProductoSimulado = {
            id: Date.now(), 
            nombre: nombreProducto.trim(),
            cantidad: 0, 
            activo: true 
        };

        console.log('Producto a agregar (simulado):', nuevoProductoSimulado);
        setMensaje({ tipo: 'success', texto: `"${nuevoProductoSimulado.nombre}" agregado exitosamente con cantidad inicial 0.` });
        setNombreProducto(''); 

        if (onProductoAgregado) {
            onProductoAgregado(nuevoProductoSimulado);
        }
    };

    return (
        <div className="min-h-screen p-4 bg-purple-50 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Agregar Nuevo Producto</h2>

                {mensaje.texto && (
                    <div className={`p-3 rounded-md mb-4 ${
                        mensaje.tipo === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
                    }`} role="alert">
                        {mensaje.texto}
                    </div>
                )}

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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-300 ease-in-out placeholder-gray-400 text-gray-800"
                            placeholder="Ej. Teclado Mecánico RGB"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Cantidad Inicial</p>
                        <p className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed">
                            0 (por defecto al agregar)
                        </p>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                        >
                            Agregar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgregarProducto;