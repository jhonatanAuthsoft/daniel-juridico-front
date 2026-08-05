import {
  cancelClientSolicitation,
  type SolicitationDetailResult,
} from '@/data/solicitation';

/**
 * Use case: cancel a solicitation owned by the authenticated client.
 */
export async function cancelClientSolicitationUseCase(
  id: string,
  signal?: AbortSignal,
): Promise<SolicitationDetailResult> {
  return cancelClientSolicitation(id, signal);
}
