import { useState } from 'react';
import { useApiStatus } from './useApiStatus';
import { ERROR, PENDING, SUCCESS } from '@/constant/apiStatus';

type UseApiConfig<T> = {
  initialData?: T;
};

type ExecResult<T> = { data: T; error: null } | { data: null; error: unknown };

export function useApi<TArgs extends any[] = any[], TData = unknown>(
  fn: (...args: TArgs) => Promise<TData>,
  config: UseApiConfig<TData> = {}
) {
  const { initialData } = config;
  const [data, setData] = useState<TData | undefined>(initialData);
  const [error, setError] = useState<unknown>(null);

  const { apiStatus, setApiStatus, ...normalisedStatuses } = useApiStatus();

  const exec = async (...args: TArgs): Promise<ExecResult<TData>> => {
    try {
      setError(null);
      setApiStatus(PENDING);

      const result = await fn(...args);
      setData(result);

      setApiStatus(SUCCESS);
      return { data: result, error: null };
    } catch (err) {
      setError(err);
      setApiStatus(ERROR);
      return { data: null, error: err };
    }
  };

  return {
    data,
    setData,
    apiStatus,
    setApiStatus,
    error,
    exec,
    ...normalisedStatuses, // isIdle, isPending, isSuccess, isError
  };
}
