import {
  aceitarTermos,
  TERMS_VERSION,
  type AceitarTermosResponse,
} from '@/data/usuario';
import { HttpError } from '@/data/http';

export type AcceptTermsInput = {
  token: string;
  checkboxConfirmado: boolean;
  scrollConfirmado?: boolean;
  versao?: string;
};

function extractApiErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    const body = error.body;
    if (body && typeof body === 'object') {
      const message =
        'message' in body && typeof body.message === 'string' ? body.message : null;
      const errors =
        'errors' in body && Array.isArray(body.errors) ? body.errors : null;
      const firstDetail =
        errors &&
        errors[0] &&
        typeof errors[0] === 'object' &&
        errors[0] !== null &&
        'detail' in errors[0] &&
        typeof (errors[0] as { detail: unknown }).detail === 'string'
          ? (errors[0] as { detail: string }).detail
          : null;

      if (firstDetail) {
        return firstDetail;
      }
      if (message) {
        return message;
      }
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Não foi possível registrar o aceite dos termos.';
}

/**
 * Use case: accept terms of use for the authenticated session.
 */
export async function acceptTermsUseCase(
  input: AcceptTermsInput,
  signal?: AbortSignal,
): Promise<AceitarTermosResponse> {
  try {
    return await aceitarTermos(
      {
        checkboxConfirmado: input.checkboxConfirmado,
        scrollConfirmado: input.scrollConfirmado ?? false,
        versao: input.versao ?? TERMS_VERSION,
      },
      input.token,
      signal,
    );
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
