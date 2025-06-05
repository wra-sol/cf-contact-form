import { getDelegatesFromKV, saveDelegateToKV } from '../services/kvStore';
import { DelegateData } from '../types';

export async function handleDelegates(request: Request, env: any): Promise<Response> {
  if (request.method === 'POST') {
    const data = (await request.json()) as Partial<DelegateData>;
    if (!data.sessionId || !data.name || !data.email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const delegate: DelegateData = {
      sessionId: data.sessionId,
      name: data.name,
      email: data.email,
      region: data.region,
      timestamp: new Date().toISOString(),
    };
    await saveDelegateToKV(env, delegate);
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (request.method === 'GET') {
    const delegates = await getDelegatesFromKV(env);
    return new Response(JSON.stringify(delegates), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
} 