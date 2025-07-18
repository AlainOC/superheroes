import { Router } from 'express';
import Mascota from '../models/Mascota.js';
import { authMiddleware } from './usuarioController.js';

const router = Router();

/**
 * @swagger
 * /api/mascotas/adoptadas:
 *   get:
 *     summary: Obtener todas las mascotas adoptadas
 *     tags: [Mascotas]
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas
 */
router.get('/mascotas/adoptadas', authMiddleware, async (req, res) => {
  try {
    const mascotas = await Mascota.find({ adoptadaPor: { $ne: null } });
    res.json(mascotas);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener mascotas adoptadas' });
  }
});

/**
 * @swagger
 * /api/mascotas/mis-adoptadas:
 *   get:
 *     summary: Obtener las mascotas adoptadas por el usuario autenticado
 *     tags: [Mascotas]
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas por el usuario
 */
router.get('/mascotas/mis-adoptadas', authMiddleware, async (req, res) => {
  try {
    const mascotas = await Mascota.find({ adoptadaPor: req.usuario._id.toString() });
    res.json(mascotas);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener tus mascotas adoptadas' });
  }
});

export default router; 