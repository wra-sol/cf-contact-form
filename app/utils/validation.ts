import { FormData } from '../types';
import { ValidationError } from './errors';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateFormData(data: FormData): void {
  if (!data.name?.trim()) {
    throw new ValidationError('Name is required');
  }

  if (!data.email?.trim()) {
    throw new ValidationError('Email is required');
  }

  if (!validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }

  if (!data.message?.trim()) {
    throw new ValidationError('Message is required');
  }

  // Additional validation rules can be added here
  if (data.name.length > 100) {
    throw new ValidationError('Name must be less than 100 characters');
  }

  if (data.message.length > 1000) {
    throw new ValidationError('Message must be less than 1000 characters');
  }
} 