import { Router } from "express";
import journalController from "../controller/journal-controller";
import { authenticate } from "../middleware/auth-middleware";
import { checkRole } from "../middleware/role-middleware";

const journalRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Journal
 *   description: Attendance journal management
 */

/**
 * @swagger
 * /journal/first/{date}:
 *   post:
 *     summary: Init arrival for today using QR code
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date for the QR code
 *     responses:
 *       201:
 *         description: Arrival inited, returns journal uuid
 *       400:
 *         description: QR code invalid or expired
 */
journalRouter.post('/first/:date', authenticate, journalController.first);

/**
 * @swagger
 * /journal/second/{uuid}:
 *   post:
 *     summary: Mark arrival using QR code
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: Journal entry UUID
 *     responses:
 *       200:
 *         description: Arrival recorded
 *       400:
 *         description: QR code invalid or user mismatch
 *       404:
 *         description: Journal not found
 */
journalRouter.post('/second/:uuid', authenticate, journalController.second);

/**
 * @swagger
 * /journal:
 *   get:
 *     summary: Get all journal entries (admin only)
 *     tags: [Journal]
 *     responses:
 *       200:
 *         description: List of journals
 */
journalRouter.get('/', checkRole(['admin']), journalController.getList);

/**
 * @swagger
 * /journal:
 *   get:
 *     summary: Get all journal entries (admin only)
 *     tags: [Journal]
 *     responses:
 *       200:
 *         description: List of journals
 */
journalRouter.delete('/clear', checkRole(['admin']), journalController.clear);

/**
 * @swagger
 * /journal/{uuid}:
 *   get:
 *     summary: Get a journal entry by UUID (admin only)
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Journal entry found
 *       404:
 *         description: Journal not found
 */
journalRouter.get('/:uuid', checkRole(['admin']), journalController.getById);

/**
 * @swagger
 * /journal/user/{uuid}:
 *   get:
 *     summary: Get a journal entry by user UUID (admin only)
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Journal entry found
 *       404:
 *         description: Journal not found
 */
journalRouter.get('/user/:uuid', checkRole(['admin']), journalController.getByUserId);

/**
 * @swagger
 * /journal/note/{uuid}:
 *   patch:
 *     summary: Add or update a note for a journal entry (admin only)
 *     tags: [Journal]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: Journal entry UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *             required:
 *               - note
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Journal not found
 */
journalRouter.patch('/note/:uuid', checkRole(['admin']), journalController.note);

export default journalRouter;
