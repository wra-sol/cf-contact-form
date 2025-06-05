import { API_ENDPOINTS } from '~/config/constants';

export async function loader() {
    const data = await fetch(API_ENDPOINTS.COUNT);
    const { count } = await data.json() as { count: number };
    return new Response(JSON.stringify({ count }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
