import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { Requester } from '../types/request';

dotenv.config();

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // verify token
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decodedPayload) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const requester = decodedPayload as Requester;

    res.locals['requester'] = requester;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err });
  }
};

// const requester = res.locals.requester;
