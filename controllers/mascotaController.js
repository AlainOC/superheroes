import { Router } from 'express'
import {
  getAllMascotas,
  getMascotaById,
  createMascota,
  updateMascota,
  deleteMascota,
  alimentarMascota,
  pasearMascota,
  personalizarMascota,
  enfermarMascota,
  curarMascota,
  revivirMascota,
  matarMascota,
  pocionVidaMascota
} from '../services/mascotaService.js'
import Mascota from '../models/Mascota.js'
import { authMiddleware } from './usuarioController.js'
const router = Router()

/**
 * @swagger
 * tags:
 *   name: Mascotas
 *   description: Gestión de mascotas de superhéroes
 */

/**
 * @swagger
 * /api/mascotas:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Mascotas]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 */
router.get('/mascotas', authMiddleware, async (req, res) => {
  const mascotas = await getAllMascotas(req.usuario.id)
  res.json(mascotas)
})

/**
 * @swagger
 * /api/mascotas/{id}:
 *   get:
 *     summary: Obtener una mascota por ID
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/mascotas/:id', authMiddleware, async (req, res) => {
  const mascota = await getMascotaById(req.params.id)
  if (!mascota) return res.status(404).json({ error: 'No encontrada' })
  res.json(mascota)
})

/**
 * @swagger
 * /api/mascotas:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Mascotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               heroe:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota creada
 */
router.post('/mascotas', authMiddleware, async (req, res) => {
  const { nombre, heroe } = req.body
  if (!nombre || !heroe) return res.status(400).json({ error: 'Nombre y héroe requeridos' })
  const nueva = await createMascota(nombre, heroe)
  res.status(201).json(nueva)
})

/**
 * @swagger
 * /api/mascotas/{id}:
 *   put:
 *     summary: Actualizar una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               heroe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *       404:
 *         description: Mascota no encontrada
 */
router.put('/mascotas/:id', authMiddleware, async (req, res) => {
  const { nombre, heroe } = req.body
  const mascota = await updateMascota(req.params.id, nombre, heroe)
  if (!mascota) return res.status(404).json({ error: 'No encontrada' })
  res.json(mascota)
})

/**
 * @swagger
 * /api/mascotas/{id}:
 *   delete:
 *     summary: Eliminar una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       204:
 *         description: Mascota eliminada
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/mascotas/:id', authMiddleware, async (req, res) => {
  const ok = await deleteMascota(req.params.id)
  if (!ok) return res.status(404).json({ error: 'No encontrada' })
  res.status(204).send()
})

/**
 * @swagger
 * /api/mascotas/{id}/alimentar:
 *   post:
 *     summary: Alimentar una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota alimentada
 *       404:
 *         description: Mascota no encontrada
 */
// Alimentar mascota
router.post('/mascotas/:id/alimentar', authMiddleware, async (req, res) => {
  const { id } = req.params
  const result = await alimentarMascota(Number(id))
  if (!result) return res.status(404).json({ error: 'Mascota no encontrada' })
  res.json(result)
})

/**
 * @swagger
 * /api/mascotas/{id}/pasear:
 *   post:
 *     summary: Sacar a pasear una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota paseada
 *       404:
 *         description: Mascota no encontrada
 */
// Pasear mascota
router.post('/mascotas/:id/pasear', authMiddleware, async (req, res) => {
  const { id } = req.params
  const result = await pasearMascota(Number(id))
  if (!result) return res.status(404).json({ error: 'Mascota no encontrada' })
  res.json(result)
})

/**
 * @swagger
 * /api/mascotas/{id}/personalizar:
 *   post:
 *     summary: Personalizar una mascota con un ítem
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 example: Collar
 *     responses:
 *       200:
 *         description: Mascota personalizada
 *       404:
 *         description: Mascota no encontrada
 */
// Personalizar mascota
router.post('/mascotas/:id/personalizar', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { item } = req.body
  const result = await personalizarMascota(Number(id), item)
  if (!result) return res.status(404).json({ error: 'Mascota no encontrada' })
  res.json(result)
})

/**
 * @swagger
 * /api/mascotas/{id}/enfermar:
 *   post:
 *     summary: Enfermar a una mascota (especificar enfermedad)
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enfermedad:
 *                 type: string
 *                 example: Gripe
 *     responses:
 *       200:
 *         description: Mascota enferma
 *       404:
 *         description: Mascota no encontrada
 */
