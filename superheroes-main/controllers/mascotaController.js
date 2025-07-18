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
    // Solo selecciona las que tienen adoptadaPor como string no vacío
    const mascotas = await Mascota.find({ adoptadaPor: { $type: 'string', $ne: null, $ne: '' } });
    res.json(Array.isArray(mascotas) ? mascotas : []);
  } catch (e) {
    res.status(200).json([]); // Nunca error 500, siempre array vacío si algo falla
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
    const userId = req.usuario._id.toString();
    const mascotas = await Mascota.find({ adoptadaPor: userId });
    res.json(Array.isArray(mascotas) ? mascotas : []);
  } catch (e) {
    res.status(200).json([]); // Nunca error 500, siempre array vacío si algo falla
  }
});

/**
 * @swagger
 * /api/mascotas/{id}/adoptar:
 *   post:
 *     summary: Adoptar una mascota (usuario autenticado)
 *     tags: [Mascotas]
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota adoptada
 *       400:
 *         description: Mascota ya adoptada
 *       404:
 *         description: Mascota no encontrada
 */
router.post('/mascotas/:id/adoptar', authMiddleware, async (req, res) => {
  try {
    const mascota = await Mascota.findOne({ id: Number(req.params.id) });
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    if (mascota.adoptadaPor) return res.status(400).json({ error: 'Mascota ya adoptada' });
    mascota.adoptadaPor = req.usuario._id.toString();
    await mascota.save();
    res.json({ mascota });
  } catch (e) {
    res.status(500).json({ error: 'Error al adoptar mascota' });
  }
});

export default router; 