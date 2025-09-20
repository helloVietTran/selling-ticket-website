export interface IErrorCode {
  code: string;
  statusCode: number;
  message?: string;
}

export const ErrorMap = {
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', statusCode: 404, message: 'Not found user' } as IErrorCode,
  USER_ALREADY_EXISTS: { code: 'USER_ALREADY_EXISTS', statusCode: 400, message: 'User already exists' } as IErrorCode,
  EVENT_NOT_EXISTS: { code: ' EVENT_NOT_EXISTS', statusCode: 400, message: 'event not exist' } as IErrorCode,
  PASSWORD_INCORRECT: { code: 'PASSWORD_INCORRECT', statusCode: 400, message: 'password incorrect' } as IErrorCode,
  TICKET_TYPE_NOT_FOUND: { code: 'TICKET_TYPE_NOT_FOUND', statusCode: 404, message: 'Not found ticket' } as IErrorCode,

  ERROR_CREATE_TICKET_TYPE: {
    code: 'ERROR_CREATE_TICKET_TYPE',
    statusCode: 400,
    message: 'Cannot create ticket type'
  } as IErrorCode,

  CATEGORY_NOT_FOUND: { code: 'CATEGORY_NOT_FOUND', statusCode: 404, message: 'Not found category' },

  UNAUTHORIZED: { code: 'AUTH_UNAUTHORIZED', statusCode: 401, message: 'Unauthorized' } as IErrorCode,
  FORBIDDEN: { code: 'AUTH_FORBIDDEN', statusCode: 403, message: 'Forbidden' } as IErrorCode,
  TOKEN_EXPIRED: { code: 'AUTH_TOKEN_EXPIRED', statusCode: 401, message: 'Token expired' } as IErrorCode,

  CREATE_EVENT_FAILED: { code: 'CREATE_EVENT_FAILED', statusCode: 400, message: 'Create event failed' } as IErrorCode,
  METHOD_NOT_ALLOWED: { code: 'METHOD_NOT_ALLOWED', statusCode: 405, message: 'Method not allowed' } as IErrorCode,

  INTERNAL_SERVER: {
    code: 'INTERNAL_SERVER',
    statusCode: 500,
    message: 'Something went wrong, please try again later.'
  } as IErrorCode,
  INVALID_REQUEST: { code: 'INVALID_REQUEST', statusCode: 400, message: 'Invalid request' } as IErrorCode,
  TICKET_TYPE_IMPOSITIVE: { code: 'TICKET_TYPE_IMPOSITIVE', statusCode: 400, message: 'ticket type impositive' } as IErrorCode,
  NOT_AVAILABLE_AT_TIME: { code: 'NOT_AVAILABLE', statusCode: 400, message: '' } as IErrorCode,
  NOT_ENOUGH_STOCK: { code: 'NOT_ENOUGH_STOCK', statusCode: 400, message: 'not enough stock for ticket' } as IErrorCode,
  QUANTITY_OVER_LIMIT: { code: 'QUANTITY_OVER_LIMIT', statusCode: 400, message: 'Quantity over limit' } as IErrorCode
};
