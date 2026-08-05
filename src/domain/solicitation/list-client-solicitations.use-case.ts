import {
  listClientSolicitations,
  type ListSolicitationsParams,
  type ListSolicitationsResult,
} from '@/data/solicitation';

/**
 * Use case: list solicitations for the authenticated client.
 */
export async function listClientSolicitationsUseCase(
  params?: ListSolicitationsParams,
  signal?: AbortSignal,
): Promise<ListSolicitationsResult> {
  return listClientSolicitations(params, signal);
}
