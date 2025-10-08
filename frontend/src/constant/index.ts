export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'app_auth_token',
  ORGANIZER_ID: 'app_organizer_id',
} as const;

export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEYS;

export const EventStatus = {
  ALL: '',
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ONGOING: 'ONGOING',
} as const;

export type EventStatus = typeof EventStatus[keyof typeof EventStatus];

export const statusLabels: Record<EventStatus, string> = {
  [EventStatus.ALL]: 'Tất cả',
  [EventStatus.DRAFT]: 'Nháp',
  [EventStatus.PUBLISHED]: 'Công khai',
  [EventStatus.ONGOING]: 'Đang diễn ra',
};
