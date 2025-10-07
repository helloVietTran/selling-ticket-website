import { NextFunction, Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AppDataSource } from '../config/data-source';
import { Role } from '../types/enum';
import { config } from '../config/config';
import { User } from '../models/User.model';
import { DisabledToken } from '../models/DisabledToken.model';
import { LoginInput, LogoutInput, RegisterInput } from '../validators/auth.validate';
import { BaseResponse, LoginOutput } from '../types/response.type';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';

export class AuthController {
  private userRepo = AppDataSource.getRepository(User);
  private disabledTokenRepo = AppDataSource.getRepository(DisabledToken);

  register: RequestHandler = async (
    req: Request<{}, RegisterInput>,
    res: Response<BaseResponse<{}>>,
    next: NextFunction
  ) => {
    try {
      const { email, userName, password } = req.body;

      const existedUser = await this.userRepo.findOne({ where: { email } });
      if (existedUser) {
        throw AppError.fromErrorCode(ErrorMap.USER_ALREADY_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepo.create({
        email,
        userName,
        passwordHash: hashedPassword,
        roles: Role.User
      });

      await this.userRepo.save(newUser);

      return res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
      next(error);
    }
  };

  login: RequestHandler = async (
    req: Request<{}, LoginInput>,
    res: Response<BaseResponse<LoginOutput>>,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw AppError.fromErrorCode(ErrorMap.PASSWORD_INCORRECT);
      }

      const token = jwt.sign({ id: user.id, roles: user.roles }, config.jwt_secret, { expiresIn: '30m' });

      return res.status(200).json({
        message: 'Đăng nhập thành công',
        data: {
          user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            roles: user.roles
          },
          accessToken: token
        }
      });
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

      const disabledToken = this.disabledTokenRepo.create({
        token: accessToken,
        expiresAt
      });

      await this.disabledTokenRepo.save(disabledToken);

      return res.status(200).json({ message: 'Đăng xuất thành công, token đã bị vô hiệu hóa.' });
    } catch (error) {
      next(error);
    }
  };

  verifyToken = (req: Request, res: Response<BaseResponse<{}>>, next: NextFunction) => {
    try {
      const token = req.body.accessToken;
      if (!token) {
        throw AppError.fromErrorCode(ErrorMap.NOT_FOUND_TOKEN);
      }

      const decoded = jwt.verify(token, config.jwt_secret);

      return res.status(200).json({
        message: 'Token hợp lệ',
        data: decoded
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
