'use client';

import { apiClient } from './api-client';
import { clearSession, setSession } from './session-store';

const AUTH0_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH0_DOMAIN ??
  process.env.REACT_APP_AUTH0_DOMAIN ??
  '';
const AUTH0_CLIENT_ID =
  process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ??
  process.env.REACT_APP_AUTH0_CLIENT_ID ??
  '';
const AUTH0_REDIRECT_URI =
  process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL ??
  process.env.REACT_APP_AUTH0_CALLBACK_URL ??
  'http://localhost:3000/callback';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  admin: boolean;
  authProvider: 'local' | 'auth0';
};

type AuthResponse = {
  token: string;
  expiresIn: number;
  user: AuthUser;
};

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await apiClient.post<AuthResponse, LoginPayload>('/auth/login', payload);
  setSession(response.token, response.expiresIn);
  return response.user;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const response = await apiClient.post<AuthResponse, RegisterPayload>('/auth/register', payload);
  setSession(response.token, response.expiresIn);
  return response.user;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  return apiClient.get<AuthUser>('/users/me');
}

export function logout(): void {
  clearSession();
}

export function buildAuth0AuthorizeUrl(connection?: string, screenHint?: 'login' | 'signup'): string {
  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    throw new Error('Auth0 environment variables are not configured.');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: AUTH0_CLIENT_ID,
    redirect_uri: AUTH0_REDIRECT_URI,
    scope: 'openid profile email',
  });

  if (connection) {
    params.set('connection', connection);
  }
  if (screenHint) {
    params.set('screen_hint', screenHint);
  }

  return `https://${AUTH0_DOMAIN}/authorize?${params.toString()}`;
}

export async function exchangeAuth0Code(code: string, state?: string): Promise<AuthUser> {
  const params = new URLSearchParams({ code });
  if (state) {
    params.set('state', state);
  }
  const response = await apiClient.get<AuthResponse>(`/auth/auth0/callback?${params.toString()}`);
  setSession(response.token, response.expiresIn);
  return response.user;
}

