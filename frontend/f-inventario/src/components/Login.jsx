import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Email:', email);
        console.log('Password:', password);
        alert('Intento de inicio de sesión. Revisa la consola para los datos.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-blue-200 via-purple-100 to-pink-200">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Bienvenido</h1>
                    <p className="text-gray-600">Inicia sesión para acceder a tu cuenta.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-400 text-gray-800"
                            placeholder="tu.correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-400 text-gray-800"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center  mb-6">
                        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition duration-300 ease-in-out">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    ¿No tienes una cuenta?
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition duration-300 ease-in-out">
                        Regístrate aquí
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;