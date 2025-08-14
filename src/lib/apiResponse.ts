/**
 * Professional API Response Handler
 * Ultra Standardized Response Structure for Pizza Palace APIs
 */

import { NextResponse } from 'next/server';

// Response interfaces
interface SuccessResponse {
  success: true;
  message: string;
  data?: any;
  requestId?: string;
  timestamp?: string;
  version?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  requestId?: string;
  timestamp?: string;
  version?: string;
  details?: any;
}

// Error codes enum
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  DATABASE_QUERY_ERROR: 'DATABASE_QUERY_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  PROFANITY_DETECTED: 'PROFANITY_DETECTED',
  DUPLICATE_REVIEW: 'DUPLICATE_REVIEW'
};

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Success Response Builder
 */
export const createSuccessResponse = (
  message: string,
  data: any,
  requestId: string,
  status: number = 200
) => {
  return new Response(JSON.stringify({
    success: true,
    message,
    data,
    requestId,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * Error Response Builder
 */
export const createErrorResponse = (
  message: string,
  code: string,
  requestId: string,
  status: number = 500
) => {
  return new Response(JSON.stringify({
    success: false,
    error: message,
    code,
    requestId,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * Professional Input Validator
 */
export class InputValidator {
  private errors: string[] = [];

  // Email validation
  validateEmail(email: string, fieldName: string = 'Email'): this {
    if (!email || typeof email !== 'string') {
      this.errors.push(`${fieldName} gereklidir`);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errors.push(`Geçerli bir ${fieldName.toLowerCase()} adresi giriniz`);
    } else if (email.length > 255) {
      this.errors.push(`${fieldName} çok uzun (maksimum 255 karakter)`);
    }
    return this;
  }

  // Password validation
  validatePassword(password: string, fieldName: string = 'Şifre'): this {
    if (!password || typeof password !== 'string') {
      this.errors.push(`${fieldName} gereklidir`);
    } else if (password.length < 6) {
      this.errors.push(`${fieldName} en az 6 karakter olmalıdır`);
    } else if (password.length > 128) {
      this.errors.push(`${fieldName} çok uzun (maksimum 128 karakter)`);
    }
    return this;
  }

  // Name validation
  validateName(name: string, fieldName: string = 'İsim'): this {
    if (!name || typeof name !== 'string') {
      this.errors.push(`${fieldName} gereklidir`);
    } else if (name.trim().length < 2) {
      this.errors.push(`${fieldName} en az 2 karakter olmalıdır`);
    } else if (name.trim().length > 100) {
      this.errors.push(`${fieldName} çok uzun (maksimum 100 karakter)`);
    } else if (!/^[a-zA-ZıiİüÜöÖçÇşŞğĞ\s]+$/.test(name.trim())) {
      this.errors.push(`${fieldName} sadece harflerden oluşmalıdır`);
    }
    return this;
  }

  // Verification code validation
  validateCode(code: string, fieldName: string = 'Doğrulama kodu'): this {
    if (!code || typeof code !== 'string') {
      this.errors.push(`${fieldName} gereklidir`);
    } else if (!/^\d{6}$/.test(code)) {
      this.errors.push(`${fieldName} 6 haneli sayı olmalıdır`);
    }
    return this;
  }

  // Required field validation
  validateRequired(value: any, fieldName: string): this {
    if (value === undefined || value === null || value === '') {
      this.errors.push(`${fieldName} gereklidir`);
    }
    return this;
  }

  // String length validation
  validateLength(value: string, min: number, max: number, fieldName: string): this {
    if (typeof value === 'string') {
      if (value.length < min) {
        this.errors.push(`${fieldName} en az ${min} karakter olmalıdır`);
      } else if (value.length > max) {
        this.errors.push(`${fieldName} en fazla ${max} karakter olmalıdır`);
      }
    }
    return this;
  }

  // Get validation errors
  getErrors(): string[] {
    return this.errors;
  }

  // Check if validation passed
  isValid(): boolean {
    return this.errors.length === 0;
  }

  // Clear errors
  clear(): this {
    this.errors = [];
    return this;
  }

  // Create error response if validation failed
  createErrorResponse(requestId?: string): NextResponse | null {
    if (this.isValid()) return null;
    
    return createErrorResponse(
      this.errors.join(', '),
      ERROR_CODES.VALIDATION_ERROR,
      requestId,
      400
    );
  }
}

/**
 * Request ID Generator
 */
export function generateRequestId(): string {
  return Math.random().toString(36).substring(7);
}

/**
 * Database Error Handler
 */
export const handleDatabaseError = (error: any, operation: string, requestId?: string): NextResponse => {
  console.error(`💾 Database Error [${requestId}] - ${operation}:`, error);
  
  // Check for specific database errors
  if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return createErrorResponse(
      'Bu kayıt zaten mevcut',
      ERROR_CODES.DUPLICATE_RECORD,
      requestId,
      409
    );
  }
  
  return createErrorResponse(
    'Veritabanı hatası oluştu',
    ERROR_CODES.DATABASE_QUERY_ERROR,
    requestId,
    500
  );
};

/**
 * Async Error Wrapper
 */
export const asyncHandler = (fn: Function) => {
  return async (request: any) => {
    const requestId = generateRequestId();
    try {
      return await fn(request, requestId);
    } catch (error) {
      console.error(`🚨 Unhandled Error [${requestId}]:`, error);
      return createErrorResponse(
        'Beklenmeyen hata oluştu',
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        requestId,
        500
      );
    }
  };
};
