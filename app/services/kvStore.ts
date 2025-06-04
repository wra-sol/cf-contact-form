import { FormData } from '../types';

export async function saveResponseToKV(
  env: { FORM_RESPONSES: KVNamespace },
  data: FormData
): Promise<void> {
  const key = `response:${Date.now()}`;
  void await env.FORM_RESPONSES.put(key, JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  }));
} 