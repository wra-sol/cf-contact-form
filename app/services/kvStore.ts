import { PetitionFullData, AnalyticsEvent, DelegateData } from '../types';

export async function saveResponseToKV(
  env: { FORM_RESPONSES: KVNamespace },
  data: Partial<PetitionFullData>,
  sessionId: string
): Promise<void> {
  const key = `response:${sessionId}`;
  void await env.FORM_RESPONSES.put(key, JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  }));
} 

export async function getResponseFromKV(
  env: { FORM_RESPONSES: KVNamespace },
  sessionId: string
): Promise<PetitionFullData | null> {
  const key = `response:${sessionId}`;
  const response = await env.FORM_RESPONSES.get(key);
  return response ? JSON.parse(response) : null;
}

export async function getCountFromKV(
  env: { FORM_RESPONSES: KVNamespace },
): Promise<number> {
  const response = await env.FORM_RESPONSES.list();
  return response.keys.length;
}

export async function saveAnalyticsEventToKV(
  env: { ANALYTICS: KVNamespace },
  event: AnalyticsEvent
): Promise<void> {
  const key = `event:${event.timestamp}:${event.type}`;
  await env.ANALYTICS.put(key, JSON.stringify(event));
}

export async function getAnalyticsEventsFromKV(
  env: { ANALYTICS: KVNamespace }
): Promise<AnalyticsEvent[]> {
  const response = await env.ANALYTICS.list();
  const events = await Promise.all(
    response.keys.map(async (k) => {
      const val = await env.ANALYTICS.get(k.name);
      return val ? JSON.parse(val) : null;
    })
  );
  return events.filter(Boolean);
}

export async function saveDelegateToKV(
  env: { FORM_RESPONSES: KVNamespace },
  data: DelegateData
): Promise<void> {
  const key = `delegate:${data.sessionId}`;
  await env.FORM_RESPONSES.put(key, JSON.stringify(data));
}

export async function getDelegatesFromKV(
  env: { FORM_RESPONSES: KVNamespace }
): Promise<DelegateData[]> {
  const response = await env.FORM_RESPONSES.list({ prefix: 'delegate:' });
  const delegates = await Promise.all(
    response.keys.map(async (k) => {
      const val = await env.FORM_RESPONSES.get(k.name);
      return val ? JSON.parse(val) : null;
    })
  );
  return delegates.filter(Boolean);
}

export async function getAllPetitionResponsesFromKV(
  env: { FORM_RESPONSES: KVNamespace }
): Promise<PetitionFullData[]> {
  const response = await env.FORM_RESPONSES.list({ prefix: 'response:' });
  const responses = await Promise.all(
    response.keys.map(async (k) => {
      const val = await env.FORM_RESPONSES.get(k.name);
      return val ? JSON.parse(val) : null;
    })
  );
  return responses.filter(Boolean);
}

export async function getListOfNamesBasedOnPrivacyType(
  env: { FORM_RESPONSES: KVNamespace },
  privacyType: 'full' | 'first' | 'private'
): Promise<string[]> {
  const responses = await getAllPetitionResponsesFromKV(env);
  return responses
    .filter(r => r.privacy === privacyType)
    .map(r => {
      if (privacyType === 'full') {
        return `${r.first_name} ${r.last_name}, ${r.city}`;
      } else if (privacyType === 'first') {
        return `${r.first_name}, ${r.city}`;
      } else if (privacyType === 'private') {
        return `${r.city}`;
      }
      return '';
    });
}   