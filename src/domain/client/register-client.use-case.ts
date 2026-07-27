import type { ClientSignupFormValues } from '@/components/signup-client';
import {
  cadastrarCliente,
  mapClientSignupFormToCadastrarRequest,
  type CadastrarClienteResponse,
} from '@/data/client';
import { HttpError } from '@/data/http';

import { mapApiPerfilToRole, type AuthUser } from '@/domain/auth/auth.types';

export type RegisterClientResult = {
  token: string;
  user: AuthUser;
  raw: CadastrarClienteResponse;
};

function extractApiErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    const body = error.body;
    if (body && typeof body === 'object') {
      const message =
        'message' in body && typeof body.message === 'string' ? body.message : null;
      const errors =
        'errors' in body && Array.isArray(body.errors) ? body.errors : null;
      const firstError = errors?.[0];
      const firstDetail =
        firstError &&
        typeof firstError === 'object' &&
        'detail' in firstError &&
        typeof (firstError as { detail: unknown }).detail === 'string'
          ? (firstError as { detail: string }).detail
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

  return 'Não foi possível concluir o cadastro.';
}

/**
 * Use case: register a client from the signup form values.
 */
export async function registerClientUseCase(
  form: ClientSignupFormValues,
  signal?: AbortSignal,
): Promise<RegisterClientResult> {
  try {
    const payload = mapClientSignupFormToCadastrarRequest(form);
    const raw = await cadastrarCliente(payload, signal);

    const user: AuthUser = {
      id: raw.usuario.id,
      email: raw.usuario.email,
      name: raw.usuario.nomeCompleto,
      role: mapApiPerfilToRole(raw.usuario.perfil),
      phone: raw.usuario.telefone,
      termsAccepted: Boolean(raw.usuario.termosAceitos),
    };

    return {
      token: raw.token,
      user,
      raw,
    };
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
