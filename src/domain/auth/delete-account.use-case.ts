import { deleteAccount } from '@/data/user';

export function deleteAccountUseCase(signal?: AbortSignal) {
  return deleteAccount(signal);
}
