import User from "../model/user-model";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth-types";
interface CreateUserDto {
  name: string;
  role: string;
  email: string;
  password: string;
}
class UserController {
  async createUser(
    req: Request<{}, {}, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const { name, role, email, password } = req.body;
    try {
      const avatar = req.file ? `/uploads/${req.file.filename}` : null;
      const newUser = await User.create({
        name,
        role,
        email,
        password,
        avatar,
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }
  async getUserById(
    req: Request<{ uuid: string }, {}, {}>,
    res: Response
  ): Promise<void> {
    const { uuid } = req.params;
    try {
      const user = await User.findByPk(uuid);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error finding user", error });
    }
  }
  async getUserList(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.query;
      const users = await User.findAll({ where: { role } });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error finding users", error });
    }
  }
  async deleteUser(
    req: Request<{ uuid: string }, {}, {}>,
    res: Response
  ): Promise<void> {
    const { uuid } = req.params;
    try {
      const result = await User.destroy({ where: { uuid } });
      if (result === 0) {
        res.status(400).json({ message: `Bad request` });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error finding users", error });
    }
  }
  async updateUser(
    req: Request<{ uuid: string }, {}, CreateUserDto>,
    res: Response
  ): Promise<void> {
    console.log(req.body);
    const { name, role, email, password } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    const { uuid } = req.params;
    try {
      console.log(req.body);
      const result = await User.update(
        { name, role, email, password, avatar },
        { where: { uuid } }
      );
      if (result[0] === 0) {
        res.status(400).json({ message: `Bad request` });
      }
      const updatedUser = await User.findByPk(uuid);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }
      const user = await User.findByPk(req.user.uuid);
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "User not found", uuid: req.user.uuid });
      }
    } catch (error) {
      res.status(500).json({ message: "Error finding user profile", error });
    }
  }
}
export default new UserController();
