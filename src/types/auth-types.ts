import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export interface UserPayload {
  uuid: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest<
  P extends ParamsDictionary = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery extends ParsedQs = ParsedQs
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: UserPayload;
}
