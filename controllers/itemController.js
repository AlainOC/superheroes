import { Router } from 'express'
import Item from '../models/Item.js'
import { authMiddleware } from './usuarioController.js'
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from '../services/itemService.js'
const router = Router()

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Gestión de items personalizables para mascotas
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Obtener todos los items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Lista de items
 */
router.get('/items', authMiddleware, async (req, res) => {
  const items = await getAllItems()
  res.json(items)
})

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Obtener un item por ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del item
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: Item no encontrado
 */
router.get('/items/:id', authMiddleware, async (req, res) => {
  const item = await getItemById(req.params.id)
  if (!item) return res.status(404).json({ error: 'Item no encontrado' })
  res.json(item)
})

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Crear un nuevo item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Collar
 *               tipo:
 *                 type: string
 *                 enum: [free, pay]
 *                 example: free
 *     responses:
 *       201:
 *         description: Item creado
 */
router.post('/items', authMiddleware, async (req, res) => {
  const { nombre, tipo } = req.body
  if (!nombre || !tipo) return res.status(400).json({ error: 'Nombre y tipo requeridos' })
  const nuevo = await createItem(nombre, tipo)
  res.status(201).json(nuevo)
})

// Endpoint para poblar la base de datos con 30 items iniciales
router.post('/items/poblar', async (req, res) => {
  const itemsBase = [
    { nombre: 'Collar', tipo: 'free' },
    { nombre: 'Capa', tipo: 'pay' },
    { nombre: 'Gafas', tipo: 'free' },
    { nombre: 'Botas', tipo: 'pay' },
    { nombre: 'Sombrero', tipo: 'free' },
    { nombre: 'Chaleco', tipo: 'pay' },
    { nombre: 'Correa', tipo: 'free' },
    { nombre: 'Arnés', tipo: 'pay' },
    { nombre: 'Pañuelo', tipo: 'free' },
    { nombre: 'Medalla', tipo: 'pay' },
    { nombre: 'Guantes', tipo: 'free' },
    { nombre: 'Escudo', tipo: 'pay' },
    { nombre: 'Cinturón', tipo: 'free' },
    { nombre: 'Mochila', tipo: 'pay' },
    { nombre: 'Reloj', tipo: 'free' },
    { nombre: 'Camiseta', tipo: 'pay' },
    { nombre: 'Bufanda', tipo: 'free' },
    { nombre: 'Peto', tipo: 'pay' },
    { nombre: 'Cubreorejas', tipo: 'free' },
    { nombre: 'Capa mágica', tipo: 'pay' },
    { nombre: 'Zapatos', tipo: 'free' },
    { nombre: 'Chaleco reflectante', tipo: 'pay' },
    { nombre: 'Gorra', tipo: 'free' },
    { nombre: 'Cintillo', tipo: 'pay' },
    { nombre: 'Cubrecola', tipo: 'free' },
    { nombre: 'Capa de invisibilidad', tipo: 'pay' },
    { nombre: 'Lentes de sol', tipo: 'free' },
    { nombre: 'Chaleco antibalas', tipo: 'pay' },
    { nombre: 'Capa de vuelo', tipo: 'pay' },
    { nombre: 'Capa de supervelocidad', tipo: 'pay' }
  ]
  const existentes = await Item.countDocuments()
  if (existentes >= 30) {
    return res.json({ mensaje: 'Ya existen items en la base de datos.' })
  }
  await Item.insertMany(itemsBase)
  res.json({ mensaje: 'Items iniciales insertados.' })
})

// Endpoint para poblar la base de datos con 30 items de ejemplo
router.post('/items/poblar30', async (req, res) => {
  const itemsBase = [
    { nombre: 'Collar', tipo: 'free' },
    { nombre: 'Capa', tipo: 'pay' },
    { nombre: 'Gafas', tipo: 'free' },
    { nombre: 'Botas', tipo: 'pay' },
    { nombre: 'Sombrero', tipo: 'free' },
    { nombre: 'Chaleco', tipo: 'pay' },
    { nombre: 'Correa', tipo: 'free' },
    { nombre: 'Arnés', tipo: 'pay' },
    { nombre: 'Pañuelo', tipo: 'free' },
    { nombre: 'Medalla', tipo: 'pay' },
    { nombre: 'Guantes', tipo: 'free' },
    { nombre: 'Escudo', tipo: 'pay' },
    { nombre: 'Cinturón', tipo: 'free' },
    { nombre: 'Mochila', tipo: 'pay' },
    { nombre: 'Reloj', tipo: 'free' },
    { nombre: 'Camiseta', tipo: 'pay' },
    { nombre: 'Bufanda', tipo: 'free' },
    { nombre: 'Peto', tipo: 'pay' },
    { nombre: 'Cubreorejas', tipo: 'free' },
    { nombre: 'Capa mágica', tipo: 'pay' },
    { nombre: 'Zapatos', tipo: 'free' },
    { nombre: 'Chaleco reflectante', tipo: 'pay' },
    { nombre: 'Gorra', tipo: 'free' },
    { nombre: 'Cintillo', tipo: 'pay' },
    { nombre: 'Cubrecola', tipo: 'free' },
    { nombre: 'Capa de invisibilidad', tipo: 'pay' },
    { nombre: 'Lentes de sol', tipo: 'free' },
    { nombre: 'Chaleco antibalas', tipo: 'pay' },
    { nombre: 'Capa de vuelo', tipo: 'pay' },
    { nombre: 'Capa de supervelocidad', tipo: 'pay' }
  ]
  const existentes = await Item.countDocuments()
  if (existentes >= 30) {
    return res.json({ mensaje: 'Ya existen 30 o más items en la base de datos.' })
  }
  await Item.insertMany(itemsBase)
  res.json({ mensaje: '30 items de ejemplo insertados.' })
})

export default router 