import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = 'supersecreto'; // Cambia esto en producción

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
export const registro = (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  const usuarios = Usuario.getAll();
  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ mensaje: 'El email ya está registrado' });
  }
  const hash = bcrypt.hashSync(password, 10);
  const nuevoUsuario = {
    id: Date.now().toString(),
    nombre,
    email,
    passwordHash: hash,
    mascotasAdoptadas: []
  };
  usuarios.push(nuevoUsuario);
  Usuario.saveAll(usuarios);
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
export const login = (req, res) => {
  const { email, password } = req.body;
  const usuarios = Usuario.getAll();
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(400).json({ mensaje: 'Credenciales inválidas' });
  }
  if (!bcrypt.compareSync(password, usuario.passwordHash)) {
    return res.status(400).json({ mensaje: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: '2h' });
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
export const perfil = (req, res) => {
  const usuario = req.usuario;
  res.json({
    id: usuario.id,
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
export const ranking = (req, res) => {
  const usuarios = Usuario.getAll();
  const ranking = usuarios
    .map(u => ({ nombre: u.nombre, cantidad: u.mascotasAdoptadas.length }))
    .sort((a, b) => b.cantidad - a.cantidad);
  res.json(ranking);
};

export const authMiddleware = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ mensaje: 'Token requerido' });
  // Permitir 'Bearer <token>' o solo '<token>'
  let token = auth;
  if (auth.toLowerCase().startsWith('bearer ')) {
    token = auth.split(' ')[1];
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    const usuarios = Usuario.getAll();
    const usuario = usuarios.find(u => u.id === decoded.id);
    if (!usuario) return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    req.usuario = usuario;
    next();
  } catch (e) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
}; 