import {NextFunction, Request, RequestHandler, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {AuthenticatedRequest} from '../types/auth-types';
import dotenv from 'dotenv';

dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'your_secret_key';

interface TokenPayload extends JwtPayload {
    uuid: string;
    role: string;
    email: string;
}

export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: missing Bearer token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        (req as AuthenticatedRequest).user = jwt.verify(token, ACCESS_SECRET) as TokenPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
    }
};
