import { FormData } from '../types';
import { GoogleSheetsError } from '../utils/errors';
import { GOOGLE_SHEETS_API_BASE } from '../config/constants';

export async function appendToSheet(
  sheetId: string,
  accessToken: string,
  data: FormData
): Promise<any> {
  const sheetsUrl = `${GOOGLE_SHEETS_API_BASE}/${sheetId}/values/Sheet1!A:D:append?valueInputOption=RAW`;
  console.log('Sending request to Sheets API:', sheetsUrl);

  const sheetsResponse = await fetch(sheetsUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
    const errorDetails = {
      status: sheetsResponse.status,
      statusText: sheetsResponse.statusText,
      error: errorText,
    };
    console.error('Sheets API error:', errorDetails);
    throw new GoogleSheetsError(`Failed to save to Google Sheet: ${errorText}`, errorDetails);
  }

  const sheetsResult = await sheetsResponse.json();
  console.log('Successfully saved to Sheets:', sheetsResult);
  return sheetsResult;
} 