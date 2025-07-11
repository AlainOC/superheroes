import { Router } from 'express'
import {
  getAllMascotas,
  getMascotaById,
  createMascota,
  updateMascota,
  deleteMascota
} from '../services/mascotaService.js'
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
router.get('/mascotas', (req, res) => {
  res.json(getAllMascotas())
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
router.get('/mascotas/:id', (req, res) => {
  const mascota = getMascotaById(parseInt(req.params.id))
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
router.post('/mascotas', (req, res) => {
  const { nombre, heroe } = req.body
  if (!nombre || !heroe) return res.status(400).json({ error: 'Nombre y héroe requeridos' })
  const nueva = createMascota(nombre, heroe)
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
router.put('/mascotas/:id', (req, res) => {
  const { nombre, heroe } = req.body
  const mascota = updateMascota(parseInt(req.params.id), nombre, heroe)
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
router.delete('/mascotas/:id', (req, res) => {
  const ok = deleteMascota(parseInt(req.params.id))
  if (!ok) return res.status(404).json({ error: 'No encontrada' })
  res.status(204).send()
})

export default router 