import {Router} from "express";
import userController from "../controller/user-controller";
import {authenticate} from "../middleware/auth-middleware";
import {checkRole} from "../middleware/role-middleware";

const userRouter = Router();

userRouter.post('/', checkRole(['admin']), userController.createUser)
userRouter.get('/:uuid', authenticate, userController.getUserById)
userRouter.get('/', checkRole(['admin']), userController.getUserList)
userRouter.delete('/:uuid', checkRole(['admin']), userController.deleteUser)
userRouter.patch('/:uuid', checkRole(['admin']), userController.updateUser)

export default userRouter;