import { deleteAccount, type DeleteAccountParams } from '@/data/user';

export function deleteAccountUseCase(
  params: DeleteAccountParams,
  signal?: AbortSignal,
) {
  return deleteAccount(params, signal);
}
