/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/// <reference types="@cloudflare/workers-types" />

import { formTemplate } from './templates';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface OAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Env {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    console.log('Request received:', {
      path: url.pathname,
      method: request.method,
    });

    // Handle API endpoint
    if (url.pathname === '/api/submit') {
      // Handle CORS
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (request.method === 'POST') {
        try {
          const data = (await request.json()) as FormData;

          // Validate input
          if (!data.name || !data.email || !data.message) {
            return new Response(
              JSON.stringify({ error: 'Missing required fields' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
              }
            );
          }

          // Create JWT token for Google API authentication
          const now = Math.floor(Date.now() / 1000);
          const jwt = await createJWT(
            env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            env.GOOGLE_PRIVATE_KEY,
            now
          );

          // Get access token
          const tokenResponse = await fetch(
            'https://oauth2.googleapis.com/token',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
              }),
            }
          );

          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('OAuth token error:', {
              status: tokenResponse.status,
              statusText: tokenResponse.statusText,
              error: errorText,
              requestBody: {
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
              }
            });
            throw new Error(`Failed to get OAuth token: ${errorText}`);
          }

          const { access_token } = (await tokenResponse.json()) as OAuthResponse;
          console.log('Successfully obtained access token');

          // Append row to Google Sheet
          const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/Sheet1!A:D:append?valueInputOption=RAW`;
          console.log('Sending request to Sheets API:', sheetsUrl);

          const sheetsResponse = await fetch(sheetsUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              values: [
                [
                  new Date().toISOString(),
                  data.name,
                  data.email,
                  data.message,
                ],
              ],
            }),
          });

          if (!sheetsResponse.ok) {
            const errorText = await sheetsResponse.text();
            console.error('Sheets API error:', {
              status: sheetsResponse.status,
              statusText: sheetsResponse.statusText,
              error: errorText,
            });
            throw new Error(`Failed to save to Google Sheet: ${errorText}`);
          }

          const sheetsResult = await sheetsResponse.json();
          console.log('Successfully saved to Sheets:', sheetsResult);

          return new Response(JSON.stringify({ success: true }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        } catch (error) {
          console.error('Error processing submission:', error);
          return new Response(
            JSON.stringify({
              error: 'Failed to save submission',
              details:
                error instanceof Error ? error.message : String(error),
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }
      }

      return new Response('Method not allowed', { status: 405 });
    }

    // Serve the HTML form for all other requests
    return new Response(formTemplate, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  },
} satisfies ExportedHandler<Env>;

// Helper function to encode to URL-safe base64
function urlSafeBase64Encode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper function to encode ArrayBuffer to URL-safe base64
function arrayBufferToUrlSafeBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper function to create JWT
async function createJWT(
  email: string,
  privateKey: string,
  now: number
): Promise<string> {
  console.log('Creating JWT for service account:', email);
  
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  // Remove any quotes from the email
  const cleanEmail = email.replace(/"/g, '');
  
  const claim = {
    iss: cleanEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  console.log('JWT claim:', JSON.stringify(claim, null, 2));

  // Use URL-safe base64 encoding for JWT
  const encodedHeader = urlSafeBase64Encode(JSON.stringify(header));
  const encodedClaim = urlSafeBase64Encode(JSON.stringify(claim));

  const signatureInput = `${encodedHeader}.${encodedClaim}`;
  console.log('JWT signature input:', signatureInput);

  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    await importPrivateKey(privateKey),
    new TextEncoder().encode(signatureInput)
  );

  // Use URL-safe base64 encoding for signature
  const encodedSignature = arrayBufferToUrlSafeBase64(signature);
  const jwt = `${signatureInput}.${encodedSignature}`;
  console.log('Generated JWT:', jwt);
  return jwt;
}

// Helper function to import private key
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  try {
    console.log('Processing private key...');

    // Handle environment variable that might have escaped newlines
    let processedPem = pem;
    
    // Replace literal \n with actual newlines if they exist
    if (processedPem.includes('\\n')) {
      processedPem = processedPem.replace(/\\n/g, '\n');
    }

    // Ensure proper PEM format
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';

    // If headers/footers are missing, the key might be just the base64 content
    if (!processedPem.includes(pemHeader)) {
      // Assume it's just the base64 content and add headers
      processedPem = `${pemHeader}\n${processedPem}\n${pemFooter}`;
    }

    // Extract the base64 content between headers
    const pemLines = processedPem.split('\n');
    const base64Lines = pemLines.filter(
      (line) =>
        line.trim() &&
        !line.includes('-----BEGIN') &&
        !line.includes('-----END')
    );
    const base64Content = base64Lines.join('');

    console.log('Base64 content length:', base64Content.length);

    // Validate base64 content
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Content)) {
      throw new Error('Invalid base64 content in private key');
    }

    // Convert base64 to ArrayBuffer
    const binaryString = atob(base64Content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('Successfully decoded private key');

    return await crypto.subtle.importKey(
      'pkcs8',
      bytes.buffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );
  } catch (error) {
    console.error('Error importing private key:', error);
    throw new Error(
      'Failed to import private key: ' +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
