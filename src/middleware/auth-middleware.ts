import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest, UserPayload } from '../types/auth-types';
import dotenv from 'dotenv';

dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'your_secret_key';

type AuthMiddleware = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => void;

interface TokenPayload extends JwtPayload, UserPayload {}

export const authenticate: AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: missing Bearer token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as TokenPayload;
    req.user = payload;
    
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
};