// Enfermar mascota (especificar enfermedad)
router.post('/mascotas/:id/enfermar', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { enfermedad } = req.body
  const result = await enfermarMascota(Number(id), enfermedad)
  if (!result) return res.status(404).json({ error: 'Mascota no encontrada' })
  res.json(result)
})

/**
 * @swagger
 * /api/mascotas/{id}/curar:
 *   post:
 *     summary: Curar una enfermedad de la mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enfermedad:
 *                 type: string
 *                 example: Gripe
 *     responses:
 *       200:
 *         description: Mascota curada
 *       404:
 *         description: Mascota no encontrada
 */
// Curar mascota (por nombre de enfermedad)
router.post('/mascotas/:id/curar', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { enfermedad } = req.body
  const result = await curarMascota(Number(id), enfermedad)
  if (!result) return res.status(404).json({ error: 'Mascota no encontrada' })
  res.json(result)
})

/**
 * @swagger
 * /api/mascotas/{id}/revivir:
 *   post:
 *     summary: Revivir una mascota muerta (vida en 0)
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota revivida
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/revivir', authMiddleware, async (req, res) => {
  const { id } = req.params
  const result = await revivirMascota(Number(id))
  if (!result) return res.status(404).json({ error: 'Mascota no encontrada' })
  res.json(result)
})

/**
 * @swagger
 * /api/mascotas/{id}/matar:
 *   post:
 *     summary: Matar una mascota especificando la causa de muerte
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               causa:
 *                 type: string
 *                 example: "Envenenamiento"
 *     responses:
 *       200:
 *         description: Mascota muerta
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/matar', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { causa } = req.body
  const result = await matarMascota(Number(id), causa)
  if (!result) return res.status(404).json({ error: 'Mascota no encontrada' })
  res.json(result)
})

/**
 * @swagger
 * /api/mascotas/{id}/pocion-vida:
 *   post:
 *     summary: Aplicar poción de vida a una mascota (curar vida)
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       200:
 *         description: Poción aplicada
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/pocion-vida', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { cantidad } = req.body
  const result = await pocionVidaMascota(Number(id), Number(cantidad))
  if (!result) return res.status(404).json({ error: 'Mascota no encontrada' })
  res.json(result)
})

// Endpoint para poblar la base de datos con 30 mascotas aleatorias
router.post('/mascotas/poblar30', async (req, res) => {
  const nombresMascotas = [
    'Krypto', 'Ace', 'Streaky', 'Comet', 'Beppo', 'Dex-Starr', 'Jumpa', 'Bat-Cow', 'Titus', 'Hoppy',
    "Ch'p", 'Proty', 'Toppo', 'Storm', 'Lockjaw', 'Redwing', 'Zabu', 'Lockheed', 'Throg', 'Hairball',
    'Rocket', 'Cosmo', 'Howard', 'Chewie', 'Goose', 'Old Lace', 'Lockjaw Jr.', 'Frog Thor', 'Devil Dinosaur', 'Ms. Lion'
  ]
  // Barajar los nombres para que sean aleatorios
  const shuffled = nombresMascotas.sort(() => 0.5 - Math.random())
  const mascotasBase = shuffled.map(nombre => ({ nombre, heroe: null }))
  await Mascota.insertMany(mascotasBase)
  res.json({ mensaje: '30 mascotas aleatorias insertadas.' })
})

// Adoptar mascota (solo usuario autenticado)
router.post('/mascotas/:id/adoptar', authMiddleware, async (req, res) => {
  const mascota = await getMascotaById(req.params.id)
  if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })
  if (mascota.adoptadaPor) return res.status(400).json({ error: 'Mascota ya adoptada' })
  mascota.adoptadaPor = req.usuario.id
  await mascota.save()
  // Agregar la mascota al usuario
  const Usuario = (await import('../models/Usuario.js')).default
  const usuarios = Usuario.getAll()
  const usuario = usuarios.find(u => u.id === req.usuario.id)
  if (usuario) {
    usuario.mascotasAdoptadas.push(mascota.id)
    Usuario.saveAll(usuarios)
  }
  res.json({ mascota })
})

export default router 