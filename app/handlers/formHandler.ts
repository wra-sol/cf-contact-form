import { Env, PetitionStep1Data, PetitionStep2Data, PetitionFullData } from '../types';
import { getGoogleAccessToken } from '../services/googleAuth';
import { appendToSheet } from '../services/googleSheets';
import { validatePetitionFormData } from '../utils/validation';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { ValidationError, GoogleAuthError, GoogleSheetsError } from '../utils/errors';
import { saveResponseToKV } from '../services/kvStore';

export async function handleFormSubmission(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const data = (await request.json()) as PetitionFullData;
    const sessionId = data.sessionId;
    validatePetitionFormData(data);

    // Get Google access token
    const accessToken = await getGoogleAccessToken(
      env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      env.GOOGLE_PRIVATE_KEY
    );

    // Append to Google Sheet (optional, update as needed)
    // await appendToSheet(env.GOOGLE_SHEET_ID, accessToken, data);

    // Save to KV
    await saveResponseToKV(env, data, sessionId);
    return createSuccessResponse(data);
  } catch (error) {
    console.error('Error processing submission:', error);

    if (error instanceof ValidationError) {
      return createErrorResponse(error.message, undefined, 400);
    }

    if (error instanceof GoogleAuthError || error instanceof GoogleSheetsError) {
      return createErrorResponse(error.message, error.details, 500);
    }

    return createErrorResponse(
      'Failed to save submission',
      error instanceof Error ? error.message : String(error)
    );
  }
}  