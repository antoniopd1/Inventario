const pool = require('../config/db');
const crypto = require('crypto');

function hashSha256(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

exports.getAllUsers = async (req, res) => {
  console.log('DEBUG: userController - Obteniendo todos los usuarios.');
  try {
    const [rows] = await pool.execute('SELECT id_usuario, nombre, correo, rol, estatus FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('DEBUG: userController - Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  console.log(`DEBUG: userController - Obteniendo usuario por ID: ${id}`);
  try {
    const [rows] = await pool.execute('SELECT id_usuario, nombre, correo, rol, estatus FROM usuarios WHERE id_usuario = ?', [id]);
    if (rows.length === 0) {
      console.log(`DEBUG: userController - Usuario ID ${id} no encontrado (404).`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`DEBUG: userController - Error al obtener usuario por ID ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createUser = async (req, res) => {
  const { nombre, correo, password, rol, estatus } = req.body;
  console.log(`DEBUG: userController - Intentando crear usuario con correo: ${correo}, rol: ${rol}.`);

  if (!nombre || !correo || !password || !rol || !estatus) {
    console.log('DEBUG: userController - Campos incompletos para crear usuario (400).');
    return res.status(400).json({ message: 'Todos los campos son requeridos: nombre, correo, password, rol, estatus.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    console.log('DEBUG: userController - Formato de correo inválido (400).');
    return res.status(400).json({ message: 'Formato de correo electrónico inválido.' });
  }

  const rolesPermitidos = ['administrador', 'almacenista'];
  if (!rolesPermitidos.includes(rol)) {
      console.log(`DEBUG: userController - Rol inválido: ${rol} (400).`);
      return res.status(400).json({ message: `Rol '${rol}' no es un rol permitido. Roles: ${rolesPermitidos.join(', ')}.` });
  }

  const estatusPermitidos = ['activo', 'inactivo'];
  if (!estatusPermitidos.includes(estatus)) {
    console.log(`DEBUG: userController - Estatus inválido: ${estatus} (400).`);
    return res.status(400).json({ message: `Estatus '${estatus}' no es un estatus permitido. Estatus: ${estatusPermitidos.join(', ')}.` });
  }

  try {
    const hashedPassword = hashSha256(password);

    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, correo, password_hash, rol, estatus) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, hashedPassword, rol, estatus]
    );
    console.log(`DEBUG: userController - Usuario "${correo}" creado con ID: ${result.insertId}.`);
    res.status(201).json({ message: 'Usuario creado exitosamente', id_usuario: result.insertId });
  } catch (error) {
    console.error('DEBUG: userController - Error al crear usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo electrónico.' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, password, rol, estatus } = req.body;
  console.log(`DEBUG: userController - Intentando actualizar usuario ID: ${id}.`);

  if (!nombre && !correo && !password && !rol && !estatus) {
    console.log('DEBUG: userController - No se proporcionaron campos para actualizar (400).');
    return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar (nombre, correo, password, rol, estatus).' });
  }

  let updateFields = [];
  let updateValues = [];

  if (nombre) {
    updateFields.push('nombre = ?');
    updateValues.push(nombre);
  }
  if (correo) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      console.log('DEBUG: userController - Formato de correo inválido en actualización (400).');
      return res.status(400).json({ message: 'Formato de correo electrónico inválido.' });
    }
    updateFields.push('correo = ?');
    updateValues.push(correo);
  }
  if (password) {
    const hashedPassword = hashSha256(password);
    updateFields.push('password_hash = ?');
    updateValues.push(hashedPassword);
  }
  if (rol) {
    const rolesPermitidos = ['administrador', 'almacenista', 'vendedor'];
    if (!rolesPermitidos.includes(rol)) {
        console.log(`DEBUG: userController - Rol inválido en actualización: ${rol} (400).`);
        return res.status(400).json({ message: `Rol '${rol}' no es un rol permitido. Roles: ${rolesPermitidos.join(', ')}.` });
    }
    updateFields.push('rol = ?');
    updateValues.push(rol);
  }
  if (estatus) {
    const estatusPermitidos = ['activo', 'inactivo'];
    if (!estatusPermitidos.includes(estatus)) {
      console.log(`DEBUG: userController - Estatus inválido en actualización: ${estatus} (400).`);
      return res.status(400).json({ message: `Estatus '${estatus}' no es un estatus permitido. Estatus: ${estatusPermitidos.join(', ')}.` });
    }
    updateFields.push('estatus = ?');
    updateValues.push(estatus);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'No se proporcionaron campos válidos para actualizar.' });
  }

  updateValues.push(id);

  const query = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id_usuario = ?`;

  try {
    const [result] = await pool.execute(query, updateValues);
    if (result.affectedRows === 0) {
      console.log(`DEBUG: userController - Usuario ID ${id} no encontrado para actualizar (404).`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.log(`DEBUG: userController - Usuario ID ${id} actualizado exitosamente.`);
    res.json({ message: 'Usuario actualizado exitosamente.' });
  } catch (error) {
    console.error('DEBUG: userController - Error al actualizar usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo electrónico.' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(`DEBUG: userController - Intentando cambiar estatus a 'inactivo' para usuario ID: ${id}.`);

  if (req.user.id === parseInt(id)) {
      console.log('DEBUG: userController - Intento de cambiar el estatus de la propia cuenta de administrador a inactivo (403).');
      return res.status(403).json({ message: 'No puedes cambiar el estatus de tu propia cuenta a "inactivo".' });
  }

  try {
    const [result] = await pool.execute('UPDATE usuarios SET estatus = "inactivo" WHERE id_usuario = ?', [id]);

    if (result.affectedRows === 0) {
      console.log(`DEBUG: userController - Usuario ID ${id} no encontrado para cambiar estatus (404).`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.log(`DEBUG: userController - Estatus de usuario ID ${id} cambiado a 'inactivo' exitosamente.`);
    res.json({ message: 'Usuario marcado como inactivo exitosamente.' });
  } catch (error) {
    console.error(`DEBUG: userController - Error al cambiar estatus de usuario ID ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};