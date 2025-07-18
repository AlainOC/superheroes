import { Router } from 'express'
import {
  getAllHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero
} from '../services/heroService.js'
import { getMascotaById, updateMascota } from '../services/mascotaService.js'
import Hero from '../models/Hero.js'
import mongoose from 'mongoose'
import { authMiddleware } from './usuarioController.js'
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
// Obtener todos los héroes
router.get('/heroes', authMiddleware, async (req, res) => {
  const heroes = await getAllHeroes()
  res.json(heroes)
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
// Obtener un héroe por ID
router.get('/heroes/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const hero = await getHeroById(id)
  if (!hero) return res.status(404).json({ error: 'Héroe no encontrado' })
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
// Crear nuevo héroe
router.post('/heroes', authMiddleware, async (req, res) => {
  const { nombre, alias, city, team } = req.body
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' })
  const nuevo = await createHero(nombre, alias, city, team)
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
// Actualizar héroe
router.put('/heroes/:id', authMiddleware, async (req, res) => {
  const { nombre, alias, city, team } = req.body
  const hero = await updateHero(req.params.id, nombre, alias, city, team)
  if (!hero) return res.status(404).json({ error: 'Superhéroe no encontrado' })
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
// Eliminar héroe
router.delete('/heroes/:id', authMiddleware, async (req, res) => {
  const ok = await deleteHero(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Superhéroe no encontrado' })
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
// Adoptar mascota
router.post('/heroes/:id/adoptar', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const hero = await getHeroById(id)
  if (!hero) return res.status(404).json({ error: 'Superhéroe no encontrado' })
  const { mascotaId } = req.body
  const mascota = await getMascotaById(mascotaId)
  if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })
  if (mascota.heroe) return res.status(400).json({ error: 'Mascota ya adoptada' })
  mascota.heroe = hero.nombre || hero.name || hero.alias
  await mascota.save()
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
// Abandonar mascota
router.post('/heroes/:id/abandonar', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const hero = await getHeroById(id)
  if (!hero) return res.status(404).json({ error: 'Superhéroe no encontrado' })
  const { mascotaId } = req.body
  const mascota = await getMascotaById(mascotaId)
  if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })
  if (mascota.heroe !== (hero.nombre || hero.name || hero.alias)) return res.status(400).json({ error: 'Esta mascota no pertenece a este héroe' })
  mascota.heroe = null
  await mascota.save()
  res.json({ heroe: hero, mascota })
})

// Endpoint para poblar la base de datos con 10 héroes de ejemplo
router.post('/heroes/poblar', async (req, res) => {
  const heroesBase = [
    { nombre: 'Clark Kent', alias: 'Superman', city: 'Metrópolis', team: 'Liga de la Justicia' },
    { nombre: 'Tony Stark', alias: 'Iron Man', city: 'Nueva York', team: 'Los Vengadores' },
    { nombre: 'Bruce Wayne', alias: 'Batman', city: 'Gotham City', team: 'Liga de la Justicia' },
    { nombre: 'Steve Rogers', alias: 'Capitán América', city: 'Nueva York', team: 'Los Vengadores' },
    { nombre: 'Diana Prince', alias: 'Mujer Maravilla', city: 'Themyscira', team: 'Liga de la Justicia' },
    { nombre: 'Peter Parker', alias: 'Spider-Man', city: 'Nueva York', team: 'Ninguno' },
    { nombre: 'Barry Allen', alias: 'Flash', city: 'Central City', team: 'Liga de la Justicia' },
    { nombre: 'Natasha Romanoff', alias: 'Viuda Negra', city: 'Moscú', team: 'Los Vengadores' },
    { nombre: 'Hal Jordan', alias: 'Linterna Verde', city: 'Coast City', team: 'Liga de la Justicia' },
    { nombre: 'Wanda Maximoff', alias: 'Bruja Escarlata', city: 'Transia', team: 'Los Vengadores' }
  ]
  const existentes = await Hero.countDocuments()
  if (existentes >= 10) {
    return res.json({ mensaje: 'Ya existen héroes en la base de datos.' })
  }
  await Hero.insertMany(heroesBase)
  res.json({ mensaje: 'Héroes de ejemplo insertados.' })
})

// Endpoint para poblar la base de datos con 30 héroes personalizados
router.post('/heroes/poblar30', async (req, res) => {
  const heroesBase = [
    { nombre: 'Clark Kent', alias: 'Superman', city: 'Metrópolis', team: 'Liga de la Justicia' },
    { nombre: 'Tony Stark', alias: 'Iron Man', city: 'Nueva York', team: 'Los Vengadores' },
    { nombre: 'Bruce Wayne', alias: 'Batman', city: 'Gotham City', team: 'Liga de la Justicia' },
    { nombre: 'Steve Rogers', alias: 'Capitán América', city: 'Nueva York', team: 'Los Vengadores' },
    { nombre: 'Diana Prince', alias: 'Mujer Maravilla', city: 'Themyscira', team: 'Liga de la Justicia' },
    { nombre: 'Thor Odinson', alias: 'Thor', city: 'Asgard', team: 'Los Vengadores' },
    { nombre: 'Barry Allen', alias: 'Flash', city: 'Central City', team: 'Liga de la Justicia' },
    { nombre: 'Bruce Banner', alias: 'Hulk', city: 'Dayton', team: 'Los Vengadores' },
    { nombre: 'Arthur Curry', alias: 'Aquaman', city: 'Atlantis', team: 'Liga de la Justicia' },
    { nombre: 'Peter Parker', alias: 'Spider-Man', city: 'Nueva York', team: 'Ninguno' },
    { nombre: 'Hal Jordan', alias: 'Linterna Verde', city: 'Coast City', team: 'Liga de la Justicia' },
    { nombre: 'Natasha Romanoff', alias: 'Viuda Negra', city: 'Moscú', team: 'Los Vengadores' },
    { nombre: 'Oliver Queen', alias: 'Green Arrow', city: 'Star City', team: 'Liga de la Justicia' },
    { nombre: 'Clint Barton', alias: 'Ojo de Halcón', city: 'Waverly', team: 'Los Vengadores' },
    { nombre: 'Victor Stone', alias: 'Cyborg', city: 'Detroit', team: 'Liga de la Justicia' },
    { nombre: 'Stephen Vincent Strange', alias: 'Doctor Strange', city: 'Nueva York', team: 'Los Vengadores' },
    { nombre: 'Billy Batson', alias: 'Shazam', city: 'Fawcett City', team: 'Liga de la Justicia' },
    { nombre: "T'Challa", alias: 'Black Panther', city: 'Wakanda', team: 'Los Vengadores' },
    { nombre: 'Kara Danvers', alias: 'Supergirl', city: 'National City', team: 'Ninguno' },
    { nombre: 'Wanda Maximoff', alias: 'Bruja Escarlata', city: 'Transia', team: 'Los Vengadores' },
    { nombre: 'Dick Grayson', alias: 'Nightwing', city: 'Blüdhaven', team: 'Ninguno' },
    { nombre: 'Charles Xavier', alias: 'Profesor X', city: 'Salem Center', team: 'X-Men' },
    { nombre: 'Barbara Gordon', alias: 'Batgirl', city: 'Gotham City', team: 'Birds of Prey' },
    { nombre: 'James Howlett', alias: 'Wolverine', city: 'Canadá', team: 'X-Men' },
    { nombre: "J'onn J'onzz", alias: 'Detective Marciano', city: 'Ninguna', team: 'Liga de la Justicia' },
    { nombre: 'Ororo Munroe', alias: 'Tormenta', city: 'El Cairo', team: 'X-Men' },
    { nombre: 'Kate Kane', alias: 'Batwoman', city: 'Gotham City', team: 'Ninguno' },
    { nombre: 'Scott Summers', alias: 'Cíclope', city: 'Anchorage', team: 'X-Men' },
    { nombre: 'Kyle Rayner', alias: 'Linterna Verde', city: 'Los Ángeles', team: 'Liga de la Justicia' },
    { nombre: 'Jean Grey', alias: 'Fénix', city: 'Annandale-on-Hudson', team: 'X-Men' }
  ];
  const existentes = await Hero.countDocuments();
  if (existentes >= 30) {
    return res.json({ mensaje: 'Ya existen 30 o más héroes en la base de datos.' });
  }
  await Hero.insertMany(heroesBase);
  res.json({ mensaje: '30 héroes insertados.' });
});

export default router 