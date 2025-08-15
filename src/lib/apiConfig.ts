export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiConfig {
  baseUrl: string;
  authToken?: string;
  defaultHeaders?: Record<string, string>;
}

const STORAGE_KEY = 'app_api_config_v1';

export function loadApiConfig(): ApiConfig {
  if (typeof window === 'undefined') {
    return {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
      defaultHeaders: { 'Content-Type': 'application/json' },
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        baseUrl:
          process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
        defaultHeaders: { 'Content-Type': 'application/json' },
      };
    }
    const parsed = JSON.parse(raw);
    return {
      baseUrl:
        parsed.baseUrl ||
        process.env.NEXT_PUBLIC_API_BASE ||
        'http://localhost:3000/api',
      authToken: parsed.authToken || undefined,
      defaultHeaders: parsed.defaultHeaders || {
        'Content-Type': 'application/json',
      },
    };
  } catch {
    return {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
      defaultHeaders: { 'Content-Type': 'application/json' },
    };
  }
}

export function saveApiConfig(config: ApiConfig) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function getAuthHeaders(): Record<string, string> {
  const cfg = loadApiConfig();
  const headers: Record<string, string> = { ...(cfg.defaultHeaders || {}) };
  if (cfg.authToken) {
    headers['Authorization'] = cfg.authToken.startsWith('Bearer ')
      ? cfg.authToken
      : `Bearer ${cfg.authToken}`;
  }
  return headers;
}

export function getBaseUrl(): string {
  const cfg = loadApiConfig();
  return cfg.baseUrl.replace(/\/?$/, '');
}
