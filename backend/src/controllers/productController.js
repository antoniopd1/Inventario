const pool = require('../config/db');

async function recordMovement(id_producto, tipo_movimiento, cantidad_movida, id_usuario) {
  try {
    await pool.execute(
      'INSERT INTO historial_movimientos (id_producto, tipo_movimiento, cantidad_movida, id_usuario) VALUES (?, ?, ?, ?)',
      [id_producto, tipo_movimiento, cantidad_movida, id_usuario]
    );
    console.log(`Movimiento registrado: Producto ${id_producto}, Tipo ${tipo_movimiento}, Cantidad ${cantidad_movida}, Usuario ${id_usuario}`);
  } catch (error) {
    console.error('Error al registrar movimiento de inventario en la BD:', error);
  }
}

exports.getAllProducts = async (req, res) => {
  console.log('DEBUG: productController - Obteniendo todos los productos.');
  try {
    const [rows] = await pool.execute('SELECT id_producto, nombre, cantidad, activo FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('DEBUG: productController - Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener productos.' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  console.log(`DEBUG: productController - Obteniendo producto por ID: ${id}`);
  try {
    const [rows] = await pool.execute('SELECT id_producto, nombre, cantidad, activo FROM productos WHERE id_producto = ?', [id]);
    if (rows.length === 0) {
      console.log(`DEBUG: productController - Producto ID ${id} no encontrado (404).`);
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`DEBUG: productController - Error al obtener producto por ID ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener producto.' });
  }
};

exports.addProduct = async (req, res) => {
  const { nombre, cantidad } = req.body;
  const userId = req.user.id;
  const userRole = req.user.rol;

  console.log(`DEBUG: productController - Intentando agregar producto con nombre: "${nombre}", cantidad: ${cantidad}.`);

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ message: 'El nombre del producto es requerido.' });
  }
  if (cantidad === undefined || cantidad < 0 || isNaN(cantidad)) {
    return res.status(400).json({ message: 'La cantidad del producto debe ser un número no negativo.' });
  }

  if (userRole !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden agregar productos.' });
  }

  try {
    const [result] = await pool.execute('INSERT INTO productos (nombre, cantidad) VALUES (?, ?)', [nombre, cantidad]);
    const newProductId = result.insertId;

    if (cantidad > 0) {
      await recordMovement(newProductId, 'Entrada', cantidad, userId);
    }

    console.log(`DEBUG: productController - Producto "${nombre}" agregado con ID: ${newProductId}.`);
    res.status(201).json({ message: 'Producto agregado exitosamente.', id: newProductId });
  } catch (error) {
    console.error('DEBUG: productController - Error al agregar producto:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un producto con ese nombre.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al agregar producto.' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, activo } = req.body;
  const userId = req.user.id;
  const userRole = req.user.rol;

  console.log(`DEBUG: productController - Intentando actualizar producto ID: ${id}.`);

  if (!nombre && cantidad === undefined && activo === undefined) {
    return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar (nombre, cantidad, activo).' });
  }

  let oldQuantity = 0;
  if (cantidad !== undefined) {
    try {
      const [currentProductRows] = await pool.execute(
        'SELECT cantidad FROM productos WHERE id_producto = ?',
        [id]
      );
      if (currentProductRows.length > 0) {
        oldQuantity = currentProductRows[0].cantidad;
      }
    } catch (error) {
      console.error('Error al obtener cantidad antigua para actualización:', error);
    }
  }

  let updateFields = [];
  let updateValues = [];

  if (nombre !== undefined) {
    if (nombre.trim() === '') {
        return res.status(400).json({ message: 'El nombre del producto no puede estar vacío.' });
    }
    updateFields.push('nombre = ?');
    updateValues.push(nombre);
  }
  if (cantidad !== undefined) {
    if (cantidad < 0 || isNaN(cantidad)) {
        return res.status(400).json({ message: 'La cantidad debe ser un número no negativo.' });
    }
    if (userRole !== 'administrador' && userRole !== 'almacenista') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores y almacenistas pueden modificar la cantidad de productos.' });
    }
    updateFields.push('cantidad = ?');
    updateValues.push(cantidad);
  }
  if (activo !== undefined) {
    if (typeof activo !== 'boolean') {
        return res.status(400).json({ message: 'El valor de "activo" debe ser true o false.' });
    }
    if (userRole !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden cambiar el estatus de productos.' });
    }
    updateFields.push('activo = ?');
    updateValues.push(activo);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'No se proporcionaron campos válidos para actualizar.' });
  }

  updateValues.push(id);

  const query = `UPDATE productos SET ${updateFields.join(', ')} WHERE id_producto = ?`;

  try {
    const [result] = await pool.execute(query, updateValues);
    if (result.affectedRows === 0) {
      console.log(`DEBUG: productController - Producto ID ${id} no encontrado para actualizar (404).`);
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    if (cantidad !== undefined && cantidad > oldQuantity) {
        const quantityAdded = cantidad - oldQuantity;
        if (quantityAdded > 0) {
            await recordMovement(parseInt(id), 'Entrada', quantityAdded, userId);
        }
    }

    console.log(`DEBUG: productController - Producto ID ${id} actualizado exitosamente.`);
    res.status(200).json({ message: 'Producto actualizado exitosamente.' });
  } catch (error) {
    console.error('DEBUG: productController - Error al actualizar producto:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un producto con ese nombre.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al actualizar producto.' });
  }
};

exports.toggleProductStatus = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  const userRole = req.user.rol;

  console.log(`DEBUG: productController - Intentando cambiar estatus para producto ID ${id} a ${activo}.`);

  if (typeof activo !== 'boolean') {
    return res.status(400).json({ message: 'El valor de "activo" debe ser true o false.' });
  }

  if (userRole !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden cambiar el estatus de productos.' });
  }

  try {
    const [result] = await pool.execute('UPDATE productos SET activo = ? WHERE id_producto = ?', [activo, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    console.log(`DEBUG: productController - Estatus de producto ID ${id} cambiado a ${activo ? 'activo' : 'inactivo'}.`);
    res.status(200).json({ message: `Producto marcado como ${activo ? 'activo' : 'inactivo'} exitosamente.` });
  } catch (error) {
    console.error('DEBUG: productController - Error al cambiar estatus del producto:', error);
    res.status(500).json({ message: 'Error interno del servidor al cambiar estatus del producto.' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userRole = req.user.rol;

  console.log(`DEBUG: productController - Intentando eliminar producto ID: ${id}.`);

  if (userRole !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden eliminar productos.' });
  }

  try {
    const [result] = await pool.execute('DELETE FROM productos WHERE id_producto = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    console.log(`DEBUG: productController - Producto ID ${id} eliminado exitosamente.`);
    res.status(200).json({ message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    console.error(`DEBUG: productController - Error al eliminar producto ID ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar producto.' });
  }
};

exports.withdrawProduct = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  const userId = req.user.id;
  const userRole = req.user.rol;

  console.log(`DEBUG: productController - Intentando sacar ${cantidad} unidades del producto ID: ${id}.`);

  if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
    return res.status(400).json({ message: 'La cantidad a sacar debe ser un número positivo.' });
  }

  if (userRole !== 'administrador' && userRole !== 'almacenista') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores y almacenistas pueden sacar inventario.' });
  }

  try {
    const [productRows] = await pool.execute(
      'SELECT cantidad FROM productos WHERE id_producto = ? AND activo = TRUE',
      [id]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado o no activo.' });
    }

    const currentQuantity = productRows[0].cantidad;

    if (currentQuantity < cantidad) {
      return res.status(400).json({ message: `No hay suficiente stock. Cantidad disponible: ${currentQuantity}. Cantidad solicitada: ${cantidad}.` });
    }

    const newQuantity = currentQuantity - cantidad;

    const [result] = await pool.execute(
      'UPDATE productos SET cantidad = ? WHERE id_producto = ?',
      [newQuantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado o no se pudo actualizar la cantidad.' });
    }

    await recordMovement(parseInt(id), 'Salida', cantidad, userId);

    console.log(`DEBUG: productController - Se sacaron ${cantidad} unidades del producto ${id}. Nueva cantidad: ${newQuantity}.`);
    res.status(200).json({ message: `Se sacaron ${cantidad} unidades del producto ${id}. Nueva cantidad: ${newQuantity}.` });

  } catch (error) {
    console.error('DEBUG: productController - Error al sacar inventario:', error);
    res.status(500).json({ message: 'Error interno del servidor al sacar inventario.' });
  }
};

exports.getMovementHistory = async (req, res) => {
  const { tipo_movimiento } = req.query;
  const userRole = req.user.rol;

  console.log(`DEBUG: productController - Solicitando historial de movimientos con filtro: ${tipo_movimiento || 'Todos'}.`);

  if (userRole !== 'administrador' && userRole !== 'almacenista' && userRole !== 'visualizador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores, almacenistas y visualizadores pueden ver el historial de movimientos.' });
  }

  let query = `
    SELECT
      m.id_movimiento,
      m.id_producto,
      p.nombre AS nombre_producto,
      m.tipo_movimiento,
      m.cantidad_movida,
      m.fecha_movimiento,
      u.nombre AS nombre_usuario_movimiento
    FROM
      historial_movimientos m
    JOIN
      productos p ON m.id_producto = p.id_producto
    LEFT JOIN
      usuarios u ON m.id_usuario = u.id_usuario
  `;
  const params = [];

  if (tipo_movimiento && (tipo_movimiento === 'Entrada' || tipo_movimiento === 'Salida')) {
    query += ' WHERE m.tipo_movimiento = ?';
    params.push(tipo_movimiento);
  }

  query += ' ORDER BY m.fecha_movimiento DESC';

  try {
    const [rows] = await pool.execute(query, params);
    console.log(`DEBUG: productController - Historial de movimientos obtenido: ${rows.length} registros.`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('DEBUG: productController - Error al obtener historial de movimientos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener historial de movimientos.' });
  }
};