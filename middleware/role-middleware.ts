import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: missing Bearer token" });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string) as { role?: string };
            if (!decoded.role || !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: insufficient role" });
            }
            (req as any).user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized: invalid token", error: err});
        }
    };
};
