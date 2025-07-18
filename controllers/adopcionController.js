import { Router } from 'express';
import Mascota from '../models/Mascota.js';
import Usuario from '../models/Usuario.js';
import { authMiddleware } from './usuarioController.js';

const router = Router();

/**
 * @swagger
 * /api/adopcion/disponibles:
 *   get:
 *     summary: Obtener todas las mascotas disponibles para adopción
 *     tags: [Adopción]
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Lista de mascotas disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 */
router.get('/adopcion/disponibles', authMiddleware, async (req, res) => {
  try {
    const mascotas = await Mascota.find({ adoptadaPor: null });
    res.json(mascotas || []);
  } catch (e) {
    console.error('Error al obtener mascotas disponibles:', e);
    res.status(200).json([]);
  }
});

/**
 * @swagger
 * /api/adopcion/adoptadas:
 *   get:
 *     summary: Obtener todas las mascotas adoptadas
 *     tags: [Adopción]
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 */
router.get('/adopcion/adoptadas', authMiddleware, async (req, res) => {
  try {
    const mascotas = await Mascota.find({ adoptadaPor: { $ne: null, $ne: '' } });
    res.json(mascotas || []);
  } catch (e) {
    console.error('Error al obtener mascotas adoptadas:', e);
    res.status(200).json([]);
  }
});

/**
 * @swagger
 * /api/adopcion/mis-mascotas:
 *   get:
 *     summary: Obtener mis mascotas adoptadas
 *     tags: [Adopción]
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas por el usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 */
router.get('/adopcion/mis-mascotas', authMiddleware, async (req, res) => {
  try {
    const userId = req.usuario._id.toString();
    const mascotas = await Mascota.find({ adoptadaPor: userId });
    res.json(mascotas || []);
  } catch (e) {
    console.error('Error al obtener mis mascotas:', e);
    res.status(200).json([]);
  }
});

/**
 * @swagger
 * /api/adopcion/adoptar/{id}:
 *   post:
 *     summary: Adoptar una mascota disponible
 *     tags: [Adopción]
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota a adoptar
 *     responses:
 *       200:
 *         description: Mascota adoptada exitosamente
 *       400:
 *         description: Mascota ya adoptada
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/adopcion/adoptar/:id', authMiddleware, async (req, res) => {
  try {
    const mascota = await Mascota.findOne({ id: Number(req.params.id) });
    
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    if (mascota.adoptadaPor) {
      return res.status(400).json({ error: 'Mascota ya adoptada' });
    }
    
    mascota.adoptadaPor = req.usuario._id.toString();
    await mascota.save();
    
    res.json({ 
      mensaje: 'Mascota adoptada exitosamente',
      mascota 
    });
  } catch (e) {
    console.error('Error al adoptar mascota:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/adopcion/abandonar/{id}:
 *   post:
 *     summary: Abandonar una mascota adoptada
 *     tags: [Adopción]
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota a abandonar
 *     responses:
 *       200:
 *         description: Mascota abandonada exitosamente
 *       400:
 *         description: Mascota no adoptada o no pertenece al usuario
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/adopcion/abandonar/:id', authMiddleware, async (req, res) => {
  try {
    const mascota = await Mascota.findOne({ id: Number(req.params.id) });
    
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    
    if (!mascota.adoptadaPor) {
      return res.status(400).json({ error: 'Mascota no está adoptada' });
    }
    
    if (mascota.adoptadaPor !== req.usuario._id.toString()) {
      return res.status(400).json({ error: 'No puedes abandonar una mascota que no adoptaste' });
    }
    
    mascota.adoptadaPor = null;
    await mascota.save();
    
    res.json({ 
      mensaje: 'Mascota abandonada exitosamente',
      mascota 
    });
  } catch (e) {
    console.error('Error al abandonar mascota:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/adopcion/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de adopción
 *     tags: [Adopción]
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Estadísticas de adopción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMascotas:
 *                   type: integer
 *                 mascotasAdoptadas:
 *                   type: integer
 *                 mascotasDisponibles:
 *                   type: integer
 *                 porcentajeAdopcion:
 *                   type: number
 */
router.get('/adopcion/estadisticas', authMiddleware, async (req, res) => {
  try {
    const totalMascotas = await Mascota.countDocuments();
    const mascotasAdoptadas = await Mascota.countDocuments({ adoptadaPor: { $ne: null, $ne: '' } });
    const mascotasDisponibles = totalMascotas - mascotasAdoptadas;
    const porcentajeAdopcion = totalMascotas > 0 ? ((mascotasAdoptadas / totalMascotas) * 100).toFixed(2) : 0;
    
    res.json({
      totalMascotas,
      mascotasAdoptadas,
      mascotasDisponibles,
      porcentajeAdopcion: parseFloat(porcentajeAdopcion)
    });
  } catch (e) {
    console.error('Error al obtener estadísticas:', e);
    res.status(200).json({
      totalMascotas: 0,
      mascotasAdoptadas: 0,
      mascotasDisponibles: 0,
      porcentajeAdopcion: 0
    });
  }
});

export default router; 