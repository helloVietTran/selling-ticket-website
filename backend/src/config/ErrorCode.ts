export type IErrorCode = {
  code: string;
  statusCode: number;
  message?: string;
};

export const ErrorMap = {
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', statusCode: 404, message: 'Not found user' } as IErrorCode,
  USER_ALREADY_EXISTS: { code: 'USER_ALREADY_EXISTS', statusCode: 400,  message: 'User already exits' } as IErrorCode,

  UNAUTHORIZED: { code: 'AUTH_UNAUTHORIZED', statusCode: 401 } as IErrorCode,
  FORBIDDEN: { code: 'AUTH_FORBIDDEN', statusCode: 403 } as IErrorCode,
  TOKEN_EXPIRED: { code: 'AUTH_TOKEN_EXPIRED', statusCode: 401 } as IErrorCode,
  TICKET_TYPE_NOT_FOUND:{code:"TICKET_TYPE_NOT_FOUND",statusCode:404,message:"Not found ticket"} as IErrorCode
};
