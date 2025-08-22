export const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_CODE: 'INVALID_CODE',
} as const;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function createErrorResponse(error: string, code?: string): ApiResponse {
  return {
    success: false,
    error,
    code,
  };
}



