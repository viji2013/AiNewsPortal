/**
 * Error logging and monitoring utilities
 */

export interface ErrorContext {
  userId?: string
  url?: string
  userAgent?: string
  timestamp: string
  [key: string]: any
}

export class ErrorLogger {
  /**
   * Log error to console in development, send to monitoring service in production
   */
  static logError(error: Error, context?: ErrorContext) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData)
    }

    // In production, send to monitoring service
    // Example: Sentry, LogRocket, DataDog, etc.
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: errorData.context })
      // Or send to custom endpoint
      this.sendToMonitoring(errorData)
    }
  }

  /**
   * Log API errors
   */
  static logAPIError(
    endpoint: string,
    statusCode: number,
    error: Error,
    context?: ErrorContext
  ) {
    this.logError(error, {
      ...context,
      type: 'API_ERROR',
      endpoint,
      statusCode,
    })
  }

  /**
   * Log authentication errors
   */
  static logAuthError(error: Error, context?: ErrorContext) {
    this.logError(error, {
      ...context,
      type: 'AUTH_ERROR',
    })
  }

  /**
   * Log database errors
   */
  static logDatabaseError(error: Error, query?: string, context?: ErrorContext) {
    this.logError(error, {
      ...context,
      type: 'DATABASE_ERROR',
      query,
    })
  }

  /**
   * Send error to monitoring service
   */
  private static async sendToMonitoring(errorData: any) {
    try {
      // Example: Send to custom monitoring endpoint
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      })
    } catch (err) {
      // Fail silently to avoid infinite error loops
      console.error('Failed to send error to monitoring:', err)
    }
  }

  /**
   * Create user-friendly error message
   */
  static getUserMessage(error: Error): string {
    // Map technical errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      NetworkError: 'Unable to connect. Please check your internet connection.',
      AuthError: 'Authentication failed. Please log in again.',
      NotFoundError: 'The requested resource was not found.',
      ValidationError: 'Please check your input and try again.',
      PermissionError: 'You do not have permission to perform this action.',
      RateLimitError: 'Too many requests. Please try again later.',
    }

    return errorMessages[error.name] || 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Custom error classes
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message)
    this.name = 'ValidationError'
  }
}
