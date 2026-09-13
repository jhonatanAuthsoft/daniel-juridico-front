import {
  updateLawyerServiceAreas,
  type UpdateLawyerServiceAreasParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerServiceAreasUseCase(
  params: UpdateLawyerServiceAreasParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerServiceAreas(params, signal);
}
