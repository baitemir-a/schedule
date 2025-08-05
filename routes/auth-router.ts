import {Router} from "express";
import authController from '../controller/auth-controller';

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);

export default authRouter;
