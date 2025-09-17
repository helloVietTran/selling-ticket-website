import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User.model';
import ApiResponse from '../utils/ApiResponse';
import { Role } from '../types/types';
import bcrypt from 'bcrypt';
import { Organizer } from '../models/Organizer.model';

class UserController {
  private userRepository = AppDataSource.getRepository(User);
  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findOneBy({ id: Number(id) });

      if (!user) {
        return res.status(404).json(
          ApiResponse.error({
            code: 'USER_NOT_FOUND',
            message: 'Không tìm thấy user',
            statusCode: 404
          })
        );
      }

      const { passwordHash, ...userWithoutPassword } = user;
      return res.json(ApiResponse.success(userWithoutPassword, 'Lấy thông tin user thành công'));
    } catch (error) {
      console.error('Lỗi khi lấy user:', error);
      return res.status(500).json(
        ApiResponse.error({
          code: 'USER_FETCH_FAILED',
          message: 'Không thể lấy thông tin user',
          statusCode: 500
        })
      );
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email, userName, phoneNumber, organizationName } = req.body;

      const user = await this.userRepository.findOneBy({ id: Number(id) });
      if (!user) {
        return res.status(404).json(
          ApiResponse.error({
            code: 'USER_NOT_FOUND',
            message: 'Không tìm thấy user',
            statusCode: 404
          })
        );
      }

      // Check email trùng
      if (email && email !== user.email) {
        const existing = await this.userRepository.findOneBy({ email });
        if (existing) {
          return res.status(400).json(
            ApiResponse.error({
              code: 'EMAIL_EXISTS',
              message: 'Email đã tồn tại',
              statusCode: 400
            })
          );
        }
        user.email = email;
      }

      if (userName !== undefined) user.userName = userName;

      // // Nếu là attendee → update phoneNumber
      // if (user.roles === 'ATTENDEE' && phoneNumber !== undefined) {
      //     (user as Attendee).phoneNumber = phoneNumber;
      // }

      // // Nếu là organizer → update organizationName
      // if (user.roles === 'ORGANIZER' && organizationName !== undefined) {
      //     (user as Organizer).organizationName = organizationName;
      // }

      const updatedUser = await this.userRepository.save(user);

      const { passwordHash, ...userWithoutPassword } = updatedUser;
      return res.json(ApiResponse.success(userWithoutPassword, 'Cập nhật user thành công'));
    } catch (error) {
      console.error('Lỗi khi cập nhật user:', error);
      return res.status(500).json(
        ApiResponse.error({
          code: 'USER_UPDATE_FAILED',
          message: 'Không thể cập nhật user',
          statusCode: 500
        })
      );
    }
  };
}
export default new UserController();
