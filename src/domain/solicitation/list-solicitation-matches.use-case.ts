import {
  listSolicitationMatches,
  type SolicitationMatchResult,
} from '@/data/solicitation';

/**
 * Use case: list persisted lawyer matches for a solicitation.
 */
export async function listSolicitationMatchesUseCase(
  id: string,
  signal?: AbortSignal,
): Promise<SolicitationMatchResult[]> {
  return listSolicitationMatches(id, signal);
}
