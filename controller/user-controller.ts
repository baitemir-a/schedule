import User from "../model/user-model";
import { Request, Response } from 'express';
interface CreateUserDto {
    name: string;
    role: string;
    email: string;
    password: string;
}
class UserController {
    async createUser(req:Request<{}, {}, CreateUserDto>, res:Response): Promise<void>{
        const { name, role, email, password } = req.body;
        try {
            const newUser = await User.create({ name, role, email, password });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }
}
export default new UserController();