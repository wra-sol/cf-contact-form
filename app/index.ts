/// <reference types="@cloudflare/workers-types" />

import { Env } from './types';
import { handleFormSubmission } from './handlers/formHandler';
import { createCorsResponse } from './utils/response';
import { API_ENDPOINTS, HTTP_METHODS } from './config/constants';
import { createRequestHandler } from "react-router";

const ASSET_URL_PREFIX = '/images/';

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {  
    const url = new URL(request.url);

    // Serve static images
    /* if (url.pathname.startsWith(ASSET_URL_PREFIX)) {
      console.log('Serving asset', url.pathname);
      const assetPath = url.pathname.replace(/^\//, '');
      const asset = await fetch(`https://newleafliberals.com/${assetPath}`);
      if (asset.ok) {
        return asset;
      }
      return new Response('Not found', { status: 404 });
    }
 */
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

    const requestHandler = createRequestHandler(
      () => import("virtual:react-router/server-build"),
      import.meta.env.MODE
    );
    
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });

    // Serve the HTML form for all other requests
  },
} satisfies ExportedHandler<Env>;
