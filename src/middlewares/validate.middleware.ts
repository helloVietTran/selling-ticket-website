import { ZodObject, ZodError, ZodRawShape } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: err.issues
      });
    }
    next(err);
  }
};
