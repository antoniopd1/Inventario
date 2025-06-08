const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('DEBUG: authMiddleware - Token no proporcionado. Acceso denegado (401).');
    return res.status(401).json({ message: 'Token no proporcionado. Acceso denegado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('DEBUG: authMiddleware - Error de verificación de token:', err.message);
      return res.status(403).json({ message: 'Token inválido o expirado. Acceso denegado.' });
    }
    req.user = user;
    console.log(`DEBUG: authMiddleware - Token verificado. Usuario: ${user.id}, Rol: ${user.rol}.`);
    next();
  });
};

exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      console.log('DEBUG: authMiddleware - Información de rol no disponible para autorización (403).');
      return res.status(403).json({ message: 'Información de rol no disponible. Acceso denegado.' });
    }
    if (!roles.includes(req.user.rol)) {
      console.log(`DEBUG: authMiddleware - Acceso denegado. Rol de usuario: ${req.user.rol}, Roles requeridos: ${roles.join(', ')} (403).`);
      return res.status(403).json({ message: 'No tiene los permisos necesarios para realizar esta acción.' });
    }
    console.log(`DEBUG: authMiddleware - Rol autorizado: ${req.user.rol}.`);
    next();
  };
};