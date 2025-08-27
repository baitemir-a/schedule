import { Router } from "express";
import userController from "../controller/user-controller";
import { authenticate } from "../middleware/auth-middleware";
import { checkRole } from "../middleware/role-middleware";
import { upload } from "../middleware/upload-middleware";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The created user
 */
userRouter.post('/', upload.single('avatar'), userController.createUser)

/**
 * @swagger
 * /users/{uuid}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: User UUID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
userRouter.get('/:uuid', authenticate, userController.getUserById)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
userRouter.get('/', checkRole(['admin']), userController.getUserList)

/**
 * @swagger
 * /users/{uuid}:
 *   delete:
 *     summary: Delete a user by UUID
 *     tags: [Users]
 */
userRouter.delete('/:uuid', checkRole(['admin']), userController.deleteUser)

/**
 * @swagger
 * /users/{uuid}:
 *   patch:
 *     summary: Update a user by UUID
 *     tags: [Users]
 */
userRouter.patch('/:uuid', checkRole(['admin']), userController.updateUser)

export default userRouter;
