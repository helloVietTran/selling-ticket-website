import { IErrorCode } from '../config/ErrorMap';

export default class ApiResponse {
  static success<T>(data: T, message = 'Success') {
    return {
      success: true,
      message,
      statusCode: 1000,
      data
    };
  }

  static error(errorCode: IErrorCode, error?: any) {
    return {
      success: false,
      code: errorCode.code,
      message: errorCode.message || '',
      statusCode: errorCode.statusCode,
      error
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
