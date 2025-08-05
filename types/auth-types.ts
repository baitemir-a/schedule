import {Request} from 'express';
export interface AuthenticatedRequest extends Request {
    user: {
        uuid: string;
        role: string;
        email: string;
        iat?: number;
        exp?: number;
    };
}
