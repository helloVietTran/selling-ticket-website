import { IErrorCode } from '../config/ErrorCode';

export default class ApiResponse {
  static success<T>(data: T, message = 'Success') {
    return {
      success: true,
      message,
      statusCode: 1000,
      data
    };
  }

  static error(error: IErrorCode) {
    return {
      success: false,
      code: error.code,
      message: error.message || 'Error',
      statusCode: error.statusCode
    };
  }
  
  static paginate<T>(data: T[], total: number, page: number, limit: number, message = 'Success') {
    return {
      success: true,
      message,
      statusCode: 1000,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
