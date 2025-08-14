import { Request } from 'express';

export interface AuthenticatedRequest<
  P = {},
  ResBody = any,
  ReqBody = any, 
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    uuid: string;
    role: string;
    email: string;
    iat?: number;
    exp?: number;
  };
}
