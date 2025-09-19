import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User.model';
import ApiResponse from '../utils/ApiResponse';
import { Role } from '../types/enum';
import bcrypt from 'bcrypt';
import { Organizer } from '../models/Organizer.model';
import { BaseResponse } from '../types/response.type';
import { UpdateUserInput } from '../validators/user.validate';
import { Requester } from '../types';

class UserController {
  private userRepository = AppDataSource.getRepository(User);

  // chưa trả về data
  getUserById = async (req: Request, res: Response<BaseResponse<User>>, next: NextFunction) => {
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
      return res.json({ message: 'Lấy thông tin user thành công' });
    } catch (error) {
      next(error);
    }
  };

  getMyInfo = async (req: Request, res: Response<BaseResponse<User>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;
    } catch (error) {}
  };

  updateMyInfo = async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response<BaseResponse<User>>,
    next: NextFunction
  ) => {
    try {
      const requester = res.locals.requester as Requester;
      // const { id } = req.params;
      // const { email, userName, phoneNumber, organizationName } = req.body;

      // const user = await this.userRepository.findOneBy({ id: Number(id) });
      // if (!user) {
      //   return res.status(404).json(
      //     ApiResponse.error({
      //       code: 'USER_NOT_FOUND',
      //       message: 'Không tìm thấy user',
      //       statusCode: 404
      //     })
      //   );
      // }

      // // Check email trùng
      // if (email && email !== user.email) {
      //   const existing = await this.userRepository.findOneBy({ email });
      //   if (existing) {
      //     return res.status(400).json(
      //       ApiResponse.error({
      //         code: 'EMAIL_EXISTS',
      //         message: 'Email đã tồn tại',
      //         statusCode: 400
      //       })
      //     );
      //   }
      //   user.email = email;
      // }

      // if (userName !== undefined) user.userName = userName;

      // // // Nếu là attendee → update phoneNumber
      // // if (user.roles === 'ATTENDEE' && phoneNumber !== undefined) {
      // //     (user as Attendee).phoneNumber = phoneNumber;
      // // }

      // // // Nếu là organizer → update organizationName
      // // if (user.roles === 'ORGANIZER' && organizationName !== undefined) {
      // //     (user as Organizer).organizationName = organizationName;
      // // }

      // const updatedUser = await this.userRepository.save(user);

      // const { passwordHash, ...userWithoutPassword } = updatedUser;
      return res.json({
        message: 'Update user successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
export default new UserController();
