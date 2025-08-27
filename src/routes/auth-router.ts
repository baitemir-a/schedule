import { Router } from "express";
import authController from '../controller/auth-controller';
import { authenticate } from "../middleware/auth-middleware";
import { checkRole } from "../middleware/role-middleware";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful, returns access token and role
 *       400:
 *         description: Invalid email or password
 */
authRouter.post('/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token
 *       401:
 *         description: Invalid or missing refresh token
 */
authRouter.post('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
authRouter.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/isauth:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authenticated
 */
authRouter.get('/isauth', authenticate, authController.isAuth);

/**
 * @swagger
 * /auth/isadmin:
 *   get:
 *     summary: Check if user is admin
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authenticated
 */
authRouter.get('/isadmin', checkRole(['admin']), authController.isAdmin);

export default authRouter;
