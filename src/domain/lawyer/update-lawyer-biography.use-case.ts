import {
  updateLawyerBiography,
  type UpdateLawyerBiographyParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerBiographyUseCase(
  params: UpdateLawyerBiographyParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerBiography(params, signal);
}
