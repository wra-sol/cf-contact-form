/// <reference types="@cloudflare/workers-types" />

import { Env } from './types';
import { handleFormSubmission } from './handlers/formHandler';
import { handleDelegates } from './handlers/delegatesHandler';
import { handleAnalytics } from './handlers/analyticsHandler';
import { handleCount } from './handlers/countHandler';
import { createCorsResponse } from './utils/response';
import { API_ENDPOINTS, HTTP_METHODS } from './config/constants';
import { createRequestHandler } from "react-router";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {  
    const url = new URL(request.url);
    switch (url.pathname) {
      case API_ENDPOINTS.SUBMIT:
        if (request.method === HTTP_METHODS.OPTIONS) {
          return createCorsResponse();
        }
        if (request.method === HTTP_METHODS.POST) {
          return handleFormSubmission(request, env);
        }
        return new Response('Method not allowed', { status: 405 });
      case API_ENDPOINTS.DELEGATES:
        return handleDelegates(request, env);
      case API_ENDPOINTS.ANALYTICS:
        return handleAnalytics(request, env);
      case API_ENDPOINTS.COUNT:
        return handleCount(request, env);
      default:
        const requestHandler = createRequestHandler(
          () => import("virtual:react-router/server-build"),
          import.meta.env.MODE
        );
        return requestHandler(request, {
          cloudflare: { env, ctx },
        });
    }
  },
} satisfies ExportedHandler<Env>;
