import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPaylod {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPaylod;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPaylod;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
