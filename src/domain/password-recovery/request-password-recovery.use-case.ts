import {
  requestPasswordRecovery,
  type RequestPasswordRecoveryParams,
  type RequestPasswordRecoveryResult,
} from '@/data/password-recovery';

/**
 * Use case: request a password recovery code by e-mail.
 */
export async function requestPasswordRecoveryUseCase(
  params: RequestPasswordRecoveryParams,
  signal?: AbortSignal,
): Promise<RequestPasswordRecoveryResult> {
  return requestPasswordRecovery(params, signal);
}
