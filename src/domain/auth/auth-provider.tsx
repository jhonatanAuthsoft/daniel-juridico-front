import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  clearAuthSessionStore,
  hydrateAuthSession,
  setAuthSession,
  subscribeAuthSession,
  updateAuthUser,
  type AuthSession,
} from '@/data/auth';
import { unregisterPushDeviceUseCase } from '@/domain/push-device/unregister-push-device.use-case';

import {
  type AuthUser,
  type UserRole,
  homeHrefForRole,
} from './auth.types';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  /** Persist a real API session (access + refresh + user). */
  signInWithSession: (session: AuthSession) => Promise<void>;
  /** Marks terms as accepted and persists the updated session. */
  markTermsAccepted: () => Promise<void>;
  /** @deprecated Mock helper — prefer signInWithSession. */
  signInAs: (role: UserRole) => void;
  setRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
  homeHref: '/client' | '/lawyer' | '/login';
};

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USERS: Record<UserRole, AuthUser> = {
  CLIENT: {
    id: 'mock-client',
    email: 'maria_silvalima@gmail.com',
    name: 'Maria Silva Lima',
    role: 'CLIENT',
    termsAccepted: true,
  },
  LAWYER: {
    id: 'mock-lawyer',
    email: 'luizabitt@gmail.com',
    name: 'Luiza Bittencourt',
    role: 'LAWYER',
    termsAccepted: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const session = await hydrateAuthSession();
        if (cancelled || !session) {
          return;
        }
        setUser(session.user);
        setToken(session.token);
        setRefreshToken(session.refreshToken || null);
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return subscribeAuthSession((session) => {
      if (!session) {
        setUser(null);
        setToken(null);
        setRefreshToken(null);
        return;
      }
      setUser(session.user);
      setToken(session.token);
      setRefreshToken(session.refreshToken || null);
    });
  }, []);

  const signInWithSession = useCallback(async (session: AuthSession) => {
    await setAuthSession(session);
    setUser(session.user);
    setToken(session.token);
    setRefreshToken(session.refreshToken || null);
  }, []);

  const markTermsAccepted = useCallback(async () => {
    if (!user) {
      return;
    }

    const nextUser: AuthUser = { ...user, termsAccepted: true };
    await updateAuthUser(nextUser);
    setUser(nextUser);
  }, [user]);

  const signInAs = useCallback((role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    setUser(mockUser);
    setToken(null);
    setRefreshToken(null);
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role]);
    setToken(null);
    setRefreshToken(null);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await unregisterPushDeviceUseCase();
    } catch {
      // Logout must proceed even if the device could not be unregistered.
    }
    await clearAuthSessionStore();
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      refreshToken,
      isAuthenticated: user != null,
      isHydrating,
      signInWithSession,
      markTermsAccepted,
      signInAs,
      setRole,
      signOut,
      homeHref: user ? homeHrefForRole(user.role) : '/login',
    }),
    [
      user,
      token,
      refreshToken,
      isHydrating,
      signInWithSession,
      markTermsAccepted,
      signInAs,
      setRole,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
