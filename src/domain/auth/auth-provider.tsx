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
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  type AuthSession,
} from '@/data/auth';

import {
  type AuthUser,
  type UserRole,
  homeHrefForRole,
} from './auth.types';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  /** Persist a real API session (token + user). */
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
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const session = await loadAuthSession();
        if (cancelled || !session) {
          return;
        }
        setUser(session.user);
        setToken(session.token);
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

  const signInWithSession = useCallback(async (session: AuthSession) => {
    await saveAuthSession(session);
    setUser(session.user);
    setToken(session.token);
  }, []);

  const markTermsAccepted = useCallback(async () => {
    if (!user || !token) {
      return;
    }

    const nextUser: AuthUser = { ...user, termsAccepted: true };
    await saveAuthSession({ token, user: nextUser });
    setUser(nextUser);
  }, [token, user]);

  const signInAs = useCallback((role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    setUser(mockUser);
    setToken(null);
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role]);
    setToken(null);
  }, []);

  const signOut = useCallback(async () => {
    await clearAuthSession();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
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
