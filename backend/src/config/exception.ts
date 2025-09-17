import { Response } from 'express';
import { ErrorMap, IErrorCode } from './ErrorMap';

export class AppError extends Error {
  private statusCode: number = 500;
  private rootCause?: Error;
  private details: Record<string, any> = {};
  private logMessage?: string;
  private errorCode?: string;

  private constructor(err: Error) {
    super(err.message);
  }

  static fromErrorCode(errorCode: IErrorCode, rootCause?: Error) {
    const baseError = new Error(errorCode.message ?? 'Unexpected error');
    const appError = new AppError(baseError);
    appError.statusCode = errorCode.statusCode;
    appError.errorCode = errorCode.code;
    if (rootCause) {
      appError.rootCause = rootCause;
    }
    return appError;
  }

  getRootCause(): Error | null {
    if (this.rootCause) {
      return this.rootCause instanceof AppError ? this.rootCause.getRootCause() : this.rootCause;
    }
    return null;
  }

  wrap(rootCause: Error): AppError {
    const appError = AppError.fromErrorCode(
      { code: this.errorCode ?? 'UNKNOWN', statusCode: this.statusCode, message: this.message },
      rootCause
    );
    return appError;
  }

  withDetail(key: string, value: any): AppError {
    this.details[key] = value;
    return this;
  }

  withLog(logMessage: string): AppError {
    this.logMessage = logMessage;
    return this;
  }

  withMessage(message: string): AppError {
    this.message = message;
    return this;
  }

  toJSON(isProduction: boolean = false) {
    const rootCause = this.getRootCause();

    return isProduction
      ? {
          code: this.errorCode,
          message: this.message,
          statusCode: this.statusCode,
          details: this.details
        }
      : {
          code: this.errorCode,
          message: this.message,
          statusCode: this.statusCode,
          rootCause: rootCause ? rootCause.message : this.message,
          details: this.details,
          logMessage: this.logMessage
        };
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

// error handler middleware
export const responseErr = (err: Error, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  !isProduction && console.error(err.stack);

  if (err instanceof AppError) {
    res.status(err.getStatusCode()).json(err.toJSON(isProduction));
    return;
  }
  // fallback: Internal Server Error
  const appErr = AppError.fromErrorCode(ErrorMap.INTERNAL_SERVER, err);
  res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
};
