export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class GoogleAuthError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'GoogleAuthError';
  }
}

export class GoogleSheetsError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'GoogleSheetsError';
  }
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isGoogleAuthError(error: unknown): error is GoogleAuthError {
  return error instanceof GoogleAuthError;
}

export function isGoogleSheetsError(error: unknown): error is GoogleSheetsError {
  return error instanceof GoogleSheetsError;
} 