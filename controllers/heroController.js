import { Router } from 'express'
import {
  getAllHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero
} from '../services/heroService.js'
import { getMascotaById } from '../services/mascotaService.js'
const router = Router()

/**
 * @swagger
 * tags:
 *   name: Heroes
 *   description: Gestión de superhéroes
 */

/**
 * @swagger
 * /api/heroes:
 *   get:
 *     summary: Obtener todos los superhéroes
 *     tags: [Heroes]
 *     responses:
 *       200:
 *         description: Lista de superhéroes
 */
router.get('/heroes', (req, res) => {
  res.json(getAllHeroes())
})

/**
 * @swagger
 * /api/heroes/{id}:
 *   get:
 *     summary: Obtener un superhéroe por ID
 *     tags: [Heroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del superhéroe
 *     responses:
 *       200:
 *         description: Superhéroe encontrado
 *       404:
 *         description: Superhéroe no encontrado
 */
router.get('/heroes/:id', (req, res) => {
  const hero = getHeroById(parseInt(req.params.id))
  if (!hero) return res.status(404).json({ error: 'No encontrado' })
  res.json(hero)
})

/**
 * @swagger
 * /api/heroes:
 *   post:
 *     summary: Crear un nuevo superhéroe
 *     tags: [Heroes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Superhéroe creado
 */
router.post('/heroes', (req, res) => {
  const { nombre } = req.body
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' })
  const nuevo = createHero(nombre)
  res.status(201).json(nuevo)
})

/**
 * @swagger
 * /api/heroes/{id}:
 *   put:
 *     summary: Actualizar un superhéroe
 *     tags: [Heroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Superhéroe actualizado
 *       404:
 *         description: Superhéroe no encontrado
 */
router.put('/heroes/:id', (req, res) => {
  const { nombre } = req.body
  const hero = updateHero(parseInt(req.params.id), nombre)
  if (!hero) return res.status(404).json({ error: 'No encontrado' })
  res.json(hero)
})

/**
 * @swagger
 * /api/heroes/{id}:
 *   delete:
 *     summary: Eliminar un superhéroe
 *     tags: [Heroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del superhéroe
 *     responses:
 *       204:
 *         description: Superhéroe eliminado
 *       404:
 *         description: Superhéroe no encontrado
 */
router.delete('/heroes/:id', (req, res) => {
  const ok = deleteHero(parseInt(req.params.id))
  if (!ok) return res.status(404).json({ error: 'No encontrado' })
  res.status(204).send()
})

/**
 * @swagger
 * /api/heroes/{id}/adoptar:
 *   post:
 *     summary: Un superhéroe adopta una mascota por ID
 *     tags: [Heroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mascotaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mascota adoptada
 *       404:
 *         description: Superhéroe o mascota no encontrada
 *       400:
 *         description: Mascota ya adoptada
 */
router.post('/heroes/:id/adoptar', (req, res) => {
  const hero = getHeroById(parseInt(req.params.id))
  if (!hero) return res.status(404).json({ error: 'Superhéroe no encontrado' })
  const { mascotaId } = req.body
  const mascota = getMascotaById(mascotaId)
  if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })
  if (mascota.heroe) return res.status(400).json({ error: 'Mascota ya adoptada' })
  mascota.heroe = hero.nombre || hero.name || hero.alias
  res.json({ heroe: hero, mascota })
})

/**
 * @swagger
 * /api/heroes/{id}/abandonar:
 *   post:
 *     summary: Un superhéroe abandona su mascota por ID
 *     tags: [Heroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mascotaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mascota abandonada
 *       404:
 *         description: Superhéroe o mascota no encontrada
 *       400:
 *         description: Esta mascota no pertenece a este héroe
 */
router.post('/heroes/:id/abandonar', (req, res) => {
  const hero = getHeroById(parseInt(req.params.id))
  if (!hero) return res.status(404).json({ error: 'Superhéroe no encontrado' })
  const { mascotaId } = req.body
  const mascota = getMascotaById(mascotaId)
  if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })
  if (mascota.heroe !== (hero.nombre || hero.name || hero.alias)) return res.status(400).json({ error: 'Esta mascota no pertenece a este héroe' })
  mascota.heroe = null
  res.json({ heroe: hero, mascota })
})

export default router 