'use client';

import { clearSession, getToken } from './session-store';

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.REACT_APP_API_URL ??
  'http://localhost:8081/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const {
    method = 'GET',
    body,
    headers: customHeaders,
    signal,
  } = options;

  const url = path.startsWith('http') ? path : `${DEFAULT_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers(customHeaders);
  const hasBody = body !== undefined && body !== null;

  if (hasBody && !(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body instanceof FormData ? body : hasBody ? JSON.stringify(body) : undefined,
    credentials: 'include',
    signal,
  });

  if (response.status === 401) {
    clearSession();
  }

  const isJson = response.headers.get('Content-Type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const errorMessage =
      (payload && typeof payload === 'object' && 'message' in payload && (payload as any).message) ||
      (typeof payload === 'string' && payload) ||
      'Request failed';
    throw new Error(errorMessage);
  }

  return (payload ?? null) as TResponse;
}

export const apiClient = {
  get: <TResponse>(path: string, options?: RequestOptions<never>) =>
    request<TResponse>(path, { ...options, method: 'GET' }),
  post: <TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions<TBody>) =>
    request<TResponse, TBody>(path, { ...options, method: 'POST', body }),
  put: <TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions<TBody>) =>
    request<TResponse, TBody>(path, { ...options, method: 'PUT', body }),
  patch: <TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions<TBody>) =>
    request<TResponse, TBody>(path, { ...options, method: 'PATCH', body }),
  delete: <TResponse>(path: string, options?: RequestOptions<never>) =>
    request<TResponse>(path, { ...options, method: 'DELETE' }),
};

