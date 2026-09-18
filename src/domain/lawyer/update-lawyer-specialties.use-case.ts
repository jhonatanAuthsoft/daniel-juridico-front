import {
  updateLawyerSpecialties,
  type UpdateLawyerSpecialtiesParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerSpecialtiesUseCase(
  params: UpdateLawyerSpecialtiesParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerSpecialties(params, signal);
}
