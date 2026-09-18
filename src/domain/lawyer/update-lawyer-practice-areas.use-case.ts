import {
  updateLawyerPracticeAreas,
  type UpdateLawyerPracticeAreasParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerPracticeAreasUseCase(
  params: UpdateLawyerPracticeAreasParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerPracticeAreas(params, signal);
}
