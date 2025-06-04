import { PostgrestError } from '@supabase/supabase-js';
import { ApiError } from '../../types';

export class SupabaseError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SupabaseError';
  }

  static fromPostgrestError(error: PostgrestError): SupabaseError {
    // Map common Postgrest error codes to our error codes
    const errorMap: Record<string, { code: string; message: string }> = {
      '23505': {
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this data already exists'
      },
      '23503': {
        code: 'FOREIGN_KEY_VIOLATION',
        message: 'Referenced record does not exist'
      },
      '23502': {
        code: 'NOT_NULL_VIOLATION',
        message: 'Required field is missing'
      },
      '22P02': {
        code: 'INVALID_INPUT',
        message: 'Invalid input data'
      },
      '42P01': {
        code: 'TABLE_NOT_FOUND',
        message: 'Requested table does not exist'
      }
    };

    const mappedError = errorMap[error.code] || {
      code: 'DATABASE_ERROR',
      message: error.message
    };

    return new SupabaseError(
      mappedError.code,
      mappedError.message,
      { originalError: error }
    );
  }

  static fromAuthError(error: Error): SupabaseError {
    // Map common auth error codes
    const errorMap: Record<string, { code: string; message: string }> = {
      'invalid_credentials': {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      },
      'invalid_token': {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      },
      'user_not_found': {
        code: 'USER_NOT_FOUND',
        message: 'User not found'
      },
      'email_not_confirmed': {
        code: 'EMAIL_NOT_CONFIRMED',
        message: 'Email not confirmed'
      }
    };

    const mappedError = errorMap[error.message] || {
      code: 'AUTH_ERROR',
      message: error.message
    };

    return new SupabaseError(
      mappedError.code,
      mappedError.message,
      { originalError: error }
    );
  }

  toApiError(): ApiError {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: {
          ...this.details,
          status: this.getHttpStatus()
        }
      }
    };
  }

  private getHttpStatus(): number {
    const statusMap: Record<string, number> = {
      'DUPLICATE_ENTRY': 409,
      'FOREIGN_KEY_VIOLATION': 400,
      'NOT_NULL_VIOLATION': 400,
      'INVALID_INPUT': 400,
      'TABLE_NOT_FOUND': 500,
      'DATABASE_ERROR': 500,
      'INVALID_CREDENTIALS': 401,
      'INVALID_TOKEN': 401,
      'USER_NOT_FOUND': 404,
      'EMAIL_NOT_CONFIRMED': 403,
      'AUTH_ERROR': 401
    };

    return statusMap[this.code] || 500;
  }
} 