export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'app_auth_token',
  USER_INFO: 'app_user_info',
  THEME_MODE: 'app_theme_mode',
} as const;

export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEYS;
