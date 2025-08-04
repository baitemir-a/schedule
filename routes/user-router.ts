import {Router} from "express";
import userController from "../controller/user-controller";

const userRouter = Router();

userRouter.post('/', userController.createUser)

export default userRouter;