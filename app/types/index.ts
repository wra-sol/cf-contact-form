export interface FormData {
    sessionId: string;
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
    SITE_URL: string;
    ANALYTICS: KVNamespace;
  }
  
  export interface PetitionStep1Data {
    sessionId: string;
    first_name: string;
    last_name: string;
    email: string;
    city: string;
    privacy: string;
    consent: string;
  }
  
  export interface PetitionStep2Data {
    sessionId: string;
    message: string;
  }
  
  export interface PetitionFullData extends PetitionStep1Data, PetitionStep2Data {}
  
  export interface AnalyticsEvent {
    type: string;
    timestamp: string;
    data?: Record<string, any>;
  }
  
  export interface DelegateData {
    sessionId: string;
    name: string;
    email: string;
    region?: string;
    timestamp: string;
  }
  