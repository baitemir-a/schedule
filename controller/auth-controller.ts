import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user-model';
import dotenv from 'dotenv';

dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'your_secret_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_secret_key';


class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        const {email, password} = req.body;
        try {
            const user = await User.findOne({where: {email}});
            if (!user || !(await user.comparePassword(password))) {
                res.status(401).json({message: 'Invalid credentials'});
                return;
            }
            const {uuid, role} = user;            
            const accessToken = jwt.sign({uuid, role}, ACCESS_SECRET, {expiresIn: '15m'});
            const refreshToken = jwt.sign({uuid, role}, REFRESH_SECRET, {expiresIn: '7d'});
            res
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true, // only over HTTPS
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                })
                .json({accessToken});
        } catch (err) {
            res.status(500).json({message: 'Login error', error: err});
        }
    }

    async refresh(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies.refreshToken;
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            if (typeof decoded  === 'string') return
            const newAccessToken = jwt.sign({uuid: decoded.uuid, role: decoded.role}, ACCESS_SECRET, {expiresIn: '15m'});
            res.json({accessToken: newAccessToken});
        } catch (err) {
            res.status(401).json({message: {...req}});
        }
    }
    async logout(_:Request, res: Response): Promise<void> {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.json({ message: 'Logged out' });
    }
}

export default new AuthController();
