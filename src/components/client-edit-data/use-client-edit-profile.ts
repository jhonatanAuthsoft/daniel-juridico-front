import type { ClientEditProfile } from '@/data/auth';
import { useAuth, useMe } from '@/domain/auth';

const EMPTY_CLIENT_EDIT_PROFILE: ClientEditProfile = {
  fullName: '',
  email: '',
  documentType: 'cpf',
  documentNumber: '',
  rg: '',
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  street: '',
  number: '',
  complement: '',
  pronouns: '',
  profession: '',
  maritalStatus: '',
  monthlyIncome: '',
};

/**
 * Client edit-data screens: `/usuarios/me` cadastral fields, with session
 * name/email as fallback while the query is loading.
 */
export function useClientEditProfile() {
  const { user } = useAuth();
  const { data: me, isLoading } = useMe();
  const fromMe = me?.clientProfile ?? null;
  const sessionName = user?.name?.trim() || '';
  const sessionEmail = user?.email?.trim() || '';

  const profile: ClientEditProfile = fromMe
    ? {
        ...fromMe,
        fullName: fromMe.fullName || sessionName,
        email: fromMe.email || sessionEmail,
      }
    : {
        ...EMPTY_CLIENT_EDIT_PROFILE,
        fullName: sessionName,
        email: sessionEmail,
      };

  return { profile, fromMe, isLoading };
}
