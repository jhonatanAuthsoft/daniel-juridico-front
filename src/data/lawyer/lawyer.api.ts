import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  httpRequest,
  type ApiResponse,
} from '@/data/http';
import type { MeDetalheWire } from '@/data/auth';

import {
  mapRegisterLawyerWireToResult,
  mapUpdateLawyerAddressToWire,
  mapUpdateLawyerBiographyToWire,
  mapUpdateLawyerBillingToWire,
  mapUpdateLawyerDocumentationToWire,
  mapUpdateLawyerGeneralDataToWire,
  mapUpdateLawyerGraduationToWire,
  mapUpdateLawyerAvailabilityToWire,
} from './lawyer.mapper';
import type {
  RegisterLawyerRequest,
  RegisterLawyerResult,
  RegisterLawyerWireResponse,
  UpdateLawyerAddressParams,
  UpdateLawyerBiographyParams,
  UpdateLawyerBillingParams,
  UpdateLawyerDocumentationParams,
  UpdateLawyerGeneralDataParams,
  UpdateLawyerGraduationParams,
  UpdateLawyerAvailabilityParams,
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

/**
 * Updates the authenticated lawyer's display name.
 * `PATCH /advogados/me/dados-gerais`
 */
export async function updateLawyerGeneralData(
  params: UpdateLawyerGeneralDataParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/advogados/me/dados-gerais'),
    {
      method: 'PATCH',
      body: mapUpdateLawyerGeneralDataToWire(params),
      signal,
    },
  );
  return assertApiSuccess(response, 'Não foi possível atualizar os dados gerais.');
}

/**
 * Updates the authenticated lawyer's address.
 * `PATCH /advogados/me/endereco`
 */
export async function updateLawyerAddress(
  params: UpdateLawyerAddressParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/advogados/me/endereco'),
    {
      method: 'PATCH',
      body: mapUpdateLawyerAddressToWire(params),
      signal,
    },
  );
  return assertApiSuccess(response, 'Não foi possível atualizar o endereço.');
}

/**
 * Replaces the authenticated lawyer's billing methods.
 * `PATCH /advogados/me/formas-cobranca`
 */
export async function updateLawyerBilling(
  params: UpdateLawyerBillingParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/advogados/me/formas-cobranca'),
    {
      method: 'PATCH',
      body: mapUpdateLawyerBillingToWire(params),
      signal,
    },
  );
  return assertApiSuccess(
    response,
    'Não foi possível atualizar as formas de cobrança.',
  );
}

/**
 * Updates the authenticated lawyer's biography and treatment pronoun.
 * `PATCH /advogados/me/biografia`
 */
export async function updateLawyerBiography(
  params: UpdateLawyerBiographyParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/advogados/me/biografia'),
    {
      method: 'PATCH',
      body: mapUpdateLawyerBiographyToWire(params),
      signal,
    },
  );
  return assertApiSuccess(response, 'Não foi possível atualizar a biografia.');
}

/**
 * Replaces the authenticated lawyer's OAB records.
 * `PATCH /advogados/me/documentacao`
 */
export async function updateLawyerDocumentation(
  params: UpdateLawyerDocumentationParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/advogados/me/documentacao'),
    {
      method: 'PATCH',
      body: mapUpdateLawyerDocumentationToWire(params),
      signal,
    },
  );
  return assertApiSuccess(response, 'Não foi possível atualizar a documentação.');
}

/**
 * Updates the authenticated lawyer's graduation.
 * `PATCH /advogados/me/graduacao`
 */
export async function updateLawyerGraduation(
  params: UpdateLawyerGraduationParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/advogados/me/graduacao'),
    {
      method: 'PATCH',
      body: mapUpdateLawyerGraduationToWire(params),
      signal,
    },
  );
  return assertApiSuccess(response, 'Não foi possível atualizar a graduação.');
}

/**
 * Updates the authenticated lawyer's profile availability.
 * `PATCH /advogados/me/disponibilidade`
 */
export async function updateLawyerAvailability(
  params: UpdateLawyerAvailabilityParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/advogados/me/disponibilidade'),
    {
      method: 'PATCH',
      body: mapUpdateLawyerAvailabilityToWire(params),
      signal,
    },
  );
  return assertApiSuccess(
    response,
    'Não foi possível atualizar a disponibilidade do perfil.',
  );
}
