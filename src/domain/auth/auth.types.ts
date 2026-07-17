export type UserRole = 'CLIENT' | 'LAWYER';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export function homeHrefForRole(role: UserRole): '/client' | '/lawyer' {
  return role === 'LAWYER' ? '/lawyer' : '/client';
}

export function roleLabel(role: UserRole): string {
  return role === 'LAWYER' ? 'Advogado' : 'Cliente';
}
