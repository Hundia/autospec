import 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}
