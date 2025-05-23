export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export function createSuccessResponse<T>(data: T): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    } as ApiResponse<T>),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export function createErrorResponse(
  error: string,
  details?: any,
  status: number = 500
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error,
      details,
    } as ApiResponse),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export function createCorsResponse(): Response {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 