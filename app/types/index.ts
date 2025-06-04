export interface FormData {
    name: string;
    email: string;
    message: string;
  }
  
  export interface OAuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
  }
  
  export interface Env {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
    GOOGLE_PRIVATE_KEY: string;
    GOOGLE_SHEET_ID: string;
    FORM_RESPONSES: KVNamespace;
    ENVIRONMENT: string;
  }
  