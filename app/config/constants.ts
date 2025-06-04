export const GOOGLE_OAUTH_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export const FORM_VALIDATION = {
  MAX_NAME_LENGTH: 100,
  MAX_MESSAGE_LENGTH: 1000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const API_ENDPOINTS = {
  SUBMIT: '/api/submit',
} as const;

export const HTTP_METHODS = {
  POST: 'POST',
  OPTIONS: 'OPTIONS',
} as const; 