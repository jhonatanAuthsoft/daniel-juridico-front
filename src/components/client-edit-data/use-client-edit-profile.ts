import type { ClientEditProfile } from '@/data/auth';
import { useAuth, useMe } from '@/domain/auth';
import { maskPhone } from '@/utils/br-input';

const EMPTY_CLIENT_EDIT_PROFILE: ClientEditProfile = {
  fullName: '',
  email: '',
  phone: '',
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
  const sessionPhone = user?.phone?.trim() ? maskPhone(user.phone) : '';

  const profile: ClientEditProfile = fromMe
    ? {
        ...fromMe,
        fullName: fromMe.fullName || sessionName,
        email: fromMe.email || sessionEmail,
        phone: fromMe.phone || sessionPhone,
      }
    : {
        ...EMPTY_CLIENT_EDIT_PROFILE,
        fullName: sessionName,
        email: sessionEmail,
        phone: sessionPhone,
      };

  return { profile, fromMe, isLoading };
}
