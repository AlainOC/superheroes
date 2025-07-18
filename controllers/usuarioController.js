import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'supersecreto'; // Usa variable de entorno si está disponible

/**
 * @swagger
 * /api/usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Faltan campos o email ya registrado
 */
export const registro = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  const existe = await Usuario.findOne({ email });
  if (existe) {
    return res.status(400).json({ mensaje: 'El email ya está registrado' });
  }
  const hash = bcrypt.hashSync(password, 10);
  const nuevoUsuario = new Usuario({ nombre, email, passwordHash: hash, mascotasAdoptadas: [] });
  await nuevoUsuario.save();
  res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
};

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token
 *       400:
 *         description: Credenciales inválidas
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(400).json({ mensaje: 'Credenciales inválidas' });
  }
  if (!bcrypt.compareSync(password, usuario.passwordHash)) {
    return res.status(400).json({ mensaje: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ id: usuario._id, email: usuario.email }, SECRET, { expiresIn: '2h' });
  res.json({ token });
};

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: Token inválido o no enviado
 */
export const perfil = async (req, res) => {
  const usuario = req.usuario;
  res.json({
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    mascotasAdoptadas: usuario.mascotasAdoptadas
  });
};

/**
 * @swagger
 * /api/usuarios/ranking:
 *   get:
 *     summary: Obtener ranking de usuarios por cantidad de mascotas adoptadas
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Ranking de usuarios
 */
export const ranking = async (req, res) => {
  const usuarios = await Usuario.find();
  const ranking = usuarios
    .map(u => ({ nombre: u.nombre, cantidad: u.mascotasAdoptadas.length }))
    .sort((a, b) => b.cantidad - a.cantidad);
  res.json(ranking);
};

export const authMiddleware = async (req, res, next) => {
  let token = null;
  const auth = req.headers['authorization'];

  if (auth) {
    if (auth.toLowerCase().startsWith('bearer ')) {
      token = auth.slice(7).trim();
    } else {
      token = auth.trim();
    }
  }

  if (!token) {
    return res.status(401).json({ mensaje: 'Token requerido en el header Authorization' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    req.usuario = usuario;
    next();
  } catch (e) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
}; 