import { Env } from '../types';

// Helper function to encode to URL-safe base64
export function urlSafeBase64Encode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper function to encode ArrayBuffer to URL-safe base64
export function arrayBufferToUrlSafeBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper function to import private key
export async function importPrivateKey(pem: string): Promise<CryptoKey> {
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

// Helper function to create JWT
export async function createJWT(
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

  const encodedHeader = urlSafeBase64Encode(JSON.stringify(header));
  const encodedClaim = urlSafeBase64Encode(JSON.stringify(claim));

  const signatureInput = `${encodedHeader}.${encodedClaim}`;
  console.log('JWT signature input:', signatureInput);

  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    await importPrivateKey(privateKey),
    new TextEncoder().encode(signatureInput)
  );

  const encodedSignature = arrayBufferToUrlSafeBase64(signature);
  const jwt = `${signatureInput}.${encodedSignature}`;
  console.log('Generated JWT:', jwt);
  return jwt;
} 