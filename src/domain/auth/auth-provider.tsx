import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  type AuthUser,
  type UserRole,
  homeHrefForRole,
} from './auth.types';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Mock sign-in with a fixed profile. */
  signInAs: (role: UserRole) => void;
  /** Switch role while staying "logged in" (dev/mock). */
  setRole: (role: UserRole) => void;
  signOut: () => void;
  homeHref: '/client' | '/lawyer' | '/login';
};

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USERS: Record<UserRole, AuthUser> = {
  CLIENT: {
    id: 'mock-client',
    email: 'maria_silvalima@gmail.com',
    name: 'Maria Silva Lima',
    role: 'CLIENT',
  },
  LAWYER: {
    id: 'mock-lawyer',
    email: 'luizabitt@gmail.com',
    name: 'Luiza Bittencourt',
    role: 'LAWYER',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const signInAs = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role]);
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role]);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      signInAs,
      setRole,
      signOut,
      homeHref: user ? homeHrefForRole(user.role) : '/login',
    }),
    [user, signInAs, setRole, signOut],
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
