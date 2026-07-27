export type UserRole = 'CLIENT' | 'LAWYER';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  /** False until POST /usuarios/aceitar-termos — use for route guard. */
  termsAccepted: boolean;
};

export type AuthSessionState = {
  token: string;
  user: AuthUser;
};

export function homeHrefForRole(role: UserRole): '/client' | '/lawyer' {
  return role === 'LAWYER' ? '/lawyer' : '/client';
}

export function roleLabel(role: UserRole): string {
  return role === 'LAWYER' ? 'Advogado' : 'Cliente';
}

export function mapApiProfileToRole(profile: string): UserRole {
  const normalized = profile.trim().toUpperCase();
  if (normalized === 'ADVOGADO' || normalized === 'LAWYER') {
    return 'LAWYER';
  }
  return 'CLIENT';
}
