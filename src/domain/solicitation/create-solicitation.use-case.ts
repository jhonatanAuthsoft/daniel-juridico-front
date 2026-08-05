import {
  createSolicitation,
  type CreateSolicitationParams,
  type CreateSolicitationResult,
} from '@/data/solicitation';

export type { CreateSolicitationResult };

/**
 * Use case: create a solicitation for the authenticated client.
 * Matching runs synchronously on the server during this call.
 */
export async function createSolicitationUseCase(
  params: CreateSolicitationParams,
  signal?: AbortSignal,
): Promise<CreateSolicitationResult> {
  return createSolicitation(params, signal);
}
