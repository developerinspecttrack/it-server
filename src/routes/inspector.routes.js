import express from 'express';
import inspectorController from '../controllers/inspector/inspector.controller.js';

const inspectorRoutes = express.Router();

/**
 * @swagger
 * /api/inspector/register:
 *   post:
 *     summary: Register a new inspector
 *     tags: [Inspectors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inspector registered successfully
 *       400:
 *         description: Bad request
 */
inspectorRoutes.post("/register", inspectorController.registerInspector);

export default inspectorRoutes;