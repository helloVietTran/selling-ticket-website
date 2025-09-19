import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AppDataSource } from '../config/data-source';
import { Role } from '../types/enum';
import { config } from '../config/config';

import { User } from '../models/User.model';
import { DisabledToken } from '../models/DisabledToken.model';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, userName, password } = req.body;
      const userRepo = AppDataSource.getRepository(User);

      const existedUser = await userRepo.findOne({ where: { email } });
      if (existedUser) {
        return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
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
      return res.status(500).json({ error: 'Lỗi server' });
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Tên đăng nhập không tồn tại' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Mật khẩu không đúng' });
      }

      const token = jwt.sign({ id: user.id, roles: user.roles }, config.jwt_secret, {
        expiresIn: '30m'
      });

      return res.status(200).json({ message: 'Đăng nhập thành công', accessToken: token });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server' });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
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

      return { message: 'Đăng xuất thành công, token đã bị vô hiệu hóa.' };
    } catch (error) {
      return { error: 'Token không hợp lệ hoặc đã hết hạn.' };
    }
  }
}

export default new AuthController();
