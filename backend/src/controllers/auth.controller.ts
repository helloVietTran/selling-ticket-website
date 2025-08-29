import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User.model';
import { Role } from '../types/enum';

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
        roles: Role.Attendee
      });

      await userRepo.save(newUser);

      return res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server' });
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, userName, password } = req.body;
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Tên đăng nhập không tồn tại' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Mật khẩu không đúng' });
      }

      const token = jwt.sign({ id: user.id, roles: user.roles }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30m'
      });

      return res.status(200).json({ message: 'Đăng nhập thành công', token });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi server' });
    }
  }
}

export default new AuthController();
