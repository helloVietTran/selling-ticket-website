export type IErrorCode = {
  code: string;
  statusCode: number;
  message?: string;
};

export const ErrorMap = {
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', statusCode: 404, message: 'Not found user' } as IErrorCode,
  USER_ALREADY_EXISTS: { code: 'USER_ALREADY_EXISTS', statusCode: 400, message: 'User already exits' } as IErrorCode,

  UNAUTHORIZED: { code: 'AUTH_UNAUTHORIZED', statusCode: 401 } as IErrorCode,
  FORBIDDEN: { code: 'AUTH_FORBIDDEN', statusCode: 403 } as IErrorCode,
  TOKEN_EXPIRED: { code: 'AUTH_TOKEN_EXPIRED', statusCode: 401 } as IErrorCode,
  TICKET_TYPE_NOT_FOUND: { code: "TICKET_TYPE_NOT_FOUND", statusCode: 404, message: "Not found ticket" } as IErrorCode,
  ERROR_CREATE_TICKET_TYPE: { code: "ERROR_CREATE_TICKET_TYPE", statusCode: 400, message: "Not create ticket type" } as IErrorCode,


  INVALID_INPUT: { code: "INVALID_INPUT", message: "Thiếu dữ liệu bắt buộc", statusCode: 400 } as IErrorCode,
  EVENT_CREATE_FAILED: { code: "EVENT_CREATE_FAILED", message: "Không thể tạo sự kiện", statusCode: 500 } as IErrorCode,
  EVENT_FETCH_FAILED: { code: "EVENT_FETCH_FAILED", message: "Không thể lấy danh sách sự kiện", statusCode: 500 } as IErrorCode,
  EVENT_NOT_FOUND: { code: "EVENT_NOT_FOUND", message: "Không tìm thấy sự kiện", statusCode: 404 } as IErrorCode,
  EVENT_UPDATE_FAILED: { code: "EVENT_UPDATE_FAILED", message: "Không thể cập nhật sự kiện", statusCode: 500 } as IErrorCode,
  EVENT_DELETE_FAILED: { code: "EVENT_DELETE_FAILED", message: "Không thể xóa sự kiện", statusCode: 500 } as IErrorCode,
  INVALID_STATUS: { code: "INVALID_STATUS", message: "Trạng thái tìm kiếm không hợp lệ", statusCode: 400 } as IErrorCode,
  EVENT_SEARCH_FAILED: { code: "EVENT_SEARCH_FAILED", message: "Không thể tìm kiếm sự kiện", statusCode: 500 } as IErrorCode,
  EVENT_FILTER_FAILED: { code: 'EVENT_FILTER_FAILED', message: 'Không thể lọc sự kiện', statusCode: 500 } as IErrorCode,
  INVALID_ORGANIZER: { code: "INVALID_ORGANIZER", message: "Organizer không hợp lệ", statusCode: 400, } as IErrorCode,
  INVALID_VENUE: { code: "INVALID_VENUE", message: "Venue không hợp lệ", statusCode: 400, } as IErrorCode,
  INVALID_CATEGORY: { code: "INVALID_CATEGORY", message: "Category không hợp lệ", statusCode: 400, } as IErrorCode,

  BOOKING_NOT_FOUND: { code: "BOOKING_NOT_FOUND", message: "Booking not found", statusCode: 404, } as IErrorCode,
  ERROR_GENERATING_TICKETS: { code: "ERROR_GENERATING_TICKETS", message: "Error generating tickets", statusCode: 500, } as IErrorCode
};
