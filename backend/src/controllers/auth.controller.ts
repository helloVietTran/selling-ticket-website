import { NextFunction, Request, Response } from 'express';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {}
}

export default new AuthController();
