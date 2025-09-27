import userController from "../src/controllers/user.controller";
import { AppDataSource } from "../src/config/data-source";
import { User } from "../src/models/User.model";
import { ErrorMap } from "../src/config/ErrorMap";
import { AppError } from "../src/config/exception";

jest.mock("../src/config/data-source", () => {
    const mockRepo = {
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn(),
    };
    return {
        AppDataSource: {
            getRepository: jest.fn(() => mockRepo),
        },
    };
});

describe("UserController", () => {
    let mockRes: any;
    let mockNext: jest.Mock;
    let mockRepo: any;

    beforeEach(() => {
        mockRes = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            locals: {},
        };
        mockNext = jest.fn();
        mockRepo = AppDataSource.getRepository(User);
        jest.clearAllMocks();
    });

    describe("getUserById", () => {
        it("should return user without password if found", async () => {
            const mockUser = { id: 1, email: "test@mail.com", userName: "John", passwordHash: "hashed" };
            mockRepo.findOneBy.mockResolvedValue(mockUser);

            const req: any = { params: { id: "1" } };

            await userController.getUserById(req, mockRes, mockNext);

            expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "User information retrieved successfully",
                status: 200,
                data: { id: 1, email: "test@mail.com", userName: "John" },
            });
        });

        it("should call next with error if user not found", async () => {
            mockRepo.findOneBy.mockResolvedValue(null);
            const req: any = { params: { id: "1" } };

            await userController.getUserById(req, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND));
        });
    });

    describe("getMyInfo", () => {
        it("should return requester info if user exists", async () => {
            const mockUser = { id: 2, email: "me@mail.com", userName: "Me", passwordHash: "hashed" };
            mockRepo.findOne.mockResolvedValue(mockUser);

            const req: any = {};
            mockRes.locals.requester = { id: 2 };

            await userController.getMyInfo(req, mockRes, mockNext);

            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Get my info successfully",
                data: { id: 2, email: "me@mail.com", userName: "Me" },
            });
        });

        it("should call next with error if user not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);
            mockRes.locals.requester = { id: 999 };

            await userController.getMyInfo({} as any, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND));
        });
    });

    describe("updateMyInfo", () => {
        it("should update and return user if valid", async () => {
            const mockUser = { id: 3, email: "old@mail.com", userName: "Old", phoneNumber: "123", passwordHash: "hashed" };
            const updatedUser = { ...mockUser, email: "new@mail.com", userName: "New" };

            mockRepo.findOne.mockResolvedValueOnce(mockUser); // find by id
            mockRepo.findOne.mockResolvedValueOnce(null); // check duplicate email
            mockRepo.save.mockResolvedValue(updatedUser);

            const req: any = { body: { email: "new@mail.com", userName: "New" } };
            mockRes.locals.requester = { id: 3 };

            await userController.updateMyInfo(req, mockRes, mockNext);

            expect(mockRepo.save).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Update user successfully",
                status: 200,
                data: { id: 3, email: "new@mail.com", userName: "New", phoneNumber: "123" },
            });
        });

        it("should call next with error if email already exists", async () => {
            const mockUser = { id: 3, email: "old@mail.com", userName: "Old", passwordHash: "hashed" };
            const existedUser = { id: 4, email: "dup@mail.com" };

            mockRepo.findOne.mockResolvedValueOnce(mockUser); // find by id
            mockRepo.findOne.mockResolvedValueOnce(existedUser); // duplicate email

            const req: any = { body: { email: "dup@mail.com" } };
            mockRes.locals.requester = { id: 3 };

            await userController.updateMyInfo(req, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.EMAIL_ALREADY_EXISTS));
        });

        it("should call next with error if user not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);
            const req: any = { body: {} };
            mockRes.locals.requester = { id: 999 };

            await userController.updateMyInfo(req, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(AppError.fromErrorCode(ErrorMap.USER_NOT_FOUND));
        });
    });
});
