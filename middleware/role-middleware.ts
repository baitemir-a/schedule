import {NextFunction, Request, RequestHandler} from "express";
import {AuthenticatedRequest} from "../types/auth-types";
import {Response} from "express";

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: missing Bearer token' });
        }
        const user = (req as AuthenticatedRequest).user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }
        next();
    };
};
