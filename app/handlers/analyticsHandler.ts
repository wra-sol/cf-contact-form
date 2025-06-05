import { getAnalyticsEventsFromKV, saveAnalyticsEventToKV } from '../services/kvStore';
import { AnalyticsEvent } from '../types';

export async function handleAnalytics(request: Request, env: any): Promise<Response> {
  if (request.method === 'POST') {
    const event = (await request.json()) as Partial<AnalyticsEvent>;
    if (!event.type) {
      return new Response(JSON.stringify({ error: 'Missing event type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const analyticsEvent: AnalyticsEvent = {
      type: event.type,
      timestamp: new Date().toISOString(),
      data: event.data || {},
    };
    await saveAnalyticsEventToKV(env, analyticsEvent);
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (request.method === 'GET') {
    const events = await getAnalyticsEventsFromKV(env);
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
} 