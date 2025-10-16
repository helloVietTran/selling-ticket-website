import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User.model';
import { BaseResponse } from '../types/response.type';
import { UpdateUserInput } from '../validators/user.validate';
import { Requester } from '../types';
import { AppError } from '../config/exception';
import { ErrorMap } from '../config/ErrorMap';

type UserResponse = Omit<User, 'passwordHash'>; // vì trong data ko được để pass
class UserController {
  private userRepository = AppDataSource.getRepository(User);

  getUserById = async (req: Request, res: Response<BaseResponse<UserResponse>>, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findOneBy({ id: Number(id) });

      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }

      const { passwordHash, ...userWithoutPassword } = user;
      return res.json({
        message: 'User information retrieved successfully',
        status: 200,
        data: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  };

  getMyInfo = async (req: Request, res: Response<BaseResponse<UserResponse>>, next: NextFunction) => {
    try {
      const requester = res.locals.requester as Requester;
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: { id: Number(requester.id) }
      });

      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }

      const { passwordHash, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: 'Get my info successfully',
        data: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  };

  updateMyInfo = async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response<BaseResponse<UserResponse>>,
    next: NextFunction
  ) => {
    try {
      const { userName, phoneNumber } = req.body;
      const requester = res.locals.requester as Requester;
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({
        where: { id: Number(requester.id) }
      });

      if (!user) {
        throw AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND);
      }

      if (userName) user.userName = userName;
      if (phoneNumber) user.phoneNumber = phoneNumber;

      const updatedUser = await userRepo.save(user);

      const { passwordHash, ...userWithoutPassword } = updatedUser;

      return res.json({
        message: 'Update user successfully',
        status: 200,
        data: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  };
}
export default new UserController();
