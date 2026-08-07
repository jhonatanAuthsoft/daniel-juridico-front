import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import { mapPublicLawyerProfileWireToResult } from './public-profile.mapper';
import type {
  PublicLawyerProfile,
  PublicLawyerProfileWire,
} from './public-profile.types';

/**
 * Public lawyer profile for authenticated clients.
 * `GET /advogados/{id}` (id = usuarioId do advogado)
 */
export async function getPublicLawyerProfile(
  lawyerUserId: string,
  signal?: AbortSignal,
): Promise<PublicLawyerProfile> {
  const id = lawyerUserId.trim();
  if (!id) {
    throw new Error('Identificador do advogado inválido.');
  }

  const response = await authenticatedHttpRequest<
    ApiResponse<PublicLawyerProfileWire>
  >(apiUrl(`/advogados/${encodeURIComponent(id)}`), {
    method: 'GET',
    signal,
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível carregar o perfil do advogado.',
  );
  return mapPublicLawyerProfileWireToResult(data);
}
