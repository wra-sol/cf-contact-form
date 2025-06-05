import { API_ENDPOINTS, HTTP_METHODS } from "../../config/constants";

export async function action({ request }: { request: Request }) { 
    const data = await request.json();  
    fetch(API_ENDPOINTS.ANALYTICS, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
    }).catch(() => {});
    return null;    
}