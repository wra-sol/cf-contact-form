import { getCountFromKV } from '../services/kvStore';

export async function handleCount(request: Request, env: any): Promise<Response> {
  const count = await getCountFromKV(env);
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
} 