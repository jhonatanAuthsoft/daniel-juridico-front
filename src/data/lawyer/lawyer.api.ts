import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

import { mapRegisterLawyerWireToResult } from './lawyer.mapper';
import type {
  RegisterLawyerRequest,
  RegisterLawyerResult,
  RegisterLawyerWireResponse,
} from './lawyer.types';

/**
 * Registers a lawyer user + profile + address + OABs + catalogs.
 * `POST /advogados/cadastrar`
 */
export async function registerLawyer(
  body: RegisterLawyerRequest,
  signal?: AbortSignal,
): Promise<RegisterLawyerResult> {
  const response = await httpRequest<ApiResponse<RegisterLawyerWireResponse>>(
    apiUrl('/advogados/cadastrar'),
    {
      method: 'POST',
      body,
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Falha ao cadastrar advogado.');
  return mapRegisterLawyerWireToResult(data);
}
