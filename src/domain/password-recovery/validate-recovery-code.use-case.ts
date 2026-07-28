import {
  validateRecoveryCode,
  type ValidateRecoveryCodeParams,
  type ValidateRecoveryCodeResult,
} from '@/data/password-recovery';

/**
 * Use case: validate a recovery code (does not consume it).
 * Throws when the server reports the code as invalid/expired.
 */
export async function validateRecoveryCodeUseCase(
  params: ValidateRecoveryCodeParams,
  signal?: AbortSignal,
): Promise<ValidateRecoveryCodeResult> {
  const result = await validateRecoveryCode(params, signal);

  if (!result.valid) {
    throw new Error(result.message || 'Código inválido ou expirado. Solicite um novo código.');
  }

  return result;
}
