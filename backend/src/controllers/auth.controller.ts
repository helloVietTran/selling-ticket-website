import { NextFunction, Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { Role } from '../types/enum';
import { config } from '../config/config';
import { User } from '../models/User.model';
import { DisabledToken } from '../models/DisabledToken.model';
import { LoginInput, LogoutInput, RegisterInput } from '../validators/auth.validate';
import { BaseResponse } from '../types/response.type';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';

class AuthController {
  register: RequestHandler = async (
    req: Request<{}, RegisterInput>,
    res: Response<BaseResponse<{}>>,
    next: NextFunction
  ) => {
    try {
      const { email, userName, password } = req.body;
      const userRepo = AppDataSource.getRepository(User);

      const existedUser = await userRepo.findOne({ where: { email } });
      if (existedUser) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = userRepo.create({
        email: email,
        userName: userName,
        passwordHash: hashedPassword,
        roles: Role.User
      });

      await userRepo.save(newUser);

      return res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
      next(error);
    }
  };
  login: RequestHandler = async (req: Request<{}, LoginInput>, res: Response<BaseResponse<{}>>, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({ where: { email } });
      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_ALREADY_EXISTS);
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw AppError.fromErrorCode(ErrorMap.PASSWORD_INCORRECT);
      }

      const token = jwt.sign({ id: user.id, roles: user.roles }, config.jwt_secret, {
        expiresIn: '30m'
      });

      return res.status(200).json({ message: 'Đăng nhập thành công', accessToken: token });
    } catch (error) {
      next(error);
    }
  };

  logout: RequestHandler = async (
    req: Request<{}, LogoutInput>,
    res: Response<BaseResponse<{}>>,
    next: NextFunction
  ) => {
    try {
      const { accessToken } = req.body;
      const decoded = jwt.verify(accessToken, config.jwt_secret as string) as {
        id: number;
        role: string;
        exp: number;
      };

      const expiresAt = new Date(decoded.exp * 1000);

      const repo = AppDataSource.getRepository(DisabledToken);

      const disabledToken = repo.create({
        token: accessToken,
        expiresAt
      });

      await repo.save(disabledToken);

      return res.status(200).json({ message: 'Đăng xuất thành công, token đã bị vô hiệu hóa.' });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
