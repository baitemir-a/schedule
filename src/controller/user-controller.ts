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
        const avatar = req.file ? `/uploads/${req.file.filename}` : null;
        try {
            const newUser = await User.create({ name, role, email, password, avatar });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }
    async getUserById(req:Request<{uuid:string}, {}, {}>, res:Response): Promise<void>{
        const { uuid } = req.params;
        try {
            const user = await User.findByPk(uuid);
            if (user) {
                res.status(200).json(user);
            }
            else{
                res.status(404).json({message: 'User not found'})
            }
        } catch (error) {
            res.status(500).json({ message: 'Error finding user', error });
        }
    }
    async getUserList(req:Request, res:Response): Promise<void>{
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error finding users', error });
        }
    }
    async deleteUser(req:Request<{uuid:string}, {}, {}>, res:Response): Promise<void>{
        const { uuid } = req.params;
        try {
            const result = await User.destroy({where: {uuid}});
            if(result === 0){
                res.status(400).json({message: `Bad request`})
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error finding users', error });
        }
    }
    async updateUser(req:Request<{uuid:string}, {}, CreateUserDto>, res:Response): Promise<void>{
        const { name, role, email, password } = req.body;
        const { uuid } = req.params;
        try {
            const result = await User.update({ name, role, email, password }, {where: {uuid}});
            if(result[0] === 0){
                res.status(400).json({message: `Bad request`})
            }
            const updatedUser = await User.findByPk(uuid)
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }
}
export default new UserController();