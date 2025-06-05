import { FormData, PetitionStep1Data, PetitionStep2Data, PetitionFullData } from '../types';
import { ValidationError } from './errors';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateFormData(data: any): void {
  // legacy, do not use
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
  if (data.name.length > 100) {
    throw new ValidationError('Name must be less than 100 characters');
  }
  if (data.message.length > 1000) {
    throw new ValidationError('Message must be less than 1000 characters');
  }
}

export function validatePetitionFormData(data: Partial<PetitionFullData>): void {
  // Step 1 fields
  if (!data.first_name?.trim()) {
    throw new ValidationError('First name is required');
  }
  if (!data.last_name?.trim()) {
    throw new ValidationError('Last name is required');
  }
  if (!data.email?.trim()) {
    throw new ValidationError('Email is required');
  }
  if (!validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }
  if (!data.city?.trim()) {
    throw new ValidationError('City is required');
  }
  if (!data.privacy?.trim()) {
    throw new ValidationError('Privacy option is required');
  }
  if (!data.consent?.trim()) {
    throw new ValidationError('Consent is required');
  }
  if (data.first_name.length > 100) {
    throw new ValidationError('First name must be less than 100 characters');
  }
  if (data.last_name.length > 100) {
    throw new ValidationError('Last name must be less than 100 characters');
  }
  // Step 2 fields (optional, but if present, validate)
  if ('message' in data && typeof data.message === 'string') {
    if (!data.message.trim()) {
      throw new ValidationError('Message is required');
    }
    if (data.message.length > 1000) {
      throw new ValidationError('Message must be less than 1000 characters');
    }
  }
}

export function validatePetitionStep1(data: Partial<PetitionFullData>): void {
  if (!data.first_name?.trim()) throw new ValidationError('First name is required');
  if (!data.last_name?.trim()) throw new ValidationError('Last name is required');
  if (!data.email?.trim()) throw new ValidationError('Email is required');
  if (!validateEmail(data.email)) throw new ValidationError('Invalid email format');
  if (!data.city?.trim()) throw new ValidationError('City is required');
  if (!data.privacy?.trim()) throw new ValidationError('Privacy option is required');
  if (!data.consent?.trim()) throw new ValidationError('Consent is required');
  if (data.first_name && data.first_name.length > 100) throw new ValidationError('First name must be less than 100 characters');
  if (data.last_name && data.last_name.length > 100) throw new ValidationError('Last name must be less than 100 characters');
} 