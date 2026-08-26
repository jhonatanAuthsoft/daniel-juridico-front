import { updatePassword, type UpdatePasswordParams } from '@/data/user';

export function updatePasswordUseCase(
  params: UpdatePasswordParams,
  signal?: AbortSignal,
) {
  return updatePassword(params, signal);
}
