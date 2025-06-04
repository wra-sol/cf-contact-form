import { OAuthResponse } from '../types';
import { createJWT } from '../utils/jwt';
import { GoogleAuthError } from '../utils/errors';
import { GOOGLE_OAUTH_URL } from '../config/constants';

export async function getGoogleAccessToken(
  serviceAccountEmail: string,
  privateKey: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwt = await createJWT(serviceAccountEmail, privateKey, now);

  const tokenResponse = await fetch(GOOGLE_OAUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    const errorDetails = {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      error: errorText,
      requestBody: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }
    };
    console.error('OAuth token error:', errorDetails);
    throw new GoogleAuthError(`Failed to get OAuth token: ${errorText}`, errorDetails);
  }

  const { access_token } = (await tokenResponse.json()) as OAuthResponse;
  console.log('Successfully obtained access token');
  return access_token;
} 