export type ToastMessage = {
  title: string;
  description?: string;
};

export type ToastMessageGroup = {
  success: ToastMessage;
  error: ToastMessage;
  warning?: ToastMessage;
  info?: ToastMessage;
};

export type ToastMessageMap = {
  CREATE_EVENT: ToastMessageGroup;
};

const TOAST_MESSAGES: ToastMessageMap = {
  CREATE_EVENT: {
    success: {
      title: 'Tạo sự kiện thành công 🎉',
      description: 'Sự kiện của bạn đã được tạo thành công.',
    },
    error: {
      title: 'Tạo sự kiện thất bại ❌',
      description: 'Không thể tạo sự kiện. Vui lòng thử lại sau.',
    },
  },
};

export default TOAST_MESSAGES;
