import { useMemo, useState } from 'react';
import { defaultStatuses, IDLE } from '../constants/apiStatus';
type StatusMap = {
  [key: string]: boolean;
};

const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const prepareStatuses = (currentStatus: string): StatusMap => {
  const statuses: StatusMap = {};

  for (const status of defaultStatuses) {
    const normalisedStatus = capitalize(status.toLowerCase());
    const normalisedStatusKey = `is${normalisedStatus}`;
    statuses[normalisedStatusKey] = status === currentStatus;
  }

  return statuses;
};

export const useApiStatus = (currentStatus = IDLE) => {
  const [apiStatus, setApiStatus] = useState(currentStatus);
  const statuses = useMemo(() => prepareStatuses(apiStatus), [apiStatus]);

  return {
    apiStatus,
    setApiStatus,
    ...statuses,
  };
};
