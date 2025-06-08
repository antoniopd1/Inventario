
const pool = require('../config/db'); 
const jwt = require('jsonwebtoken');  
const crypto = require('crypto');     


function hashSha256(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

exports.login = async (req, res) => {
  const { correo, password } = req.body; 

  if (!correo || !password) {
    console.log('DEBUG: authController - Correo o contraseña no proporcionados (400).');
    return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
  }

  try {
    const [rows] = await pool.execute('SELECT id_usuario, nombre, correo, password_hash, rol, estatus FROM usuarios WHERE correo = ?', [correo]);
    const user = rows[0]; 

    if (!user) {
      console.log('DEBUG: authController - Credenciales inválidas: Usuario no encontrado (401).');
      return res.status(401).json({ message: 'Credenciales inválidas' }); 
    }

    if (user.estatus === 'inactivo') {
      console.log(`DEBUG: authController - Cuenta inactiva para usuario: ${correo} (403).`);
      return res.status(403).json({ message: 'Su cuenta está inactiva. Contacte al administrador.' });
    }

    const passwordMatch = (hashSha256(password) === user.password_hash); 

    if (!passwordMatch) {
      console.log('DEBUG: authController - Credenciales inválidas: Contraseña incorrecta (401).');
      return res.status(401).json({ message: 'Credenciales inválidas' }); 
    }


    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`DEBUG: authController - Inicio de sesión exitoso para ${correo}. Token generado.`);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        estatus: user.estatus
      }
    });

  } catch (error) {
    console.error('DEBUG: authController - Error en el proceso de login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};