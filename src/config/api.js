const DEFAULT_API_URL = '/api';

/**
 * API base URL for the backend.
 * - Dev: `/api` (proxied to localhost:3001 by Vite)
 * - Prod: set VITE_API_URL in `.env.production` or hosting env vars
 */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim();
  return configured || DEFAULT_API_URL;
}

export function buildApiUrl(endpoint) {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}
