import {
  getClientSolicitation,
  type SolicitationDetailResult,
} from '@/data/solicitation';

/**
 * Use case: fetch one solicitation owned by the authenticated client.
 */
export async function getClientSolicitationUseCase(
  id: string,
  signal?: AbortSignal,
): Promise<SolicitationDetailResult> {
  return getClientSolicitation(id, signal);
}
