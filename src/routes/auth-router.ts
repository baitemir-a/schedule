import {Router} from "express";
import authController from '../controller/auth-controller';
import { authenticate } from "../middleware/auth-middleware";

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/isauth', authenticate, authController.isAuth);

export default authRouter;
