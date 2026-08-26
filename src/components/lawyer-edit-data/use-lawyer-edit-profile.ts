import type { LawyerEditProfile } from '@/data/auth';
import { useAuth, useMe } from '@/domain/auth';

const EMPTY_LAWYER_EDIT_PROFILE: LawyerEditProfile = {
  fullName: '',
  email: '',
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  street: '',
  number: '',
  complement: '',
  billingMethods: [],
  biography: '',
  pronouns: '',
  oabNumber: '',
  oabUf: '',
  oabIssueDate: '',
  oabPhotoUris: [],
  oabPhotoKeys: [],
  supplementalOabs: [],
  university: '',
  course: '',
  graduationYear: '',
};

/**
 * Lawyer edit-data screens: `/usuarios/me` cadastral fields, with session
 * name/email as fallback while the query is loading.
 */
export function useLawyerEditProfile() {
  const { user } = useAuth();
  const { data: me, isLoading } = useMe();
  const fromMe = me?.lawyerProfile ?? null;
  const sessionName = user?.name?.trim() || '';
  const sessionEmail = user?.email?.trim() || '';

  const profile: LawyerEditProfile = fromMe
    ? {
        ...fromMe,
        fullName: fromMe.fullName || sessionName,
        email: fromMe.email || sessionEmail,
      }
    : {
        ...EMPTY_LAWYER_EDIT_PROFILE,
        fullName: sessionName,
        email: sessionEmail,
      };

  return { profile, fromMe, isLoading };
}
