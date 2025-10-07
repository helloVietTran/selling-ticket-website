import { useMemo, useState } from "react";
import { defaultStatuses, IDLE, type Status } from "../../constant/apiStatus";

export type StatusBooleans = {
  [K in Status as `is${Capitalize<Lowercase<K>>}`]: boolean;
};

const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const prepareStatuses = (currentStatus: Status): StatusBooleans => {
  const statuses = {} as StatusBooleans;

  for (const status of defaultStatuses) {
    const normalisedStatus = capitalize(status.toLowerCase());
    const key = `is${normalisedStatus}` as keyof StatusBooleans;
    statuses[key] = status === currentStatus;
  }

  return statuses;
};

export const useApiStatus = (currentStatus: Status = IDLE) => {
  const [apiStatus, setApiStatus] = useState<Status>(currentStatus);

  const statuses = useMemo(() => prepareStatuses(apiStatus), [apiStatus]);

  return {
    apiStatus,
    setApiStatus,
    ...statuses, // { isIdle, isPending, isSuccess, isError }
  };
};
