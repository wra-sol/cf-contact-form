/// <reference types="@cloudflare/workers-types" />

import { formTemplate } from './templates';
import { Env } from './types';
import { handleFormSubmission } from './handlers/formHandler';
import { createCorsResponse } from './utils/response';
import { API_ENDPOINTS, HTTP_METHODS } from './config/constants';

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
    if (url.pathname === API_ENDPOINTS.SUBMIT) {
      // Handle CORS
      if (request.method === HTTP_METHODS.OPTIONS) {
        return createCorsResponse();
      }

      if (request.method === HTTP_METHODS.POST) {
        return handleFormSubmission(request, env);
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
