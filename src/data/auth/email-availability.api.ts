import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

export type EmailAvailabilityWire = {
  disponivel: boolean;
};

/**
 * Checks whether an e-mail can be used for signup.
 * `GET /usuarios/email-disponivel?email=`
 */
export async function checkEmailAvailability(
  email: string,
  signal?: AbortSignal,
): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const response = await httpRequest<ApiResponse<EmailAvailabilityWire>>(
    apiUrl(`/usuarios/email-disponivel?email=${encodeURIComponent(normalized)}`),
    {
      method: 'GET',
      signal,
    },
  );

  const data = assertApiSuccess(
    response,
    'Não foi possível verificar o e-mail',
  );
  return data.disponivel;
}
