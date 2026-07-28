import {
  resetPassword,
  type ResetPasswordParams,
  type ResetPasswordResult,
} from '@/data/password-recovery';

/**
 * Use case: reset password with a valid recovery code.
 */
export async function resetPasswordUseCase(
  params: ResetPasswordParams,
  signal?: AbortSignal,
): Promise<ResetPasswordResult> {
  return resetPassword(params, signal);
}
