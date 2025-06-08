import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';

import useAuthStore from './store/useAuthStore';

import Login from './components/Login';
import Inventario from './components/Inventario';
import SacarInventario from './components/SacarInventario';
import AgregarProducto from './components/AgregarProducto';
import HistorialMovimientos from './components/HistorialMovimientos';

import './index.css';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children ? children : <Outlet />;
};

const PrivateRouteAdmin = ({ children }) => {
  const { user, token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!user || user.rol !== 'administrador') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-8">
        <h1 className="text-4xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-lg">Solo los administradores tienen permiso para acceder a esta página.</p>
        <Link to="/inventario" className="mt-6 text-blue-600 hover:underline">Volver a Inventario</Link>
      </div>
    );
  }
  return children ? children : <Outlet />;
};

const PrivateRouteAlmacenista = ({ children }) => {
  const { user, token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!user || user.rol !== 'almacenista') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-8">
        <h1 className="text-4xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-lg">Solo los almacenistas tienen permiso para acceder a esta página.</p>
        <Link to="/inventario" className="mt-6 text-blue-600 hover:underline">Volver a Inventario</Link>
      </div>
    );
  }
  return children ? children : <Outlet />;
};


function App() {
  const { token, user, logout } = useAuthStore();

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {token && (
          <nav className="bg-blue-800 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link to="/inventario" className="text-white text-2xl font-bold hover:text-blue-200 transition-colors">
                Sistema de Inventario
              </Link>
              <div className="flex items-center space-x-6">
                <Link to="/inventario" className="text-white hover:text-blue-200 transition-colors text-lg font-medium">
                  Inventario
                </Link>
                {user && user.rol === 'administrador' && (
                  <Link to="/agregar-producto" className="text-white hover:text-blue-200 transition-colors text-lg font-medium">
                    Agregar Producto
                  </Link>
                )}
                {user && user.rol === 'almacenista' && (
                  <Link to="/sacar-inventario" className="text-white hover:text-blue-200 transition-colors text-lg font-medium">
                    Sacar Inventario
                  </Link>
                )}
                {user && (user.rol === 'administrador' ) && (
                  <Link to="/historial-movimientos" className="text-white hover:text-blue-200 transition-colors text-lg font-medium">
                    Historial Movimientos
                  </Link>
                )}
                <span className="text-blue-200 text-md capitalize">
                  Rol: {user?.rol || 'No Autenticado'}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </nav>
        )}

        <main className="flex-grow p-4">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={token ? <Navigate to="/inventario" replace /> : <Navigate to="/login" replace />} />

            <Route
              path="/inventario"
              element={
                <ProtectedRoute allowedRoles={['administrador', 'almacenista']}>
                  <Inventario />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agregar-producto"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <AgregarProducto />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sacar-inventario"
              element={
                <ProtectedRoute allowedRoles={[ 'almacenista']}>
                  <SacarInventario />
                </ProtectedRoute>
              }
            />

            <Route
              path="/historial-movimientos"
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <HistorialMovimientos />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={
              <div className="text-center p-8 mt-16">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404: Página no encontrada</h1>
                <p className="text-lg text-gray-600">La URL que estás buscando no existe.</p>
                {token ? (
                  <Link to="/inventario" className="mt-4 text-blue-600 hover:underline inline-block">Volver a Inventario</Link>
                ) : (
                  <Link to="/login" className="mt-4 text-blue-600 hover:underline inline-block">Ir a Login</Link>
                )}
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;