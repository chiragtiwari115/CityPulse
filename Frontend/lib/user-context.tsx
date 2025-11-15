'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AuthUser,
  buildAuth0AuthorizeUrl,
  exchangeAuth0Code,
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutSession,
  register as registerRequest,
} from './auth-client';
import { getToken } from './session-store';

type LoginCredentials = {
  email: string;
  password: string;
};

type RegistrationPayload = {
  username: string;
  email: string;
  password: string;
};

interface UserContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithEmail: (credentials: LoginCredentials) => Promise<void>;
  registerWithEmail: (payload: RegistrationPayload) => Promise<void>;
  loginWithAuth0: (options?: { connection?: string; screenHint?: 'login' | 'signup' }) => void;
  completeAuth0Login: (code: string, state?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const bootstrapUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsFetchingUser(true);
    try {
      const profile = await fetchCurrentUser();
      setUser(profile);
    } catch (error) {
      console.error('Failed to fetch current user', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsFetchingUser(false);
    }
  }, []);

  useEffect(() => {
    bootstrapUser();
  }, [bootstrapUser]);

  const loginWithEmail = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      try {
        const profile = await loginRequest(credentials);
        setUser(profile);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const registerWithEmail = useCallback(
    async (payload: RegistrationPayload) => {
      setIsLoading(true);
      try {
        const profile = await registerRequest(payload);
        setUser(profile);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const loginWithAuth0 = useCallback(
    (options?: { connection?: string; screenHint?: 'login' | 'signup' }) => {
      try {
        const url = buildAuth0AuthorizeUrl(options?.connection, options?.screenHint);
        window.location.assign(url);
      } catch (error) {
        console.error('Auth0 login is not configured correctly', error);
      }
    },
    [],
  );

  const completeAuth0Login = useCallback(async (code: string, state?: string) => {
    setIsLoading(true);
    try {
      const profile = await exchangeAuth0Code(code, state);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutSession();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    await bootstrapUser();
  }, [bootstrapUser]);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      isLoading: isLoading || isFetchingUser,
      isAuthenticated: !!user,
      isAdmin: !!user?.admin,
      loginWithEmail,
      registerWithEmail,
      loginWithAuth0,
      completeAuth0Login,
      logout,
      refreshUser,
    }),
    [
      user,
      isLoading,
      isFetchingUser,
      loginWithEmail,
      registerWithEmail,
      loginWithAuth0,
      completeAuth0Login,
      logout,
      refreshUser,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
